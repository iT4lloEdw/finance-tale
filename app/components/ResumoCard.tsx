import { Text, View } from "react-native";
import { COLORS } from "../constants/colors";

type Props = {
  totalGeral: number;
  totalCarteiras: number;
  totalDespesas: number;
};

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
        }}
      >
        RESUMO GERAL
      </Text>

      <Text
        style={{
          color: "#FFF",
          fontSize: 34,
          fontWeight: "700",
          marginTop: 10,
        }}
      >
        R$ {totalGeral.toFixed(2)}
      </Text>

      <Text
        style={{
          color: "#FFF",
          marginTop: 10,
        }}
      >
        {totalCarteiras} Carteiras • {totalDespesas} Despesas
      </Text>
    </View>
  );
}
