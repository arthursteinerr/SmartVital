import { PaginationParams } from "./paginationDTO";

export interface AgenteFilterDTO extends PaginationParams {
  nome?: string;
  cargo?: string;
  registro_profissional?: string;
  sortBy?: "id" | "nome" | "cargo" | "registro_profissional" | "data_admissao";
  sortOrder?: "asc" | "desc";
}
