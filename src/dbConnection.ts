import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

// conferir se todas as variáveis estão definidas
const requiredEnv = ["DB_CLIENT", "DB_HOST", "DB_USER", "DB_PASSWORD", "DB_DATABASE", "DB_PORT"];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Variável de ambiente ${key} não definida no .env`);
  }
}

export const connection = knex({
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT),
  },
});

export default connection;
