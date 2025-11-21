import { Request, Response, NextFunction } from 'express';
import { AuthUtils, TokenPayload } from '../utils/authUtils';
import { getAgenteById } from '../data/agenteData';

export class AuthMiddleware {
    static async authenticate(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = String(req.headers.authorization || '').trim();

            if (!authHeader) {
                return res.status(401).send({ error: 'Token não fornecido' });
            }

            // aceita "Bearer xxx" ou só "xxx"
            const token = authHeader.replace(/^Bearer\s+/i, '');

            if (!token) {
                return res.status(401).send({ error: 'Token mal formatado' });
            }

            const payload: TokenPayload = AuthUtils.verifyToken(token);

            if (!payload || !payload.id) {
                return res.status(401).send({ error: 'Token inválido' });
            }

            // Busca o agente no DB para popular req.user com dados reais (evita campos vazios)
            const agente = await getAgenteById(payload.id);
            if (!agente) {
                return res.status(401).send({ error: 'Usuário não autenticado' });
            }

            // Prepara o objeto `user` esperado pelo restante da aplicação (sem senha)
            (req as any).user = {
                id: agente.id,
                nome: agente.nome,
                cargo: agente.cargo,
                registro_profissional: agente.registro_profissional,
                data_admissao: agente.data_admissao
            } as any;

            next();

        } catch (error: any) {
            return res.status(401).send({ error: 'Token inválido ou expirado' });
        }
    }
}
