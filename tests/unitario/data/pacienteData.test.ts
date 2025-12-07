// Comando para rodar: npm test -- tests/unitario/data/pacienteData.test.ts
import {
    getAllPacientes,
    getPacienteById,
    createPaciente,
    updatePaciente,
    patchPaciente,
    deletePaciente
} from "../../../src/data/pacienteData";

import { connection } from "../../../src/dbConnection";
import { Paciente } from "../../../src/types/pacienteTypes";

jest.mock("../../../src/dbConnection", () => ({
    connection: jest.fn()
}));

const mockQuery = () => {
    const query: any = {
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        first: jest.fn(),
        insert: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        del: jest.fn()
    };
    return query;
};

describe("pacienteData", () => {

    let tableMock: any;

    const mockPaciente: Paciente = {
        id: 1,
        nome: "João Silva",
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
        tableMock = mockQuery();
        (connection as unknown as jest.Mock).mockImplementation(() => tableMock);
        jest.clearAllMocks();
    });

    // get all
    describe("getAllPacientes", () => {
        it("deve retornar lista de pacientes ordenada por id", async () => {
            tableMock.orderBy.mockResolvedValue([mockPaciente]);

            const result = await getAllPacientes();

            expect(result).toEqual([mockPaciente]);
            expect(tableMock.select).toHaveBeenCalledWith(
                "id", "nome", "idade", "peso", "altura", "temperatura", 
                "indice_glicemico", "pressao_arterial", "saturacao", 
                "pulso", "respiracao"
            );
            expect(tableMock.orderBy).toHaveBeenCalledWith("id", "asc");
        });

        it("deve lançar erro em caso de falha", async () => {
            tableMock.orderBy.mockRejectedValue(new Error("DB Error"));

            await expect(getAllPacientes()).rejects.toThrow("Erro ao buscar pacientes.");
        });
    });

    // get by id
    describe("getPacienteById", () => {
        it("deve retornar paciente por ID", async () => {
            tableMock.first.mockResolvedValue(mockPaciente);

            const result = await getPacienteById(1);

            expect(result).toEqual(mockPaciente);
            expect(tableMock.where).toHaveBeenCalledWith({ id: 1 });
            expect(tableMock.first).toHaveBeenCalled();
        });

        it("deve retornar null se paciente não existir", async () => {
            tableMock.first.mockResolvedValue(undefined);

            const result = await getPacienteById(999);

            expect(result).toBeNull();
        });

        it("deve lançar erro em caso de falha no banco", async () => {
            tableMock.first.mockRejectedValue(new Error("DB Error"));

            await expect(getPacienteById(1)).rejects.toThrow("Erro ao buscar paciente pelo ID.");
        });
    });

    //create
    describe("createPaciente", () => {
        it("deve criar paciente com todos os dados", async () => {
            tableMock.returning.mockResolvedValue([mockPaciente]);

            const result = await createPaciente("João Silva", 45, 80.5, 1.75);

            expect(result).toEqual(mockPaciente);
            expect(tableMock.insert).toHaveBeenCalled();
            expect(tableMock.returning).toHaveBeenCalled();
        });

        it("deve criar paciente apenas com nome", async () => {
            const pacienteMinimo = { id: 2, nome: "Maria Santos" };
            tableMock.returning.mockResolvedValue([pacienteMinimo]);

            const result = await createPaciente("Maria Santos");

            expect(result).toEqual(pacienteMinimo);
        });

        it("deve lançar erro em caso de falha", async () => {
            tableMock.returning.mockRejectedValue(new Error("DB Error"));

            await expect(createPaciente("Teste")).rejects.toThrow("Erro ao criar paciente.");
        });
    });

    // put
    describe("updatePaciente", () => {
        it("deve atualizar paciente completamente", async () => {
            const atualizado = { ...mockPaciente, nome: "João Atualizado" };
            tableMock.returning.mockResolvedValue([atualizado]);

            const result = await updatePaciente(1, atualizado);

            expect(result).toEqual(atualizado);
            expect(tableMock.where).toHaveBeenCalledWith({ id: 1 });
            expect(tableMock.update).toHaveBeenCalledWith(atualizado);
        });

        it("deve retornar null se paciente não existir", async () => {
            tableMock.returning.mockResolvedValue([]);

            const result = await updatePaciente(999, mockPaciente);

            expect(result).toBeNull();
        });

        it("deve lançar erro em caso de falha", async () => {
            tableMock.returning.mockRejectedValue(new Error("DB Error"));

            await expect(updatePaciente(1, mockPaciente))
                .rejects.toThrow("Erro ao atualizar paciente.");
        });
    });

    // patch
    describe("patchPaciente", () => {
        it("deve atualizar parcialmente o paciente", async () => {
            const parcial = { temperatura: 37.0, pulso: 80 };
            const resultado = { ...mockPaciente, ...parcial };
            
            tableMock.returning.mockResolvedValue([resultado]);

            const result = await patchPaciente(1, parcial);

            expect(result).toEqual(resultado);
            expect(tableMock.where).toHaveBeenCalledWith({ id: 1 });
            expect(tableMock.update).toHaveBeenCalledWith(parcial);
        });

        it("deve retornar null se paciente não existir", async () => {
            tableMock.returning.mockResolvedValue([]);

            const result = await patchPaciente(999, { temperatura: 37.0 });

            expect(result).toBeNull();
        });

        it("deve lançar erro em caso de falha", async () => {
            tableMock.returning.mockRejectedValue(new Error("DB Error"));

            await expect(patchPaciente(1, { temperatura: 37.0 }))
                .rejects.toThrow("Erro ao atualizar parcialmente paciente.");
        });
    });

    // delete
    describe("deletePaciente", () => {
        it("deve deletar paciente com sucesso", async () => {
            tableMock.del.mockResolvedValue(1);

            const result = await deletePaciente(1);

            expect(result).toBe(true);
            expect(tableMock.where).toHaveBeenCalledWith({ id: 1 });
            expect(tableMock.del).toHaveBeenCalled();
        });

        it("deve retornar false se paciente não existir", async () => {
            tableMock.del.mockResolvedValue(0);

            const result = await deletePaciente(999);

            expect(result).toBe(false);
        });

        it("deve lançar erro em caso de falha", async () => {
            tableMock.del.mockRejectedValue(new Error("DB Error"));

            await expect(deletePaciente(1)).rejects.toThrow("Erro ao deletar paciente.");
        });
    });
});
