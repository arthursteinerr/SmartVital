import { connection } from "../dbConnection";
import { Paciente } from "../types/pacienteTypes";

//GET ALL Pacientes
export const getAllPacientes = async (): Promise<Paciente[]> => {
  try{
    return await connection<Paciente>("pacientes")
    .select("id", "nome", "idade", "peso", "altura", "temperatura", "indice_glicemico", "pressao_arterial", "saturacao", "pulso", "respiracao")
    .orderBy("id", "asc");
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error);
    throw new Error("Erro ao buscar pacientes.");
  }
};

//GET Paciente By ID
export const getPacienteById = async (id: number): Promise<Paciente | null> => {
  try{
    const paciente = await connection<Paciente>("pacientes")
    .select("id", "nome", "idade", "peso", "altura", "temperatura", "indice_glicemico", "pressao_arterial", "saturacao", "pulso", "respiracao")
    .where({id})
    .first();
    return paciente || null;
  } catch (error) {
    console.error(`Erro ao buscar paciente com ID ${id}:`, error);
    throw new Error("Erro ao buscar paciente pelo ID.");
  }
};

//POST Paciente
export const createPaciente = async (
  nome: string,
  idade?: number,
  peso?: number,
  altura?: number
  ): Promise<Paciente> => {
  try{
    const [novoPaciente] = await connection<Paciente>("pacientes")
    .insert({
      nome,
      idade: idade ?? undefined,
      peso: peso ?? undefined,
      altura: altura ?? undefined,
      temperatura: undefined,
      indice_glicemico: undefined,
      pressao_arterial: undefined,
      saturacao: undefined,
      pulso: undefined,
      respiracao: undefined,
    })
    .returning(["id", "nome", "idade", "peso", "altura", "temperatura", "indice_glicemico", "pressao_arterial", "saturacao", "pulso", "respiracao"]);
    return novoPaciente;
  } catch (error) {
      console.error("Erro ao criar paciente:", error);
      throw new Error("Erro ao criar paciente.");
  }
};

//PUT Paciente
export const updatePaciente = async (
  id: number,
  data: Paciente
): Promise<Paciente | null> => {
  try {
    const[pacienteAtualizado] = await connection<Paciente>("pacientes")
    .where({id})
    .update(data)
    .returning(["id", "nome", "idade", "peso", "altura", "temperatura", "indice_glicemico", "pressao_arterial", "saturacao", "pulso", "respiracao"]);
    return pacienteAtualizado || null;
  } catch (error) {
      console.error(`Erro ao atualizar paciente com o ID: ${id}`, error);
      throw new Error("Erro ao atualizar paciente.");
  }
};

//PATCH Paciente
export const patchPaciente = async (
  id: number,
  data: Partial<Paciente>
): Promise<Paciente | null> => {
  try {
    const[pacienteAtualizado] = await connection<Paciente>("pacientes")
    .where({id})
    .update(data)
    .returning(["id", "nome", "idade", "peso", "altura", "temperatura", "indice_glicemico", "pressao_arterial", "saturacao", "pulso", "respiracao"]);
    return pacienteAtualizado || null;
  } catch (error) {
      console.error(`Erro ao atualizar parcialmente paciente com o ID: ${id}`, error);
      throw new Error("Erro ao atualizar parcialmente paciente.");
  }
};

//DELETE Paciente
export const deletePaciente = async (id: number): Promise<boolean> => {
  try{
    const deleted = await connection("pacientes").where({id}).del();
    return deleted > 0;
  } catch (error) {
    console.error(`Erro ao deletar paciente com ID ${id}:`, error);
    throw new Error("Erro ao deletar paciente.");
  }
};

