import { InlineKeyboard } from "@gramio/core";
import { bot } from "$lib/server/bot";
import {
	db_get_service_by_slug,
	db_insert_form_and_return,
} from "$lib/server/database";
import type { FormBody } from "$lib/server/types";
import { event_start_form } from "$lib/server/bot/callback_queries/events";

export async function POST({ request, params }) {
	const body: FormBody = await request.json();

	const service = db_get_service_by_slug(params.service_slug);

	if (!service) {
		return new Response("[trainingbot] > Service not found", { status: 500 });
	}

	const new_form = db_insert_form_and_return();

	if (!new_form) {
		return new Response("[trainingbot] > Can't create new form", {
			status: 500,
		});
	}

	await bot.api.sendMessage({
		chat_id: body.chat_id,
		text: `Вы выбрали услугу "${service.service_name}". Чтобы записаться, нужно ответить на несколько коротких вопросов`,
		reply_markup: new InlineKeyboard().text(
			"Начать опрос",
			event_start_form.pack({
				service_id: service.id,
				form_id: new_form.id,
			}),
		),
	});

	return new Response("", { status: 200 });
}
