import type { CallbackQueryContext } from "@gramio/core";
import type { bot } from "$lib/server/bot";
import { $announce_awaited } from "$lib/server/bot/state";

export async function proceed_cancel_announce(
	context: CallbackQueryContext<typeof bot>,
) {
	if (!context.message) return;

	const message = context.message;
	const bot = context.bot;

	$announce_awaited.set(false);

	await bot.api.editMessageText({
		text: "Рассылка отменена",
		chat_id: message.chat.id,
		message_id: message.id,
		reply_markup: undefined,
	});
}
