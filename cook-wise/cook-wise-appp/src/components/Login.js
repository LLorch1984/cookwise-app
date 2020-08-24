import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { authenticateUser } from "cook-wise-client-logic";
import AsyncStorage from "@react-native-community/async-storage";
import Feedback from "./Feedback";

export const Login = function ({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await authenticateUser(email, password);

      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("OOPS!", error.message);
    }
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require("../../assets/background.jpg")}
    >
      <View style={styles.container}>
        <View style={styles.upContainer}>
          <View style={styles.prueba}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              defaultValue=""
              onChangeText={(val) => setEmail(val.trim())}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              defaultValue=""
              secureTextEntry={true}
              onChangeText={(val) => setPassword(val.trim())}
            />
            <TouchableOpacity style={styles.buttonwraper} onPress={handleLogin}>
              <Text style={styles.button}>Submit</Text>
            </TouchableOpacity>
            <View style={styles.message}>
              <Text style={styles.advise}>Not a member?</Text>
              <TouchableOpacity onPress={() => onShowAlert()}>
                <Text
                  style={styles.anchor}
                  onPress={() => navigation.navigate("Register")}
                >
                  Click here!
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.downContainer}></View>
      </View>
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },

  input: {
    borderWidth: 1,
    borderColor: "#0D3B66",
    padding: 8,
    margin: 10,
    width: 250,
    backgroundColor: "white",
    borderRadius: 20,
    height: 40,
  },

  background: {
    width: "100%",
    height: "100%",
  },

  upContainer: {
    flex: 0.9,
    justifyContent: "center",
    alignItems: "center",
  },

  downContainer: {
    flex: 0.1,
    flexDirection: "row",
    justifyContent: "center",
  },

  button: {
    alignSelf: "center",
    backgroundColor: "#F4D35E",
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 20,
    color: "#0D3B66",
  },

  anchor: {
    color: "red",
    paddingLeft: 10,
  },
  message: {
    flexDirection: "row",
    paddingTop: 10,
    alignSelf: "center",
  },
  advise: {
    color: "white",
  },
});
