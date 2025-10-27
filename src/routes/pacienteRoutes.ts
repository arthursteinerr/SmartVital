import express from "express";
import { getAllPacientesController } from "../controller/pacienteController";
import { getPacienteByIdController } from "../controller/pacienteController";
import { createPacienteController } from "../controller/pacienteController";
import { updatePacienteController } from "../controller/pacienteController";
import { patchPacienteController } from "../controller/pacienteController";
import { deletePacienteController } from "../controller/pacienteController";

const router = express.Router();

router.get("/", getAllPacientesController);
router.get("/:id", getPacienteByIdController);
router.post("/", createPacienteController);
router.put("/:id", updatePacienteController);
router.patch("/:id", patchPacienteController);
router.delete("/:id", deletePacienteController);

export default router;
