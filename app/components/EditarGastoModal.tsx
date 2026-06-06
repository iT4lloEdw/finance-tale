import React, { useEffect, useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

import { COLORS } from "../constants/colors";
import { Gasto } from "../types";
import { MESES } from "../utils/meses";

type Props = {
  visible: boolean;
  gasto: Gasto | null;
  onClose: () => void;
  onSalvar: (gasto: Gasto) => void;
};

export default function EditarGastoModal({
  visible,
  gasto,
  onClose,
  onSalvar,
}: Props) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [mes, setMes] = useState(1);
  const [ano, setAno] = useState(new Date().getFullYear());

  // Limites: mês anterior e mês atual (espelha a navegação da tela principal)
  const dataAtual = new Date();
  const mesAtualReal = dataAtual.getMonth() + 1;
  const anoAtualReal = dataAtual.getFullYear();
  const mesAnteriorReal = mesAtualReal === 1 ? 12 : mesAtualReal - 1;
  const anoAnteriorReal = mesAtualReal === 1 ? anoAtualReal - 1 : anoAtualReal;

  // Pode voltar até o mês anterior real
  const podeVoltar = !(mes === mesAnteriorReal && ano === anoAnteriorReal);
  // Pode avançar até o mês atual real
  const podeAvancar = !(mes === mesAtualReal && ano === anoAtualReal);

  useEffect(() => {
    if (gasto) {
      setDescricao(gasto.descricao);
      setValor(String(gasto.valor));
      setMes(gasto.mes);
      setAno(gasto.ano);
    }
  }, [gasto]);

  function navegarMes(direcao: "anterior" | "proximo") {
    if (direcao === "anterior") {
      if (!podeVoltar) return;
      if (mes === 1) {
        setMes(12);
        setAno((a) => a - 1);
      } else {
        setMes((m) => m - 1);
      }
    } else {
      if (!podeAvancar) return;
      if (mes === 12) {
        setMes(1);
        setAno((a) => a + 1);
      } else {
        setMes((m) => m + 1);
      }
    }
  }

  function salvar() {
    if (!gasto) return;
    const valorNumerico = Number(valor.replace(",", "."));
    if (!descricao.trim() || isNaN(valorNumerico) || valorNumerico <= 0) return;

    onSalvar({
      ...gasto,
      descricao: descricao.trim(),
      valor: valorNumerico,
      mes,
      ano,
      atualizadoEm: new Date().toISOString(),
    });
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.4)",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "#FFF",
            borderRadius: 20,
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "700",
              color: COLORS.secondary,
            }}
          >
            Editar Gasto
          </Text>

          <TextInput
            placeholder="Descrição"
            value={descricao}
            onChangeText={setDescricao}
            style={{
              borderWidth: 1,
              borderColor: COLORS.border,
              borderRadius: 12,
              padding: 12,
              marginTop: 15,
            }}
          />

          <TextInput
            placeholder="Valor"
            keyboardType="numeric"
            value={valor}
            onChangeText={setValor}
            style={{
              borderWidth: 1,
              borderColor: COLORS.border,
              borderRadius: 12,
              padding: 12,
              marginTop: 10,
            }}
          />

          {/* Navegação de mês com limites */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 15,
              borderWidth: 1,
              borderColor: COLORS.border,
              borderRadius: 12,
              padding: 12,
            }}
          >
            <TouchableOpacity
              onPress={() => navegarMes("anterior")}
              disabled={!podeVoltar}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text
                style={{
                  color: podeVoltar ? COLORS.primary : COLORS.textLight,
                  fontSize: 18,
                  fontWeight: "700",
                }}
              >
                ◀
              </Text>
            </TouchableOpacity>

            <Text style={{ color: COLORS.secondary, fontWeight: "600" }}>
              {MESES[mes - 1]} {ano}
            </Text>

            <TouchableOpacity
              onPress={() => navegarMes("proximo")}
              disabled={!podeAvancar}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text
                style={{
                  color: podeAvancar ? COLORS.primary : COLORS.textLight,
                  fontSize: 18,
                  fontWeight: "700",
                }}
              >
                ▶
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={salvar}
            style={{
              backgroundColor: COLORS.primary,
              padding: 14,
              borderRadius: 12,
              marginTop: 20,
            }}
          >
            <Text
              style={{
                color: "#FFF",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Salvar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={{ marginTop: 10 }}>
            <Text
              style={{
                textAlign: "center",
                color: COLORS.danger,
              }}
            >
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
