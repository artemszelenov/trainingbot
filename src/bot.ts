import { env } from '$env/dynamic/private'
import TelegramBot from 'node-telegram-bot-api'
import { clients } from '../db/schema'
import { db } from '../db/instance'

const BOT_TOKEN = env.TG_BOT_TOKEN
const ADMIN_CHAT_ID = env.ADMIN_CHAT_ID

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN is not set')
}

export const bot = new TelegramBot(BOT_TOKEN)

bot.setMyCommands([{
  command: 'announce',
  description: 'Создать новый анонс'
}], {
  scope: {
    type: "chat",
    chat_id: ADMIN_CHAT_ID
  }
})

let announceAwaited = false

bot.onText(/\/start/, async (msg) => {
  try {
    db.insert(clients).values({
      tg_chat_id: msg.chat.id,
      first_name: msg.from?.first_name,
      last_name: msg.from?.last_name,
      username: msg.from?.username
    }).run()
  } catch (err) {
    if (err instanceof Error) {
      console.error('Drizzle: ', err.message)
    }
  }

  bot.sendMessage(msg.chat.id, 'Здравствуйте! Я чат-бот Маргариты. Благодаря мне, теперь вы всегда будете в курсе всех практик и мероприятий от Марго!')
})

bot.on('/announce', async (msg) => {
  announceAwaited = true

  await bot.sendMessage(msg.chat.id, 'Жду свежий анонс', {
    reply_markup: {
      inline_keyboard: [[{ text: 'Отмена', callback_data: 'cancel_announce' }]]
    }
  })
})

bot.on('callback_query', async ({ id }) => {
  announceAwaited = false

  await bot.sendMessage(id, 'Анонс отменен')
})

// bot.on('message', async (msg) => {
//   if (!announceAwaited) return

//   const clients = await db.collection('clients').getFullList({
//     fields: 'id, tg_chat_id'
//   })

//   for (const client of clients) {
//     if (client.tg_chat_id === ADMIN_CHAT_ID) {
//       continue
//     }

//     const client_sent_msg = await bot.sendMessage(client.tg_chat_id, msg.text ?? '') // todo: fix

//     await db.collection('announces').create({
//       original_message_id: msg.message_id,
//       message_id: client_sent_msg.message_id,
//       client: client.id
//     })
//   }

//   announceAwaited = false

//   await bot.sendMessage(msg.chat.id, 'Анонс успешно отправлен всем клиентам')
// })

// warn! pseudocode
// bot.on('edited_message', async (msg) => {
//   if (!msg.text) return

//   const annouces = db.select("announces.message_id", "clients.tg_chat_id")
//     .from('announces, clients')
//     .where('announces.original_message_id = {:id}', { id: msg.message_id })

//   for (const a of annouces) {
//     await bot.editMessageText(msg.text, {
//       chat_id: a.tg_chat_id,
//       message_id: a.message_id
//     })
//   }
// })
