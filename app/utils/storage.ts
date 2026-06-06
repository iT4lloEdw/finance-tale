import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@financetale_v2";

// Estrutura: { "mes-ano": Carteira[] }
// Cada período é completamente independente.
export type DadosPorPeriodo = Record<string, any[]>;

export function chave(mes: number, ano: number): string {
  return `${mes}-${ano}`;
}

export async function salvarDados(dados: DadosPorPeriodo): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
  } catch (error) {
    console.log(error);
  }
}

export async function carregarDados(): Promise<DadosPorPeriodo> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.log(error);
    return {};
  }
}

// Retorna as carteiras de um período específico
export function carteirasDoPeriodo(
  dados: DadosPorPeriodo,
  mes: number,
  ano: number,
): any[] {
  return dados[chave(mes, ano)] ?? [];
}
