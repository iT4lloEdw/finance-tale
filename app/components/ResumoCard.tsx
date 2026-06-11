import { Text, View } from "react-native";
import { COLORS } from "../constants/colors";

type Props = {
  totalGeral: number;
  totalCarteiras: number;
  totalDespesas: number;
};

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function ResumoCard({
  totalGeral,
  totalCarteiras,
  totalDespesas,
}: Props) {
  return (
    <View
      style={{
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        padding: 20,
        marginVertical: 20,
      }}
    >
      <Text
        style={{
          color: "#FFF",
          opacity: 0.8,
          fontFamily: "Inter_600SemiBold",
          fontSize: 12,
          letterSpacing: 0.8,
        }}
      >
        RESUMO GERAL
      </Text>

      <Text
        style={{
          color: "#FFF",
          fontSize: 34,
          fontFamily: "Inter_700Bold",
          marginTop: 10,
        }}
      >
        {formatarMoeda(totalGeral)}
      </Text>

      <Text
        style={{
          color: "#FFF",
          marginTop: 10,
          fontFamily: "Inter_400Regular",
        }}
      >
        {totalCarteiras} Carteiras • {totalDespesas} Despesas
      </Text>
    </View>
  );
}
