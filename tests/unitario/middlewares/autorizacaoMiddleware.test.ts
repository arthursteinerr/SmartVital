// Comando para rodar teste desse arquivo: npm test -- tests/unitario/middlewares/autorizacaoMiddleware.test.ts

import { AutorizacaoMiddleware } from "../../../src/middlewares/AutorizacaoMiddleware";

describe("AutorizacaoMiddleware", () => {

    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
        req = { user: null };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        };
        next = jest.fn();

        jest.clearAllMocks();
    });

    // TESTES DO autorizacaoAgente
    describe("autorizacaoAgente", () => {

        it("deve retornar 401 se não houver usuário", () => {
            req.user = null;

            AutorizacaoMiddleware.autorizacaoAgente(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith({
                error: "Usuário não autenticado."
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("deve retornar 403 se o cargo não for Médico ou Enfermeiro", () => {
            req.user = { cargo: "Recepcionista" };

            AutorizacaoMiddleware.autorizacaoAgente(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith({
                error: "Acesso restrito a médicos e enfermeiros."
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("deve permitir acesso para Médico", () => {
            req.user = { cargo: "Médico" };

            AutorizacaoMiddleware.autorizacaoAgente(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it("deve permitir acesso para Enfermeiro", () => {
            req.user = { cargo: "Enfermeiro" };

            AutorizacaoMiddleware.autorizacaoAgente(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it("deve retornar 500 se ocorrer exceção", () => {
            req.user = {};
            Object.defineProperty(req.user, "cargo", {
                get() {
                    throw new Error("Falhou");
                }
            });

            AutorizacaoMiddleware.autorizacaoAgente(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({ error: "Falhou" });
            expect(next).not.toHaveBeenCalled();
        });
    });

    // TESTES DO autorizacaoMedico
    describe("autorizacaoMedico", () => {

        it("deve retornar 401 se não houver usuário", () => {
            req.user = null;

            AutorizacaoMiddleware.autorizacaoMedico(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith({
                error: "Usuário não autenticado."
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("deve retornar 403 se usuário não for Médico", () => {
            req.user = { cargo: "Enfermeiro" };

            AutorizacaoMiddleware.autorizacaoMedico(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith({
                error: "Apenas medicos podem confirmar a exclusao de um relatorio."
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("deve permitir acesso se usuário for Médico", () => {
            req.user = { cargo: "Médico" };

            AutorizacaoMiddleware.autorizacaoMedico(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it("deve retornar 500 se houver erro inesperado", () => {
            req.user = {};
            Object.defineProperty(req.user, "cargo", {
                get() {
                    throw new Error("Erro inesperado");
                }
            });

            AutorizacaoMiddleware.autorizacaoMedico(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({ error: "Erro inesperado" });
            expect(next).not.toHaveBeenCalled();
        });
    });
});