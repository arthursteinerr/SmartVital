import { RelatorioData } from "../data/relatorioData";
import { Relatorio } from "../types/relatorioTypes";

const relatorioData = new RelatorioData();

export class RelatorioBusiness {

    async criarRelatorio(input: Relatorio): Promise<Relatorio> {

        if (!input.id_paciente || !input.id_paciente) {
            throw new Error("Campos obrigatorios: id_paciente e id_agente");
        }
        return await relatorioData.createRelatorio(input);
    }

    async buscarPorId(id: number): Promise<Relatorio> {

        const relatorio = await relatorioData.getRelatorioById(id);

        if (!relatorio) throw new Error("Relatorio não encontrado!");

        return relatorio;
    }

    async listarPorPaciente(id_paciente: number): Promise<Relatorio[]> {

        return await relatorioData.getRelatoriosByPaciente(id_paciente);
    }

    async atualizar(id: number, data: Partial<Relatorio>): Promise<Relatorio> {

        const relatorio = await relatorioData.updateRelatorio(id, data);

        if(!relatorio) throw new Error("Relatorio não encontrado.");
        return relatorio;
    }

    async listarPendentes(): Promise<Relatorio[]> {

        return await relatorioData.getRelatoriosPendentes();
    }
}