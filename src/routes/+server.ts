import { bot } from "$lib/server/bot";

export async function POST({ request }) {
  try {
    const data = await request.json();
    console.log("req", data);
    bot.updates.handleUpdate(data);
    return new Response("", { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response("", { status: 500 });
  }
}
