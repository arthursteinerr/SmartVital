import express from "express";
import { getAllPacientesController } from "../controller/pacienteController";
import { getPacienteByIdController } from "../controller/pacienteController";
import { createPacienteController } from "../controller/pacienteController";
import { updatePacienteController } from "../controller/pacienteController";
import { patchPacienteController } from "../controller/pacienteController";
import { deletePacienteController } from "../controller/pacienteController";

export const pacienteRouter = express.Router();

pacienteRouter.get("/", getAllPacientesController);
pacienteRouter.get("/:id", getPacienteByIdController);
pacienteRouter.post("/", createPacienteController);
pacienteRouter.put("/:id", updatePacienteController);
pacienteRouter.patch("/:id", patchPacienteController);
pacienteRouter.delete("/:id", deletePacienteController);
