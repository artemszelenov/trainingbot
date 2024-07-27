import dotenv from "dotenv";
import ngrok from "ngrok";
import { bot } from "./bot";

dotenv.config();

const BOT_TOKEN = process.env.TG_BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not set");
}

const url = await ngrok.connect(5173);

await bot.api.setWebhook({ url });

console.log("webHookInfo", await bot.api.getWebhookInfo());
