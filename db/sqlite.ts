import { Database } from "bun:sqlite";

export const sql = new Database("./db/data.sqlite", {
  create: true,
  strict: true,
});

sql.exec("PRAGMA journal_mode = WAL;");
