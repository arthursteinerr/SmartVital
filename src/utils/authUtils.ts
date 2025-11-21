import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
if (!process.env.JWT_SECRET) {
  console.warn("Aviso: JWT_SECRET não definido em .env — usando chave de desenvolvimento. Defina uma chave segura em produção.");
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "20m";

export interface TokenPayload {
    id: number;
    cargo: string;
    registro_profissional: string;
}

export class AuthUtils {
    static generateToken(payload: TokenPayload): string {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        } as jwt.SignOptions);
    }

    static verifyToken(token: string): TokenPayload {
        try {
            // Remove o prefixo "Bearer" no header Authorization do Postman
            const cleanToken = token.replace(/^Bearer\s+/i, "");
            return jwt.verify(cleanToken, JWT_SECRET) as TokenPayload;
        } catch (error) {
            console.error("Erro ao validar token:", error);
            throw new Error("Token inválido ou expirado");
        }
    }
}
