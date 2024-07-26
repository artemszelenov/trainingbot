import dotenv from 'dotenv'
import ngrok from 'ngrok'
import TelegramBot from 'node-telegram-bot-api'

dotenv.config()

const BOT_TOKEN = process.env.TG_BOT_TOKEN

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN is not set')
}

export const bot = new TelegramBot(BOT_TOKEN)

const url = await ngrok.connect(5173)

console.log('tunnel     ', url)
console.log('bot        ', BOT_TOKEN)
console.log('webHookSet ', await bot.setWebHook(url))
console.log('webHookInfo', await bot.getWebHookInfo())