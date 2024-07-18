import { env } from '$env/dynamic/private'
import TelegramBot from 'node-telegram-bot-api'
import PocketBase from 'pocketbase'

const BOT_TOKEN = env.TG_BOT_TOKEN

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN is not set')
}

export const bot = new TelegramBot(BOT_TOKEN)
const db = new PocketBase('http://localhost:8090')

bot.on('message', async (msg) => {
  await bot.sendMessage(msg.chat.id, msg.text + ' added bla')
})

bot.on('photo', async (msg) => {
  await bot.sendMessage(msg.chat.id, 'photo')
})
