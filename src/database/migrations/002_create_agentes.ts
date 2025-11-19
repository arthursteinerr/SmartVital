import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("agentes", (table) => {
        table.increments("id").primary();
        table.string("nome").notNullable();
        table.string("senha").notNullable();
        table.string("cargo").notNullable();
        table.string("registro_profissional").unique().notNullable();
        table.date("data_admissao").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("agentes");
}