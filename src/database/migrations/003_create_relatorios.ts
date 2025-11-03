import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("relatorios", (table) => {
        table.increments("id").primary();

        table
            .integer("id_paciente")
            .notNullable()
            .references("id")
            .inTable("pacientes")
            .onDelete("CASCADE");

        table
            .integer("id_agente")
            .nullable()
            .references("id")
            .inTable("agentes")
            .onDelete("SET NULL");

        table.text("observacao").notNullable();
        table.timestamp("data_registro").defaultTo(knex.fn.now());
        table.boolean("completo").notNullable().defaultTo(false);

        table.boolean("deletado").defaultTo(false);
        table
            .integer("solicitado_por")
            .nullable()
            .references("id")
            .inTable("agentes")
            .onDelete("SET NULL");

        table
            .integer("confirmado_por_medico")
            .nullable()
            .references("id")
            .inTable("agentes")
            .onDelete("SET NULL");

        table.text("motivo_exclusao").nullable();
        table.timestamp("data_exclusao").nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("relatorios");
}