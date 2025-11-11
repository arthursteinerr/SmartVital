import { getAgenteByRegistro } from "../data/agenteData";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginInput, AuthResponse } from "../dto/authDTO";
import { authUtils } from "../utils/authUtils";

export class AuthBusiness {
  public async login(input: LoginInput): Promise<AuthResponse> {
		try {
			const {registro_profissional, senha} = input;
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

		const token = authUtils.generateToken({
			id: agente.id,
			cargo: agente.cargo,
			registro_profissional: agente.registro_profissional
		});

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
