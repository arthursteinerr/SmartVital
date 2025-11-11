import express from "express";
import { getAgentesController } from "../controller/agenteController";
import { getAgenteByIdController } from "../controller/agenteController";
import { createAgenteController } from "../controller/agenteController";
import { updateAgenteController } from "../controller/agenteController";
import { deleteAgenteController } from "../controller/agenteController";
import { AutorizacaoMiddleware } from "../middlewares/AutorizacaoMiddleware";

export const agenteRouter = express.Router();

// Middleware temporário para simular autenticação
agenteRouter.use((req, res, next) => {
    req.user = {
        id: 1,
        nome: "Dra. Camila Nunes",
        cargo: "Tec. Enfermagem", // Esta com erro pois estou forçando um cargo diferente, para testa com sucesso é so trocar para Médico ou Enfermeiro
        registro_profissional: "CRM-SP-456789",
        data_admissao: "2022-10-05"
    };
    next();
});

agenteRouter.get("/", AutorizacaoMiddleware.autorizacaoAgente, getAgentesController);
agenteRouter.get("/:id", AutorizacaoMiddleware.autorizacaoAgente, getAgenteByIdController);
agenteRouter.post("/", AutorizacaoMiddleware.autorizacaoAgente, createAgenteController);
agenteRouter.patch("/:id", AutorizacaoMiddleware.autorizacaoAgente, updateAgenteController);
agenteRouter.delete("/:id", AutorizacaoMiddleware.autorizacaoAgente, deleteAgenteController);