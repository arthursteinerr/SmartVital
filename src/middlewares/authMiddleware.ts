import { Request, Response, NextFunction } from 'express';
import { authUtils } from '../utils/authUtils';

declare global {
    namespace Express {
        interface Request {
            agente?: {
                id: number;
                cargo: string;
                registro_profissional: string;
            };
        }
    }
}

export class AuthMiddleware {
    static authenticate(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return res.status(401).send({ error: 'Token não fornecido' });
            }

            const token = authHeader.replace("Bearer ", "");

            if (!token) {
                return res.status(401).send({ error: 'Token mal formatado' });
            }

            const payload = authUtils.verifyToken(token);

            req.agente = payload;

            next();

        } catch (error: any) {
            return res.status(401).send({ error: 'Token inválido ou expirado' });
        }
    }
}
