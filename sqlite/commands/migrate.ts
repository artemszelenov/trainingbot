import { parse_sql_content } from "../helpers";
import { sql } from "../instance";
import * as fs from "fs";

sql.run(`
  CREATE TABLE IF NOT EXISTS _migration (
    id TEXT PRIMARY KEY NOT NULL,
    timestamp TEXT NOT NULL
  );
`);

sql.run(`
  CREATE TABLE IF NOT EXISTS _migration_lock (
    id TEXT PRIMARY KEY NOT NULL,
    is_locked INTEGER NOT NULL
  );
`);

sql.run(`
  INSERT INTO _migration_lock (
    id,
    is_locked
  ) VALUES (
   'migration_lock',
   0
  ) ON CONFLICT (id) DO NOTHING;
`);

const run = sql.transaction(async () => {
  const rows = sql.query(`
    UPDATE _migration_lock
    SET is_locked = 1
    WHERE id = 'migration_lock' AND is_locked = 0
    RETURNING id;
  `).all();

  if (rows.length === 0) {
    throw new Error("migration is in progress");
  }

  class Migration {
    id: string;
    timestamp: string;
  }
  const latest_migration = sql
    .query(`
      SELECT id, timestamp FROM _migration
      ORDER BY timestamp DESC
      LIMIT 1;
    `)
    .as(Migration).get();

  if (latest_migration) {
    console.log(
      `latest migration: ${latest_migration.id} at ${new Date(
        Number(latest_migration.timestamp)
      ).toISOString()}`
    );
  } else {
    console.log(`no previous migrations found`);
  }

  const dir = new URL("../migrations", import.meta.url);

  for (const file_name of fs.readdirSync(dir)) {
    if (latest_migration && file_name <= latest_migration?.id) continue;
    if (!file_name.endsWith(".sql")) continue;

    const file_path = new URL(`../migrations/${file_name}`, import.meta.url);
    const file_content = fs.readFileSync(file_path, { encoding: "utf8" });

    const queries = parse_sql_content(file_content);

    console.log(`running migration ${file_name}`);

    for (const query of queries) {
      sql.run(query);
    }

    sql.query(`
      INSERT INTO _migration (id, timestamp) VALUES (?, unixepoch());
    `).run(file_name);

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  sql.query(`
    UPDATE _migration_lock
    SET is_locked = false
    WHERE id = 'migration_lock'
  `).run();
});

run();
