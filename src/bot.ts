import { Bot, type TelegramMessage } from "gramio";
import {
  db_insert_client,
  db_get_all_clients,
  db_insert_announce,
  db_get_announces_to_delete,
  db_get_announces_to_update,
  db_delete_announce,
} from "$lib/server/database";

const BOT_TOKEN = Bun.env.TG_BOT_TOKEN;
const ADMIN_CHAT_ID = Bun.env.ADMIN_CHAT_ID;
const WEBKOOK_URL = Bun.env.WEBKOOK_URL;

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not set");
}

export const bot = new Bot(BOT_TOKEN);

if (WEBKOOK_URL) {
  await bot.api.setWebhook({ url: WEBKOOK_URL });
}

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

let state_announce_awaited = false;
let state_announce_control_msg_id: number | null = null;
let state_announce_sender_msg_id: number | null = null;

bot.command("start", (c) => {
  try {
    db_insert_client(
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
  state_announce_awaited = true;

  const msg = await c.send(
    "Напиши и отправь мне текст рассылки (можно прикрепить одно фото)",
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Отмена", callback_data: "cancel_announce" }],
        ],
      },
    }
  );

  state_announce_control_msg_id = msg.id;
});

bot.on("message", async (context) => {
  if (!state_announce_awaited) return;

  const all_clients = db_get_all_clients();

  for (const client of all_clients) {
    if (client.chat_id === Number(ADMIN_CHAT_ID)) {
      continue;
    }

    let client_sent_msg: TelegramMessage | null = null;
    if (context.text) {
      client_sent_msg = await bot.api.sendMessage({
        chat_id: client.chat_id,
        text: context.text,
      });
    } else if (context.photo) {
      client_sent_msg = await bot.api.sendPhoto({
        chat_id: client.chat_id,
        photo: context.photo[0].fileId,
        caption: context.caption,
      });
    }

    if (!client_sent_msg) {
      console.error("[Trainingbot] Not supported announce type");
      return;
    }

    db_insert_announce(client.id, context.id, client_sent_msg.message_id);
  }

  if (state_announce_control_msg_id) {
    await bot.api.editMessageText({
      text: "Рассылка успешно отправлена 🎉",
      chat_id: context.chat.id,
      message_id: state_announce_control_msg_id,
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

  state_announce_sender_msg_id = context.id;
  state_announce_awaited = false;
});

bot.on("callback_query", async ({ message, data }) => {
  if (!message) return;

  if (data === "cancel_announce") {
    state_announce_awaited = false;

    await bot.api.editMessageText({
      text: "Рассылка отменена",
      chat_id: message.chat.id,
      message_id: message.id,
      reply_markup: undefined,
    });
  }

  if (data === "delete_announce" && state_announce_sender_msg_id) {
    state_announce_awaited = false;

    const announces_to_delete = db_get_announces_to_delete(
      state_announce_sender_msg_id
    );

    for (const a of announces_to_delete) {
      await bot.api.deleteMessage({
        chat_id: a.client_chat_id,
        message_id: a.client_message_id,
      });

      db_delete_announce(a.client_message_id);
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
  const announces_to_update = db_get_announces_to_update(msg.id);

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

bot.on("web_app_data", (context) => {
  console.log("web context", context);
});
