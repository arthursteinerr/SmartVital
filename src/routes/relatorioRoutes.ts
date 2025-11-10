import { Router } from "express";
import { RelatorioController } from "../controller/relatorioController";
import { AutorizacaoMiddleware } from "../middlewares/AutorizacaoMiddleware";

export const relatorioRouter = Router();

const relatorioController = new RelatorioController();

// Metodos para busca
relatorioRouter.get("/pendentes", AutorizacaoMiddleware.autorizacaoAgente, (req, res) => relatorioController.listarPendentes(req, res));
relatorioRouter.get("/:id", AutorizacaoMiddleware.autorizacaoAgente, (req, res) => relatorioController.buscarPorId(req, res));
relatorioRouter.get("/paciente/:id", AutorizacaoMiddleware.autorizacaoAgente, (req, res) => relatorioController.listarPorPaciente(req, res));
relatorioRouter.get("/por-data/:data", AutorizacaoMiddleware.autorizacaoAgente, (req, res) => relatorioController.listarPorData(req, res));

// Metodo para criar
relatorioRouter.post("/", AutorizacaoMiddleware.autorizacaoAgente, (req, res) => relatorioController.criar(req, res));

// Metodo para atualizar
relatorioRouter.patch("/:id", AutorizacaoMiddleware.autorizacaoAgente, (req, res) => relatorioController.atualizar(req, res));

// Metodo para deletar
relatorioRouter.delete("/deletar/:id", AutorizacaoMiddleware.autorizacaoAgente, (req, res) => relatorioController.deletar(req, res));