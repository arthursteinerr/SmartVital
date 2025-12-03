import { connection } from "../dbConnection";
import { Relatorio } from "../types/relatorioTypes";

// POST Relatorio
export const createRelatorio = async (data: Relatorio): Promise<Relatorio> => {

    const [id] = await connection<Relatorio>("relatorios")
        .insert({
            id_paciente: data.id_paciente,
            id_agente: data.id_agente,
            observacao: data.observacao,
            completo: data.completo ?? false,
            deletado: false,
            data_registro: connection.fn.now(),
        });

    // Como o MySQL não suporta .returning(), fazemos uma nova consulta
    const novo = await connection<Relatorio>("relatorios").where({ id }).first();

    if (!novo) {
        throw new Error("Erro ao criar o relatório — não foi possível recuperar o registro criado.");
    }

    return novo;
}

// GET Por ID
export const getRelatorioById = async (id: number): Promise<Relatorio | undefined> => {

    const rel = await connection<Relatorio>("relatorios")
        .where({ id })
        .first();

    if (!rel) return undefined;

    return {
        ...rel,
        deletado: rel.deletado === 1 || rel.deletado === true
    };
};

// GET Por Paciente
export const getRelatoriosByPaciente = async (id_paciente: number): Promise<Relatorio[]> => {

    return connection<Relatorio>("relatorios")
        .where({ id_paciente })
        .andWhere({ deletado: false })
        .orderBy("data_registro", "desc");
}

// PATCH Paciente
export const updateRelatorio = async (
    id: number,
    data: Partial<Relatorio>
): Promise<Relatorio | undefined> => {

    const updateObj: any = {};

    if (data.observacao !== undefined) updateObj.observacao = data.observacao;
    if (data.completo !== undefined) updateObj.completo = data.completo ? 1 : 0;

    await connection<Relatorio>("relatorios")
        .where({ id })
        .andWhere({ deletado: false })
        .update({
            ...updateObj,
            data_registro: connection.fn.now(),
        })

    // Altercao devido ao MySql não suportar o .returning(), por isso, fazemos uma nova consulta
    const updated = await connection<Relatorio>("relatorios").where({ id }).first();

    if (!updated) return undefined;

    // AQUI fazemos a conversão reversa tinyint -> boolean
    return {
        ...updated,
        completo: updated.completo === 1
    }
}

// GET Por Pendentes
export const getRelatoriosPendentes = async (): Promise<Relatorio[]> => {

    return connection<Relatorio>("relatorios")
        .where({ completo: false })
        .andWhere({ deletado: false })
        .orderBy("data_registro", "desc");
}

// GET por Data
export const getRelatoriosByData = async (data: string): Promise<Relatorio[]> => {

    return connection<Relatorio>("relatorios")
        .whereRaw("DATE(data_registro) = ?", [data])
        .andWhere({ deletado: false })
        .orderBy("data_registro", "desc")
}

// DELETE Relatorio
export const deleteRelatorio = async (
    id: number,
    solicitado_por: number,
    confirmado_por_medico: number,
    motivo_exclusao: string
): Promise<Relatorio | undefined> => {

    const existing = await connection<Relatorio>("relatorios")
        .where({ id })
        .andWhere({ deletado: false })
        .first();

    if (!existing) return undefined;

    await connection<Relatorio>("relatorios")
        .where({ id })
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