curl -X POST https://api.telegram.org/bot$(BOT_TOKEN)/setWebhook \
 -H "Content-type: application/json" \
 -d '{"url": "https://sveltekit-bot.vercel.app"}'
