import { Bot, Keyboard, type TelegramMessage } from "gramio";
import { prompt } from "@gramio/prompt";
import type { FormBodyI, CallbackDataI } from "$lib/server/types";
import {
  db_insert_client,
  db_get_all_clients,
  db_insert_announce,
  db_get_announces_to_delete,
  db_get_announces_to_update,
  db_delete_announce,
  sql,
} from "$lib/server/database";

const BOT_TOKEN = Bun.env.TG_BOT_TOKEN;
const ADMIN_CHAT_ID = Bun.env.ADMIN_CHAT_ID;
const WEBKOOK_URL = Bun.env.WEBKOOK_URL;

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not set");
}

export const bot = new Bot(BOT_TOKEN).extend(prompt());

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

  const cbd: CallbackDataI = {
    event: "cancel_announce",
    payload: {},
  };

  const msg = await c.send(
    "Напиши и отправь мне текст рассылки (можно прикрепить одно фото)",
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Отмена", callback_data: JSON.stringify(cbd) }],
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
      console.error("[trainingbot] > Not supported announce type");
      return;
    }

    db_insert_announce(client.id, context.id, client_sent_msg.message_id);
  }

  if (state_announce_control_msg_id) {
    const cbd: CallbackDataI = {
      event: "delete_announce",
      payload: {},
    };

    await bot.api.editMessageText({
      text: "Рассылка успешно отправлена 🎉",
      chat_id: context.chat.id,
      message_id: state_announce_control_msg_id,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "⚠️ Удалить последнюю рассылку",
              callback_data: JSON.stringify(cbd),
            },
          ],
        ],
      },
    });
  }

  state_announce_sender_msg_id = context.id;
  state_announce_awaited = false;
});

bot.on("callback_query", async ({ message, data: raw_data, prompt }) => {
  if (!message) return;

  const data: CallbackDataI = raw_data ? JSON.parse(raw_data) : {};
  console.log("data", data);

  if (data?.event === "form_start") {
    // sql
    //   .query(
    //     `UPDATE clients SET awaited_form_service_id = ${service.id}
    //     WHERE chat_id = ${message.chat.id}`
    //   )
    //   .run();
    // const answer = await prompt("message", "Какой у вас запрос?");
    // console.log("[answer] ", answer);
    // const answer2 = await prompt(
    //   "message",
    //   "На сколько баллов от 1 до 10 вам важно решить запрос?",
    //   {
    //     reply_markup: new Keyboard()
    //       .text("1")
    //       .text("2")
    //       .text("3")
    //       .text("4")
    //       .text("5")
    //       .row()
    //       .text("6")
    //       .text("7")
    //       .text("8")
    //       .text("9")
    //       .text("10")
    //       .oneTime(),
    //   }
    // );
    // console.log("[answer2] ", answer2);
    // if (!client?.first_name) {
    //   bot.api.sendMessage({
    //     chat_id: body.chat_id,
    //     text: `Введите ваше имя`,
    //   });
    // }
    // if (!client?.last_name) {
    //   bot.api.sendMessage({
    //     chat_id: body.chat_id,
    //     text: `Введите вашу фамилию`,
    //   });
    // }
    // bot.api.sendMessage({
    //   chat_id: body.chat_id,
    //   text: `Какой у вас запрос?`,
    // });
    // await bot.api.sendMessage({
    //   chat_id: context.chat.id,
    //   text: `На сколько баллов от 1 до 10 вам важно решить запрос?`,
    //   reply_markup: new Keyboard()
    //     .text("1")
    //     .text("2")
    //     .text("3")
    //     .text("4")
    //     .text("5")
    //     .row()
    //     .text("6")
    //     .text("7")
    //     .text("8")
    //     .text("9")
    //     .text("10")
    //     .oneTime(),
    // });
    // bot.api.sendMessage({
    //   chat_id: body.chat_id,
    //   text: `Ваш контактный телефон`,
    //   reply_markup: new Keyboard()
    //     .requestContact("Поделиться номером с Ритой")
    //     .oneTime(),
    // });
    // bot.api.sendMessage({
    //   chat_id: body.chat_id,
    //   text: `Сколкьо вам полных лет?`,
    // });
    // bot.api.sendMessage({
    //   chat_id: body.chat_id,
    //   text: `Откуда обо мне узнали?`,
    // });
  }

  if (data?.event === "cancel_announce") {
    state_announce_awaited = false;

    await bot.api.editMessageText({
      text: "Рассылка отменена",
      chat_id: message.chat.id,
      message_id: message.id,
      reply_markup: undefined,
    });
  }

  if (data?.event === "delete_announce" && state_announce_sender_msg_id) {
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
