import express from "express";
import { getAllPacientesController } from "../controller/pacienteController";
import { getPacienteByIdController } from "../controller/pacienteController";
import { createPacienteController } from "../controller/pacienteController";
import { updatePacienteController } from "../controller/pacienteController";
import { patchPacienteController } from "../controller/pacienteController";
import { deletePacienteController } from "../controller/pacienteController";
import { AutorizacaoMiddleware } from "../middlewares/AutorizacaoMiddleware";

export const pacienteRouter = express.Router();

pacienteRouter.get("/", AutorizacaoMiddleware.autorizacaoAgente, getAllPacientesController);
pacienteRouter.get("/:id", AutorizacaoMiddleware.autorizacaoAgente, getPacienteByIdController);
pacienteRouter.post("/", AutorizacaoMiddleware.autorizacaoAgente, createPacienteController);
pacienteRouter.put("/:id", AutorizacaoMiddleware.autorizacaoAgente, updatePacienteController);
pacienteRouter.patch("/:id", AutorizacaoMiddleware.autorizacaoAgente, patchPacienteController);
pacienteRouter.delete("/:id", AutorizacaoMiddleware.autorizacaoAgente, deletePacienteController);