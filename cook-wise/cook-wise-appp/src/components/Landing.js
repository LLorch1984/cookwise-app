import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { isLoggedIn } from "cook-wise-client-logic";
import { retrieveUser } from "cook-wise-client-logic";

export const Landing = function ({ navigation }) {
  const [user, setUser] = useState();

  useEffect(() => {
    (async () => {
      if (await isLoggedIn()) {
        const user = await retrieveUser();
        setUser(user);
        navigation.navigate("Home");
      }
    })();
  }, []);

  return (
    <>
      <ImageBackground
        source={require("../../assets/background.jpg")}
        style={{ width: "100%", height: "100%" }}
      >
        <View style={styles.container}>
          <View style={styles.upContainer}>
            <View style={styles.imageContainer}></View>
          </View>

          <View style={styles.downContainer}>
            <View style={styles.downLeftContainer}>
              <TouchableOpacity style={styles.buttonwraper}>
                <Text
                  onPress={() => navigation.navigate("Register")}
                  style={styles.button}
                >
                  Register
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.downRightContainer}>
              <TouchableOpacity>
                <Text
                  onPress={() => navigation.navigate("Login")}
                  style={styles.button}
                >
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

export default Landing;

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },

  logo: {
    height: "50%",
    width: "50%",
    resizeMode: "contain",
    alignSelf: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
  },
  upContainer: {
    flex: 0.75,
    justifyContent: "center",
  },
  downContainer: {
    flex: 0.25,
    flexDirection: "row",
    justifyContent: "center",
  },

  downLeftContainer: {
    flex: 0.5,
    justifyContent: "center",
  },
  downRightContainer: {
    flex: 0.5,
    justifyContent: "center",
  },
  button: {
    alignSelf: "center",
    backgroundColor: "#F4D35E",
    paddingVertical: 20,
    paddingHorizontal: 50,
    color: "#0D3B66",
    borderRadius: 10,
  },
});
