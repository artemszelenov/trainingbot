import { InlineKeyboard, type MessageContext } from "@gramio/core";
import type { TelegramMessage } from "@gramio/types";
import type { bot } from "$lib/server/bot/instance";
import { db_get_all_clients, db_insert_announce } from "$lib/server/database";
import {
	$announce_awaited,
	$announce_sender_msg_id,
	$announce_control_msg_id,
} from "$lib/server/bot/state";
import { event_delete_announce } from "$lib/server/bot/callback_queries/events";

export async function proceed_send_announce(
	context: MessageContext<typeof bot>,
) {
	if (!$announce_awaited.get()) return;

	const bot = context.bot;

	const all_clients = db_get_all_clients();

	// send to all clients
	for (const client of all_clients) {
		if (client.chat_id === Number(Bun.env.ADMIN_CHAT_ID)) {
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

	// change control message state
	const message_id = $announce_control_msg_id.get();
	if (message_id) {
		await bot.api.editMessageText({
			text: "Рассылка успешно отправлена 🎉",
			chat_id: context.chat.id,
			message_id,
			reply_markup: new InlineKeyboard().text(
				"⚠️ Удалить последнюю рассылку",
				event_delete_announce.pack({}),
			),
		});
	}

	$announce_sender_msg_id.set(context.id);
	$announce_awaited.set(false);
}
