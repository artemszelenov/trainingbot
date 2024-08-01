import { Bot, type TelegramMessage } from "gramio";
import {
  insertClient,
  allClients,
  insertAnnounce,
  announcesToDelete,
  announcesToUpdate,
  deleteAnnounce,
} from "$lib/server/database";

const BOT_TOKEN = Bun.env.TG_BOT_TOKEN;
const ADMIN_CHAT_ID = Bun.env.ADMIN_CHAT_ID;

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not set");
}

export const bot = new Bot(BOT_TOKEN);

await bot.init();

const ADMIN_NAME = "Рита";
const WELCOME_MESSAGE =
  "Здравствуйте! Я чат-бот Маргариты. Благодаря мне, теперь вы всегда будете в курсе всех практик и мероприятий от Марго!";

bot.api.setMyCommands({
  commands: [
    {
      command: "announce",
      description: "Создать новый анонс",
    },
  ],
  scope: {
    type: "chat",
    chat_id: Number(ADMIN_CHAT_ID),
  },
});

let announce_awaited = false;
let last_announce_status_message_id: number | null = null;
let last_sender_announce_message_id: number | null = null;

bot.command("start", (c) => {
  try {
    insertClient(
      c.chat.id,
      c.from?.firstName ?? "",
      c.from?.lastName ?? "",
      c.from?.username ?? ""
    );
  } catch (err) {
    if (err instanceof Error) {
      console.error("[SQLite] ", err.message);
    }
  }

  if (c.chat.id === Number(ADMIN_CHAT_ID)) {
    c.send(`Привет, ${ADMIN_NAME}!`);
  } else {
    c.send(WELCOME_MESSAGE);
  }
});

bot.command("announce", async (c) => {
  announce_awaited = true;

  const m = await c.send(
    "Напиши и отправь мне текст рассылки (можно прикрепить одно фото)",
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Отмена", callback_data: "cancel_announce" }],
        ],
      },
    }
  );

  last_announce_status_message_id = m.id;
});

bot.on("message", async (c) => {
  if (!announce_awaited) return;

  const all_clients = allClients();

  for (const client of all_clients) {
    if (client.chat_id === Number(ADMIN_CHAT_ID)) {
      continue;
    }

    let client_sent_msg: TelegramMessage | null = null;
    if (c.text) {
      client_sent_msg = await bot.api.sendMessage({
        chat_id: client.chat_id,
        text: c.text,
      });
    } else if (c.photo) {
      client_sent_msg = await bot.api.sendPhoto({
        chat_id: client.chat_id,
        photo: c.photo[0].fileId,
        caption: c.caption,
      });
    }

    if (!client_sent_msg) {
      console.error("[Trainingbot] Not supported announce type");
      return;
    }

    insertAnnounce(client.id, c.id, client_sent_msg.message_id);
  }

  if (last_announce_status_message_id) {
    await bot.api.editMessageText({
      text: "Рассылка успешно отправлена 🎉",
      chat_id: c.chat.id,
      message_id: last_announce_status_message_id,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "⚠️ Удалить последнюю рассылку",
              callback_data: "delete_announce",
            },
          ],
        ],
      },
    });
  }

  last_sender_announce_message_id = c.id;
  announce_awaited = false;
});

bot.on("callback_query", async ({ message, data }) => {
  if (!message) return;

  if (data === "cancel_announce") {
    announce_awaited = false;

    await bot.api.editMessageText({
      text: "Рассылка отменена",
      chat_id: message.chat.id,
      message_id: message.id,
      reply_markup: undefined,
    });
  }

  if (data === "delete_announce" && last_sender_announce_message_id) {
    announce_awaited = false;

    const announces_to_delete = announcesToDelete(
      last_sender_announce_message_id
    );

    for (const a of announces_to_delete) {
      await bot.api.deleteMessage({
        chat_id: a.client_chat_id,
        message_id: a.client_message_id,
      });

      deleteAnnounce(a.client_message_id);
    }

    await bot.api.editMessageText({
      text: "Рассылка удалена",
      chat_id: message.chat.id,
      message_id: message.id,
      reply_markup: undefined,
    });
  }
});

bot.on("edited_message", async (msg) => {
  const announces_to_update = announcesToUpdate(msg.id);

  for (const a of announces_to_update) {
    try {
      if (msg.caption) {
        await bot.api.editMessageCaption({
          caption: msg.caption,
          chat_id: a.chat_id,
          message_id: a.client_message_id,
        });
      } else if (msg.text) {
        await bot.api.editMessageText({
          text: msg.text,
          chat_id: a.chat_id,
          message_id: a.client_message_id,
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  }
});
