import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export async function ensureDatabaseExists() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
    });

    const dbName = process.env.DB_DATABASE;
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`✅ Banco de dados "${dbName}" verificado/criado.`);
    await connection.end();
}