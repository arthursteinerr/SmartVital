import { Request, Response } from "express";
import {
    criarRelatorioBusiness,
    buscarPorIdBusiness,
    listarPorPacienteBusiness,
    atualizarBusiness,
    listarPendentesBusiness,
    listarPorDataBusiness,
    excluirRelatorioBusiness
} from "../business/relatorioBusiness";
import { AutorizacaoMiddleware } from "../middlewares/AutorizacaoMiddleware";

// POST Relatorio
export const criarController = async (req: Request, res: Response) => {

    const resultado = await criarRelatorioBusiness(req.body);

    if (!resultado.success) {
        return res.status(400).json({ message: resultado.message });
    }

    return res.status(201).json(resultado.data);
};

// GET por ID
export const buscarPorIdController = async (req: Request, res: Response) => {

    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            message: "ID invalido."
        })
    }

    const resultado = await buscarPorIdBusiness(id);

    if (!resultado.success) {
        return res.status(404).json({ message: resultado.message })
    }

    return res.status(200).json(resultado.data);
};

// GET por Paciente
export const buscarPorPacienteController = async (req: Request, res: Response) => {

    const id_paciente = Number(req.params.id);

    if (isNaN(id_paciente)) {
        return res.status(400).json({
            message: "ID de paciente invalido."
        });
    }

    const resultado = await listarPorPacienteBusiness(id_paciente);

    if (!resultado.success) {
        return res.status(400).json({ message: resultado.message });
    }

    return res.status(200).json(resultado.data);
}

// PATCH Relatorio
export const atualizarController = async (req: Request, res: Response) => {

    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            message: "ID invalido."
        });
    }

    const result = await atualizarBusiness(id, req.body);

    if (!result.success) {
        return res.status(404).json({ message: result.message });
    }

    return res.status(200).json(result.data);
}

// GET por Pendentes
export const listarPendentesController = async (req: Request, res: Response) => {

    const resultado = await listarPendentesBusiness();

    if (!resultado.success) {
        return res.status(500).json({ message: resultado.message })
    }

    return res.status(200).json(resultado.data)
}

// GET por Data
export const listarPorDataController = async (req: Request, res: Response) => {

    const { data } = req.params;

    if (!data || typeof data !== "string") {
        return res.status(400).json({
            message: "Parametro 'data' é obrigatorio no formato DD-MM-YYYY."
        })
    }

    const resultado = await listarPorDataBusiness(data);

    if (!resultado.success) {
        return res.status(400).json({
            message: resultado.message
        });
    }

    return res.status(200).json(resultado.data);
};

// DELETE Relatorio
export const deletarController = async (req: Request, res: Response) => {

    const id = Number(req.params.id);
    const { solicitado_por, confirmado_por_medico, motivo_exclusao } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({
            message: "ID invalido."
        });
    }

    if (!solicitado_por || !confirmado_por_medico || !motivo_exclusao) {
        return res.status(400).json({
            message: "Campos obrigatorios: solicitado_por, confirmado_por_medico e motivo_exclusao."
        });
    }

    // Middleware de autorizacao
    if (confirmado_por_medico) {

        const fakeNext = () => { };
        const resultado = AutorizacaoMiddleware.autorizacaoMedico(req, res, fakeNext);

        if (resultado) {
            return resultado;
        }
    }

    const resultado = await excluirRelatorioBusiness(id, solicitado_por, confirmado_por_medico, motivo_exclusao);

    if (!resultado.success) {
        return res.status(400).json({
            message: resultado.message
        });
    }

    return res.status(200).json({
        message: "Soft delete registrado com sucesso."
    });
};