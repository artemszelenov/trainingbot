import { sql } from "../../../../sqlite/instance";

export class Client {
  id: number;
  chat_id: number;
  first_name: string | null;
  last_name: string | null;
  age: number | null;
  phone: string | null;
  username: string;
}

export function db_get_client(chat_id: number) {
  return sql
    .query(
      `
      SELECT * FROM clients WHERE chat_id = ?;
    `
    )
    .as(Client)
    .get(chat_id);
}

export function db_insert_client(
  chat_id: number,
  first_name: string,
  last_name: string,
  username: string
) {
  return sql
    .query(
      `
      INSERT INTO clients (
        chat_id, first_name, last_name, username
      ) VALUES (?,?,?,?);
    `
    )
    .get(chat_id, first_name, last_name, username);
}

export function db_update_client_phone(chat_id: number, phone: string) {
  sql
    .query(
      `
      UPDATE clients 
      SET phone = ?1
      WHERE chat_id = ?2;
    `
    )
    .run(phone, chat_id);
}

export function db_update_client_age(chat_id: number, age: number) {
  sql
    .query(
      `
      UPDATE clients 
      SET age = ?1
      WHERE chat_id = ?2;
    `
    )
    .run(age, chat_id);
}

export function db_get_all_clients() {
  return sql
    .query(
      `
      SELECT id, chat_id FROM clients;
      `
    )
    .as(Client)
    .all();
}
