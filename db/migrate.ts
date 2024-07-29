import { sql } from "./sqlite";
import * as fs from "fs";

class Migration {
  id: string;
  timestamp: string;
}

sql.run(`
  CREATE TABLE IF NOT EXISTS _migration (
    id TEXT PRIMARY KEY NOT NULL,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
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

// const stmt = sql.query("select * from _migration_lock;").values();

const lock_stmt = sql.prepare(`
  UPDATE _migration_lock
  SET is_locked = 1
  WHERE id = 'migration_lock' AND is_locked = 0
  RETURNING id;
`);

const unlock_stmt = sql.prepare(`
  UPDATE _migration_lock
  SET is_locked = false
  WHERE id = 'migration_lock'
`);

const latest_migration_stmt = sql
  .prepare(
    `
  SELECT id, timestamp FROM _migration
  ORDER BY timestamp DESC
  LIMIT 1;
`
  )
  .as(Migration);

const insert_migration_stmt = sql.prepare(`
  INSERT INTO _migration (id, timestamp) VALUES ($file_name, $timestamp);
`);

const run = sql.transaction(() => {
  const rows = lock_stmt.all();

  if (rows.length === 0) {
    throw new Error("migration is in progress");
  }

  const latest_migration = latest_migration_stmt.get();

  console.log(latest_migration);

  if (latest_migration) {
    console.log(
      `latest migration: ${latest_migration.id} at ${new Date(
        Number(latest_migration.timestamp)
      ).toISOString()}`
    );
  } else {
    console.log(`no previous migrations found`);
  }

  const dir = new URL("migrations", import.meta.url);

  for (const file_name of fs.readdirSync(dir)) {
    if (file_name <= latest_migration?.id) continue;
    if (!file_name.endsWith(".sql")) continue;

    const file_path = new URL(`migrations/${file_name}`, import.meta.url);
    const fileContent = fs.readFileSync(file_path, { encoding: "utf8" });

    const sql_stmts = parseSqlContent(fileContent);

    console.log(`running migration ${file_name}`);

    for (const sql_stmt of sql_stmts) {
      sql.run(sql_stmt);
    }

    insert_migration_stmt.run(file_name, Date.now());
  }

  unlock_stmt.run();
});

run();

/**
 * A single .sql file can contain multiple sql statements
 * splitted by an empty line
 */
function parseSqlContent(content: string): string[] {
  const parts = content
    .split(/\n\n/gm)
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
  return parts;
}
