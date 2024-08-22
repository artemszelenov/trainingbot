import { bot } from "$lib/server/bot";

await bot.init();

export async function handle({ event, resolve }) {
	const response = await resolve(event);
	return response;
}
