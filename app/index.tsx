import React, { useEffect, useRef, useState } from "react";
import SplashScreen from "../app/components/SplashScreen";

import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";
import { COLORS } from "../app/constants/colors";
import { Carteira, Gasto } from "../app/types";
import { MESES } from "../app/utils/meses";
import {
  DadosPorPeriodo,
  carregarDados,
  carteirasDoPeriodo,
  chave,
  salvarDados,
} from "../app/utils/storage";

import CarteiraCard from "../app/components/CarteiraCard";
import EditarGastoModal from "../app/components/EditarGastoModal";
import ResumoCard from "../app/components/ResumoCard";

export default function Index() {
  // Todos os dados indexados por "mes-ano"
  const [dados, setDados] = useState<DadosPorPeriodo>({});

  const [modalVisible, setModalVisible] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [nomeCarteira, setNomeCarteira] = useState("");
  const [erroNome, setErroNome] = useState("");
  const [loading, setLoading] = useState(true);

  const dataAtual = new Date();
  const [mesSelecionado, setMesSelecionado] = useState(
    dataAtual.getMonth() + 1,
  );
  const [anoSelecionado, setAnoSelecionado] = useState(dataAtual.getFullYear());

  const [modalEditar, setModalEditar] = useState(false);
  const [gastoEditando, setGastoEditando] = useState<Gasto | null>(null);

  const carregouDados = useRef(false);

  // Carrega todos os dados uma vez ao iniciar
  useEffect(() => {
    async function iniciar() {
      const d = await carregarDados();
      setDados(d);
      carregouDados.current = true;
      setLoading(false);
    }
    iniciar();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Persiste sempre que os dados mudam
  useEffect(() => {
    if (carregouDados.current) {
      salvarDados(dados);
    }
  }, [dados]);

  // Carteiras do período atualmente selecionado
  const carteiras: Carteira[] = carteirasDoPeriodo(
    dados,
    mesSelecionado,
    anoSelecionado,
  );

  // Atualiza somente o período selecionado dentro do objeto global
  function setCarteiras(fn: (prev: Carteira[]) => Carteira[]) {
    setDados((prevDados) => {
      const k = chave(mesSelecionado, anoSelecionado);
      const atual = prevDados[k] ?? [];
      return { ...prevDados, [k]: fn(atual) };
    });
  }

  // Limites: apenas mês anterior e mês atual
  const mesAtualReal = dataAtual.getMonth() + 1;
  const anoAtualReal = dataAtual.getFullYear();
  const mesAnteriorReal = mesAtualReal === 1 ? 12 : mesAtualReal - 1;
  const anoAnteriorReal = mesAtualReal === 1 ? anoAtualReal - 1 : anoAtualReal;

  const podeVoltar = !(
    mesSelecionado === mesAnteriorReal && anoSelecionado === anoAnteriorReal
  );
  const podeAvancar = !(
    mesSelecionado === mesAtualReal && anoSelecionado === anoAtualReal
  );

  function mesAnterior() {
    if (!podeVoltar) return;
    if (mesSelecionado === 1) {
      setMesSelecionado(12);
      setAnoSelecionado((a) => a - 1);
    } else {
      setMesSelecionado((m) => m - 1);
    }
  }

  function proximoMes() {
    if (!podeAvancar) return;
    if (mesSelecionado === 12) {
      setMesSelecionado(1);
      setAnoSelecionado((a) => a + 1);
    } else {
      setMesSelecionado((m) => m + 1);
    }
  }

  function abrirModalCarteira() {
    setNomeCarteira("");
    setErroNome("");
    setModalVisible(true);
  }

  function fecharModalCarteira() {
    Keyboard.dismiss();
    setModalVisible(false);
    setNomeCarteira("");
    setErroNome("");
  }

  function criarCarteira() {
    if (!nomeCarteira.trim()) {
      setErroNome("Informe um nome para a carteira.");
      return;
    }

    // Duplicata verificada apenas dentro do mesmo período
    const nomeDuplicado = carteiras.some(
      (c) => c.nome.toLowerCase() === nomeCarteira.trim().toLowerCase(),
    );
    if (nomeDuplicado) {
      setErroNome("Já existe uma carteira com esse nome neste mês.");
      return;
    }

    setCarteiras((prev) => [
      ...prev,
      {
        id: Date.now(),
        nome: nomeCarteira.trim(),
        gastos: [],
        novoGastoDescricao: "",
        novoGastoValor: "",
      },
    ]);
    fecharModalCarteira();
  }

  function excluirCarteira(id: number) {
    setCarteiras((prev) => prev.filter((c) => c.id !== id));
  }

  function atualizarCampo(
    carteiraId: number,
    campo: "novoGastoDescricao" | "novoGastoValor",
    valor: string,
  ) {
    if (campo === "novoGastoValor") {
      const valorFiltrado = valor.replace(/[^0-9.,]/g, "");
      setCarteiras((prev) =>
        prev.map((c) =>
          c.id === carteiraId ? { ...c, [campo]: valorFiltrado } : c,
        ),
      );
      return;
    }
    setCarteiras((prev) =>
      prev.map((c) => (c.id === carteiraId ? { ...c, [campo]: valor } : c)),
    );
  }

  function adicionarGasto(carteiraId: number) {
    setCarteiras((prev) =>
      prev.map((c) => {
        if (c.id !== carteiraId) return c;
        if (!c.novoGastoDescricao?.trim() || !c.novoGastoValor?.trim())
          return c;

        const valorNumerico = Number(c.novoGastoValor.replace(",", "."));
        if (isNaN(valorNumerico) || valorNumerico <= 0) return c;

        return {
          ...c,
          gastos: [
            ...c.gastos,
            {
              id: Date.now(),
              descricao: c.novoGastoDescricao.trim(),
              valor: valorNumerico,
              mes: mesSelecionado,
              ano: anoSelecionado,
              criadoEm: new Date().toISOString(),
            },
          ],
          novoGastoDescricao: "",
          novoGastoValor: "",
        };
      }),
    );
  }

  function excluirGasto(carteiraId: number, gastoId: number) {
    setCarteiras((prev) =>
      prev.map((c) =>
        c.id === carteiraId
          ? { ...c, gastos: c.gastos.filter((g) => g.id !== gastoId) }
          : c,
      ),
    );
  }

  function salvarEdicao(gastoAtualizado: Gasto) {
    setCarteiras((prev) =>
      prev.map((carteira) => ({
        ...carteira,
        gastos: carteira.gastos.map((gasto) =>
          gasto.id === gastoAtualizado.id ? gastoAtualizado : gasto,
        ),
      })),
    );
    setModalEditar(false);
    setGastoEditando(null);
  }

  // Totais do período — calculados direto das carteiras já filtradas
  const totalGeral = carteiras.reduce(
    (total, c) => total + c.gastos.reduce((s, g) => s + g.valor, 0),
    0,
  );

  const totalDespesas = carteiras.reduce(
    (total, c) => total + c.gastos.length,
    0,
  );

  if (showSplash) return <SplashScreen />;

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingTop: 60,
          paddingBottom: 120,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Header: logomarca ── */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View>
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
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 34,
                color: "#C9A84C",
                letterSpacing: -0.5,
                lineHeight: 38,
              }}
            >
              Finance
            </Text>
          </View>

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
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 28,
                color: "#FFFFFF",
                letterSpacing: -0.5,
              }}
            >
              Tale
            </Text>
          </View>
        </View>

        <Text style={{ color: COLORS.textLight, marginTop: 4 }}>
          Controle suas despesas
        </Text>

        {/* Navegação de mês */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 14,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <TouchableOpacity
              onPress={mesAnterior}
              disabled={!podeVoltar}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: podeVoltar
                  ? COLORS.primary + "22"
                  : COLORS.primary + "0A",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: podeVoltar ? COLORS.primary : COLORS.textLight,
                  fontWeight: "700",
                  fontSize: 16,
                }}
              >
                ‹
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                color: COLORS.textLight,
                fontWeight: "600",
                minWidth: 110,
                textAlign: "center",
              }}
            >
              {MESES[mesSelecionado - 1]} {anoSelecionado}
            </Text>

            <TouchableOpacity
              onPress={proximoMes}
              disabled={!podeAvancar}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: podeAvancar
                  ? COLORS.primary + "22"
                  : COLORS.primary + "0A",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: podeAvancar ? COLORS.primary : COLORS.textLight,
                  fontWeight: "700",
                  fontSize: 16,
                }}
              >
                ›
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.push("/historico")}>
            <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
              Histórico
            </Text>
          </TouchableOpacity>
        </View>

        {/* Resumo — valores já são do período selecionado */}
        <ResumoCard
          totalGeral={totalGeral}
          totalCarteiras={carteiras.length}
          totalDespesas={totalDespesas}
        />

        {/* Carteiras do período */}
        {carteiras.length === 0 ? (
          <View style={{ marginTop: 40, alignItems: "center", opacity: 0.5 }}>
            <Text style={{ fontSize: 40 }}>👛</Text>
            <Text
              style={{
                color: COLORS.textLight,
                marginTop: 12,
                textAlign: "center",
                fontSize: 15,
              }}
            >
              Nenhuma carteira criada.{"\n"}Toque em + para começar.
            </Text>
          </View>
        ) : (
          carteiras.map((carteira) => {
            const totalCarteira = carteira.gastos.reduce(
              (soma, gasto) => soma + gasto.valor,
              0,
            );
            return (
              <CarteiraCard
                key={carteira.id}
                carteira={carteira}
                totalCarteira={totalCarteira}
                gastosFiltrados={carteira.gastos}
                atualizarCampo={atualizarCampo}
                adicionarGasto={adicionarGasto}
                excluirGasto={excluirGasto}
                excluirCarteira={excluirCarteira}
                editarGasto={(gasto) => {
                  setGastoEditando(gasto);
                  setModalEditar(true);
                }}
              />
            );
          })
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        onPress={abrirModalCarteira}
        style={{
          position: "absolute",
          right: 25,
          bottom: 30,
          width: 65,
          height: 65,
          borderRadius: 40,
          backgroundColor: COLORS.primary,
          justifyContent: "center",
          alignItems: "center",
          elevation: 8,
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
        }}
      >
        <Text style={{ color: "#FFF", fontSize: 32, lineHeight: 36 }}>+</Text>
      </TouchableOpacity>

      {/* Modal — Nova Carteira */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <Pressable
            style={{
              flex: 1,
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.45)",
              padding: 24,
            }}
            onPress={fecharModalCarteira}
          >
            <Pressable
              onPress={() => {}}
              style={{ backgroundColor: "#FFF", borderRadius: 20, padding: 24 }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "700",
                  color: COLORS.secondary,
                }}
              >
                Nova Carteira
              </Text>
              <Text
                style={{ color: COLORS.textLight, marginTop: 4, fontSize: 13 }}
              >
                Dê um nome para sua carteira
              </Text>

              <TextInput
                placeholder="Ex: Nubank, Carteira física..."
                placeholderTextColor={COLORS.textLight}
                value={nomeCarteira}
                onChangeText={(t) => {
                  setNomeCarteira(t);
                  if (erroNome) setErroNome("");
                }}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={criarCarteira}
                style={{
                  borderWidth: 1.5,
                  borderColor: erroNome ? "#E53935" : COLORS.border,
                  borderRadius: 12,
                  padding: 13,
                  marginTop: 16,
                  fontSize: 15,
                  color: COLORS.secondary,
                }}
              />

              {erroNome ? (
                <Text style={{ color: "#E53935", fontSize: 12, marginTop: 6 }}>
                  {erroNome}
                </Text>
              ) : null}

              <View style={{ flexDirection: "row", gap: 10, marginTop: 18 }}>
                <TouchableOpacity
                  onPress={fecharModalCarteira}
                  style={{
                    flex: 1,
                    padding: 14,
                    borderRadius: 12,
                    borderWidth: 1.5,
                    borderColor: COLORS.border,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: COLORS.textLight, fontWeight: "600" }}>
                    Cancelar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={criarCarteira}
                  style={{
                    flex: 1,
                    backgroundColor: COLORS.primary,
                    padding: 14,
                    borderRadius: 12,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#FFF", fontWeight: "700" }}>
                    Criar
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal — Editar Gasto */}
      <EditarGastoModal
        visible={modalEditar}
        gasto={gastoEditando}
        onClose={() => {
          setModalEditar(false);
          setGastoEditando(null);
        }}
        onSalvar={salvarEdicao}
      />
    </View>
  );
}
