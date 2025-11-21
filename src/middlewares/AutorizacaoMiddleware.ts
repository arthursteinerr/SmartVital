import { Request, Response, NextFunction } from 'express';
import { AuthUtils } from '../utils/authUtils';
import { getAgenteById } from '../data/agenteData';

export class AutorizacaoMiddleware {

    private static async ensureUserFromToken(req: Request) {
        
        if ((req as any).user) return;

        const authHeader = String(req.headers.authorization || '').trim();
        if (!authHeader) {
            throw new Error('Usuário não autenticado.');
        }

        // AuthUtils.verifyToken remove "Bearer"
        const payload = AuthUtils.verifyToken(authHeader);
        if (!payload || !payload.id) {
            throw new Error('Usuário não autenticado.');
        }

        const agente = await getAgenteById(payload.id);
        if (!agente) {
            throw new Error('Usuário não autenticado.');
        }

        (req as any).user = {
            id: agente.id,
            nome: agente.nome,
            cargo: agente.cargo,
            registro_profissional: agente.registro_profissional
        };
    }

    // Aceita qualquer usuário autenticado (token válido)
    static async autorizacaoAgente(req: Request, res: Response, next: NextFunction) {
        try {
            await AutorizacaoMiddleware.ensureUserFromToken(req);
            next();
        } catch (error: any) {
            const msg = error?.message || 'Erro na autorização.';
            const status = msg === 'Usuário não autenticado.' ? 401 : 500;
            return res.status(status).send({ error: msg });
        }
    }


    static async autorizacaoMedico(req: Request, res: Response, next: NextFunction) {
        try {
            await AutorizacaoMiddleware.ensureUserFromToken(req);

            const agentes = (req as any).user;

            if (!agentes) {
                return res.status(401).send({ error: 'Usuário não autenticado.' });
            }

            if (agentes.cargo !== "Médico") {
                return res.status(403).send({
                    error: "Apenas medicos podem confirmar a exclusao de um relatorio."
                });
            }

            next();
        } catch (error: any) {
            const msg = error?.message || 'Erro na autorização.';
            const status = msg === 'Usuário não autenticado.' ? 401 : 500;
            return res.status(status).send({ error: msg });
        }
    }
}