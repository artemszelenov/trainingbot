import { parse_sql_content } from "../helpers";
import { sql } from "../sqlite";
import * as fs from "node:fs";

sql.run(`
  CREATE TABLE IF NOT EXISTS _migration (
    id TEXT PRIMARY KEY NOT NULL,
    timestamp TEXT NOT NULL
  );
`);

class Migration {
	id: string;
	timestamp: string;
}

const run = sql.transaction(async () => {
	const latest_migration = sql
		.query(`
      SELECT id, timestamp FROM _migration
      ORDER BY timestamp DESC
      LIMIT 1;
    `)
		.as(Migration)
		.get();

	if (latest_migration) {
		console.log(
			`latest migration: ${latest_migration.id} at ${new Date(
				Number(latest_migration.timestamp),
			).toISOString()}`,
		);
	} else {
		console.log("no previous migrations found");
	}

	const dir = new URL("../migrations", import.meta.url);
	const sorted_file_names = fs
		.readdirSync(dir)
		.toSorted((a, b) => (a > b ? 1 : -1));

	for (const file_name of sorted_file_names) {
		if (latest_migration && file_name <= latest_migration?.id) continue;
		if (!file_name.endsWith(".sql")) continue;

		const file_path = new URL(`../migrations/${file_name}`, import.meta.url);
		const file_content = fs.readFileSync(file_path, { encoding: "utf8" });

		const queries = parse_sql_content(file_content);

		console.log(`running migration ${file_name}`);

		for (const query of queries) {
			sql.run(query);
		}

		sql
			.query(`
      INSERT INTO _migration (id, timestamp) VALUES (?, unixepoch());
    `)
			.run(file_name);

		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
});

run();
