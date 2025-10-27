import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { agenteRouter } from "./routes/agenteRoutes";
dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());

//ROTAS
app.use("/agentes", agenteRouter); 

app.get("/", (req, res) => {
  res.send("SmartVital API Funcionando!");
});
