import { Request, Response, NextFunction } from 'express';

export class AutorizacaoMiddleware {

    static autorizacaoAgente(req: Request, res: Response, next: NextFunction) {
        try {

            const agentes = req.user;
            
            if (!agentes) {
                return res.status(401).send({ error: 'Usuário não autenticado.' });
            }

            const { cargo } = agentes;

            if (cargo !== "Médico" && cargo !== "Enfermeiro") {
                return res.status(403).send({
                    error: 'Acesso restrito a médicos e enfermeiros.'
                });
            }

            next();
        } catch (error: any) {
            return res.status(500).send({ error: error.message });
        }
    }

    static autorizacaoMedico(req: Request, res: Response, next: NextFunction) {
        try{

            const agentes = req.user;
            
            if (!agentes) {
                return res.status(401).send({ error: 'Usuário não autenticado.' });
            }

            if(agentes.cargo !== "Médico"){
                return res.status(403).send({
                    error: "Apenas medicos podem confirmar a exclusao de um relatorio."
                })
            }

            next();
        } catch(error: any){
            return res.status(500).send({ error: error.message });
        }
    }
}