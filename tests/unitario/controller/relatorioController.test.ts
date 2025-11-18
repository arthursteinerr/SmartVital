// Comando para rodar teste desse arquivo: npm test -- tests/unitario/controller/relatorioController.test.ts

import {
    criarController,
    buscarPorIdController,
    buscarPorPacienteController,
    atualizarController,
    listarPendentesController,
    listarPorDataController,
    deletarController
} from "../../../src/controller/relatorioController";

import * as business from "../../../src/business/relatorioBusiness";
import { AutorizacaoMiddleware } from "../../../src/middlewares/AutorizacaoMiddleware";

describe("RelatorioController", () => {

    let req: any;
    let res: any;

    const mockRelatorio = {
        id: 1,
        id_paciente: 10,
        id_agente: 5,
        observacao: "Teste",
        completo: false,
        deletado: false,
        data_registro: new Date()
    };

    beforeEach(() => {
        req = { params: {}, body: {} };

        res = {
            status: jest.fn(function (code: number) {
                this.statusCode = code;
                return this;
            }),
            json: jest.fn(function (data: any) {
                this.body = data;
                return this;
            })
        };

        jest.clearAllMocks();
    });

    // POST criar_controller
    describe("criarController", () => {
        it("deve criar relatório com sucesso", async () => {
            jest.spyOn(business, "criarRelatorioBusiness").mockResolvedValue({
                success: true,
                data: mockRelatorio
            });

            req.body = { id_paciente: 10, id_agente: 20 };

            await criarController(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockRelatorio);
        });

        it("deve retornar erro de validação", async () => {
            jest.spyOn(business, "criarRelatorioBusiness").mockResolvedValue({
                success: false,
                message: "Erro qualquer"
            });

            await criarController(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Erro qualquer" });
        });
    });

    // GET buscarPorId
    describe("buscarPorIdController", () => {

        it("deve retornar erro se o ID for inválido", async () => {
            req.params.id = "abc";

            await buscarPorIdController(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it("deve retornar relatório se existir", async () => {
            req.params.id = "1";

            jest.spyOn(business, "buscarPorIdBusiness").mockResolvedValue({
                success: true,
                data: mockRelatorio
            });

            await buscarPorIdController(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockRelatorio);
        });

        it("deve retornar 404 se relatório não existir", async () => {
            req.params.id = "1";

            jest.spyOn(business, "buscarPorIdBusiness").mockResolvedValue({
                success: false,
                message: "Relatorio não encontrado!"
            });

            await buscarPorIdController(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Relatorio não encontrado!" });
        });
    });

    // GET por Paciente
    describe("buscarPorPacienteController", () => {

        it("deve rejeitar ID inválido", async () => {
            req.params.id = "abc";

            await buscarPorPacienteController(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it("deve retornar lista de relatórios", async () => {
            req.params.id = "10";

            jest.spyOn(business, "listarPorPacienteBusiness").mockResolvedValue({
                success: true,
                data: [mockRelatorio]
            });

            await buscarPorPacienteController(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([mockRelatorio]);
        });
    });

    // PATCH atualizar
    describe("atualizarController", () => {

        it("deve recusar ID inválido", async () => {
            req.params.id = "abc";

            await atualizarController(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it("deve atualizar relatório", async () => {
            req.params.id = "1";

            const atualizado = { ...mockRelatorio, observacao: "OK" };

            jest.spyOn(business, "atualizarBusiness").mockResolvedValue({
                success: true,
                data: atualizado
            });

            await atualizarController(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(atualizado);
        });

        it("deve retornar 404 se não existir", async () => {
            req.params.id = "1";

            jest.spyOn(business, "atualizarBusiness").mockResolvedValue({
                success: false,
                message: "Relatorio não encontrado."
            });

            await atualizarController(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Relatorio não encontrado." });
        });
    });

    // GET pendentes
    describe("listarPendentesController", () => {

        it("deve retornar pendentes", async () => {
            jest.spyOn(business, "listarPendentesBusiness").mockResolvedValue({
                success: true,
                data: [mockRelatorio]
            });

            await listarPendentesController(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([mockRelatorio]);
        });

        it("deve retornar 500 em erro", async () => {
            jest.spyOn(business, "listarPendentesBusiness").mockResolvedValue({
                success: false,
                message: "Erro"
            });

            await listarPendentesController(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Erro" });
        });
    });

    // GET por data
    describe("listarPorDataController", () => {

        it("deve validar formato ausente", async () => {
            req.params.data = undefined;

            await listarPorDataController(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it("deve retornar relatórios", async () => {
            req.params.data = "10-02-2025";

            jest.spyOn(business, "listarPorDataBusiness").mockResolvedValue({
                success: true,
                data: [mockRelatorio]
            });

            await listarPorDataController(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([mockRelatorio]);
        });

        it("deve retornar 400 em caso de formato inválido (business retorna false)", async () => {
            req.params.data = "inválido";

            jest.spyOn(business, "listarPorDataBusiness").mockResolvedValue({
                success: false,
                message: "Formato de data inválido."
            });

            await listarPorDataController(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Formato de data inválido." });
        });
    });

    // DELETE
    describe("deletarController", () => {

        it("deve recusar ID inválido", async () => {
            req.params.id = "abc";

            await deletarController(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it("deve validar campos obrigatórios", async () => {
            req.params.id = "1";
            req.body = {};

            await deletarController(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Campos obrigatorios: solicitado_por, confirmado_por_medico e motivo_exclusao."
            });
        });

        it("deve excluir relatório", async () => {
            req.params.id = "1";
            req.body = {
                solicitado_por: 1,
                confirmado_por_medico: 2,
                motivo_exclusao: "motivo válido e grande com mais de 30 caracteres!!!!!"
            };

            jest.spyOn(AutorizacaoMiddleware, "autorizacaoMedico")
                .mockReturnValue(undefined as any);

            jest.spyOn(business, "excluirRelatorioBusiness").mockResolvedValue({
                success: true,
                data: mockRelatorio
            });

            await deletarController(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Soft delete registrado com sucesso."
            });
        });

        it("deve retornar 400 se business falhar na exclusão", async () => {
            req.params.id = "1";
            req.body = {
                solicitado_por: 1,
                confirmado_por_medico: 2,
                motivo_exclusao: "motivo válido e grande com mais de 30 caracteres!!!!!"
            };

            jest.spyOn(AutorizacaoMiddleware, "autorizacaoMedico")
                .mockReturnValue(undefined as any);

            jest.spyOn(business, "excluirRelatorioBusiness").mockResolvedValue({
                success: false,
                message: "Erro ao excluir"
            });

            await deletarController(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Erro ao excluir" });
        });
    });
});