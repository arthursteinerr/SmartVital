import { getAllPacientes } from "../data/pacienteData";
import { getPacienteById } from "../data/pacienteData";
import { createPaciente } from "../data/pacienteData";
import { updatePaciente } from "../data/pacienteData";
import { patchPaciente } from "../data/pacienteData";
import { deletePaciente } from "../data/pacienteData";

import { Paciente } from "../types/pacienteTypes";

//GET ALL Pacientes
export const getAllPacientesBusiness = async () => {
  const pacientes = await getAllPacientes();

  if(pacientes.length === 0){
    return { success: false, message: "Nenhum paciente encontrado." };
  }

  return { success: true, data: pacientes };
};

//GET Paciente por ID
export const getPacienteByIdBusiness = async (id: number) =>{
  const paciente = await getPacienteById(id);

  if(!paciente) {
    return { success: false, message: "Paciente não encontrado." };
  }
  return { success: true, data: paciente };
};

//POST Paciente
export const createPacienteBusiness = async (data: Omit<Paciente, "id">) => {
  if (!data.nome) {
    return { success: false, message: "O campo 'nome' é obrigatório." };
  }

  const novoPaciente = await createPaciente(
    data.nome,
    data.idade ?? null,
    data.peso ?? null,
    data.altura ?? null
    );

  return { success: true, data: novoPaciente };
};

//PATCH Paciente
export const patchPacienteBusinesse = async (
  id: number,
  data: Partial<Paciente>
  ) => {
  const pacienteExistente = await getPacienteById(id);

  if(!pacienteExistente) {
    return { success: false, message: "Paciente inválido."};
  }

  const pacienteAtualizado = await patchPaciente(id, data);

  return { success: true, data: pacienteAtualizado };
};

//DELETE Paciente
export const deletePacienteBusiness = async (id: number) => {
  const pacienteExistente = await getPacienteById(id);

  if(!pacienteExistente) {
    return { success: false, message: "Paciente inválido."};
  }

  const deleted = await deletePaciente(id);

  if(!deleted) {
    return { success: false, message: "Erro ao deletar paciente." };
  }
  return { success: true, data: pacienteExistente };
};
























