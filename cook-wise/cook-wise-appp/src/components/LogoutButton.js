import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity, Styles, StyleSheet } from "react-native";
import { logout } from "cook-wise-client-logic";

export default function ({ navigation }) {
  const handleLogout = async () => {
    await logout();

    await navigation.navigate("Landing");
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.logout}>
      <MaterialCommunityIcons name="logout-variant" size={24} color="#0D3B66" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  logout: {
    marginRight: 20,
  },
});
