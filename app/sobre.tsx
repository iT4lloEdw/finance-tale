import {
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "./constants/colors";

const REDES = [
  {
    label: "GitHub",
    url: "https://github.com/it4lloedw/",
    icon: "{ }",
  },
  {
    label: "LinkedIn",
    url: "https://linkedin.com/in/itallo-edward/",
    icon: "in",
  },
];

export default function Sobre() {
  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        paddingTop: 60,
        paddingBottom: 60,
      }}
      style={{ flex: 1, backgroundColor: COLORS.background }}
    >
      {/* Card do desenvolvedor */}
      <View
        style={{
          backgroundColor: "#FFF",
          borderRadius: 20,
          padding: 24,
          borderWidth: 1,
          borderColor: COLORS.border,
          alignItems: "center",
        }}
      >
        {/* Avatar inicial */}
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: "#212559",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <Text
            style={{
              color: "#C9A84C",
              fontSize: 28,
              fontFamily: "Inter_700Bold",
            }}
          >
            IE
          </Text>
        </View>

        <Text
          style={{
            fontFamily: "Inter_700Bold",
            fontSize: 20,
            color: COLORS.secondary,
          }}
        >
          Itallo Edward
        </Text>

        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 13,
            color: COLORS.textLight,
            marginTop: 4,
          }}
        >
          Desenvolvedor do FinanceTale
        </Text>

        {/* Redes sociais */}
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            marginTop: 20,
          }}
        >
          {REDES.map((rede) => (
            <TouchableOpacity
              key={rede.label}
              onPress={() => Linking.openURL(rede.url)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: COLORS.border,
                backgroundColor: COLORS.background,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 11,
                  color: COLORS.primary,
                }}
              >
                {rede.icon}
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 13,
                  color: COLORS.secondary,
                }}
              >
                {rede.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Versão */}
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 12,
            color: COLORS.textLight,
            marginTop: 20,
            opacity: 0.6,
          }}
        >
          App em desenvolvimento • v1.0
        </Text>
      </View>
    </ScrollView>
  );
}
