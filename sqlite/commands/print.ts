import { sql } from "../database";

const clients = sql.query("SELECT * FROM clients;").all();
console.log("clients");
console.table(clients);

const announces = sql.query("SELECT * FROM announces;").all();
console.log("announces");
console.table(announces);

const migration = sql.query("SELECT * FROM _migration;").all();
console.log("applied migrations");
console.table(migration);
