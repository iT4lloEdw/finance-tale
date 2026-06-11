import AsyncStorage from "@react-native-async-storage/async-storage";
import { Carteira } from "../types";

const STORAGE_KEY = "@financetale_v2";

export type DadosPorPeriodo = Record<string, Carteira[]>;

export function chave(mes: number, ano: number): string {
  return `${mes}-${ano}`;
}

export async function salvarDados(dados: DadosPorPeriodo): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
  } catch (error) {
    console.log("Erro ao salvar dados:", error);
  }
}

export async function carregarDados(): Promise<DadosPorPeriodo> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return {};
    }

    return JSON.parse(raw) as DadosPorPeriodo;
  } catch (error) {
    console.log("Erro ao carregar dados:", error);
    return {};
  }
}

export function carteirasDoPeriodo(
  dados: DadosPorPeriodo,
  mes: number,
  ano: number,
): Carteira[] {
  return dados[chave(mes, ano)] ?? [];
}
