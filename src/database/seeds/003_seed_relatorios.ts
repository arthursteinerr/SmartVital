import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex("relatorios").del();

    await knex("relatorios").insert([
        {
            id_paciente: 1,
            id_agente: 1,
            observacao: "Paciente apresentou febre leve e dor de cabeça.",
            completo: false,
            data_registro: knex.fn.now(),
        },
        {
            id_paciente: 1,
            id_agente: 2,
            observacao: "Melhora clínica após uso de medicação.",
            completo: true,
            data_registro: knex.fn.now(),
        },
        {
            id_paciente: 2,
            id_agente: 1,
            observacao: "Em observação pós-operatória.",
            completo: false,
            data_registro: knex.fn.now(),
        },
    ]);
}