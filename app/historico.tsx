import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "./constants/colors";
import { Gasto } from "./types";
import { MESES } from "./utils/meses";
import {
  DadosPorPeriodo,
  carregarDados,
  carteirasDoPeriodo,
} from "./utils/storage";

interface MesAno {
  mes: number;
  ano: number;
}

function obterUltimosDoisMeses(): MesAno[] {
  const agora = new Date();
  const mesAtual = agora.getMonth() + 1;
  const anoAtual = agora.getFullYear();
  const mesAnterior = mesAtual === 1 ? 12 : mesAtual - 1;
  const anoAnterior = mesAtual === 1 ? anoAtual - 1 : anoAtual;
  return [
    { mes: mesAnterior, ano: anoAnterior },
    { mes: mesAtual, ano: anoAtual },
  ];
}

function formatarValor(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Historico() {
  const [dados, setDados] = useState<DadosPorPeriodo>({});
  const meses = obterUltimosDoisMeses();

  useEffect(() => {
    async function carregar() {
      const d = await carregarDados();
      setDados(d);
    }
    carregar();
  }, []);

  function gastosDoMes(mes: number, ano: number): Gasto[] {
    const carteiras = carteirasDoPeriodo(dados, mes, ano);
    return carteiras.flatMap((c) => c.gastos ?? []);
  }

  function totalDoMes(mes: number, ano: number): number {
    return gastosDoMes(mes, ano).reduce((s, g) => s + g.valor, 0);
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingTop: 60,
          paddingBottom: 60,
        }}
      >
        {/* Voltar */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginBottom: 6 }}
        >
          <Text
            style={{
              color: COLORS.primary,
              fontSize: 15,
              fontFamily: "Inter_600SemiBold",
            }}
          >
            ← Voltar
          </Text>
        </TouchableOpacity>

        {/* Card do desenvolvedor */}
        <TouchableOpacity
          onPress={() => router.push("/sobre")}
          activeOpacity={0.85}
          style={{
            backgroundColor: "#FFF",
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: COLORS.border,
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            marginBottom: 28,
          }}
        >
          {/* Avatar */}
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "#212559",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#C9A84C",
                fontSize: 15,
                fontFamily: "Inter_700Bold",
              }}
            >
              IE
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 14,
                color: COLORS.secondary,
              }}
            >
              Itallo Edward
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: COLORS.textLight,
                marginTop: 2,
              }}
            >
              Desenvolvedor do FinanceTale
            </Text>
          </View>

          <Text style={{ color: COLORS.textLight, fontSize: 18 }}>›</Text>
        </TouchableOpacity>

        {/* Título */}
        <Text
          style={{
            fontSize: 28,
            fontFamily: "Inter_700Bold",
            color: COLORS.secondary,
          }}
        >
          Histórico
        </Text>
        <Text
          style={{
            color: COLORS.textLight,
            fontFamily: "Inter_400Regular",
            marginTop: 4,
            fontSize: 13,
          }}
        >
          Últimos 2 meses de gastos
        </Text>

        {/* Blocos por mês */}
        {meses.map(({ mes, ano }) => {
          const gastos = gastosDoMes(mes, ano);
          const total = totalDoMes(mes, ano);

          return (
            <View key={`${mes}-${ano}`} style={{ marginTop: 28 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    fontFamily: "Inter_700Bold",
                    color: COLORS.secondary,
                  }}
                >
                  {MESES[mes - 1]} {ano}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "Inter_600SemiBold",
                    color: COLORS.primary,
                  }}
                >
                  {formatarValor(total)}
                </Text>
              </View>

              {gastos.length === 0 ? (
                <View
                  style={{
                    backgroundColor: "#FFF",
                    borderRadius: 12,
                    padding: 16,
                    alignItems: "center",
                    opacity: 0.6,
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.textLight,
                      fontFamily: "Inter_400Regular",
                      fontSize: 14,
                    }}
                  >
                    Nenhum gasto registrado neste mês.
                  </Text>
                </View>
              ) : (
                gastos.map((gasto) => (
                  <View
                    key={gasto.id}
                    style={{
                      backgroundColor: "#FFF",
                      borderRadius: 12,
                      padding: 14,
                      marginBottom: 8,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: "Inter_600SemiBold",
                          fontSize: 14,
                          color: COLORS.secondary,
                        }}
                      >
                        {gasto.descricao}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Inter_400Regular",
                          fontSize: 12,
                          color: COLORS.textLight,
                          marginTop: 2,
                        }}
                      >
                        {new Date(gasto.criadoEm).toLocaleDateString("pt-BR")}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontFamily: "Inter_700Bold",
                        fontSize: 15,
                        color: COLORS.primary,
                      }}
                    >
                      {formatarValor(gasto.valor)}
                    </Text>
                  </View>
                ))
              )}
            </View>
          );
        })}

        {/* Rodapé */}
        <View
          style={{
            marginTop: 36,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
            paddingTop: 20,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: COLORS.textLight,
              fontFamily: "Inter_400Regular",
              fontSize: 13,
              textAlign: "center",
              opacity: 0.7,
            }}
          >
            📅 Histórico com mais meses disponível em futuras atualizações.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
