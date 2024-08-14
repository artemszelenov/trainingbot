import type { MessageContext } from "gramio";
import type { bot } from "$lib/server/bot/instance";
import { db_get_announces_to_update } from "$lib/server/database";
import { $announce_awaited } from "$lib/server/bot/state";

export async function proceed_update_announce(
	context: MessageContext<typeof bot>,
) {
	if (!$announce_awaited.get()) return;

	const bot = context.bot;

	const announces_to_update = db_get_announces_to_update(context.id);

	for (const a of announces_to_update) {
		try {
			if (context.caption) {
				await bot.api.editMessageCaption({
					caption: context.caption,
					chat_id: a.chat_id,
					message_id: a.client_message_id,
				});
			} else if (context.text) {
				await bot.api.editMessageText({
					text: context.text,
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
}
