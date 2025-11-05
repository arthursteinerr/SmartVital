import { Relatorio } from "../types/relatorioTypes";
import { connection } from "../dbConnection";

export class RelatorioData {

    async createRelatorio(data: Relatorio): Promise<Relatorio> {

        const [id] = await connection<Relatorio>("relatorios")
            .insert({
                id_paciente: data.id_paciente,
                id_agente: data.id_agente,
                observacao: data.observacao,
                completo: data.completo ?? false,
                data_registro: connection.fn.now(),
            })

        // Como o MySQL não suporta .returning(), fazemos uma nova consulta
        const novo = await connection<Relatorio>("relatorios").where({ id }).first();

        if (!novo) {
            throw new Error("Erro ao criar o relatório — não foi possível recuperar o registro criado.");
        }

        return novo;
    }

    async getRelatorioById(id: number): Promise<Relatorio | undefined> {

        return connection<Relatorio>("relatorios")
            .where({ id })
            .andWhere({ deletado: false })
            .first();
    }

    async getRelatoriosByPaciente(id_paciente: number): Promise<Relatorio[]> {

        return connection<Relatorio>("relatorios")
            .where({ id_paciente })
            .andWhere({ deletado: false })
            .orderBy("data_registro", "desc");
    }

    async updateRelatorio(id: number, data: Partial<Relatorio>): Promise<Relatorio | undefined> {

        const updateObj: Partial<Relatorio> = {};

        if (data.observacao !== undefined) updateObj.observacao = data.observacao;
        if (data.completo !== undefined) updateObj.completo = data.completo;

        await connection<Relatorio>("relatorios")
            .where({ id })
            .andWhere({ deletado: false })
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
            .andWhere({ deletado: false })
            .orderBy("data_registro", "desc");
    }

    async getRelatoriosByData(data: string): Promise<Relatorio[]> {

        return connection<Relatorio>("relatorios")
            .whereRaw("DATE(data_registro) = ?", [data])
            .andWhere({ deletado: false })
            .orderBy("data_registro", "desc")
    }

    async deleteRelatorio(
        id: number,
        solicitado_por: number,
        confirmado_por_medico: number,
        motivo_exclusao: string
    ): Promise<Relatorio | undefined> {

        await connection<Relatorio>("relatorios")
            .where({ id })
            .andWhere({ deletado: false })
            .update({
                deletado: true,
                solicitado_por,
                confirmado_por_medico,
                motivo_exclusao,
                data_exclusao: connection.fn.now()
            });
        return connection<Relatorio>("relatorios")
            .where({ id })
            .first();
    }
}