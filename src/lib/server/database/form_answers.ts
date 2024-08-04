import { sql } from "../../../../sqlite/instance";

export function db_insert_form_answer({
  client_id,
  service_id,
  question,
  answer,
}: {
  client_id: number;
  service_id: number;
  question: string;
  answer: string;
}) {
  return sql
    .query(
      `
      INSERT INTO form_answers (
        client_id, service_id, question, answer
      ) VALUES (?,?,?,?);
    `
    )
    .run(client_id, service_id, question, answer);
}
