import express from "express";
import { getAgentesController } from "../controller/agenteController";
import { getAgenteByIdController } from "../controller/agenteController";
import { createAgenteController } from "../controller/agenteController";
import { updateAgenteController } from "../controller/agenteController";
import { deleteAgenteController } from "../controller/agenteController";
import { AutorizacaoMiddleware } from "../middlewares/AutorizacaoMiddleware";

export const agenteRouter = express.Router();

agenteRouter.get("/", AutorizacaoMiddleware.autorizacaoAgente, getAgentesController);
agenteRouter.get("/:id", AutorizacaoMiddleware.autorizacaoAgente, getAgenteByIdController);
agenteRouter.post("/", AutorizacaoMiddleware.autorizacaoAgente, createAgenteController);
agenteRouter.patch("/:id", AutorizacaoMiddleware.autorizacaoAgente, updateAgenteController);
agenteRouter.delete("/:id", AutorizacaoMiddleware.autorizacaoAgente, deleteAgenteController);