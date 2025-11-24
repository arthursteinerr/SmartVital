import express, { Request, Response } from "express";
import cors from "cors";

import { agenteRouter } from "./routes/agenteRoutes";
import { pacienteRouter } from "./routes/pacienteRoutes"; 
import { relatorioRouter } from "./routes/relatorioRoutes";
import { authRouter } from "./routes/authRoutes";

export const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());

//Rota de autenticação
app.use("/auth", authRouter);

// Rotas principais
app.use("/agentes", agenteRouter);
app.use("/pacientes", pacienteRouter);
app.use("/relatorios", relatorioRouter);

// Verificar se a API está funcionando
app.get("/", (req: Request, res: Response) => {
  res.status(200).send({
    message: "SmartVital API Funcionando!",
  });
});