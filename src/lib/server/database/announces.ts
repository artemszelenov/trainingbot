import { sql } from "../../../../sqlite/instance";

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

export class AnnouncesToDelete {
  client_message_id: number;
  client_chat_id: number;
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
    .as(AnnouncesToDelete)
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

export class AnnouncesToUpdate {
  client_message_id: number;
  chat_id: number;
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
    .as(AnnouncesToUpdate)
    .all(message_id);
}
