import { Bot, Keyboard, RemoveKeyboard, type TelegramMessage, type Message, bold, format, join } from "gramio";
import { prompt } from "@gramio/prompt";
import { atom } from 'nanostores'
import type { CallbackDataI } from "$lib/server/types";
import {
  db_insert_client,
  db_get_all_clients,
  db_insert_announce,
  db_get_announces_to_delete,
  db_get_announces_to_update,
  db_delete_announce,
  db_get_client,
  db_insert_form_answer,
  db_update_client_age,
  db_update_client_phone,
  db_get_service,
  db_get_form_answers
} from "$lib/server/database";

const BOT_TOKEN = Bun.env.TG_BOT_TOKEN;
const ADMIN_CHAT_ID = Bun.env.ADMIN_CHAT_ID;
const WEBKOOK_URL = Bun.env.WEBKOOK_URL;

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not set");
}

export const bot = new Bot(BOT_TOKEN)
  .extend(prompt());

if (WEBKOOK_URL) {
  await bot.api.setWebhook({ url: WEBKOOK_URL });
}

await bot.init();

const ADMIN_NAME = "Рита";
const WELCOME_MESSAGE =
  "Здравствуйте! Я чат-бот Маргариты. Благодаря мне, теперь вы всегда будете в курсе всех практик и мероприятий от Марго!";

export const $announce_awaited = atom(false);
export const $announce_control_msg_id = atom<number | null>(null);
export const $announce_sender_msg_id = atom<number | null>(null);

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
      console.error("[SQLite] > ", err.message);
    }
  }

  if (c.chat.id === Number(ADMIN_CHAT_ID)) {
    c.send(`Привет, ${ADMIN_NAME}!`);
  } else {
    c.send(WELCOME_MESSAGE);
  }
});

bot.on("message", async (context) => {
  if (!$announce_awaited.get()) return;

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

  const message_id = $announce_control_msg_id.get()
  if (message_id) {
    const cbd: CallbackDataI = {
      event: "delete_announce",
      payload: {},
    };

    await bot.api.editMessageText({
      text: "Рассылка успешно отправлена 🎉",
      chat_id: context.chat.id,
      message_id,
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

  $announce_sender_msg_id.set(context.id);
  $announce_awaited.set(false);
});

bot.on("callback_query", async ({ message, data: raw_data, prompt }) => {
  if (!message) return;

  const data: CallbackDataI = raw_data ? JSON.parse(raw_data) : {};

  if (data?.event === "form_start") {
    const client = db_get_client(message.chat.id);

    if (!client) {
      throw new Error("[trainingbot] > Can't start from, client not found");
    }

    let question = "";
    let answer: Message;

    if (!client?.first_name) {
      question = "Введите ваше имя";
      answer = await prompt("message", question);

      db_insert_form_answer({
        question,
        answer: answer.text || "",
        client_id: client.id,
        service_id: data.payload.service_id,
        form_id: data.payload.form_id,
      });
    }

    if (!client?.last_name) {
      question = "Введите вашу фамилию";
      answer = await prompt("message", question);

      db_insert_form_answer({
        question,
        answer: answer.text || "",
        client_id: client.id,
        service_id: data.payload.service_id,
        form_id: data.payload.form_id,
      });
    }

    question = "Какой у вас запрос?";
    answer = await prompt("message", question);

    db_insert_form_answer({
      question,
      answer: answer.text || "",
      client_id: client.id,
      service_id: data.payload.service_id,
      form_id: data.payload.form_id,
    });

    question = "На сколько баллов от 1 до 10 вам важно решить запрос?";
    answer = await prompt("message", question, {
      reply_markup: new Keyboard()
        .text("1")
        .text("2")
        .text("3")
        .text("4")
        .text("5")
        .row()
        .text("6")
        .text("7")
        .text("8")
        .text("9")
        .text("10")
        .oneTime(),
    });

    db_insert_form_answer({
      question,
      answer: answer.text || "",
      client_id: client.id,
      service_id: data.payload.service_id,
      form_id: data.payload.form_id,
    });

    if (!client?.phone) {
      question = "Ваш контактный телефон";
      answer = await prompt("message", question, {
        reply_markup: new Keyboard()
          .requestContact("Поделиться номером с Ритой")
          .oneTime(),
      });

      if (answer?.contact?.phoneNumber) {
        db_update_client_phone(client.chat_id, answer?.contact?.phoneNumber);
      }
    }

    if (!client?.age) {
      question = "Сколько вам полных лет?";
      answer = await prompt("message", question, {
        reply_markup: new RemoveKeyboard().selective(),
      });

      if (answer.text) {
        db_update_client_age(client.chat_id, Number.parseInt(answer.text));
      }
    }

    question = "Откуда обо мне узнали?";
    answer = await prompt("message", question);

    db_insert_form_answer({
      question,
      answer: answer.text || "",
      client_id: client.id,
      service_id: data.payload.service_id,
      form_id: data.payload.form_id,
    });

    await bot.api.sendMessage({
      chat_id: client.chat_id,
      text: "Спасибо за уделенное время! Ваша ссылка на оплату *** . После оплаты Маргарита свяжется с вами",
    });

    const service = db_get_service(data.payload.service_id);

    const form_answers = db_get_form_answers(client.id, data.payload.service_id, data.payload.form_id);

    const fresh_client = db_get_client(client.chat_id);

    const admin_text = format`
      📝 ${bold`Новая заявка`}

      ${bold`Клиент`}

      ФИО: ${fresh_client?.first_name ?? ''} ${fresh_client?.last_name ?? ''}
      Телефон: ${fresh_client?.phone ?? ''}
      Возраст: ${fresh_client?.age ?? ''}
      Имя пользователя: @${fresh_client?.username ?? ''}

      ${bold`Услуга`}

      "${service?.service_name ?? ''}"

      ${bold`Результаты опроса`}

      ${join(form_answers, ({ question = '', answer = '' }) => format`${question}: ${answer}`, "\n")}
    `;

    await bot.api.sendMessage({
      chat_id: Number(ADMIN_CHAT_ID),
      text: admin_text
    });
  }

  if (data?.event === "cancel_announce") {
    $announce_awaited.set(false);

    await bot.api.editMessageText({
      text: "Рассылка отменена",
      chat_id: message.chat.id,
      message_id: message.id,
      reply_markup: undefined,
    });
  }

  const target_message_id = $announce_sender_msg_id.get();

  if (data?.event === "delete_announce" && target_message_id) {
    $announce_awaited.set(false);

    const announces_to_delete = db_get_announces_to_delete(target_message_id);

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
