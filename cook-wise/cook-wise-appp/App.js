import React, { useState } from "react";
import StackNavigator from "./routes/landingStack";
import logic from "cook-wise-client-logic";
import AsyncStorage from "@react-native-community/async-storage";
import { API_URL } from "./config";
import { AppLoading } from "expo";
import * as Font from "expo-font";

logic.__context__.storage = AsyncStorage;
logic.__context__.API_URL = API_URL;

console.disableYellowBox = true;

module.exports = () => {
  const [isLoading, setIsLoading] = useState(true);

  const getFonts = () =>
    Font.loadAsync({
      montserrat: require("./assets/fonts/Montserrat-Regular.ttf"),
      shadow: require("./assets/fonts/ShadowsIntoLight-Regular.ttf"),
    });

  if (isLoading)
    return (
      <AppLoading
        startAsync={getFonts}
        onError={({ message }) => console.log(message)}
        onFinish={() => setIsLoading(false)}
      />
    );

  if (!isLoading) return <StackNavigator />;
};
