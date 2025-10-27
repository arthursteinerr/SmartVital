import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex("pacientes").del();

    await knex("pacientes").insert([
        {
            nome: "Henrique Pereira",
            idade: 30,
            peso: 75.0,
            altura: 1.7,
            temperatura: 36.8,
            indice_glicemico: 95,
            pressao_arterial: "120/80",
            saturacao: 98,
            pulso: 75,
            respiracao: 16,
        },
        {
            nome: "Maria Souza",
            idade: 42,
            peso: 68.5,
            altura: 1.65,
            temperatura: 36.7,
            indice_glicemico: 100,
            pressao_arterial: "130/85",
            saturacao: 97,
            pulso: 78,
            respiracao: 17,
        },
    ]);
}