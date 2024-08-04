import { InlineKeyboard } from "gramio";
import { bot } from "$lib/server/bot";
import { sql, Service } from "$lib/server/database";
import type { FormBodyI, CallbackDataI } from "$lib/server/types";

export async function POST({ request, params }) {
  const body: FormBodyI = await request.json();

  const service = sql
    .query(
      `SELECT * FROM services WHERE service_slug = "${params.service_slug}"`
    )
    .as(Service)
    .get();

  if (!service) {
    return new Response("[trainingbot] > Service not found", { status: 500 });
  }

  const cbd: CallbackDataI = {
    event: "form_start",
    payload: {
      service_id: service.id,
    },
  };

  await bot.api.sendMessage({
    chat_id: body.chat_id,
    text: `Вы выбрали услугу "${service.service_name}". Чтобы записаться, нужно ответить на несколько коротких вопросов`,
    reply_markup: new InlineKeyboard().text(
      "Начать опрос",
      JSON.stringify(cbd)
    ),
  });

  return new Response("", { status: 200 });
}
