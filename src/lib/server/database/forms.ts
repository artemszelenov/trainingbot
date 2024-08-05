import { sql } from "../../../../sqlite/instance";

export class Form {
  id: number;
  name: string;
}

export function db_insert_form_and_return() {
  const { lastInsertRowid } = sql
    .query(`INSERT INTO forms (name) VALUES ("");`)
    .run();

  return sql
    .query(`SELECT * FROM forms WHERE id = ?;`)
    .as(Form)
    .get(lastInsertRowid);
}
