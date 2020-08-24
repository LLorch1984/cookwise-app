import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Picker,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Dimensions,
} from "react-native";
import { recipeSearchIdeas } from "cook-wise-client-logic";
import { retrieveFavorites } from "cook-wise-client-logic";
import Card from "../components/Card";
import { Entypo } from "@expo/vector-icons";
import { toogleFavorites } from "cook-wise-client-logic";

export default function RecipeIdeas({ navigation }) {
  const [array, setArray] = useState([]);
  const [ingredients, setIngredients] = useState("");
  const [recipeIdeas, setRecipeIdeas] = useState([]);
  const [favoritesInit, setFavoritesInit] = useState([]);

  useEffect(() => {
    (async () => {
      const favoritesInit = await retrieveFavorites();
      setFavoritesInit(favoritesInit);
    })();
  }, [recipeIdeas]);

  const handleToogleMenu = (recipeId) => {
    navigation.navigate("schedule", { id: recipeId });
  };

  const handleGoToDetails = (recipeId) => {
    navigation.navigate("Recipe", { id: recipeId });
  };

  useEffect(() => {}, []);

  const handleIngredient = function () {
    setArray([...array, ingredients]);
  };

  const handleToogleFavorite = async (recipeId) => {
    await toogleFavorites(recipeId);
    const favoritesInit = await retrieveFavorites();
    setFavoritesInit(favoritesInit);
  };

  const handleOnSearch = async (ing) => {
    const recipeFind = await recipeSearchIdeas(ing);
    setRecipeIdeas(recipeFind);
    setArray([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.ingredients}>
        <View style={styles.cardUp}>
          <View style={styles.cardUpLeft}>
            <TextInput
              style={styles.input}
              placeholder="e.g. Mcarrones"
              defaultValue=""
              onChangeText={(val) => setIngredients(val)}
            ></TextInput>
            <TouchableOpacity style={styles.addbutton}>
              <Text style={styles.button} onPress={handleIngredient}>
                Add
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardUpRigth}>
            <View style={styles.ingredientsBox}>
              {array &&
                array.map((item, index) => (
                  <Text style={styles.textbox} key={index}>
                    {item}
                  </Text>
                ))}
            </View>
            <TouchableOpacity style={styles.buttonwraper}>
              <Text style={styles.button} onPress={() => handleOnSearch(array)}>
                Search
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView>
          {recipeIdeas &&
            recipeIdeas.map((queryResult, index) => (
              <Card
                key={index}
                layout={styles.cardContainer}
                onToDetails={() => handleGoToDetails(queryResult._id)}
              >
                <View style={styles.cardRight}>
                  <Text style={styles.recipeName}>{queryResult.name}</Text>
                  <Text style={styles.recipeDescription}>
                    {queryResult.author}
                  </Text>
                  <Text style={styles.recipeTime}>{queryResult.time}'</Text>
                </View>
                <View style={styles.cardLeft}>
                  <View style={styles.cardLeftUp}>
                    <TouchableOpacity
                      style={styles.retrivefavorites}
                      onPress={() => handleToogleMenu(queryResult._id)}
                    >
                      <Entypo
                        style={styles.plus}
                        name="plus"
                        size={50}
                        color="#0D3B66"
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.cardLeftDown}>
                    <TouchableOpacity
                      style={styles.retrivefavorites}
                      onPress={() => handleToogleFavorite(queryResult.id)}
                    >
                      <Entypo
                        style={styles.icon}
                        name="cake"
                        size={40}
                        color={
                          typeof favoritesInit.find(
                            (fav) => fav.id === queryResult._id.toString()
                          ) !== "undefined"
                            ? "red"
                            : "#0D3B66"
                        }
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  downbox: {
    flex: 0.7,
    width: Dimensions.get("window").width,
    justifyContent: "space-around",
  },
  buttonwraper: {
    alignSelf: "center",
    backgroundColor: "#F4D35E",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    height: 20,
    alignSelf: "center",
    justifyContent: "center",
    color: "#0D3B66",
  },
  input: {
    marginTop: 80,
    margin: 10,
    width: 150,
    backgroundColor: "white",
    borderRadius: 20,
    height: 40,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    elevation: 3,
    paddingLeft: 10,
  },

  cardUp: {
    backgroundColor: "#FAF0CA",
    borderBottomColor: "#0D3B66",
    borderBottomWidth: 1,
    flexDirection: "row",
    height: 270,
  },
  cardUpRigth: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
  },
  cardUpLeft: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  ingredientsBox: {
    borderRadius: 6,
    width: 100,
    elevation: 3,
    backgroundColor: "white",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    height: 100,
  },
  cardContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "blue",
    margin: 10,
  },
  cardRight: {
    flex: 0.7,
    justifyContent: "space-between",
  },
  cardLeft: {
    flex: 0.3,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  cardLeftDown: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingRight: 10,
  },
  recipeName: {
    paddingTop: 10,
    fontSize: 30,
    color: "#0D3B66",
    paddingLeft: 10,
  },
  recipeDescription: {
    paddingTop: 10,
    fontSize: 30,
    color: "#0D3B66",
    paddingLeft: 10,
  },
  recipeTime: {
    paddingTop: 10,
    fontSize: 30,
    color: "#0D3B66",
    paddingLeft: 10,
  },

  plus: {
    paddingBottom: 85,
    paddingRight: 35,
  },
  addbutton: {
    alignSelf: "center",
    backgroundColor: "#F4D35E",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    height: 20,
    alignSelf: "center",
    justifyContent: "center",
    color: "#0D3B66",
    marginTop: 40,
  },
  button: {
    color: "#0D3B66",
  },
  textbox: {
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
});
