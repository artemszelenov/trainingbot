import { InlineKeyboard } from "gramio";
import { bot } from "$lib/server/bot";
import { db_get_service_by_slug, db_insert_form_and_return } from "$lib/server/database";
import type { FormBodyI, CallbackDataI } from "$lib/server/types";

export async function POST({ request, params }) {
  const body: FormBodyI = await request.json();

  const new_form = db_insert_form_and_return();

  const service = db_get_service_by_slug(params.service_slug)

  if (!service) {
    return new Response("[trainingbot] > Service not found", { status: 500 });
  }

  const cbd: CallbackDataI = {
    event: "form_start",
    payload: {
      service_id: service.id,
      form_id: new_form!.id,
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
