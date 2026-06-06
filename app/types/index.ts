export type Gasto = {
  id: number;
  descricao: string;
  valor: number;
  mes: number;
  ano: number;
  criadoEm: string;
  atualizadoEm?: string;
};

export type Carteira = {
  id: number;
  nome: string;
  gastos: Gasto[];
  novoGastoDescricao?: string;
  novoGastoValor?: string;
};
