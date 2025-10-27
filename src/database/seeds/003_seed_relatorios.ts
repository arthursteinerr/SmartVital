import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("relatorios").del();

  await knex("relatorios").insert([
    {
      id_paciente: 1,
      id_agente: 1,
      observacao: "Paciente apresentou febre leve e dor de cabeça.",
      completo: false,
      data_registro: "2025-10-21T14:35:00Z",
    },
    {
      id_paciente: 1,
      id_agente: 2,
      observacao: "Melhora clínica após uso de medicação.",
      completo: true,
      data_registro: "2025-10-22T09:20:00Z",
    },
    {
      id_paciente: 2,
      id_agente: 1,
      observacao: "Em observação pós-operatória.",
      completo: false,
      data_registro: "2025-10-20T16:00:00Z",
    },
  ]);
}