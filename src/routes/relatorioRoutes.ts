import express from "express";
import {
  criarController,
  buscarPorIdController,
  buscarPorPacienteController,
  atualizarController,
  listarPendentesController,
  listarPorDataController,
  deletarController
} from "../controller/relatorioController";
import { AutorizacaoMiddleware } from "../middlewares/AutorizacaoMiddleware";

export const relatorioRouter = express.Router();

// Metodos para busca
relatorioRouter.get("/pendentes", AutorizacaoMiddleware.autorizacaoAgente, listarPendentesController);
relatorioRouter.get("/:id", AutorizacaoMiddleware.autorizacaoAgente, buscarPorIdController);
relatorioRouter.get("/paciente/:id", AutorizacaoMiddleware.autorizacaoAgente, buscarPorPacienteController);
relatorioRouter.get("/por-data/:data", AutorizacaoMiddleware.autorizacaoAgente, listarPorDataController);

// Metodo para criar
relatorioRouter.post("/", AutorizacaoMiddleware.autorizacaoAgente, criarController);

// Metodo para atualizar
relatorioRouter.patch("/:id", AutorizacaoMiddleware.autorizacaoAgente, atualizarController);

// Metodo para deletar
relatorioRouter.delete("/deletar/:id", AutorizacaoMiddleware.autorizacaoAgente, deletarController);