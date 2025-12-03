import { connection } from "../../src/dbConnection";
import knex from "knex";

const knexConfig = require("../../knexfile");
const db = knex(knexConfig.test);

jest.setTimeout(30000);

beforeAll(async () => {
    const resetDB = require("./resetDB");
    await resetDB();
});

afterAll(async () => {
    await connection.destroy(); // encerra pool do Knex
    await db.destroy();
});