import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const clients = sqliteTable('clients', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  tg_chat_id: integer('tg_chat_id'),
  first_name: text('first_name'),
  last_name: text('last_name'),
  username: text('username').unique(),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => sql`CURRENT_TIMESTAMP`).notNull(),
});

export const announces = sqliteTable('announces', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  original_message_id: integer('original_message_id'),
  message_id: integer('message_id'),
  client_id: integer('client_id').references(() => clients.id),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => sql`CURRENT_TIMESTAMP`).notNull(),
})