import { bot } from "$lib/server/bot";
import type { BodyI } from "./types";

export async function POST({ request }) {
  const body: BodyI = await request.json();

  bot.api.sendMessage({
    chat_id: body.chat_id,
    text: `Вы воспользовались услугой ${body.service_name}`,
  });

  return new Response("", { status: 200 });
}
