// Comando para rodar: npm test -- tests/End2End/paciente-fluxo-completo.test.ts

import request from "supertest";
import { app } from "../../src/app";
import knex from "knex";

const knexConfig = require("../../knexfile");
const db = knex(knexConfig.test);

let tokenAgente: string;

describe("E2E - Fluxo completo de Paciente", () => {
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

    let novoPacienteId: number;

    //post paciente
    it("deve criar um novo paciente", async () => {
        const response = await request(app)
            .post("/pacientes")
            .set("Authorization", `Bearer ${tokenAgente}`)
            .send({
                nome: "Jorge Silva",
                idade: 45,
                peso: 80.5,
                altura: 1.75
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.nome).toBe("Jorge Silva");
        expect(response.body.idade).toBe(45);

        novoPacienteId = response.body.id;
    });

    //get pacientes by id
    it("deve buscar o paciente criado por ID", async () => {
        const response = await request(app)
            .get(`/pacientes/${novoPacienteId}`)
            .set("Authorization", `Bearer ${tokenAgente}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(novoPacienteId);
        expect(response.body.nome).toBe("Jorge Silva");
    });

    //get pacientes
    it("deve listar todos os pacientes", async () => {
        const response = await request(app)
            .get("/pacientes")
            .set("Authorization", `Bearer ${tokenAgente}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    //patch - atualizacao parcial
    it("deve atualizar parcialmente o paciente", async () => {
        const response = await request(app)
            .patch(`/pacientes/${novoPacienteId}`)
            .set("Authorization", `Bearer ${tokenAgente}`)
            .send({
                temperatura: 36.8,
                saturacao: 98
            });

        expect(response.status).toBe(200);
        expect(response.body.temperatura).toBe(36.8);
        expect(response.body.saturacao).toBe(98);
        expect(response.body.nome).toBe("Jorge Silva"); // Mantém dados anteriores
    });

    //put - atualizaçao total
    it("deve atualizar completamente o paciente", async () => {
        const response = await request(app)
            .put(`/pacientes/${novoPacienteId}`)
            .set("Authorization", `Bearer ${tokenAgente}`)
            .send({
                id: novoPacienteId,
                nome: "Jorge Silva Atualizado",
                idade: 46,
                peso: 82.0,
                altura: 1.75,
                temperatura: 37.0,
                indice_glicemico: 95,
                pressao_arterial: "120/80",
                saturacao: 99,
                pulso: 72,
                respiracao: 16
            });

        expect(response.status).toBe(200);
        expect(response.body.nome).toBe("Jorge Silva Atualizado");
        expect(response.body.idade).toBe(46);
        expect(response.body.peso).toBe(82.0);
    });

    //delete
    it("deve deletar o paciente", async () => {
        const response = await request(app)
            .delete(`/pacientes/${novoPacienteId}`)
            .set("Authorization", `Bearer ${tokenAgente}`);

        expect(response.status).toBe(200);
    });

    //verificar delete
    it("não deve encontrar o paciente deletado", async () => {
        const response = await request(app)
            .get(`/pacientes/${novoPacienteId}`)
            .set("Authorization", `Bearer ${tokenAgente}`);

        expect(response.status).toBe(404);
    });
});
