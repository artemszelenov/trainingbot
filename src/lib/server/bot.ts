import { Bot } from "@gramio/core";
import { prompt } from "@gramio/prompt";
import { proceed_form_start } from "$lib/server/bot/callback_queries/form_start";
import { proceed_cancel_announce } from "$lib/server/bot/callback_queries/cancel_announce";
import { proceed_delete_announce } from "$lib/server/bot/callback_queries/delete_announce";
import { proceed_start } from "$lib/server/bot/commands/start";
import { proceed_send_announce } from "$lib/server/bot/handlers/send_announce";
import { proceed_update_announce } from "$lib/server/bot/handlers/update_announce";
import {
	event_cancel_announce,
	event_delete_announce,
	event_start_form,
} from "$lib/server/bot/callback_queries/events";

const BOT_TOKEN = Bun.env.TG_BOT_TOKEN;
const WEBKOOK_URL = Bun.env.WEBKOOK_URL;

if (!BOT_TOKEN) {
	throw new Error("BOT_TOKEN is not set");
}

export const bot = new Bot(BOT_TOKEN).extend(prompt());

if (WEBKOOK_URL) {
	await bot.api.setWebhook({ url: WEBKOOK_URL });
}

bot.command("start", proceed_start);

bot.on("message", proceed_send_announce);

bot.on("edited_message", proceed_update_announce);

bot.callbackQuery(event_cancel_announce, proceed_cancel_announce);
bot.callbackQuery(event_delete_announce, proceed_delete_announce);
bot.callbackQuery(event_start_form, proceed_form_start);

bot.onError(({ context, kind, error }) => {
	if (context.is("message")) {
		console.error(`${kind}: ${error.message}`);
	}
});
