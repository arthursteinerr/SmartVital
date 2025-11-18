// Comando para rodar teste desse arquivo: npm test -- tests/unitario/data/relatorioData.test.ts

import {
    createRelatorio,
    getRelatorioById,
    getRelatoriosByPaciente,
    updateRelatorio,
    getRelatoriosPendentes,
    getRelatoriosByData,
    deleteRelatorio
} from "../../../src/data/relatorioData";

import { connection } from "../../../src/dbConnection";
import { Relatorio } from "../../../src/types/relatorioTypes";

jest.mock("../../../src/dbConnection", () => ({
    connection: jest.fn()
}));

// cria funções mock encadeáveis do knex
const mockQuery = () => {
    const query: any = {
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        whereRaw: jest.fn().mockReturnThis(),
        first: jest.fn(),
    };
    return query;
};

describe("relatorioData", () => {

    let tableMock: any;
    let nowMock: any;

    const mockRelatorio: Relatorio = {
        id: 1,
        id_paciente: 10,
        id_agente: 20,
        observacao: "Teste",
        completo: false,
        deletado: false,
        data_registro: new Date()
    };

    beforeEach(() => {
        tableMock = mockQuery();

        (connection as unknown as jest.Mock).mockImplementation(() => tableMock);

        nowMock = jest.fn().mockReturnValue("2025-01-01 00:00:00");
        (connection as any).fn = { now: nowMock };

        jest.clearAllMocks();
    });

    // CREATE
    describe("createRelatorio", () => {
        it("deve inserir e retornar o registro criado", async () => {
            tableMock.insert.mockResolvedValue([1]);
            tableMock.first.mockResolvedValue(mockRelatorio);

            const result = await createRelatorio(mockRelatorio);

            expect(result).toEqual(mockRelatorio);
            expect(tableMock.insert).toHaveBeenCalled();
            expect(tableMock.where).toHaveBeenCalledWith({ id: 1 });
            expect(tableMock.first).toHaveBeenCalled();
        });

        it("deve lançar erro quando não conseguir buscar o registro", async () => {
            tableMock.insert.mockResolvedValue([1]);
            tableMock.first.mockResolvedValue(undefined);

            await expect(createRelatorio(mockRelatorio))
                .rejects
                .toThrow("Erro ao criar o relatório — não foi possível recuperar o registro criado.");
        });
    });

    // GET by ID
    describe("getRelatorioById", () => {
        it("deve retornar um relatório existente", async () => {
            tableMock.first.mockResolvedValue(mockRelatorio);

            const result = await getRelatorioById(1);

            expect(result).toEqual(mockRelatorio);
            expect(tableMock.where).toHaveBeenCalledWith({ id: 1 });
            expect(tableMock.andWhere).toHaveBeenCalledWith({ deletado: false });
        });
    });

    // GET por paciente
    describe("getRelatoriosByPaciente", () => {
        it("deve retornar lista de relatórios", async () => {
            tableMock.orderBy.mockResolvedValue([mockRelatorio]);

            const result = await getRelatoriosByPaciente(10);

            expect(result).toEqual([mockRelatorio]);
            expect(tableMock.where).toHaveBeenCalledWith({ id_paciente: 10 });
        });
    });

    // UPDATE
    describe("updateRelatorio", () => {
        it("deve atualizar e retornar o registro atualizado", async () => {
            const atualizado: Relatorio = {
                ...mockRelatorio,
                observacao: "Mudado"
            };

            tableMock.first.mockResolvedValue(atualizado);

            const result = await updateRelatorio(1, { observacao: "Mudado" });

            expect(result).toEqual(atualizado);
            expect(tableMock.update).toHaveBeenCalled();
            expect(tableMock.where).toHaveBeenCalledWith({ id: 1 });
        });
    });

    // GET pendentes
    describe("getRelatoriosPendentes", () => {
        it("deve buscar relatórios pendentes", async () => {
            tableMock.orderBy.mockResolvedValue([mockRelatorio]);

            const result = await getRelatoriosPendentes();

            expect(result).toEqual([mockRelatorio]);
            expect(tableMock.where).toHaveBeenCalledWith({ completo: false });
            expect(tableMock.andWhere).toHaveBeenCalledWith({ deletado: false });
        });
    });

    // GET por data
    describe("getRelatoriosByData", () => {
        it("deve buscar por data e retornar lista", async () => {
            tableMock.orderBy.mockResolvedValue([mockRelatorio]);

            const result = await getRelatoriosByData("2025-01-01");

            expect(result).toEqual([mockRelatorio]);
            expect(tableMock.whereRaw).toHaveBeenCalled();
        });
    });

    // DELETE
    describe("deleteRelatorio", () => {
        it("deve marcar como deletado e retornar o registro atualizado", async () => {
            tableMock.first.mockResolvedValue({
                ...mockRelatorio,
                deletado: true
            });

            const result = await deleteRelatorio(1, 10, 20, "teste grande motivo válido");

            expect(result?.deletado).toBe(true);
            expect(tableMock.update).toHaveBeenCalled();
            expect(tableMock.where).toHaveBeenCalledWith({ id: 1 });
        });
    });
});