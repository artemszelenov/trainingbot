import { bot } from "$lib/server/bot";

export async function POST({ request, url }) {
	const body = await request.json();

	await bot.api.sendDocument({
		chat_id: body.chat_id,
		document: `${url.origin}/api/web-app/free-guide/`,
		caption: 'Гайд "Топ-5 асан от ноющей поясницы"',
	});

	return new Response("", { status: 200 });
}
