import { getAllAgentes } from "../data/agenteData";
import { getAgenteById } from "../data/agenteData";
import { getAgenteByRegistro } from "../data/agenteData";
import { createAgente } from "../data/agenteData";
import { updateAgente } from "../data/agenteData";
import { deleteAgente } from "../data/agenteData";
import { Agente } from "../types/agenteTypes";

//GET All Agentes
export const getAllAgentesBusiness = async () => {
  const agentes = await getAllAgentes();
  
  if (agentes.length === 0) {
    return { success: false, message: "Nenhum agente encontrado." };
  }

  return { success: true, data: agentes };
};

//GET Agente By ID
export const getAgenteByIdBusiness = async (id: number) => {
  const agente = await getAgenteById(id);
  
  if (!agente) {
    return { success: false, message: "Agente não encontrado." };
  }

  return { success: true, data: agente };
};

//POST Novo Agente
export const createAgenteBusiness = async (data: Omit<Agente, "id">) => {
  if (!data.nome || !data.senha || !data.cargo || !data.registro_profissional || !data.data_admissao) {
    return { success: false, message: "Todos os campos são obrigatórios." };
  }

  const existing = await getAgenteByRegistro(data.registro_profissional);
  
  if (existing) {
    return { success: false, message: "Registro profissional já cadastrado." };
  }

  const newAgente = await createAgente(
    data.nome,
    data.senha,
    data.cargo,
    data.registro_profissional,
    data.data_admissao
  );
  
  return { success: true, data: newAgente };
};

//PATCH Atualiza Agente
export const updateAgenteBusiness = async (id: number, data: Partial<Omit<Agente, "id" | "registro_profissional" | "data_admissao">>) => {
  const agenteExists = await getAgenteById(id);

  if (!agenteExists) {
    return { success: false, message: "Agente não encontrado." };
  }

  const updated = await updateAgente(id, data.nome || agenteExists.nome, data.senha || agenteExists.senha, data.cargo || agenteExists.cargo);

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
