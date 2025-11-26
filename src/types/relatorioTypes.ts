export interface Relatorio {

    id?: number;
    id_paciente: number;
    id_agente: number;
    observacao?: string;
    completo?: number | boolean;
    data_registro?: Date;
    deletado?: boolean;
    solicitado_por?: number | null;
    confirmado_por_medico?:number | null;
    motivo_exclusao?: string | null;
    data_exclusao?: Date | null;
    
}