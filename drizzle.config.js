/** @type { import("drizzle-kit").Config } */
export default {
  dialect: "sqlite", // "mysql" | "sqlite" | "postgresql"
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dbCredentials: {
    url: "./db/sqlite.db"
  }
};