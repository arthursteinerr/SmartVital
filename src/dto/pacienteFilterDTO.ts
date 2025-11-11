import { PaginationParams } from "./paginationDTO";

export interface PacienteFilterDTO extends PaginationParams {
  nome?: string;
  sortBy?: "id" | "nome" | "idade" | "peso" | "altura" | "temperatura" | "indice_glicemico" | "pressao_arterial" | "saturacao" | "pulso" | "respiracao";
  sortOrder?: "asc" | "desc";
}

