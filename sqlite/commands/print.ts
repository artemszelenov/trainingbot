import { sql } from "../sqlite";

const clients = sql.query("SELECT * FROM clients;").all();
console.log("clients");
console.table(clients);

const announces = sql.query("SELECT * FROM announces;").all();
console.log("announces");
console.table(announces);

const forms = sql.query("SELECT * FROM forms;").all();
console.log("forms");
console.table(forms);

const form_answers = sql.query("SELECT * FROM form_answers;").all();
console.log("form_answers");
console.table(form_answers);

const services = sql.query("SELECT * FROM services;").all();
console.log("services");
console.table(services);

const migration = sql.query("SELECT * FROM _migration;").all();
console.log("applied migrations");
console.table(migration);
