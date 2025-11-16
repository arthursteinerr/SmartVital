import {
    criarRelatorioBusiness,
    buscarPorIdBusiness,
    listarPorPacienteBusiness,
    atualizarBusiness,
    listarPendentesBusiness,
    listarPorDataBusiness,
    excluirRelatorioBusiness,
} from "../../../src/business/relatorioBusiness";

import * as relatorioData from "../../../src/data/relatorioData";
import { Relatorio } from "../../../src/types/relatorioTypes";

jest.mock("../../../src/data/relatorioData");

const mockRelatorio: Relatorio = {
    id: 1,
    id_paciente: 10,
    id_agente: 5,
    observacao: "Teste",
    completo: false,
    deletado: false,
    data_registro: new Date(),
};

// Resetar mocks antes de cada teste
beforeEach(() => {
    jest.clearAllMocks();
});

// TESTES do criarRelatorioBusiness
describe("criarRelatorioBusiness", () => {
    it("deve criar um relatório com sucesso", async () => {
        (relatorioData.createRelatorio as jest.Mock).mockResolvedValue(mockRelatorio);

        const result = await criarRelatorioBusiness(mockRelatorio);

        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockRelatorio);
        expect(relatorioData.createRelatorio).toHaveBeenCalledWith(mockRelatorio);
    });

    it("deve falhar caso faltem campos obrigatórios", async () => {
        const result = await criarRelatorioBusiness({
            ...mockRelatorio,
            id_paciente: undefined as any,
        });

        expect(result.success).toBe(false);
        expect(result.message).toBe("Campos obrigatórios: id_paciente e id_agente.");
    });

    it("deve tratar erros inesperados do Data Layer", async () => {
        (relatorioData.createRelatorio as jest.Mock).mockRejectedValue(new Error("Erro interno"));

        const result = await criarRelatorioBusiness(mockRelatorio);

        expect(result.success).toBe(false);
        expect(result.message).toBe("Erro interno");
    });
});

// TESTES do buscarPorIdBusiness
describe("buscarPorIdBusiness", () => {
    it("deve retornar relatório existente", async () => {
        (relatorioData.getRelatorioById as jest.Mock).mockResolvedValue(mockRelatorio);

        const result = await buscarPorIdBusiness(1);

        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockRelatorio);
    });

    it("deve retornar erro se relatório não existir", async () => {
        (relatorioData.getRelatorioById as jest.Mock).mockResolvedValue(undefined);

        const result = await buscarPorIdBusiness(1);

        expect(result.success).toBe(false);
        expect(result.message).toBe("Relatorio não encontrado!");
    });
});

// TESTES do listarPorPacienteBusiness
describe("listarPorPacienteBusiness", () => {
    it("deve listar relatórios por paciente", async () => {
        (relatorioData.getRelatoriosByPaciente as jest.Mock).mockResolvedValue([mockRelatorio]);

        const result = await listarPorPacienteBusiness(10);

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(1);
    });
});

// TESTES do atualizarBusiness
describe("atualizarBusiness", () => {
    it("deve atualizar um relatório existente", async () => {
        (relatorioData.getRelatorioById as jest.Mock).mockResolvedValue(mockRelatorio);
        (relatorioData.updateRelatorio as jest.Mock).mockResolvedValue({
            ...mockRelatorio,
            observacao: "Atualizado",
        });

        const result = await atualizarBusiness(1, { observacao: "Atualizado" });

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data!.observacao).toBe("Atualizado");
    });

    it("deve retornar erro se relatório não existir", async () => {
        (relatorioData.getRelatorioById as jest.Mock).mockResolvedValue(undefined);

        const result = await atualizarBusiness(1, { observacao: "Teste" });

        expect(result.success).toBe(false);
        expect(result.message).toBe("Relatorio não encontrado.");
    });
});

// TESTES do listarPendentesBusiness
describe("listarPendentesBusiness", () => {
    it("deve retornar relatórios pendentes", async () => {
        (relatorioData.getRelatoriosPendentes as jest.Mock).mockResolvedValue([mockRelatorio]);

        const result = await listarPendentesBusiness();

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(1);
    });
});

// TESTES do listarPorDataBusiness
describe("listarPorDataBusiness", () => {
    it("deve validar falta do parâmetro", async () => {
        const result = await listarPorDataBusiness("");

        expect(result.success).toBe(false);
        expect(result.message).toBe("Parâmetro 'data' é obrigatório no formato DD-MM-YYYY.");
    });

    it("deve validar formato incorreto", async () => {
        const result = await listarPorDataBusiness("2020/01/10");

        expect(result.success).toBe(false);
        expect(result.message).toBe("Formato de data inválido. Use DD-MM-YYYY.");
    });

    it("deve retornar relatórios por data", async () => {
        (relatorioData.getRelatoriosByData as jest.Mock).mockResolvedValue([mockRelatorio]);

        const result = await listarPorDataBusiness("10-01-2024");

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(1);

        // garante que converteu DD-MM-YYYY -> YYYY-MM-DD
        expect(relatorioData.getRelatoriosByData).toHaveBeenCalledWith("2024-01-10");
    });
});

// TESTES do excluirRelatorioBusiness
describe("excluirRelatorioBusiness", () => {
    it("deve excluir relatório com sucesso", async () => {
        (relatorioData.getRelatorioById as jest.Mock).mockResolvedValue(mockRelatorio);
        (relatorioData.deleteRelatorio as jest.Mock).mockResolvedValue(mockRelatorio);

        const result = await excluirRelatorioBusiness(1, 10, 20, "Motivo válido com mais de 30 caracteres");

        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockRelatorio);
    });

    it("deve validar campos obrigatórios", async () => {
        const result = await excluirRelatorioBusiness(1, undefined as any, 20, "motivo válido longo");

        expect(result.success).toBe(false);
        expect(result.message).toBe("Campos 'solicitado_por' e 'confirmado_por_medico' são obrigatorios.");
    });

    it("deve validar motivo_exclusao curto", async () => {
        const result = await excluirRelatorioBusiness(1, 10, 20, "curto");

        expect(result.success).toBe(false);
        expect(result.message).toBe("O campo motivo_exclusao é obrigatorio e deve conter no minimo 30 caracteres.");
    });

    it("deve retornar erro se relatório não existir", async () => {
        (relatorioData.getRelatorioById as jest.Mock).mockResolvedValue(undefined);

        const result = await excluirRelatorioBusiness(1, 10, 20, "Motivo válido com mais de 30 caracteres");

        expect(result.success).toBe(false);
        expect(result.message).toBe("Relatorio não encontrado.");
    });
});