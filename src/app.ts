import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { agenteRouter } from "./routes/agenteRoutes";
// import { pacienteRouter } from "./routes/pacienteRoutes";
import { relatorioRouter } from "./routes/relatorioRoutes";

dotenv.config();

export const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Rotas principais
app.use("/agentes", agenteRouter);
// app.use("/pacientes", pacienteRouter);
app.use("/relatorios", relatorioRouter);

// Verificar se a API esta em funcinamento
app.get("/", (req: Request, res: Response) => {
  res.status(200).send({
    message: "SmartVital API Funcionando!",
  });
});