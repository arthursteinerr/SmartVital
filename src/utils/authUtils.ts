import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string|| '5h';

export interface TokenPayload {
    id: number;
    cargo: string;
    registro_profissional: string;
}

export class authUtils {
    static generateToken(payload: TokenPayload): string {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        });
    }

    static verifyToken(token: string): TokenPayload {
        try {
            if(!JWT_SECRET){
                throw new Error("JWT_SECRET não definido no .env");
            }
            return jwt.verify(token, JWT_SECRET) as TokenPayload;
            } catch (error){
                throw new Error("Token inválido ou expirado");
        }
    }
}
