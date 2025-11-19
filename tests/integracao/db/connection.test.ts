// Comando para rodar teste desse arquivo: npm test -- tests/integracao/db/connection.test.ts

import { connection } from "../../../src/dbConnection";

describe("Conexão com o banco de testes", () => {

    it("deve conectar ao banco de dados de teste com sucesso", async () => {

        const result = await connection.raw("SELECT 1 + 1 AS resultado");

        expect(result[0][0].resultado).toBe(2);
    });

    it("NODE_ENV deve ser 'test'", () => {

        expect(process.env.NODE_ENV).toBe("test");
    });

    it("deve possuir variaveis de ambiente do banco de testes", () => {

        expect(process.env.DB_DATABASE).toBeDefined();
        expect(process.env.DB_HOST).toBeDefined();
        expect(process.env.DB_USER).toBeDefined();
        expect(process.env.DB_PASSWORD).toBeDefined();
    });
});