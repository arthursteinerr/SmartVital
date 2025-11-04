import { AgenteFilterDTO } from "../dto/agenteFilterDTO";

export class FilterUtils {
  private static readonly DEFAULTS = {
    page: 1,
    limit: 10,
    sortBy: "id",
    sortOrder: "asc",
    maxLimit: 100,
  } as const;

  static parseAgenteFilter(query: any): Partial<AgenteFilterDTO> {
    const getNumber = (value: any, min = 1, max?: number) => {
      const num = parseInt(value);
      if (isNaN(num) || num < min) return undefined;
      return max ? Math.min(num, max) : num;
    };

    return {
      nome: query.nome?.toString(),
      cargo: query.cargo?.toString(),
      registro_profissional: query.registro_profissional?.toString(),
      page: getNumber(query.page, 1),
      limit: getNumber(query.limit, 1, this.DEFAULTS.maxLimit),
      sortBy: this.validateSortBy(query.sortBy),
      sortOrder: this.validateSortOrder(query.sortOrder),
    };
  }

  static applyDefaults(filter: Partial<AgenteFilterDTO>): Required<AgenteFilterDTO> {
    const { DEFAULTS } = this;
    return {
      nome: filter.nome ?? "",
      cargo: filter.cargo ?? "",
      registro_profissional: filter.registro_profissional ?? "",
      page: filter.page ?? DEFAULTS.page,
      limit: filter.limit ?? DEFAULTS.limit,
      sortBy: filter.sortBy ?? DEFAULTS.sortBy,
      sortOrder: filter.sortOrder ?? DEFAULTS.sortOrder,
    };
  }

  private static validateSortBy(value: any): AgenteFilterDTO["sortBy"] | undefined {
    const valid = ["id", "nome", "cargo", "registro_profissional", "data_admissao"];
    return valid.includes(value) ? value : undefined;
  }

  private static validateSortOrder(value: any): AgenteFilterDTO["sortOrder"] | undefined {
    return ["asc", "desc"].includes(value) ? value : undefined;
  }
}
