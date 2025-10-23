import { Relatorio } from "../types/relatorioTypes";
import db from '../dbConnection';

export class RelatorioData {

    async createRelatorio(data: Relatorio): Promise< Relatorio > {

        const [novo] = await db<Relatorio>("relatorio")
        .insert({
            id_paciente: data.id_paciente,
            id_agente: data.id_agente,
            observacao: data.observacao,
            completo: data.completo ?? false,
            data: db.fn.now(),
        })

        .returning(["id", "id_paciente", "id_agente", "observacao", "data as data_registro","completo"]);

        return novo;
    }

    async getRelatorioById(id: number): Promise< Relatorio | undefined >{

        return db<Relatorio>("relatorio").where({ id }).first();
    }

    async getRelatorioByPaciente(id_paciente: number): Promise< Relatorio | undefined >{

        return db<Relatorio>("relatorio")
        .where({ id_paciente })
        .orderBy("data", "desc");
    }

    async updateRelatorio(id: number, data: Partial<Relatorio>): Promise < Relatorio | undefined > {
        
        const [updated] = await db<Relatorio>("relatorio")
        .where({ id })
        .update({
            observacao: data.observacao,
            completo: data.completo,
            atualizado_em: db.fn.now(),
        })
        .returning("*");
        
        return updated;
    }

    async getRelatoriosPendentes():Promise<Relatorio[]>{

        return db<Relatorio>("relatorio")
        .where({ completo: false})
        .orderBy("data", "desc");
    }
}