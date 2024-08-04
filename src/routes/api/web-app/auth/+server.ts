import { validate, parse } from "@telegram-apps/init-data-node";

const token = Bun.env.TG_BOT_TOKEN || "";

export async function POST({ request, locals }) {
  const auth_header = request.headers.get("authorization") || "";
  const [auth_type, auth_data = ""] = auth_header.split(" ");

  switch (auth_type) {
    case "tma":
      try {
        validate(auth_data, token, {
          // We consider init data sign valid for 1 hour from their creation moment.
          expiresIn: 3600,
        });
      } catch (e) {
        return new Response("Unauthorized", { status: 401 });
      }

      locals.tg_auth_data = parse(auth_data);

      return new Response("", { status: 200 });
    default:
      return new Response("Wrong auth type", { status: 400 });
  }
}