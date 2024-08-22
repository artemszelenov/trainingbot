import type { CallbackQueryContext } from "@gramio/core";
import type { bot } from "$lib/server/bot";
import {
	db_get_announces_to_delete,
	db_delete_announce,
} from "$lib/server/database";
import {
	$announce_awaited,
	$announce_sender_msg_id,
} from "$lib/server/bot/state";

export async function proceed_delete_announce(
	context: CallbackQueryContext<typeof bot>,
) {
	if (!context.message) return;

	const message = context.message;
	const bot = context.bot;

	const target_message_id = $announce_sender_msg_id.get();
	if (!target_message_id) return;

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
