import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Logomarca Finance Tale */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Bloco "Finance" com seta acima */}
          <View>
            {/* Seta com os mesmos valores do index */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: -6,
                marginLeft: 2,
              }}
            >
              <View
                style={{ flex: 0.11, height: 1.5, backgroundColor: "#C9A84C" }}
              />
              <Text
                style={{
                  fontSize: 7,
                  color: "#C9A84C",
                  lineHeight: 12,
                  marginLeft: -1,
                }}
              >
                ▶
              </Text>
            </View>

            {/* "Finance" dourado */}
            <Text style={styles.logoDourado}>Finance</Text>
          </View>

          {/* "Tale" com fundo menor, centralizado com Finance */}
          <View
            style={{
              marginLeft: 8,
              backgroundColor: "#212559",
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 0,
              alignSelf: "center",
              marginTop: 10,
            }}
          >
            <Text style={styles.logoBranco}>Tale</Text>
          </View>
        </View>

        {/* Subtítulo */}
        <Text style={styles.subtitle}>
          Suas finanças de forma simplificada.
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    alignItems: "center",
  },

  logoDourado: {
    fontFamily: "Inter_700Bold",
    fontSize: 58,
    color: "#C9A84C",
    letterSpacing: -1,
    lineHeight: 66,
  },

  logoBranco: {
    fontFamily: "Inter_700Bold",
    fontSize: 48,
    color: "#FFFFFF",
    letterSpacing: -1,
  },

  subtitle: {
    marginTop: 24,
    color: "#212559",
    textAlign: "center",
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    opacity: 0.65,
    letterSpacing: 0.2,
  },
});
