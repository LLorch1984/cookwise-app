import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

export default function Card({ onToDetails, children, layout }) {
  return (
    <TouchableOpacity onPress={onToDetails}>
      <View style={{ ...layout, ...styles.card }}>{children}</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    width: "100%",
    elevation: 3,
    backgroundColor: "#F4D35E",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    height: 200,
  },
});
