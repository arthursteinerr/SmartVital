// Comando para rodar teste desse arquivo: npm test -- tests/End2End/relatorio-fluxo-atualizacao.test.ts

import request from "supertest";
import { app } from "../../src/app";
import knex from "knex";

const knexConfig = require("../../knexfile");

const db = knex(knexConfig.test);

let tokenAgente: string;

describe("E2E - Fluxo de criação, busca e atualização de relatório", () => {
    beforeAll(async () => {
        await db.migrate.rollback(undefined, true);
        await db.migrate.latest();
        await db.seed.run();

        // Login realizado com um dos agentes cadastrados por meio da seed
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

    let novoRelatorioId: number;

    it("deve criar um relatório", async () => {
        const response = await request(app)
            .post("/relatorios/")
            .set("Authorization", `Bearer ${tokenAgente}`)
            .send({
                id_paciente: 1,
                id_agente: 1,
                observacao: "Paciente com dor abdominal",
                completo: false
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");

        novoRelatorioId = response.body.id;
    });

    it("deve buscar o relatório criado", async () => {
        const response = await request(app)
            .get(`/relatorios/${novoRelatorioId}`)
            .set("Authorization", `Bearer ${tokenAgente}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(novoRelatorioId);
    });

    it("deve atualizar o relatório", async () => {
        const response = await request(app)
            .patch(`/relatorios/${novoRelatorioId}`)
            .set("Authorization", `Bearer ${tokenAgente}`)
            .send({
                observacao: "Paciente com dor abdominal moderada",
                completo: true
            });

        expect(response.status).toBe(200);
        expect(response.body.completo).toBe(true);
        expect(response.body.observacao).toBe("Paciente com dor abdominal moderada");
    });
});