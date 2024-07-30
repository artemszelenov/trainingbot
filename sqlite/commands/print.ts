import { sql } from "../database";

const clients = sql.query("select * from clients;").values();
const announces = sql.query("select * from announces;").values();

console.log("clients", clients);
console.log("announces", announces);

const migration = sql.query("select * from _migration;").values();
const migration_lock = sql.query("select * from _migration_lock;").values();

console.log("migration", migration);
console.log("migration_lock", migration_lock);
