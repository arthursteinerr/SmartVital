import express from "express";
import { getAllAgentesController } from "../controller/agenteController";
import { getAgenteByIdController } from "../controller/agenteController";
import { createAgenteController } from "../controller/agenteController";
import { updateAgenteController } from "../controller/agenteController";
import { deleteAgenteController } from "../controller/agenteController";

export const agenteRouter = express.Router();

agenteRouter.get("/", getAllAgentesController);
agenteRouter.get("/:id", getAgenteByIdController);
agenteRouter.post("/", createAgenteController);
agenteRouter.patch("/:id", updateAgenteController);
agenteRouter.delete("/:id", deleteAgenteController);