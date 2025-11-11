import express from "express";
import { getAllPacientesController } from "../controller/pacienteController";
import { getPacienteByIdController } from "../controller/pacienteController";
import { createPacienteController } from "../controller/pacienteController";
import { updatePacienteController } from "../controller/pacienteController";
import { patchPacienteController } from "../controller/pacienteController";
import { deletePacienteController } from "../controller/pacienteController";
import { AutorizacaoMiddleware } from "../middlewares/AutorizacaoMiddleware";

export const pacienteRouter = express.Router();

// Middleware temporário para simular autenticação
pacienteRouter.use((req, res, next) => {
    req.user = {
        id: 1,
        nome: "Dra. Camila Nunes",
        cargo: "Tec. Enfermagem", // Esta com erro pois estou forçando um cargo diferente, para testa com sucesso é so trocar para Médico ou Enfermeiro
        registro_profissional: "CRM-SP-456789",
        data_admissao: "2022-10-05"
    };
    next();
});

pacienteRouter.get("/", AutorizacaoMiddleware.autorizacaoAgente, getAllPacientesController);
pacienteRouter.get("/:id", AutorizacaoMiddleware.autorizacaoAgente, getPacienteByIdController);
pacienteRouter.post("/", AutorizacaoMiddleware.autorizacaoAgente, createPacienteController);
pacienteRouter.put("/:id", AutorizacaoMiddleware.autorizacaoAgente, updatePacienteController);
pacienteRouter.patch("/:id", AutorizacaoMiddleware.autorizacaoAgente, patchPacienteController);
pacienteRouter.delete("/:id", AutorizacaoMiddleware.autorizacaoAgente, deletePacienteController);