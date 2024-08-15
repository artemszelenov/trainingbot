import { Bot } from "@gramio/core";
import { prompt } from "@gramio/prompt";

const BOT_TOKEN = Bun.env.TG_BOT_TOKEN;
const WEBKOOK_URL = Bun.env.WEBKOOK_URL;

if (!BOT_TOKEN) {
	throw new Error("BOT_TOKEN is not set");
}

export const bot = new Bot(BOT_TOKEN).extend(prompt());

if (WEBKOOK_URL) {
	await bot.api.setWebhook({ url: WEBKOOK_URL });
}
