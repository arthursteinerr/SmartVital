// Comando para rodar: npm test -- tests/integracao/api/pacientes/paciente.test.ts

import request from "supertest";
import { app } from "../../../../src/app";
import { connection } from "../../../../src/dbConnection";
import knex from "knex";

const knexConfig = require("../../../../knexfile");
const db = knex(knexConfig.test);

let tokenAgente: string;

afterAll(async () => {
    await connection.destroy();
});

describe("Integração - Pacientes /pacientes", () => {
    beforeAll(async () => {
        await db.migrate.rollback(undefined, true);
        await db.migrate.latest();
        await db.seed.run();

        //login com agente
        const login = await request(app)
            .post("/auth/login")
            .send({
                registro_profissional: "COREN-123456",
                senha: "abcde"
            });

        tokenAgente = login.body.token;
    });

    afterAll(async () => {
        await db.destroy();
    });

    //teste post sucedido
    it("deve criar um paciente com dados completos", async () => {
        const response = await request(app)
            .post("/pacientes")
            .set("Authorization", `Bearer ${tokenAgente}`)
            .send({
                nome: "Maria Santos",
                idade: 30,
                peso: 65.5,
                altura: 1.68
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.nome).toBe("Maria Santos");
    });

    it("deve criar um paciente apenas com nome", async () => {
        const response = await request(app)
            .post("/pacientes")
            .set("Authorization", `Bearer ${tokenAgente}`)
            .send({
                nome: "Pedro Oliveira"
            });

        expect(response.status).toBe(201);
        expect(response.body.nome).toBe("Pedro Oliveira");
        expect(response.body.idade).toBeUndefined();
    });

    //get all sucedido
    it("deve listar todos os pacientes", async () => {
        const response = await request(app)
            .get("/pacientes")
            .set("Authorization", `Bearer ${tokenAgente}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    //get by id sucedido
    it("deve retornar um paciente por ID", async () => {
        const response = await request(app)
            .get("/pacientes/1")
            .set("Authorization", `Bearer ${tokenAgente}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id", 1);
        expect(response.body).toHaveProperty("nome");
    });

    //patch sucedido
    it("deve atualizar parcialmente um paciente", async () => {
        const response = await request(app)
            .patch("/pacientes/1")
            .set("Authorization", `Bearer ${tokenAgente}`)
            .send({
                temperatura: 36.5,
                pulso: 75
            });

        expect(response.status).toBe(200);
        expect(response.body.temperatura).toBe(36.5);
        expect(response.body.pulso).toBe(75);
    });

    //put - atualizacao total sucedida
    it("deve atualizar completamente um paciente", async () => {
        const response = await request(app)
            .put("/pacientes/1")
            .set("Authorization", `Bearer ${tokenAgente}`)
            .send({
                id: 1,
                nome: "Paciente Atualizado",
                idade: 40,
                peso: 70.0,
                altura: 1.70,
                temperatura: 36.7,
                indice_glicemico: 90,
                pressao_arterial: "110/70",
                saturacao: 97,
                pulso: 70,
                respiracao: 15
            });

        expect(response.status).toBe(200);
        expect(response.body.nome).toBe("Paciente Atualizado");
    });

    //delete sucedido
    it("deve deletar um paciente existente", async () => {
        //criacao de paciente pra ser deletado
        const criado = await request(app)
            .post("/pacientes")
            .set("Authorization", `Bearer ${tokenAgente}`)
            .send({ nome: "Para Deletar" });

        const response = await request(app)
            .delete(`/pacientes/${criado.body.id}`)
            .set("Authorization", `Bearer ${tokenAgente}`);

        expect(response.status).toBe(200);
    });

    //erro - criar sem nome
    it("deve retornar erro ao criar paciente sem nome", async () => {
        const response = await request(app)
            .post("/pacientes")
            .set("Authorization", `Bearer ${tokenAgente}`)
            .send({
                idade: 25
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
    });

    //erro- buscar id inválido
    it("deve retornar 400 ao buscar paciente com ID inválido", async () => {
        const response = await request(app)
            .get("/pacientes/abc")
            .set("Authorization", `Bearer ${tokenAgente}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("ID Inválido.");
    });

    //erro - buscar id inexistente
    it("deve retornar 404 ao buscar paciente inexistente", async () => {
        const response = await request(app)
            .get("/pacientes/9999")
            .set("Authorization", `Bearer ${tokenAgente}`);

        expect(response.status).toBe(404);
    });

    //erro - atualizar id invalido
    it("deve retornar 400 ao atualizar paciente com ID inválido", async () => {
        const response = await request(app)
            .patch("/pacientes/xyz")
            .set("Authorization", `Bearer ${tokenAgente}`)
            .send({ nome: "Teste" });

        expect(response.status).toBe(400);
    });

    //erro - atualizar id inexistente
    it("deve retornar 404 ao atualizar paciente inexistente", async () => {
        const response = await request(app)
            .patch("/pacientes/9999")
            .set("Authorization", `Bearer ${tokenAgente}`)
            .send({ nome: "Teste" });

        expect(response.status).toBe(404);
    });

    //erro - deletar id invalido
    it("deve retornar 400 ao deletar paciente com ID inválido", async () => {
        const response = await request(app)
            .delete("/pacientes/abc")
            .set("Authorization", `Bearer ${tokenAgente}`);

        expect(response.status).toBe(400);
    });

    //erro - deletar id inexistente
    it("deve retornar 404 ao deletar paciente inexistente", async () => {
        const response = await request(app)
            .delete("/pacientes/9999")
            .set("Authorization", `Bearer ${tokenAgente}`);

        expect(response.status).toBe(404);
    });

    //tentar acessar sem autenticacao
    it("deve retornar 401 ao tentar acessar sem token", async () => {
        const response = await request(app)
            .get("/pacientes");

        expect(response.status).toBe(401);
    });
});
