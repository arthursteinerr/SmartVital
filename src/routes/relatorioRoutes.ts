import { Router } from "express";
import { RelatorioController } from "../controller/relatorioController";

export const relatorioRouter = Router();

const relatorioController = new RelatorioController();

// Metodos para busca
relatorioRouter.get("/buscar/pendentes", (req, res) => relatorioController.listarPendentes(req, res));
relatorioRouter.get("/buscar/:id", (req, res) => relatorioController.buscarPorId(req, res));
relatorioRouter.get("/buscar/paciente/:id", (req, res) => relatorioController.listarPorPaciente(req, res));

// Metodo para criar
relatorioRouter.post("/criar/relatorio", (req, res) => relatorioController.criar(req, res));

// Metodo para atualizar
relatorioRouter.patch("/:id", (req, res) => relatorioController.atualizar(req, res));
