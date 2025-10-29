// src/app.ts
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { agenteRouter } from "./routes/agenteRoutes";
<<<<<<< HEAD
=======
import { pacienteRouter } from "./routes/pacienteRoutes";
>>>>>>> 5228bbecae86713110b81cc5dce2db9ce23b7716
import { relatorioRouter } from "./routes/relatorioRoutes";
import pacienteRouter from "./routes/pacienteRoutes";

dotenv.config();

export const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Rotas principais
app.use("/agentes", agenteRouter);
<<<<<<< HEAD
=======
app.use("/pacientes", pacienteRouter);
>>>>>>> 5228bbecae86713110b81cc5dce2db9ce23b7716
app.use("/relatorios", relatorioRouter);
app.use("/pacientes", pacienteRouter); 

// Verificar se a API está funcionando
app.get("/", (req: Request, res: Response) => {
  res.status(200).send({
    message: "SmartVital API Funcionando!",
  });
});
<<<<<<< HEAD

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor rodando na porta", process.env.PORT || 3000);
});
=======
>>>>>>> 5228bbecae86713110b81cc5dce2db9ce23b7716
