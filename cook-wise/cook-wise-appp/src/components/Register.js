import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  Dimensions,
  TouchableOpacity,
  _SectionList,
  Alert,
} from "react-native";
import { registerUser } from "cook-wise-client-logic";


export const Register = function ({ navigation }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [surname, setSurname] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      await registerUser(name, surname, email, password);
      navigation.navigate("Login");
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
        <View style={styles.upContainer}></View>

        <View style={styles.downContainer}>
          <View style={styles.prueba}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              onChangeText={(val) => setName(val.trim())}
            />

            <TextInput
              style={styles.input}
              placeholder="Surname"
              onChangeText={(val) => setSurname(val.trim())}
            />

            <TextInput
              style={styles.input}
              placeholder="Email/Username"
              onChangeText={(val) => setEmail(val.trim())}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={(val) => setPassword(val.trim())}
            />
            <TouchableOpacity
              onPress={handleRegister}
              style={styles.buttonwraper}
            >
              <Text style={styles.button}>Submit</Text>
            </TouchableOpacity>
            <View style={styles.message}>
              <Text style={styles.advise}>Have already an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.anchor}>Go to Login!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Register;

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
  downContainer: {
    flex: 0.75,
    justifyContent: "center",
    alignItems: "center",
  },

  upContainer: {
    flex: 0.25,
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
