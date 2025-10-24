import { connection } from "../dbConnection";
import { Agente } from "../types/agenteTypes";

//GET All Agentes
export const getAllAgentes = async (): Promise<Omit<Agente, "senha">[]> => {
  try {
    return await connection<Agente>("agentes")
      .select("id", "nome", "cargo", "registro_profissional", "data_admissao")
      .orderBy("id", "asc");
  } catch (error) {
      console.error("Erro ao buscar todos os agentes:", error);
      throw new Error("Erro ao buscar todos os agentes.");
  }
};

//GET Agente By ID
export const getAgenteById = async (id: number): Promise<Agente | null> => {
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

//GET Agente By Registro
export const getAgenteByRegistro = async (registro: string): Promise<Agente | null> => {
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
  try {
    const [novoAgente] = await connection<Agente>("agentes")
      .insert({
        nome,
        senha,
        cargo,
        registro_profissional,
        data_admissao,
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
  try {
    const deleted = await connection("agentes").where({ id }).del();
    return deleted > 0;
  } catch (error) {
      console.error(`Erro ao deletar agente com ID ${id}:`, error);
      throw new Error("Erro ao deletar agente.");
  }
};
