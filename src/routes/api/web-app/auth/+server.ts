import { validate, parse } from "@telegram-apps/init-data-node";
import { sql } from "$lib/server/database";

const token = Bun.env.TG_BOT_TOKEN || "";

export async function POST({ request }) {
	const auth_header = request.headers.get("authorization") || "";
	const [auth_type, auth_data = ""] = auth_header.split(" ");

	if (auth_type === "tma") {
		try {
			validate(auth_data, token, {
				// We consider init data sign valid for 1 hour from their creation moment.
				expiresIn: 3600,
			});
		} catch (e) {
			return new Response("Unauthorized", { status: 401 });
		}

		const { user } = parse(auth_data);

		const existing_client = sql
			.query(`
				SELECT chat_id FROM clients WHERE chat_id = ?;
			`)
			.get(user?.id ?? "");

		if (!existing_client && user) {
			const { id, firstName, lastName, username } = user;

			sql
				.query(`
					INSERT INTO clients (
						chat_id, first_name, last_name, username
					) VALUES (?,?,?,?);
				`)
				.run(id, firstName, lastName ?? "", username ?? "");
		}

		return new Response(
			JSON.stringify({
				is_new_client: !existing_client,
			}),
			{ status: 200 },
		);
	}

	return new Response("Wrong auth type", { status: 400 });
}
