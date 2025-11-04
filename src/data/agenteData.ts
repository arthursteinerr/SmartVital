import connection from "../dbConnection";
import { Agente } from "../types/agenteTypes";
import { PaginatedResponse } from "../dto/paginationDTO";
import { AgenteFilterDTO } from "../dto/agenteFilterDTO";

//GET All Agentes
export const getAllAgentes = async (
  filter: Required<AgenteFilterDTO>
): Promise<PaginatedResponse<Omit<Agente, "senha">>> => {
  if (!filter) {
    throw new Error("Parâmetros de filtro não informados.");
  }

  try {
    const { nome, cargo, registro_profissional, page, limit, sortBy, sortOrder } = filter;

    const baseQuery = connection<Agente>("agentes");

    if (nome) {
      baseQuery.whereILike("nome", `%${nome}%`);
    }

    if (cargo) {
      baseQuery.whereILike("cargo", `%${cargo}%`);
    }

    if (registro_profissional) {
      baseQuery.where("registro_profissional", registro_profissional);
    }

  const countQuery = connection<Agente>("agentes").modify((qb) => {
    if (nome) {
      qb.whereILike("nome", `%${nome}%`);
    }

    if (cargo) {
      qb.whereILike("cargo", `%${cargo}%`);
    }

    if (registro_profissional) {
      qb.where("registro_profissional", registro_profissional);
    }
  });


    const countResult = await countQuery.count<{ count: string }>('* as count').first();
    const total = Number(countResult?.count ?? 0);

    const data = await baseQuery
      .select("id", "nome", "cargo", "registro_profissional", "data_admissao")
      .orderBy(sortBy, sortOrder)
      .limit(limit)
      .offset((page - 1) * limit);

    return {
      data,
      pageInfo: {
        total,
        limit,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };

  } catch (error: any) {
      console.error("Erro ao buscar agentes:", error);
      throw new Error(error.message || "Erro ao buscar agentes no banco de dados");
  }
};

//GET Agente por ID
export const getAgenteById = async (id: number): Promise<Agente | null> => {
  if (!id) throw new Error("ID do agente não informado.");

  try {
    const result = await connection<Agente>("agentes")
      .select("id", "nome", "senha", "cargo", "registro_profissional", "data_admissao")
      .where({ id })
      .first();

    return result || null;
  } catch (error) {
    console.error(`Erro ao buscar agente com ID ${id}:`, error);
    throw new Error("Erro ao buscar agente pelo ID.");
  }
};

//GET Agente por Registro Profissional
export const getAgenteByRegistro = async (registro: string): Promise<Agente | null> => {
  if (!registro) throw new Error("Registro profissional não informado.");

  try {
    const result = await connection<Agente>("agentes")
      .select("id", "nome", "senha", "cargo", "registro_profissional", "data_admissao")
      .where("registro_profissional", registro)
      .first();

    return result || null;
  } catch (error) {
      console.error(`Erro ao buscar agente com registro ${registro}:`, error);
      throw new Error("Erro ao buscar agente pelo registro.");
  }
};

//POST Novo Agente
export const createAgente = async (
  nome: string,
  senha: string,
  cargo: string,
  registro_profissional: string,
  data_admissao: string
): Promise<Agente> => {
  if (!nome || !senha || !cargo || !registro_profissional || !data_admissao) {
    throw new Error("Campos obrigatórios não informados.");
  }

  try {
    const [novoAgente] = await connection<Agente>("agentes")
      .insert({
        nome,
        senha,
        cargo,
        registro_profissional,
        data_admissao: new Date(data_admissao),
      })
      .returning(["id", "nome", "senha", "cargo", "registro_profissional", "data_admissao"]);

    return novoAgente;
  } catch (error) {
    console.error("Erro ao criar agente:", error);
    throw new Error("Erro ao criar novo agente.");
  }
};

//PATCH Atualizar Agente
export const updateAgente = async (
  id: number,
  nome: string,
  senha: string,
  cargo: string
): Promise<Agente | null> => {
  if (!id) throw new Error("ID do agente não informado.");

  try {
    const [agenteAtualizado] = await connection<Agente>("agentes")
      .where({ id })
      .update({ nome, senha, cargo })
      .returning(["id", "nome", "senha", "cargo", "registro_profissional", "data_admissao"]);

    return agenteAtualizado || null;
  } catch (error) {
    console.error(`Erro ao atualizar agente com ID ${id}:`, error);
    throw new Error("Erro ao atualizar agente.");
  }
};

//DELETE Agente
export const deleteAgente = async (id: number): Promise<boolean> => {
  if (!id) throw new Error("ID do agente não informado.");

  try {
    const deleted = await connection("agentes").where({ id }).del();
    return deleted > 0;
  } catch (error) {
      console.error(`Erro ao deletar agente com ID ${id}:`, error);
      throw new Error("Erro ao deletar agente.");
  }
};
