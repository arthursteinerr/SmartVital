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

    async listarPorData(data: string): Promise<Relatorio[]> {
        
        if(!/^\d{2}\/\d{2}\/\d{4}$/.test(data)){
            throw new Error("Formatação da 'data' inválido. Use o formato DD/MM/YYYY.")
        }
        
        // Convertendo a data do padrao brasileiro DD/MM/YYYY para o usado no banco de dados YYYY/MM/DD
        const [dia, mes, ano] = data.split("/");
        const dataFormatada = `${ano}-${mes}-${dia}`;

        const relatorios = await relatorioData.getRelatoriosByData(dataFormatada);
        return relatorios;
    }

    async excluirRelatorio(
        id: number,
        solicitado_por: number,
        confirmado_por_medico: number,
        motivo_exclusao: string
    ): Promise<void> {

        if(!solicitado_por || confirmado_por_medico) {
            throw new Error("Campos 'solicitado_por' e 'confirmado_por_medico' são obrigatorios.")
        }
        if(!motivo_exclusao || motivo_exclusao.trim(). length < 30) {
            throw new Error("O campo motivo_exclusao é obrigatorio e deve conter no minimo 30 caracteres.")
        }

        const relatorioExistente = await relatorioData.getRelatorioById(id);
        if(!relatorioExistente) {
            throw new Error("Relatorio não encontrado.");
        }

        await relatorioData.deleteRelatorio(id, solicitado_por, confirmado_por_medico, motivo_exclusao);
    }
}