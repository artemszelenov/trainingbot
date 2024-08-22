import {
	Keyboard,
	RemoveKeyboard,
	type Message,
	bold,
	format,
	join,
	type CallbackQueryContext,
} from "@gramio/core";
import {
	db_get_client,
	db_insert_form_answer,
	db_update_client_age,
	db_update_client_phone,
	db_get_service,
	db_get_form_answers,
} from "$lib/server/database";
import type { bot } from "$lib/server/bot";

export async function proceed_form_start(
	context: CallbackQueryContext<typeof bot>,
) {
	if (!context.message) return;

	const message = context.message;
	const prompt = context.prompt;
	const bot = context.bot;
	const data = context.queryData;

	const client = db_get_client(message.chat.id);

	if (!client) {
		throw new Error("[trainingbot] > Can't start from, client not found");
	}

	let question = "";
	let answer: Message;

	if (!client?.first_name) {
		question = "Введите ваше имя";
		answer = await prompt("message", question, {
			reply_markup: new RemoveKeyboard(),
		});

		db_insert_form_answer({
			question,
			answer: answer.text || "",
			client_id: client.id,
			service_id: data.service_id,
			form_id: data.form_id,
		});
	}

	if (!client?.last_name) {
		question = "Введите вашу фамилию";
		answer = await prompt("message", question);

		db_insert_form_answer({
			question,
			answer: answer.text || "",
			client_id: client.id,
			service_id: data.service_id,
			form_id: data.form_id,
		});
	}

	question = "Какой у вас запрос?";
	answer = await prompt("message", question, {
		reply_markup: new RemoveKeyboard(),
	});

	db_insert_form_answer({
		question,
		answer: answer.text || "",
		client_id: client.id,
		service_id: data.service_id,
		form_id: data.form_id,
	});

	question = "На сколько баллов от 1 до 10 вам важно решить запрос?";
	answer = await prompt("message", question, {
		reply_markup: new Keyboard()
			.text("1")
			.text("2")
			.text("3")
			.text("4")
			.text("5")
			.row()
			.text("6")
			.text("7")
			.text("8")
			.text("9")
			.text("10")
			.oneTime(),
	});

	db_insert_form_answer({
		question,
		answer: answer.text || "",
		client_id: client.id,
		service_id: data.service_id,
		form_id: data.form_id,
	});

	if (!client?.phone) {
		question = "Ваш контактный телефон";
		answer = await prompt("message", question, {
			reply_markup: new Keyboard()
				.requestContact("Поделиться номером с Ритой")
				.oneTime(),
		});

		if (answer?.contact?.phoneNumber) {
			db_update_client_phone(client.chat_id, answer?.contact?.phoneNumber);
		}
	}

	if (!client?.age) {
		question = "Сколько вам полных лет?";
		answer = await prompt("message", question, {
			reply_markup: new RemoveKeyboard(),
		});

		if (answer.text) {
			db_update_client_age(client.chat_id, Number.parseInt(answer.text));
		}
	}

	question = "Откуда обо мне узнали?";
	answer = await prompt("message", question);

	db_insert_form_answer({
		question,
		answer: answer.text || "",
		client_id: client.id,
		service_id: data.service_id,
		form_id: data.form_id,
	});

	await bot.api.sendMessage({
		chat_id: client.chat_id,
		text: `Спасибо за уделенное время, ${client.first_name}! Маргарита свяжется с вами для уточнения деталей и оплаты`,
	});

	const service = db_get_service(data.service_id);

	const form_answers = db_get_form_answers(
		client.id,
		data.service_id,
		data.form_id,
	);

	const fresh_client = db_get_client(client.chat_id);

	const admin_text = format`
      📝 ${bold`Новая заявка`}

      ${bold`Клиент`}

      ФИО: ${fresh_client?.first_name ?? ""} ${fresh_client?.last_name ?? ""}
      Телефон: ${fresh_client?.phone ?? ""}
      Возраст: ${fresh_client?.age ?? ""}
      Имя пользователя: @${fresh_client?.username ?? ""}

      ${bold`Услуга`}

      "${service?.service_name ?? ""}"

      ${bold`Результаты опроса`}

      ${join(form_answers, ({ question = "", answer = "" }) => format`${question}: ${answer}`, "\n")}
    `;

	await bot.api.sendMessage({
		chat_id: Number(Bun.env.ADMIN_CHAT_ID),
		text: admin_text,
	});
}
