import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Style,
  ImageBackground,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { retrieveRecipe } from "cook-wise-client-logic";
import { Entypo } from "@expo/vector-icons";

function Recipe({ route }) {
  const { id: recipeId } = route.params;
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const recipe = await retrieveRecipe(recipeId);
      setRecipe(recipe);
      setLoading(false);
    })();
  }, []);

  if (loading) return <Text>Esperate chaval</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.cardUp}>
          <Text style={styles.recipeName}>{recipe.name}</Text>
          <Entypo style={styles.icon} name="cake" size={40} color="#0D3B66" />
        </View>
        <View style={styles.cardMid}>
          <View style={styles.timewrapper}>
            <AntDesign
              style={styles.iconTime}
              name="clockcircleo"
              size={40}
              color="black"
            />
            <Text style={styles.time}>{recipe.time}</Text>
          </View>
        </View>
        <View style={styles.cardDown}>
          <Text style={styles.author}>
            Author: <Text style={{ fontSize: 20 }}>{recipe.author}</Text>
          </Text>
          <Text style={styles.recipeDescription}>
            Description:{" "}
            <Text style={{ fontSize: 20 }}>{recipe.description}</Text>
          </Text>
        </View>
        <View style={styles.ingredientscontainer}>
          <Text style={styles.ingredientHeader}>Ingredients:</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredients}>
              {ingredient.ingredient} {ingredient.quantity}g
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}
export default Recipe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get("window").height,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    flex: 0.9,
    borderRadius: 6,
    elevation: 3,
    backgroundColor: "#F4D35E",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    width: "90%",
  },
  cardUp: {
    borderBottomWidth: 1,
    borderColor: "#0D3B66",
    paddingVertical: 10,
    paddingLeft: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    paddingRight: 10,
    color: "#0D3B66",
  },
  recipeName: {
    fontSize: 25,
    color: "#0D3B66",
  },
  iconTime: {
    paddingRight: 10,
    color: "#0D3B66",
    paddingTop: 10,
  },
  cardMid: {
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  time: {
    fontSize: 25,
    color: "#0D3B66",
  },
  timewrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  author: {
    fontSize: 25,
    color: "#0D3B66",
    paddingLeft: 10,
    paddingTop: 10,
  },
  recipeDescription: {
    fontSize: 25,
    color: "#0D3B66",
    paddingLeft: 10,
    paddingTop: 10,
  },
  ingredientHeader: {
    fontSize: 25,
    color: "#0D3B66",
    paddingLeft: 10,
    paddingTop: 10,
  },
  ingredients: {
    fontSize: 15,
    color: "#0D3B66",
    paddingLeft: 10,
    paddingTop: 10,
  },
});
