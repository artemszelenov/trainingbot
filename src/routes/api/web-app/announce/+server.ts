import { InlineKeyboard } from "@gramio/core";
import { bot } from "$lib/server/bot/instance";
import {
	$announce_control_msg_id,
	$announce_awaited,
} from "$lib/server/bot/state";
import { event_cancel_announce } from "$lib/server/bot/callback_queries/events";

const ADMIN_CHAT_ID = Bun.env.ADMIN_CHAT_ID;

export async function POST() {
	$announce_awaited.set(true);

	const msg = await bot.api.sendMessage({
		chat_id: Number(ADMIN_CHAT_ID),
		text: "Напиши и отправь мне текст рассылки (можно прикрепить одно фото)",
		reply_markup: new InlineKeyboard().text(
			"Отмена",
			event_cancel_announce.pack({}),
		),
	});

	$announce_control_msg_id.set(msg.message_id);

	return new Response("", { status: 200 });
}
