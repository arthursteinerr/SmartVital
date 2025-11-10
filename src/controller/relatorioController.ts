import { Request, Response } from "express";
import { RelatorioBusiness } from "../business/relatorioBusiness";
import { AutorizacaoMiddleware } from "../middlewares/AutorizacaoMiddleware";

const relatorioBusiness = new RelatorioBusiness();

export class RelatorioController {

    async criar(req: Request, res: Response) {

        try {

            const relatorio = await relatorioBusiness.criarRelatorio(req.body);
            res.status(201).json(relatorio);
        } catch (error: any) {

            res.status(400).json({ erro: error.message });
        }
    }

    async buscarPorId(req: Request, res: Response) {

        try {

            const relatorio = await relatorioBusiness.buscarPorId(Number(req.params.id));
            res.status(200).json(relatorio);
        } catch (error: any) {

            res.status(404).json({ erro: error.message });
        }
    }

    async listarPorPaciente(req: Request, res: Response) {

        try {

            const relatorios = await relatorioBusiness.listarPorPaciente(Number(req.params.id));
            res.status(200).json(relatorios);
        } catch (error: any) {

            res.status(400).json({ erro: error.message });
        }
    }

    async atualizar(req: Request, res: Response) {

        try {

            const realtorio = await relatorioBusiness.atualizar(Number(req.params.id), req.body);
            res.status(200).json(realtorio);
        } catch (error: any) {

            res.status(400).json({ erro: error.message })
        }
    }

    async listarPendentes(req: Request, res: Response) {

        try {

            const relatorios = await relatorioBusiness.listarPendentes();
            res.status(200).json(relatorios);
        } catch (error: any) {

            res.status(500).json({ erro: error.message })
        }
    }

    async listarPorData(req: Request, res: Response) {

        try {

            const { data } = req.params;
            if (!data || typeof data !== "string") {
                return res.status(400).json({ erro: "Parametro 'data' é obrigatorio no formato DD/MM/YYYY." });
            }

            const relatorios = await relatorioBusiness.listarPorData(data);
            res.status(200).json(relatorios);
        } catch (error: any) {

            res.status(400).json({ erro: error.message });
        }
    }

    async deletar(req: Request, res: Response) {

        try {

            const id = Number(req.params.id);
            const { solicitado_por, confirmado_por_medico, motivo_exclusao } = req.body;

            if (!solicitado_por || !confirmado_por_medico || !motivo_exclusao) {

                return res.status(400).json({
                    erro: "Campos obrigatorios: solicitado_por, confirmado_por_medico e motivo_exclusao."
                });
            }

            if (confirmado_por_medico) {
                const fakeNext = () => { };
                const resultado = AutorizacaoMiddleware.autorizacaoMedico(req, res, fakeNext);

                if (resultado) {
                    return resultado;
                }
            }

            await relatorioBusiness.excluirRelatorio(id, solicitado_por, confirmado_por_medico, motivo_exclusao);

            res.status(200).json({ mensagem: "SOFT delete registrado com sucesso." })
        } catch (error: any) {

            res.status(400).json({ erro: error.message });
        }
    }
}