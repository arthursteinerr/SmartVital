// Comando para rodar: npm test -- tests/unitario/controller/pacienteController.test.ts

import {
    getAllPacientesController,
    getPacienteByIdController,
    createPacienteController,
    updatePacienteController,
    patchPacienteController,
    deletePacienteController
} from "../../../src/controller/pacienteController";

import * as business from "../../../src/business/pacienteBusiness";

describe("PacienteController", () => {

    let req: any;
    let res: any;

    const mockPaciente = {
        id: 1,
        nome: "Jorge Silva",
        idade: 45,
        peso: 80.5,
        altura: 1.75,
        temperatura: 36.5,
        indice_glicemico: 95,
        pressao_arterial: "120/80",
        saturacao: 98,
        pulso: 72,
        respiracao: 16
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
            }),
            send: jest.fn(function () {
                return this;
            })
        };

        jest.clearAllMocks();
    });

    // get all
    describe("getAllPacientesController", () => {
        it("deve retornar lista de pacientes", async () => {
            jest.spyOn(business, "getAllPacientesBusiness").mockResolvedValue({
                success: true,
                data: [mockPaciente]
            });

            await getAllPacientesController(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([mockPaciente]);
        });

        it("deve retornar 404 quando não houver pacientes", async () => {
            jest.spyOn(business, "getAllPacientesBusiness").mockResolvedValue({
                success: false,
                message: "Nenhum paciente encontrado."
            });

            await getAllPacientesController(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Nenhum paciente encontrado." });
        });
    });

    // get by id
    describe("getPacienteByIdController", () => {
        it("deve retornar erro se ID for inválido", async () => {
            req.params.id = "abc";

            await getPacienteByIdController(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "ID Inválido." });
        });

        it("deve retornar paciente por ID", async () => {
            req.params.id = "1";

            jest.spyOn(business, "getPacienteByIdBusiness").mockResolvedValue({
                success: true,
                data: mockPaciente
            });

            await getPacienteByIdController(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockPaciente);
        });

        it("deve retornar 404 se paciente não existir", async () => {
            req.params.id = "999";

            jest.spyOn(business, "getPacienteByIdBusiness").mockResolvedValue({
                success: false,
                message: "Paciente não encontrado."
            });

            await getPacienteByIdController(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    // post
    describe("createPacienteController", () => {
        it("deve criar paciente com sucesso", async () => {
            req.body = {
                nome: "Maria Silva",
                idade: 30,
                peso: 65.0,
                altura: 1.68
            };

            jest.spyOn(business, "createPacienteBusiness").mockResolvedValue({
                success: true,
                data: { ...mockPaciente, ...req.body }
            });

            await createPacienteController(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalled();
        });

        it("deve retornar erro se nome não for fornecido", async () => {
            req.body = { idade: 25 };

            jest.spyOn(business, "createPacienteBusiness").mockResolvedValue({
                success: false,
                message: "O campo 'nome' é obrigatório."
            });

            await createPacienteController(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    // put
    describe("updatePacienteController", () => {
        it("deve retornar erro se ID for inválido", async () => {
            req.params.id = "abc";

            await updatePacienteController(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "ID inválido." });
        });

        it("deve atualizar paciente completamente", async () => {
            req.params.id = "1";
            req.body = mockPaciente;

            jest.spyOn(business, "updatePacienteBusiness").mockResolvedValue({
                success: true,
                data: mockPaciente
            });

            await updatePacienteController(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockPaciente);
        });

        it("deve retornar 404 se paciente não existir", async () => {
            req.params.id = "999";
            req.body = mockPaciente;

            jest.spyOn(business, "updatePacienteBusiness").mockResolvedValue({
                success: false,
                message: "Paciente não encontrado."
            });

            await updatePacienteController(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    // patch
    describe("patchPacienteController", () => {
        it("deve retornar erro se ID for inválido", async () => {
            req.params.id = "xyz";

            await patchPacienteController(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it("deve atualizar parcialmente o paciente", async () => {
            req.params.id = "1";
            req.body = { temperatura: 37.0 };

            const atualizado = { ...mockPaciente, temperatura: 37.0 };

            jest.spyOn(business, "patchPacienteBusiness").mockResolvedValue({
                success: true,
                data: atualizado
            });

            await patchPacienteController(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(atualizado);
        });

        it("deve retornar 404 se paciente não existir", async () => {
            req.params.id = "999";
            req.body = { temperatura: 37.0 };

            jest.spyOn(business, "patchPacienteBusiness").mockResolvedValue({
                success: false,
                message: "Paciente não encontrado."
            });

            await patchPacienteController(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    // delete
    describe("deletePacienteController", () => {
        it("deve retornar erro se ID for inválido", async () => {
            req.params.id = "abc";

            await deletePacienteController(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it("deve deletar paciente com sucesso", async () => {
            req.params.id = "1";

            jest.spyOn(business, "deletePacienteBusiness").mockResolvedValue({
                success: true,
                data: mockPaciente
            });

            await deletePacienteController(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it("deve retornar 404 se paciente não existir", async () => {
            req.params.id = "999";

            jest.spyOn(business, "deletePacienteBusiness").mockResolvedValue({
                success: false,
                message: "Paciente não encontrado."
            });

            await deletePacienteController(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});
