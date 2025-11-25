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
        return res.status(404).json({ message: resultado.message });
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

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            message: "Nenhum dado enviado para atualizar."
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

    if (typeof solicitado_por !== "number" || typeof confirmado_por_medico !== "number" || !motivo_exclusao) {
        return res.status(400).json({
            message: "Campos solicitado_por, confirmado_por_medico e motivo_exclusao invalidos ou ausentes."
        });
    }

    // Verificando cargo sem utilizar o middleware de autorizacao dentro do controller 
    // O Jest estava com problemas com o const fakeNext = () => { };
    const user = (req as any).user;

    if (confirmado_por_medico) {
        if (user.cargo !== "Médico") {
            return res.status(403).json({
                message: "A exclusão só pode ser confirmada por um médico."
            });
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