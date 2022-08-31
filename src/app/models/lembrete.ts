export interface Lembretes extends Array<Lembrete>{}

export interface Lembrete {
  titulo: string;
  conteudo: string;
  prioridade: string;
}
export interface LembreteApi {
  payload: Lembretes;
}

export enum PrioridadeReceber {
  baixa = 'Baixa',
  media = 'Média',
  alta = 'Alta'
};


export enum PrioridadeEnviar {
  'Baixa' = 'baixa',
  'Média' = 'media',
  'Alta' = 'baixa'
};
