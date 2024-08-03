import { sql } from "../../../sqlite/database";
import * as mappings from "../../../sqlite/mappings";

export { mappings };

export function db_get_client(chat_id: number) {
  return sql
    .query(
      `
      SELECT * FROM clients WHERE chat_id = ?;
    `
    )
    .as(mappings.Client)
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

export function db_get_all_clients() {
  return sql
    .query(
      `
      SELECT id, chat_id FROM clients;
      `
    )
    .as(mappings.Client)
    .all();
}

export function db_insert_announce(
  client_id: number,
  sender_message_id: number,
  client_message_id: number
) {
  sql
    .query(
      `
      INSERT INTO announces (
        client_id, sender_message_id, client_message_id
      ) VALUES (?,?,?);
      `
    )
    .run(client_id, sender_message_id, client_message_id);
}

export function db_get_announces_to_delete(
  last_sender_announce_message_id: number
) {
  return sql
    .query(
      `
      SELECT
        announces.client_message_id AS client_message_id,
        clients.chat_id AS client_chat_id
      FROM announces
      LEFT JOIN clients ON announces.client_id = clients.id
      WHERE announces.sender_message_id = ?;
      `
    )
    .as(mappings.AnnouncesToDelete)
    .all(last_sender_announce_message_id);
}

// fix it to bulk delete
export function db_delete_announce(client_message_id: number) {
  return sql
    .query(
      `
      DELETE FROM announces WHERE client_message_id = ?;
    `
    )
    .run(client_message_id);
}

export function db_get_announces_to_update(message_id: number) {
  return sql
    .query(
      `
      SELECT
        announces.client_message_id AS client_message_id,
        clients.chat_id AS chat_id
      FROM announces
      LEFT JOIN clients ON announces.client_id = clients.id
      WHERE announces.sender_message_id = ?;
    `
    )
    .as(mappings.AnnouncesToUpdate)
    .all(message_id);
}

export { sql };
