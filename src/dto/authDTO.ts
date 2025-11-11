export interface LoginInput {
  registro_profissional: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  agente: {
  id: number;
  nome: string;
  registro_profissional: string;
  cargo: string;
  }
}

