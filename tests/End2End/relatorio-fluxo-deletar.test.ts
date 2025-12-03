// Comando para rodar teste desse arquivo: npm test -- tests/End2End/relatorio-fluxo-deletar.test.ts

import request from "supertest";
import { app } from "../../src/app";
import knex from "knex";

const knexConfig = require("../../knexfile");
const db = knex(knexConfig.test);

let tokenEnfermeiro: string;

describe("E2E - Fluxo de criação, busca e deleção de relatório", () => {

    beforeAll(async () => {
        await db.migrate.rollback(undefined, true);
        await db.migrate.latest();
        await db.seed.run();

        // Login Medico
        const login = await request(app)
            .post("/auth/login")
            .send({
                registro_profissional: "CRM-SP-456789",
                senha: "12345"
            });

        tokenEnfermeiro = login.body.token;
    });

    afterAll(async () => {
        await db.destroy();
    });

    let relatorioId: number;

    it("deve criar um relatório para testes", async () => {
        const response = await request(app)
            .post("/relatorios/")
            .set("Authorization", `Bearer ${tokenEnfermeiro}`)
            .send({
                id_paciente: 1,
                id_agente: 1,
                observacao: "Relatório para testar deleção",
                completo: false
            });

        expect(response.status).toBe(201);
        relatorioId = response.body.id;
    });

    it("deve encontrar o relatório antes de deletar", async () => {
        const response = await request(app)
            .get(`/relatorios/${relatorioId}`)
            .set("Authorization", `Bearer ${tokenEnfermeiro}`);

        expect(response.status).toBe(200);
    });

    it("deve permitir realizar o soft delete", async () => {
        const response = await request(app)
            .delete(`/relatorios/deletar/${relatorioId}`)
            .set("Authorization", `Bearer ${tokenEnfermeiro}`)
            .send({
                solicitado_por: 1,
                confirmado_por_medico: 1,
                motivo_exclusao: "Motivo válido com mais de 30 caracteres...."
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Soft delete registrado com sucesso.");
    });

    it("não deve encontrar o relatório após deletar", async () => {
        const response = await request(app)
            .get(`/relatorios/${relatorioId}`)
            .set("Authorization", `Bearer ${tokenEnfermeiro}`);

        console.log("GET AFTER DELETE:", {
            status: response.status,
            body: response.body
        });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Relatorio não encontrado!");
    });

    it("não deve permitir deletar novamente", async () => {
        const response = await request(app)
            .delete(`/relatorios/deletar/${relatorioId}`)
            .set("Authorization", `Bearer ${tokenEnfermeiro}`)
            .send({
                solicitado_por: 1,
                confirmado_por_medico: 1,
                motivo_exclusao: "Motivo válido com mais de 30 caracteres...."
            });

        console.log("DELETE AGAIN RESPONSE:", {
            status: response.status,
            body: response.body
        });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Relatorio não encontrado!");
    });
});