import { sql } from "../../../../sqlite/sqlite";

export class FormAnswerShort {
	question: string;
	answer: string;
}

export function db_insert_form_answer({
	client_id,
	service_id,
	form_id,
	question,
	answer,
}: {
	client_id: number;
	service_id: number;
	form_id: number;
	question: string;
	answer: string;
}) {
	return sql
		.query(
			`
      INSERT INTO form_answers (
        client_id, service_id, question, answer, form_id
      ) VALUES (?,?,?,?,?);
    `,
		)
		.run(client_id, service_id, question, answer, form_id);
}

export function db_get_form_answers(
	client_id: number,
	service_id: number,
	form_id: number,
) {
	return sql
		.query(`
      SELECT question, answer 
      FROM form_answers 
      WHERE client_id = $1 AND service_id = $2 AND form_id = $3
    `)
		.as(FormAnswerShort)
		.all(client_id, service_id, form_id);
}
