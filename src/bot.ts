import { Bot, type Message, type TelegramMessage } from "gramio";
import * as schema from "../db/schema";
import { db } from "../db/instance";
import { eq } from "drizzle-orm";

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
    db.insert(schema.clients)
      .values({
        chat_id: c.chat.id,
        first_name: c.from?.firstName,
        last_name: c.from?.lastName,
        username: c.from?.username,
      })
      .run();
  } catch (err) {
    if (err instanceof Error) {
      console.error("[Drizzle] ", err.message);
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
  await sendAnnounce(c);
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

    const announces_to_delete = await db
      .select({
        client_message_id: schema.announces.client_message_id,
        client_chat_id: schema.clients.chat_id,
      })
      .from(schema.announces)
      .where(
        eq(schema.announces.sender_message_id, last_sender_announce_message_id)
      )
      .leftJoin(
        schema.clients,
        eq(schema.announces.client_id, schema.clients.id)
      )
      .all();

    for (const a of announces_to_delete) {
      await bot.api.deleteMessage({
        chat_id: a.client_chat_id!,
        message_id: a.client_message_id,
      });
    }

    await bot.api.editMessageText({
      text: "Рассылка удалена у всех клиентов",
      chat_id: message.chat.id,
      message_id: message.id,
      reply_markup: undefined,
    });
  }
});

bot.on("edited_message", async (msg) => {
  const announces_to_update = await db
    .select({
      client_message_id: schema.announces.client_message_id,
      chat_id: schema.clients.chat_id,
    })
    .from(schema.announces)
    .where(eq(schema.announces.sender_message_id, msg.id))
    .leftJoin(schema.clients, eq(schema.announces.client_id, schema.clients.id))
    .all();

  for (const a of announces_to_update) {
    if (msg.caption) {
      await bot.api.editMessageCaption({
        caption: msg.caption,
        chat_id: a.chat_id!,
        message_id: a.client_message_id,
      });
    } else if (msg.text) {
      await bot.api.editMessageText({
        text: msg.text,
        chat_id: a.chat_id!,
        message_id: a.client_message_id,
      });
    }
  }
});

async function sendAnnounce(msg: Message) {
  if (!announce_awaited) return;

  const all_clients = await db
    .select({
      id: schema.clients.id,
      chat_id: schema.clients.chat_id,
    })
    .from(schema.clients)
    .all();

  for (const client of all_clients) {
    if (client.chat_id === Number(ADMIN_CHAT_ID)) {
      continue;
    }

    let client_sent_msg: TelegramMessage | null = null;
    if (msg.text) {
      client_sent_msg = await bot.api.sendMessage({
        chat_id: client.chat_id,
        text: msg.text,
      });
    } else if (msg.photo) {
      client_sent_msg = await bot.api.sendPhoto({
        chat_id: client.chat_id,
        photo: msg.photo[0].fileId,
        caption: msg.caption,
      });
    }

    if (!client_sent_msg) {
      console.error("[Trainingbot] Not supported announce type");
      return;
    }

    await db
      .insert(schema.announces)
      .values({
        client_id: client.id,
        sender_message_id: msg.id,
        client_message_id: client_sent_msg.message_id,
      })
      .run();
  }

  if (last_announce_status_message_id) {
    await bot.api.editMessageText({
      text: "Рассылка успешно отправлена всем клиентам 🎉",
      chat_id: msg.chat.id,
      message_id: last_announce_status_message_id,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "⚠️ Удалить последнюю рассылку у всех",
              callback_data: "delete_announce",
            },
          ],
        ],
      },
    });
  }

  last_sender_announce_message_id = msg.id;
  announce_awaited = false;
}
