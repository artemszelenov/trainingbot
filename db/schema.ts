import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

const timestamp = {
  created_at: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updated_at: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
    .notNull(),
};

export const clients = sqliteTable("clients", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  chat_id: integer("chat_id").notNull(),
  first_name: text("first_name"),
  last_name: text("last_name"),
  username: text("username").unique(),
  ...timestamp,
});

export const announces = sqliteTable("announces", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  sender_message_id: integer("sender_message_id").notNull(),
  client_message_id: integer("client_message_id").notNull(),
  client_id: integer("client_id")
    .references(() => clients.id)
    .notNull(),
  ...timestamp,
});
