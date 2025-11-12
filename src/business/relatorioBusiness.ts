import {
    createRelatorio,
    getRelatorioById,
    getRelatoriosByPaciente,
    updateRelatorio,
    getRelatoriosPendentes,
    getRelatoriosByData,
    deleteRelatorio
} from "../data/relatorioData";
import { Relatorio } from "../types/relatorioTypes";

// POST Relatorio
export const criarRelatorioBusiness = async (input: Relatorio) => {
    try {

        if (!input.id_paciente || !input.id_paciente) {
            return {
                success: false,
                message: "Campos obrigatórios: id_paciente e id_agente."
            };
        }

        const novoRelatorio = await createRelatorio(input);

        return { success: true, data: novoRelatorio };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};

// GET Relatorio por ID
export const buscarPorIdBusiness = async (id: number) => {
    try {

        const relatorio = await getRelatorioById(id);

        if (!relatorio) {
            return {
                success: false,
                message: "Relatorio não encontrado!"
            };
        }

        return { success: true, data: relatorio };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};

// GET Relatorio por paciente
export const listarPorPacienteBusiness = async (id_paciente: number) => {
    try {

        const relatorios = await getRelatoriosByPaciente(id_paciente);

        return { success: true, data: relatorios };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};

// PATCH Relatorio
export const atualizarBusiness = async (id: number, data: Partial<Relatorio>) => {
    try {

        const relatorioExiste = await getRelatorioById(id);

        if (!relatorioExiste) {
            return {
                success: false,
                message: "Relatorio não encontrado."
            };
        }

        const atualizado = await updateRelatorio(id, data);

        return { success: true, data: atualizado };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};

// GET Relatorios Pendentes
export const listarPendentesBusiness = async () => {
    try {

        const relatorios = await getRelatoriosPendentes();

        return { success: true, data: relatorios }
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};

// GET Relatorios por Data
export const listarPorDataBusiness = async (data: string) => {
    try {

        if (!data) {
            return {
                success: false,
                message: "Parâmetro 'data' é obrigatório no formato DD-MM-YYYY."
            };
        }

        const match = data.match(/^(\d{2})-(\d{2})-(\d{4})$/);

        if (!match) {
            return {
                success: false,
                message: "Formato de data inválido. Use DD-MM-YYYY."
            };
        }

        // Convertendo a data do padrao brasileiro DD-MM-YYYY para o usado no banco de dados YYYY-MM-DD
        const [dia, mes, ano] = data.split("-");
        const dataFormatada = `${ano}-${mes}-${dia}`;

        const relatorios = await getRelatoriosByData(dataFormatada);
        return { success: true, data: relatorios };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};

// DELETE Relatorio
export const excluirRelatorioBusiness = async (
    id: number,
    solicitado_por: number,
    confirmado_por_medico: number,
    motivo_exclusao: string
) => {
    try {
        if (solicitado_por === undefined || confirmado_por_medico === undefined) {
            return {
                success: false,
                message: "Campos 'solicitado_por' e 'confirmado_por_medico' são obrigatorios."
            };
        }

        if (!motivo_exclusao || motivo_exclusao.trim().length < 30) {
            return {
                success: false,
                message: "O campo motivo_exclusao é obrigatorio e deve conter no minimo 30 caracteres."
            };
        }

        const relatorioExistente = await getRelatorioById(id);
        if (!relatorioExistente) {
            return {
                success: false,
                message: "Relatorio não encontrado."
            };
        }

        await deleteRelatorio(id, solicitado_por, confirmado_por_medico, motivo_exclusao);

        return { success: true, data: relatorioExistente };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};