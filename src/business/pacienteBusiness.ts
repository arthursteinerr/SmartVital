import { getAllPacientes } from "../data/pacienteData";
import { getPacienteById } from "../data/pacienteData";
import { createPaciente } from "../data/pacienteData";
import { updatePaciente } from "../data/pacienteData";
import { patchPaciente } from "../data/pacienteData";
import { deletePaciente } from "../data/pacienteData";
import { Paciente } from "../types/pacienteTypes";

interface Response<T> {
  success: boolean;
  message?: string;
  data?: T; 
}

//GET ALL Pacientes
export const getAllPacientesBusiness = async (): Promise<Response<Paciente[]>> => {
  try {
    const pacientes = await getAllPacientes();

    if (pacientes.length === 0) {
      return { success: false, message: "Nenhum paciente encontrado." };
    }

    return { success: true, data: pacientes };
  } catch (error) {
    return { success: false, message: "Erro ao buscar pacientes." };
  }
};

//GET Paciente por ID
export const getPacienteByIdBusiness = async (id: number): Promise<Response<Paciente>> => {
  try {
    const paciente = await getPacienteById(id);

    if (!paciente) {
      return { success: false, message: "Paciente não encontrado.", data: undefined };
    }

    return { success: true, data: paciente };
  } catch (error) {
    return { success: false, message: "Erro ao buscar paciente." };
  }
};

//POST Paciente
export const createPacienteBusiness = async (data: Omit<Paciente, "id">): Promise<Response<Paciente>> => {
  try {
    if (!data.nome) {
      return { success: false, message: "O campo 'nome' é obrigatório." };
    }

    const novoPaciente = await createPaciente(
      data.nome,
      data.idade ?? undefined,
      data.peso ?? undefined,
      data.altura ?? undefined
    );

    return { success: true, data: novoPaciente };
  } catch (error) {
    return { success: false, message: "Erro ao criar paciente." };
  }
};

//PUT Paciente
export const updatePacienteBusiness = async (id: number, data: Paciente): Promise<Response<Paciente>> => {
  try {
    const pacienteExistente = await getPacienteById(id);

    if (!pacienteExistente) {
      return { success: false, message: "Paciente não encontrado." };
    }

    // Atualiza o paciente passando um objeto conforme esperado pela função updatePaciente
    const pacienteAtualizado = await updatePaciente(id, {
      id,
      nome: data.nome ?? pacienteExistente.nome,
      idade: data.idade ?? pacienteExistente.idade,
      peso: data.peso ?? pacienteExistente.peso,
      altura: data.altura ?? pacienteExistente.altura,
    });

    return { success: true, data: pacienteAtualizado ?? undefined };
  } catch (error) {
    return { success: false, message: "Erro ao atualizar paciente." };
  }
};

//PATCH Paciente
export const patchPacienteBusiness = async (id: number, data: Partial<Paciente>): Promise<Response<Paciente>> => {
  try {
    const pacienteExistente = await getPacienteById(id);

    if (!pacienteExistente) {
      return { success: false, message: "Paciente não encontrado." };
    }

    const pacienteAtualizado = await patchPaciente(id, data);

    // Se o paciente atualizado for null, retornamos undefined
    if (pacienteAtualizado == null) {
      return { success: false, message: "Erro ao atualizar dados do paciente.", data: undefined };
    }

    return { success: true, data: pacienteAtualizado };
  } catch (error) {
    return { success: false, message: "Erro ao atualizar dados do paciente." };
  }
};

//DELETE Paciente
export const deletePacienteBusiness = async (id: number): Promise<Response<Paciente>> => {
  try {
    const pacienteExistente = await getPacienteById(id);

    if (!pacienteExistente) {
      return { success: false, message: "Paciente não encontrado." };
    }

    const deleted = await deletePaciente(id);

    if (!deleted) {
      return { success: false, message: "Erro ao deletar paciente." };
    }

    return { success: true, data: pacienteExistente };
  } catch (error) {
    return { success: false, message: "Erro ao tentar deletar paciente." };
  }
};
