import type { MessageContext } from "@gramio/core";
import type { bot } from "$lib/server/bot";
import { db_insert_client } from "$lib/server/database";

const ADMIN_NAME = "Рита";
const WELCOME_MESSAGE =
	"Здравствуйте! Я чат-бот Маргариты. Благодаря мне, теперь вы всегда будете в курсе всех практик и мероприятий от Марго!";

export async function proceed_start(context: MessageContext<typeof bot>) {
	try {
		db_insert_client(
			context.chat.id,
			context.from?.firstName ?? "",
			context.from?.lastName ?? "",
			context.from?.username ?? "",
		);
	} catch (err) {
		if (err instanceof Error) {
			console.error("[SQLite] > ", err.message);
		}
	}

	if (context.chat.id === Number(Bun.env.ADMIN_CHAT_ID)) {
		context.send(`Привет, ${ADMIN_NAME}!`);
	} else {
		context.send(WELCOME_MESSAGE);
	}
}
