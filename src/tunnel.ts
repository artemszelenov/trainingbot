import ngrok from "ngrok";
import { bot } from "./bot";

const url = await ngrok.connect(5173);

await bot.api.setWebhook({ url });

console.log("webHookInfo", await bot.api.getWebhookInfo());
