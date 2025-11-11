import { getAgenteByRegistro } from "../data/agenteData";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthBusiness {
  async login(registro_profissional: string, senha: string) {
		try {
			if (!registro_profissional || !senha) {
			throw new Error("Campos 'registro profissional' e 'senha' são obrigatórios.");
		}

		const agente = await getAgenteByRegistro(registro_profissional);

		if (!agente) {
			throw new Error("Agente não encontrado ou credenciais inválidas.");
		}
			
		if (!agente.senha) {
			throw new Error("O agente não possui senha cadastrada.");
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
			token,
			agente: {
				id: agente.id,
		        nome: agente.nome,
				registro_profissional: agente.registro_profissional,
				cargo: agente.cargo
			}
		};
   		} catch (error: any) {
     	 throw new Error(error.message);
		}
	}
}
