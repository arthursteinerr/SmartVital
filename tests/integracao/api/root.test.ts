// Comando para rodar teste desse arquivo: npm test -- tests/integracao/api/root.test.ts

import supertest from "supertest";
import { app } from "../../../src/app";

const request = supertest(app);

describe("Teste de saude da API", () => {
    it("GET / deve retornar status 200 e a mensagem correta", async () => {
        const response = await request.get("/");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe("SmartVital API Funcionando!");
    });
});