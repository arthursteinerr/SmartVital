import { Relatorio } from "../types/relatorioTypes";
import { connection } from "../dbConnection";

export class RelatorioData {

    async createRelatorio(data: Relatorio): Promise<Relatorio> {

        const [novo] = await connection<Relatorio>("relatorios")
            .insert({
                id_paciente: data.id_paciente,
                id_agente: data.id_agente,
                observacao: data.observacao,
                completo: data.completo ?? false,
                data_registro: connection.fn.now(),
            })

            .returning(["id", "id_paciente", "id_agente", "observacao", "data_registro", "completo"]);

        return novo;
    }

    async getRelatorioById(id: number): Promise<Relatorio | undefined> {

        return connection<Relatorio>("relatorios").where({ id }).first();
    }

    async getRelatoriosByPaciente(id_paciente: number): Promise<Relatorio[]> {

        return connection<Relatorio>("relatorios")
            .where({ id_paciente })
            .orderBy("data_registro", "desc");
    }

    async updateRelatorio(id: number, data: Partial<Relatorio>): Promise<Relatorio | undefined> {

        const updateObj: Partial<Relatorio> = {};

        if (data.observacao !== undefined) updateObj.observacao = data.observacao;
        if (data.completo !== undefined) updateObj.completo = data.completo;

        await connection<Relatorio>("relatorios")
            .where({ id })
            .update({
                ...updateObj,
                data_registro: connection.fn.now(),
            })

            // Altercao devido ao MySql não suportar o .returning(), por isso, fazemos uma nova consulta
            const updated = await connection<Relatorio>("relatorios").where({ id }).first();

            return updated;
    }

    async getRelatoriosPendentes(): Promise<Relatorio[]> {

        return connection<Relatorio>("relatorios")
            .where({ completo: false })
            .orderBy("data_registro", "desc");
    }
}