import React from "react";

import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/colors";
import { Carteira, Gasto } from "../types";
type Props = {
  carteira: Carteira;

  totalCarteira: number;

  gastosFiltrados: Gasto[];

  atualizarCampo: (
    carteiraId: number,
    campo: "novoGastoDescricao" | "novoGastoValor",
    valor: string,
  ) => void;

  adicionarGasto: (carteiraId: number) => void;

  excluirGasto: (carteiraId: number, gastoId: number) => void;

  excluirCarteira: (id: number) => void;

  editarGasto: (gasto: Gasto) => void;
};

export default function CarteiraCard({
  carteira,
  totalCarteira,
  gastosFiltrados,
  atualizarCampo,
  adicionarGasto,
  excluirGasto,
  excluirCarteira,
  editarGasto,
}: Props) {
  return (
    <View
      style={{
        backgroundColor: "#FFF",
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: "700",
          color: COLORS.secondary,
        }}
      >
        {carteira.nome}
      </Text>

      <Text
        style={{
          fontSize: 26,
          fontWeight: "700",
          color: COLORS.primary,
          marginTop: 10,
        }}
      >
        R$ {totalCarteira.toFixed(2)}
      </Text>

      <TextInput
        placeholder="Descrição"
        value={carteira.novoGastoDescricao}
        onChangeText={(text) =>
          atualizarCampo(carteira.id, "novoGastoDescricao", text)
        }
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
        value={carteira.novoGastoValor}
        onChangeText={(text) =>
          atualizarCampo(carteira.id, "novoGastoValor", text)
        }
        style={{
          borderWidth: 1,
          borderColor: COLORS.border,
          borderRadius: 12,
          padding: 12,
          marginTop: 10,
        }}
      />

      <TouchableOpacity
        onPress={() => adicionarGasto(carteira.id)}
        style={{
          backgroundColor: COLORS.primary,
          padding: 14,
          borderRadius: 12,
          marginTop: 12,
        }}
      >
        <Text
          style={{
            color: "#FFF",
            textAlign: "center",
            fontWeight: "600",
          }}
        >
          Adicionar Gasto
        </Text>
      </TouchableOpacity>

      {gastosFiltrados.map((gasto) => (
        <View
          key={gasto.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 15,
          }}
        >
          <Text>{gasto.descricao}</Text>

          <View
            style={{
              flexDirection: "row",
              gap: 10,
            }}
          >
            <TouchableOpacity onPress={() => editarGasto(gasto)}>
              <Text>✏️</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => excluirGasto(carteira.id, gasto.id)}
            >
              <Text
                style={{
                  color: COLORS.danger,
                }}
              >
                🗑️
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                color: COLORS.primary,
                fontWeight: "600",
              }}
            >
              R$ {gasto.valor.toFixed(2)}
            </Text>
          </View>
        </View>
      ))}

      <TouchableOpacity
        onPress={() => excluirCarteira(carteira.id)}
        style={{
          marginTop: 20,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: COLORS.danger,
          }}
        >
          Excluir Carteira
        </Text>
      </TouchableOpacity>
    </View>
  );
}
