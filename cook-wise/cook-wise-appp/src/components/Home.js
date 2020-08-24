import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { retrieveDay } from "cook-wise-client-logic";
import Card from "../components/Card";
import { Entypo } from "@expo/vector-icons";
import "cook-wise-commons/polyfills/string.prototype.to-proper-case";
import { useFocusEffect } from "@react-navigation/native";

function Home({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [day, setDay] = useState("");
  const [loading, setLoading] = useState(true);

  useFocusEffect(() => {
    (async () => {

      const { result, day } = await retrieveDay();
      setDay(day);
      setRecipes(result);
      setLoading(false);
    })();
  }, []);

  const handleGoToDetails = (recipeId) => {
    navigation.navigate("Recipe", { id: recipeId });
  };

  if (loading)
    return (
      <View style={styles.spinner}>
        <ActivityIndicator size="large" color="#0D3B66" />
      </View>
    );
  return (
    <>
      <View style={styles.container}>
        <View style={styles.dayContainer}>
          {day ? <Text style={styles.day}>{day.toProperCase()}</Text> : null}
        </View>
        <View style={styles.downContainer}>
          {recipes.length ? (
            recipes.map((recipe, index) => (
              <Card
                key={index}
                style={styles.cardContainer}
                onToDetails={() => handleGoToDetails(recipe.id)}
              >
                <View style={styles.cardUp}>
                  <Text style={styles.recipeName}>{recipe.name}</Text>
                  <Entypo
                    style={styles.icon}
                    name="cake"
                    size={24}
                    color="#0D3B66"
                  />
                </View>
                <View style={styles.cardDown}>
                  <Text style={styles.recipeDescription}>
                    {recipe.description}
                  </Text>
                  <Text style={styles.recipeTime}>{recipe.time}'</Text>
                </View>
              </Card>
            ))
          ) : (
            <Text style={styles.error}>Not recipes yet, add some!!</Text>
          )}
        </View>
      </View>
    </>
  );
}
export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get("window").height,
    paddingHorizontal: 15,
  },
  day: {
    fontSize: 50,
    color: "#0D3B66",
  },
  icon: {
    paddingRight: 10,
    color: "#0D3B66",
  },
  cardUp: {
    borderBottomWidth: 1,
    borderColor: "#0D3B66",
    paddingVertical: 10,
    paddingLeft: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardDown: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  cardContainer: {
    flex: 1,
  },
  dayContainer: {
    flex: 0.25,
    justifyContent: "center",
    alignItems: "center",
    color: "#0D3B66",
  },
  downContainer: {
    flex: 0.75,
    justifyContent: "space-evenly",
  },
  recipeName: {
    fontSize: 20,
    color: "#0D3B66",
  },
  recipeDescription: {
    fontSize: 15,
  },
  recipeTime: {
    fontSize: 20,
    marginTop: 80,
    color: "#0D3B66",
  },
  spinner: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 250,
  },
  error: {
    fontSize: 20,
    paddingLeft: 35,
    paddingBottom: 100,
  },
});
