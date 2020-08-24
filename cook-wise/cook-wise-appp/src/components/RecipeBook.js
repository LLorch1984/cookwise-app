import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  TextInput,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import { retrieveFavorites } from "cook-wise-client-logic";
import { deleteRecipe } from "cook-wise-client-logic";
import Card from "../components/Card";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { searchRecipe } from "cook-wise-client-logic";
import { toogleFavorites } from "cook-wise-client-logic";

const RecipeBook = function ({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [queryResult, setQueryResult] = useState([]);
  const [query, setQuery] = useState("");
  const [favoritesInit, setFavoritesInit] = useState([]);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    (async () => {
      const favoritesInit = await retrieveFavorites();
      setFavoritesInit(favoritesInit);
    })();
  }, [queryResult.length]);

  useEffect(() => {
    (async () => {
      const favoritesInit = await retrieveFavorites();
      setFavoritesInit(favoritesInit);
    })();
  }, [favorites]);

  const handleToogleMenu = (recipeId) => {
    navigation.navigate("schedule", { id: recipeId });
  };

  const handleGoToDetails = (recipeId) => {
    navigation.navigate("Recipe", { id: recipeId });
  };

  const handleRetrieveFavorites = async () => {
    try {
      const favorites = await retrieveFavorites();
      setQueryResult([]);
      setFavorites(favorites);
    } catch (error) {
      setError(error.message);
    }
  };
  const handleDeleteRecipe = async (recipeId) => {
    try {
      await deleteRecipe(recipeId);
      setQueryResult([]);
      if (favorites.length !== 0) {
        const favorites = await retrieveFavorites();
        setFavorites(favorites);
      }
      const results = await searchRecipe(query);
      setQueryResult(results);
    } catch (error) {
      setError(error.message);
    }
  };
  const handleSearchRecipe = async () => {
    try {
      const results = await searchRecipe(query);
      setFavorites([]);
      setQueryResult(results);
      setError();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleToogleFavorite = async (recipeId) => {

    await toogleFavorites(recipeId);
    const favoritesInit = await retrieveFavorites();
    setFavoritesInit(favoritesInit);
  };

  return (
    <>
      <KeyboardAvoidingView behavior="height" style={styles.container}>
        <View style={styles.searchbox}>
          <View style={styles.leftbox}>
            <TextInput
              style={styles.input}
              placeholder="macarrones"
              onChangeText={(val) => setQuery(val)}
            />
            <TouchableOpacity
              style={styles.buttonwraper}
              onPress={handleSearchRecipe}
            >
              <Text style={styles.button}>Search</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rigthbox}>
            <TouchableOpacity
              style={styles.retrivefavorites}
              onPress={handleRetrieveFavorites}
            >
              <Entypo name="cake" size={40} color="#0D3B66" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.downbox}>
          <ScrollView>
            {error && (
              <View style={styles.nomatcheswraper}>
                <Text style={styles.nomatches}>No matches found!</Text>
              </View>
            )}
            {queryResult.map((queryResult, index) => (
              <Card
                key={index}
                layout={styles.cardContainer}
                onToDetails={() => handleGoToDetails(queryResult.id)}
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
                      onPress={() => handleToogleMenu(queryResult.id)}
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
                            (fav) => fav.id === queryResult.id.toString()
                          ) !== "undefined"
                            ? "red"
                            : "#0D3B66"
                        }
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.retrivefavorites}
                      onPress={() => handleDeleteRecipe(queryResult.id)}
                    >
                      <FontAwesome5
                        style={styles.icon}
                        name="trash"
                        size={40}
                        color="#0D3B66"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            ))}

            {favorites.map((favorites, index) => (
              <Card
                key={index}
                layout={styles.cardContainer}
                onToDetails={() => handleGoToDetails(favorites.id)}
              >
                <View style={styles.cardRight}>
                  <Text style={styles.recipeName}>{favorites.name}</Text>
                  <Text style={styles.recipeDescription}>
                    {favorites.author}
                  </Text>
                  <Text style={styles.recipeTime}>{favorites.time}'</Text>
                </View>
                <View style={styles.cardLeft}>
                  <View style={styles.cardLeftUp}>
                    <TouchableOpacity
                      style={styles.retrivefavorites}
                      onPress={() => handleToogleMenu(favorites.id)}
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
                      onPress={() => handleToogleFavorite(favorites.id)}
                    >
                      <Entypo
                        style={styles.icon}
                        name="cake"
                        size={40}
                        color={
                          typeof favoritesInit.find(
                            (fav) => fav.id === favorites.id.toString()
                          ) !== "undefined"
                            ? "red"
                            : "#0D3B66"
                        }
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.retrivefavorites}
                      onPress={() => handleDeleteRecipe(favorites.id)}
                    >
                      <FontAwesome5
                        style={styles.icon}
                        name="trash"
                        size={40}
                        color="#0D3B66"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            ))}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default RecipeBook;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
  },

  searchbox: {
    flex: 0.3,
    flexDirection: "row",
    backgroundColor: "#FAF0CA",
    width: Dimensions.get("window").width,
    borderBottomWidth: 1,
    borderColor: "#0D3B66",
  },
  leftbox: {
    flex: 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  rigthbox: {
    flex: 0.2,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 40,
  },
  downbox: {
    flex: 0.7,
    width: Dimensions.get("window").width,
    justifyContent: "space-around",
  },
  input: {
    borderWidth: 1,
    borderColor: "#777",
    padding: 8,
    margin: 10,
    width: 230,
    backgroundColor: "white",
    borderRadius: 20,
    height: 40,
  },
  buttonwraper: {
    alignSelf: "center",
    backgroundColor: "#F4D35E",
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 20,
    height: 10,
    alignSelf: "center",
    justifyContent: "center",
    color: "#0D3B66",
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
  icon: {
    paddingBottom: 10,
    paddingRight: 10,
  },
  plus: {
    paddingBottom: 85,
    paddingRight: 35,
  },
  nomatches: {
    backgroundColor: "#0D3B66",
    height: 50,
    color: "#F4D35E",
    paddingLeft: 100,
    width: "100%",
    paddingTop: 10,
    fontSize: 20,
  },
  nomatcheswraper: {
    width: "100%",
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center",
  },
});
