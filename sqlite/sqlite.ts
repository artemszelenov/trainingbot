import { Database } from "bun:sqlite";

export const sql = new Database("./sqlite/data.sqlite", {
	create: true,
	strict: true,
});
