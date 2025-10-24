import { Request, Response } from "express";
import { RelatorioBusiness } from "../business/relatorioBusiness";

const relatorioBusiness = new RelatorioBusiness();

export class RelatorioController {

    async criar(req: Request, res: Response) {

        try{

            const relatorio = await relatorioBusiness.criarRelatorio(req.body);
            res.status(201).json(relatorio);
        } catch (error: any) {

            res.status(400).json({ erro: error.message });
        }
    }

    async buscarPorId(req: Request, res: Response) {

        try{

            const relatorio = await relatorioBusiness.buscarPorId(Number(req.params.id));
            res.status(200).json(relatorio);
        } catch (error: any) {

            res.status(404).json({ erro: error.message });
        }
    }

    async listarPorPaciente(req: Request, res: Response) {
        
        try{

            const relatorios = await relatorioBusiness.listarPorPaciente(Number(req.params.id));
            res.status(200).json(relatorioBusiness);
        } catch (error: any) {

            res.status(400).json({ erro: error.message });
        }
    }

    async atualizar(req: Request, res: Response) {

        try{

            const realtorio = await relatorioBusiness.atualizar(Number(req.params.id), req.body);
            res.status(200).json(realtorio);
        } catch (error: any) {

            res.status(400).json({ erro: error.message })
        }
    }

    async listarPendentes( req: Request, res: Response) {

        try{

            const relatorios = await relatorioBusiness.listarPendentes();
            res.status(200).json(relatorios);
        } catch (error: any) {
            
            res.status(500).json({ erro: error.message })
        }
    }
}