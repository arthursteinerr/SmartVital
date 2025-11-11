import { getAgenteByRegistro } from "../data/agenteData";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Agente } from "../types/agenteTypes";

export class AuthBusiness {
  async login(registro_profissional: string, senha: string) {
		if (!registro_profissional || !senha) {
			throw new Error("Campos 'registro profissional' e 'senha' são obrigatórios.");
		}

		const agente = await getAgenteByRegistro(registro_profissional);

		if (!agente) {
			throw new Error("Agente não encontrado ou credenciais inválidas.");
		}

		const senhaCorreta = await bcrypt.compare(senha, agente.senha);
		if (!senhaCorreta) {
			throw new Error("Credenciais inválidas.");
		}

		const token = jwt.sign(
		{
			id: agente.id,
			cargo: agente.cargo,
			registro: agente.registro_profissional
		},
		process.env.JWT_SECRET as string,
		{
			expiresIn: "5h"
		}
		);

		return {
			success: true,
			message: "Login realizado com sucesso!",
			token,
			agente: agenteSemSenha
		};
	}
}
