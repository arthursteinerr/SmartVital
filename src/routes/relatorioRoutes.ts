import { Router } from "express";
import { RelatorioController } from "../controller/relatorioController";

const router = Router();
const relatorioController = new RelatorioController();

// Metodos para busca
router.get("/buscar/pendentes", (req, res) => relatorioController.listarPendentes(req, res));
router.get("/buscar/:id", (req, res) => relatorioController.buscarPorId(req, res));
router.get("/buscar/paciente/:id", (req, res) => relatorioController.listarPorPaciente(req, res));

// Metodo para criar
router.post("/criar/relatorio", (req, res) => relatorioController.criar(req, res));

// Metodo para atualizar
router.patch("/:id", (req, res) => relatorioController.atualizar(req, res));

export default router;