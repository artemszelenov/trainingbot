package main

import (
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	_ "trainingbot/migrations"

	"github.com/lpernett/godotenv"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	tele "gopkg.in/telebot.v3"
	"gopkg.in/telebot.v3/middleware"
)

type Client struct {
	ChatID string `db:"tg_chat_id"`
}

func (r Client) Recipient() string {
	return r.ChatID
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
				clients := app.Dao().DB().Select("tg_chat_id").From("clients")

				res := []Client{}
				clients.All(&res)

				for _, client := range res {
					if os.Getenv("ADMIN_CHAT_ID") == client.ChatID {
						continue
					}
					b.Send(client, c.Text())
				}

				announceAwaited = false

				return c.Send("Анонс успешно отправлен всем клиентам")
			}

			return nil
		})

		go b.Start()

    if err := app.Start(); err != nil {
        log.Fatal(err)
    }
}