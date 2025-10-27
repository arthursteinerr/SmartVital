import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("relatorios", (table) => {
        table.increments("id").primary();
        table
            .integer("id_paciente")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("pacientes")
            .onDelete("CASCADE");

        table
            .integer("id_agente")
            .unsigned()
            .nullable()
            .references("id")
            .inTable("agentes")
            .onDelete("SET NULL");

        table.text("observacao").notNullable();
        table.timestamp("data_registro").defaultTo(knex.fn.now());
        table.boolean("completo").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("relatorios");
}