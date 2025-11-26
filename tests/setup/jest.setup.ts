import { connection } from "../../src/dbConnection";

jest.setTimeout(30000);

beforeAll(async () => {
    const resetDB = require("./resetDB");
    await resetDB();
});

afterAll(async () => {
    await connection.destroy(); // encerra pool do Knex
});