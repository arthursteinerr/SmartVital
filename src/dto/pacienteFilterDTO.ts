import { PaginationParams } from "./paginationDTO";

export interface PacienteFilterDTO extends PaginationParams {
  nome?: string;
  idade?: number;
  peso?: number;
  altura?: number;
  temperatura?: number;
  indice_glicemico?: number;
  pressao_arterial?: string;
  saturacao?: number;
  pulso?: number;
  respiracao?: number;
  sortBy?: "id" | "nome" | "idade" | "peso" | "altura" | "temperatura" | "indice_glicemico" | "pressao_arterial" | "saturacao" | "pulso" | "respiracao";
  sortOrder?: "asc" | "desc";
}
