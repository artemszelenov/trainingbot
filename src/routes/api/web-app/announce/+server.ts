import { InlineKeyboard } from 'gramio'
import { bot, $announce_control_msg_id, $announce_awaited } from "$lib/server/bot";
import type { CallbackDataI } from "$lib/server/types";

const ADMIN_CHAT_ID = Bun.env.ADMIN_CHAT_ID;

export async function POST() {
  const cbd: CallbackDataI = {
    event: "cancel_announce",
    payload: {},
  };

  $announce_awaited.set(true);

  const msg = await bot.api.sendMessage({
    chat_id: Number(ADMIN_CHAT_ID),
    text: "Напиши и отправь мне текст рассылки (можно прикрепить одно фото)",
    reply_markup: new InlineKeyboard().text("Отмена", JSON.stringify(cbd))
  });

  $announce_control_msg_id.set(msg.message_id);

  return new Response("", { status: 200 });
}
