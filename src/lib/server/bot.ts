import type { CallbackData } from "$lib/server/types";
import { proceed_form_start } from "$lib/server/bot/callback_queries/form_start";
import { proceed_cancel_announce } from "$lib/server/bot/callback_queries/cancel_announce";
import { proceed_delete_announce } from "$lib/server/bot/callback_queries/delete_announce";
import { proceed_start } from "$lib/server/bot/commands/start";
import { proceed_send_announce } from "$lib/server/bot/handlers/send_announce";
import { proceed_update_announce } from "$lib/server/bot/handlers/update_announce";
import { bot } from "$lib/server/bot/instance";

bot.command("start", proceed_start);

bot.on("message", proceed_send_announce);

bot.on("edited_message", proceed_update_announce);

bot.on("callback_query", async (context) => {
	const data: CallbackData = context.data ? JSON.parse(context.data) : {};

	if (data?.event === "form_start") {
		proceed_form_start(context, data);
	}

	if (data?.event === "cancel_announce") {
		proceed_cancel_announce(context);
	}

	if (data?.event === "delete_announce") {
		proceed_delete_announce(context);
	}
});

await bot.init();
