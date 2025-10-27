import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("pacientes", (table) => {
    table.increments("id").primary();
    table.string("nome").notNullable();
    table.integer("idade").nullable();
    table.decimal("peso", 5, 2).nullable();
    table.decimal("altura", 3, 2).nullable();
    table.decimal("temperatura", 4, 1).nullable();
    table.integer("indice_glicemico").nullable();
    table.string("pressao_arterial").nullable();
    table.integer("saturacao").nullable();
    table.integer("pulso").nullable();
    table.integer("respiracao").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("pacientes");
}