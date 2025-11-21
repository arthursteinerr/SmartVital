import { getAgenteByRegistro } from "../data/agenteData";
import { updateAgente } from "../data/agenteData";
import bcrypt from "bcryptjs";
import { LoginInput, AuthResponse } from "../dto/authDTO";
import { AuthUtils } from "../utils/authUtils";

export class AuthBusiness {
  public async login(input: LoginInput): Promise<AuthResponse> {
    try {
      const { registro_profissional, senha } = input;

      if (!registro_profissional || !senha) {
        throw new Error("Campos 'registro profissional' e 'senha' são obrigatórios.");
      }

      const agente = await getAgenteByRegistro(registro_profissional);

      if (!agente) {
        throw new Error("Agente não encontrado ou credenciais inválidas.");
      }

      // Normaliza senha armazenada e a senha enviada
      const providedSenha = String(senha).trim();

      const bcryptHashRegex = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

      let senhaValida = false;

      if (bcryptHashRegex.test(agente.senha)) {
        // Comparação segura entre plain e hash
        senhaValida = await bcrypt.compare(providedSenha, agente.senha);
      } else {

        if (agente.senha === providedSenha) {
          const rounds = parseInt(process.env.BCRYPT_ROUNDS || "10", 10);
          const novoHash = await bcrypt.hash(providedSenha, rounds);
          // updateAgente(id, nome, senha, cargo)
          await updateAgente(agente.id, agente.nome, novoHash, agente.cargo);
          senhaValida = true;
        } else {
          senhaValida = false;
        }
      }

      if (!senhaValida) {
        throw new Error("Agente não encontrado ou credenciais inválidas.");
      }

      const token = AuthUtils.generateToken({
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
      // Retorna sempre mensagem genérica para o cliente, mantendo detalhe no log dev
      const msg = error?.message || "Erro no processo de login.";
      if (process.env.NODE_ENV !== "production") {
        console.error("[AuthBusiness] erro:", error);
      }
      throw new Error(msg);
    }
  }
}
