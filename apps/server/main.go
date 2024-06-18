package main

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	_ "trainingbot/migrations"

	"github.com/lpernett/godotenv"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	tele "gopkg.in/telebot.v3"
	"gopkg.in/telebot.v3/middleware"
)

type Client struct {
	ID string `db:"id"`
	ChatID string `db:"tg_chat_id"`
}

func (r Client) Recipient() string {
	return r.ChatID
}

type ClientAnnounce struct {
	MessageID string `db:"message_id"`
	ChatID string `db:"tg_chat_id"`
}

func (a ClientAnnounce) MessageSig() (string, int64) {
	chatID, _ := strconv.ParseInt(a.ChatID, 10, 64)
	return a.MessageID, chatID
}

func main() {
		godotenv.Load()

		pref := tele.Settings{
			Token: os.Getenv("TG_BOT_TOKEN"),
			Poller: &tele.LongPoller{Timeout: 10 * time.Second},
		}

		b, err := tele.NewBot(pref)
		if err != nil {
			log.Fatal(err)
			return
		}

		isDev := os.Getenv("IS_DEV")
		if isDev == "true" {
			b.Use(middleware.Logger())
		}

		app := pocketbase.New()

		// loosely check if it was executed using "go run"
    isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())

    migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
			// enable auto creation of migration files when making collection changes in the Admin UI
			// (the isGoRun check is to enable it only during development)
			Automigrate: isGoRun,
    })

		adminChatIDInt, err := strconv.ParseInt(os.Getenv("ADMIN_CHAT_ID"), 10, 64)
		if err != nil {
			log.Fatal("Error loading ADMIN_CHAT_ID env")
		}

		b.SetCommands(
			[]tele.Command{
				{Text: "announce", Description: "Создать новый анонс"},
			},
			tele.CommandScope{Type: tele.CommandScopeChat, ChatID: adminChatIDInt},
		)

		b.Handle("/start", func(c tele.Context) error {
			clients, err := app.Dao().FindCollectionByNameOrId("clients")
			if err != nil {
				log.Fatal("Can't find clients collection")
			}

			newClient := models.NewRecord(clients)
			newClient.Set("tg_chat_id", c.Message().Chat.ID)
			newClient.Set("first_name", c.Message().Sender.FirstName)
			newClient.Set("last_name", c.Message().Sender.LastName)
			newClient.Set("username", c.Message().Sender.Username)

			app.Dao().SaveRecord(newClient)

			return c.Send("Здравствуйте! Я чат-бот Маргариты. Благодаря мне, теперь вы всегда будете в курсе всех практик и мероприятий от Марго!")
		})

		var announceAwaited = false

		b.Handle("/announce", func(c tele.Context) error {
			announceAwaited = true
			return c.Send("Жду свежий анонс", &tele.ReplyMarkup{
				InlineKeyboard: [][]tele.InlineButton{{{Text: "Отмена", Data: "cancel_announce"}}},
			})
		})

		b.Handle(tele.OnCallback, func (c tele.Context) error {
			announceAwaited = false
			return c.Send("Анонс отменен")
		})

		b.Handle(tele.OnText, func(c tele.Context) error {
			if announceAwaited {
				clientsRecords := app.Dao().DB().Select("id", "tg_chat_id").From("clients")

				clients := []Client{}
				clientsRecords.All(&clients)

				announces, err := app.Dao().FindCollectionByNameOrId("announces")
				if err != nil {
					log.Fatal("Can't find announces collection")
				}

				for _, client := range clients {
					if os.Getenv("ADMIN_CHAT_ID") == client.ChatID {
						continue
					}

					msg, err := b.Send(&client, c.Text())
					if err != nil {
						fmt.Println(err)
					}

					newAnnounce := models.NewRecord(announces)
					newAnnounce.Set("original_message_id", c.Message().ID)
					newAnnounce.Set("message_id", msg.ID)
					newAnnounce.Set("client", client.ID)

					app.Dao().SaveRecord(newAnnounce)
				}

				announceAwaited = false

				return c.Send("Анонс успешно отправлен всем клиентам")
			}

			return nil
		})

		b.Handle(tele.OnEdited, func(c tele.Context) error {
			records := app.Dao().DB().
				Select("announces.message_id", "clients.tg_chat_id").
				From("announces", "clients").
				Where(dbx.NewExp("announces.original_message_id = {:id}", dbx.Params{"id": c.Message().ID}))

			announcesToUpdate := []ClientAnnounce{}
			records.All(&announcesToUpdate)

			for _, announce := range announcesToUpdate {
				b.Edit(announce, c.Text())
			}

			return nil
		})

		go b.Start()

    if err := app.Start(); err != nil {
        log.Fatal(err)
    }
}