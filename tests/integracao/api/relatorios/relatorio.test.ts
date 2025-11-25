// Comando para rodar teste desse arquivo: npm test -- tests/integracao/api/relatorios/relatorio.test.ts

import request from "supertest";
import { app } from "../../../../src/app";
import { connection } from "../../../../src/dbConnection";

const knexConfig = require("../../../../knexfile");
import knex from "knex";

const db = knex(knexConfig.test);

let tokenAgente: string;
let tokenMedico: string;

afterAll(async () => {
    await connection.destroy(); // encerra pool do Knex
});

describe("Integração - Relatórios /relatorios", () => {
    beforeAll(async () => {
        await db.migrate.rollback(undefined, true);
        await db.migrate.latest();
        await db.seed.run();

        // Login como Médico (id 1 nas seeds)
        const loginMedico = await request(app)
            .post("/auth/login")
            .send({
                registro_profissional: "CRM-SP-456789",
                senha: "12345"
            });

        tokenMedico = loginMedico.body.token;

        // Login como Agente 2 (id 2 nas seeds)
        const loginAgente = await request(app)
            .post("/auth/login")
            .send({
                registro_profissional: "COREN-123456",
                senha: "abcde"
            });

        tokenAgente = loginAgente.body.token;
    });

    afterAll(async () => {
        await db.destroy();
    });

    // POST - CRIAR
    it("deve criar um relatório", async () => {
        const novo = {
            id_paciente: 1,
            id_agente: 2,
            observacao: "Relatorio criado no teste automatizado.",
            completo: false
        };

        const response = await request(app)
            .post("/relatorios")
            .set("Authorization", `Bearer ${tokenAgente}`)
            .send(novo);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.observacao).toContain("Relatorio criado no teste");
    });

    // GET - Buscar por ID
    it("deve retornar relatório por ID", async () => {
        const response = await request(app)
            .get("/relatorios/1")
            .set("Authorization", `Bearer ${tokenAgente}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id", 1);
    });

    // GET - Por paciente
    it("deve listar relatórios por paciente", async () => {
        const response = await request(app)
            .get("/relatorios/paciente/1")
            .set("Authorization", `Bearer ${tokenAgente}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    // GET - Pendentes
    it("deve listar relatórios pendentes", async () => {
        const response = await request(app)
            .get("/relatorios/pendentes")
            .set("Authorization", `Bearer ${tokenAgente}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // GET - Por data
    it("deve buscar relatórios filtrando por data", async () => {

        const hoje = new Date(); // Usamos "hoje" porque a seed insere `knex.fn.now()`
        const dd = String(hoje.getDate()).padStart(2, "0");
        const mm = String(hoje.getMonth() + 1).padStart(2, "0");
        const yyyy = hoje.getFullYear();

        const dataBrasileira = `${dd}-${mm}-${yyyy}`;

        const response = await request(app)
            .get(`/relatorios/por-data/${dataBrasileira}`)
            .set("Authorization", `Bearer ${tokenAgente}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // PATCH - Atualizar
    it("deve atualizar um relatório existente", async () => {
        const response = await request(app)
            .patch("/relatorios/1")
            .set("Authorization", `Bearer ${tokenAgente}`)
            .send({ observacao: "Observação atualizada via teste." });

        expect(response.status).toBe(200);
        expect(response.body.observacao).toContain("atualizada");
    });

    // DELETE - Exclusão (soft delete)
    it("deve permitir exclusão quando médico confirma", async () => {

        const response = await request(app)
            .delete("/relatorios/deletar/2")
            .set("Authorization", `Bearer ${tokenMedico}`)
            .send({
                solicitado_por: 2,
                confirmado_por_medico: 1,
                motivo_exclusao: "Este relatório deve ser removido pois contém informações inconsistentes."
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Soft delete registrado com sucesso.");
    });

    // TESTES DE ERRO
    // Buscar por ID inválido
    it("deve retornar 400 ao buscar relatório com ID inválido", async () => {
        const response = await request(app)
            .get("/relatorios/abc")
            .set("Authorization", `Bearer ${tokenAgente}`);

        expect(response.status).toBe(400);
    });

    // Buscar relatório inexistente
    it("deve retornar 404 ao buscar relatório que não existe", async () => {
        const response = await request(app)
            .get("/relatorios/9999")
            .set("Authorization", `Bearer ${tokenAgente}`);

        expect(response.status).toBe(404);
    });

    // Criar relatório com id_paciente inexistente
    it("deve retornar erro ao criar relatório para paciente inexistente", async () => {
        const novo = {
            id_paciente: 9999,
            id_agente: 1,
            observacao: "Teste com paciente inválido."
        };

        const response = await request(app)
            .post("/relatorios")
            .set("Authorization", `Bearer ${tokenAgente}`)
            .send(novo);

        expect(response.status).toBe(400);
    });

    // Criar com payload incompleto
    it("deve retornar 400 ao criar relatório sem campos obrigatórios", async () => {
        const response = await request(app)
            .post("/relatorios")
            .set("Authorization", `Bearer ${tokenAgente}`)
            .send({ observacao: "faltando campos" });

        expect(response.status).toBe(400);
    });

    // Atualizar relatório inexistente
    it("deve retornar erro ao atualizar relatório inexistente", async () => {
        const response = await request(app)
            .patch("/relatorios/9999")
            .set("Authorization", `Bearer ${tokenAgente}`)
            .send({ observacao: "update inválido" });

        expect(response.status).toBe(404);
    });

    // Atualizar com payload vazio
    it("deve retornar 400 ao atualizar sem enviar dados", async () => {
        const response = await request(app)
            .patch("/relatorios/1")
            .set("Authorization", `Bearer ${tokenAgente}`)
            .send({});

        expect(response.status).toBe(400);
    });

    // Listar por paciente inexistente
    it("deve retornar 404 ao buscar relatórios por paciente inexistente", async () => {
        const response = await request(app)
            .get("/relatorios/paciente/9999")
            .set("Authorization", `Bearer ${tokenAgente}`);

        expect(response.status).toBe(404);
    });

    // Excluir sem passar campos obrigatórios
    it("deve retornar 400 ao tentar excluir relatório sem enviar solicitado_por e confirmado_por_medico", async () => {
        const response = await request(app)
            .delete("/relatorios/deletar/1")
            .set("Authorization", `Bearer ${tokenAgente}`)
            .send({});

        expect(response.status).toBe(400);
    });

    // Excluir relatório inexistente
    it("deve retornar erro ao excluir relatório inexistente", async () => {
        const response = await request(app)
            .delete("/relatorios/deletar/9999")
            .set("Authorization", `Bearer ${tokenAgente}`)
            .send({
                solicitado_por: 1,
                confirmado_por_medico: 2,
                motivo_exclusao: "teste"
            });

        expect(response.status).toBe(400);
    });

    // Excluir com IDs inválidos
    it("deve retornar 400 ao excluir com IDs inválidos", async () => {
        const response = await request(app)
            .delete("/relatorios/deletar/1")
            .set("Authorization", `Bearer ${tokenAgente}`)
            .send({
                solicitado_por: "abc",
                confirmado_por_medico: "xyz",
                motivo_exclusao: "motivo"
            });

        expect(response.status).toBe(400);
    });
});