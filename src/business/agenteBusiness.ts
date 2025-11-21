import { getAllAgentes } from "../data/agenteData";
import { getAgenteById } from "../data/agenteData";
import { getAgenteByRegistro } from "../data/agenteData";
import { createAgente } from "../data/agenteData";
import { updateAgente } from "../data/agenteData";
import { deleteAgente } from "../data/agenteData";
import { Agente } from "../types/agenteTypes";
import { PaginatedResponse } from "../dto/paginationDTO";
import { AgenteFilterDTO } from "../dto/agenteFilterDTO";
import { FilterUtils } from '../utils/filterUtils';
import bcrypt from "bcryptjs";

//GET All Agentes
export const getAllAgentesBusiness = async (
  filter: AgenteFilterDTO
): Promise<PaginatedResponse<Omit<Agente, "senha">>> => {
  try {
    const completeFilter = FilterUtils.applyDefaults(filter);
    return await getAllAgentes(completeFilter);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

//GET Agente By ID
export const getAgenteByIdBusiness = async (id: number) => {
  const agente = await getAgenteById(id);
  
  if (!agente) {
    return { success: false, message: "Agente não encontrado." };
  }

  return { success: true, data: agente };
};

//POST Novo Agente (com hash da senha)
export const createAgenteBusiness = async (data: Omit<Agente, "id">) => {
  if (!data.nome || !data.senha || !data.cargo || !data.registro_profissional || !data.data_admissao) {
    return { success: false, message: "Todos os campos são obrigatórios." };
  }

  const existing = await getAgenteByRegistro(data.registro_profissional);
  
  if (existing) {
    return { success: false, message: "Registro profissional já cadastrado." };
  }

  // Criptografar senha
  const hashedPassword = await bcrypt.hash(data.senha, 10);

  const newAgente = await createAgente(
    data.nome,
    hashedPassword,
    data.cargo,
    data.registro_profissional,
    data.data_admissao.toISOString()
  );
  
  return { success: true, data: newAgente };
};

//PATCH Atualiza Agente (re-hash da senha se fornecida)
export const updateAgenteBusiness = async (
  id: number,
  data: Partial<Omit<Agente, "id" | "registro_profissional" | "data_admissao">>
) => {

  const agenteExists = await getAgenteById(id);
  if (!agenteExists) {
    return { success: false, message: "Agente não encontrado." };
  }

  const nome = data.nome ?? agenteExists.nome!;
  const cargo = data.cargo ?? agenteExists.cargo!;

  // Se senha for informada, gera hash, senão mantém a atual
  const senha = data.senha 
    ? await bcrypt.hash(data.senha, 10)
    : agenteExists.senha!;

  const updated = await updateAgente(id, nome, senha, cargo);

  return { success: true, data: updated };
};

//DELETE Agente
export const deleteAgenteBusiness = async (id: number) => {
  const agenteExists = await getAgenteById(id);

  if (!agenteExists) {
    return { success: false, message: "Agente não encontrado." };
  }

  const deleted = await deleteAgente(id);
  
  if (!deleted) {
    return { success: false, message: "Erro ao deletar agente." };
  }

  return { success: true, data: agenteExists };
};
