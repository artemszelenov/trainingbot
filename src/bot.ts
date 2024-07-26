import { env } from "$env/dynamic/private";
import TelegramBot from "node-telegram-bot-api";
import { announces, clients } from "../db/schema";
import { db } from "../db/instance";
import { eq } from "drizzle-orm";

const BOT_TOKEN = env.TG_BOT_TOKEN;
const ADMIN_CHAT_ID = env.ADMIN_CHAT_ID;

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not set");
}

export const bot = new TelegramBot(BOT_TOKEN);

bot.setMyCommands(
  [
    {
      command: "announce",
      description: "Создать новый анонс",
    },
  ],
  {
    scope: {
      type: "chat",
      chat_id: Number(ADMIN_CHAT_ID),
    },
  }
);

let announce_awaited = false;
let announce_message_id: number | null = null;

bot.onText(/\/start/, async (msg) => {
  try {
    db.insert(clients)
      .values({
        chat_id: msg.chat.id,
        first_name: msg.from?.first_name,
        last_name: msg.from?.last_name,
        username: msg.from?.username,
      })
      .run();
  } catch (err) {
    if (err instanceof Error) {
      console.error("Drizzle: ", err.message);
    }
  }

  if (msg.chat.id === Number(ADMIN_CHAT_ID)) {
    bot.sendMessage(msg.chat.id, "Привет Рита!");
  } else {
    bot.sendMessage(
      msg.chat.id,
      "Здравствуйте! Я чат-бот Маргариты. Благодаря мне, теперь вы всегда будете в курсе всех практик и мероприятий от Марго!"
    );
  }
});

bot.onText(/\/announce/, async (msg) => {
  announce_awaited = true;

  const m = await bot.sendMessage(msg.chat.id, "Жду свежий анонс", {
    reply_markup: {
      inline_keyboard: [[{ text: "Отмена", callback_data: "cancel_announce" }]],
    },
  });

  announce_message_id = m.message_id;
});

bot.on("photo", async (msg) => {
  await sendAnnounce(msg);
});

bot.on("text", async (msg) => {
  await sendAnnounce(msg);
});

bot.on("callback_query", async ({ message, data }) => {
  announce_awaited = false;

  if (data === "cancel_announce" && message) {
    await bot.editMessageText("Анонс отменен", {
      reply_markup: undefined,
      chat_id: message.chat.id,
      message_id: message.message_id,
    });
  }
});

bot.on("edited_message", async (msg) => {
  const announces_to_update = await db
    .select({
      client_message_id: announces.client_message_id,
      chat_id: clients.chat_id,
    })
    .from(announces)
    .where(eq(announces.sender_message_id, msg.message_id))
    .leftJoin(clients, eq(announces.client_id, clients.id))
    .all();

  for (const a of announces_to_update) {
    if (msg.caption) {
      await bot.editMessageCaption(msg.caption, {
        chat_id: a.chat_id!,
        message_id: a.client_message_id,
      });
    } else if (msg.text) {
      await bot.editMessageText(msg.text, {
        chat_id: a.chat_id!,
        message_id: a.client_message_id,
      });
    }
  }
});

bot.on("message", async (msg) => {
  // add deliting
  console.log(msg);
});

async function sendAnnounce(msg: TelegramBot.Message) {
  if (!announce_awaited) return;

  const all_clients = await db
    .select({
      id: clients.id,
      chat_id: clients.chat_id,
    })
    .from(clients)
    .all();

  for (const client of all_clients) {
    if (client.chat_id === Number(ADMIN_CHAT_ID)) {
      continue;
    }

    let client_sent_msg: TelegramBot.Message | null = null;
    if (msg.text) {
      client_sent_msg = await bot.sendMessage(client.chat_id, msg.text!);
    } else if (msg.photo) {
      client_sent_msg = await bot.sendPhoto(
        client.chat_id,
        msg.photo[2].file_id,
        {
          caption: msg.caption,
        }
      );
    }

    if (!client_sent_msg) {
      console.error("Trainingbot: not supported announce type");
      return;
    }

    await db
      .insert(announces)
      .values({
        client_id: client.id,
        sender_message_id: msg.message_id,
        client_message_id: client_sent_msg.message_id,
      })
      .run();
  }

  if (announce_message_id) {
    await bot.editMessageText("Анонс успешно отправлен всем клиентам 👇🏻", {
      reply_markup: undefined,
      chat_id: msg.chat.id,
      message_id: announce_message_id,
    });
  }

  announce_awaited = false;
  announce_message_id = null;
}
