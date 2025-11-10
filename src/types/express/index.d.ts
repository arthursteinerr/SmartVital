import "express";

declare global {
  namespace Express {
    interface User {
      id: number;
      nome: string;
      cargo: "Médico" | "Enfermeiro";
      registro_profissional: string;
      data_admissao: string;
    }

    interface Request {
      user?: User;
    }
  }
}