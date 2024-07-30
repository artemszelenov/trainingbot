import { sql } from "../../../sqlite/database";

export function insertClient(
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

class Client {
  id: number;
  chat_id: number;
}

export function allClients() {
  return sql
    .query(
      `
      SELECT id, chat_id FROM clients;
      `
    )
    .as(Client)
    .all();
}

export function insertAnnounce(
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

class AnnouncesToDelete {
  client_message_id: number;
  client_chat_id: number;
}

export function announcesToDelete(last_sender_announce_message_id: number) {
  return sql
    .query(
      `
      SELECT
        announces.client_message_id AS client_message_id,
        clients.chat_id AS client_chat_id
      FROM announces
      WHERE sender_message_id = $last_sender_announce_message_id
      LEFT JOIN clients ON announces.client_id = clients.id;
      `
    )
    .as(AnnouncesToDelete)
    .all(last_sender_announce_message_id);
}

class AnnouncesToUpdate {
  client_message_id: number;
  chat_id: number;
}

export function announcesToUpdate(message_id: number) {
  return sql
    .query(
      `
      SELECT
        announces.client_message_id AS client_message_id,
        clients.chat_id AS chat_id
      FROM announces
      WHERE sender_message_id = $message_id
      LEFT JOIN clients ON announces.client_id = clients.id;
    `
    )
    .as(AnnouncesToUpdate)
    .all(message_id);
}

export { sql };
