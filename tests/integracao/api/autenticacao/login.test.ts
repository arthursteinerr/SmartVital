// Comando para rodar teste desse arquivo: npm test -- tests/integracao/api/autenticacao/login.test.ts

import request from "supertest";
import { app } from "../../../../src/app";

const knexConfig = require("../../../../knexfile");
import knex from "knex";


const db = knex(knexConfig.test);

describe("Integração - Login /auth/login", () => {
    beforeAll(async () => {
        await db.migrate.rollback(undefined, true);
        await db.migrate.latest();
        await db.seed.run();
    });

    afterAll(async () => {
        await db.destroy();
    });

    it("deve autenticar um agente válido e retornar um token JWT", async () => {
        // Credenciais que EXISTEM na seed
        const loginData = {
            registro_profissional: "CRM-SP-456789",
            senha: "12345"
        };

        const response = await request(app)
            .post("/auth/login")
            .send(loginData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(typeof response.body.token).toBe("string");

        expect(response.body).toHaveProperty("agente");
        expect(response.body.agente).toHaveProperty("id");
        expect(response.body.agente).toHaveProperty("registro_profissional");
    });

    it("deve recusar autenticação com credenciais inválidas", async () => {
        const response = await request(app)
            .post("/auth/login")
            .send({
                registro_profissional: "USER_INVALIDO",
                senha: "senha_ruim"
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("deve recusar autenticação com senha inválida", async () => {
        const response = await request(app)
            .post("/auth/login")
            .send({
                registro_profissional: "CRM-SP-456789",
                senha: "senha_ruim"
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("deve recusar autenticação com registro_profissional inválido", async () => {
        const response = await request(app)
            .post("/auth/login")
            .send({
                registro_profissional: "CRM-SP-45678",
                senha: "12345"
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });
});