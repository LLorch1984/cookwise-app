import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Button,
} from "react-native";
import { retrieveMenu } from "cook-wise-client-logic";
import { toogleMenu } from "cook-wise-client-logic";
import { FontAwesome5 } from "@expo/vector-icons";
import { deleteDayMenu } from "cook-wise-client-logic";
import { deleteTimeline } from "cook-wise-client-logic";
import { useFocusEffect } from "@react-navigation/native";

const Schedule = function ({ route, navigation }) {
  const WEEKDAYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState("");
  const [removal, setRemoval] = useState(false);
  let weekday, timeline, recipeId, _day;

  if (route.params) recipeId = route.params.id;

  useFocusEffect(() => {
    (async () => {
      const menu = await retrieveMenu();
      setMenu(menu);
      setLoading(false);
    })();
  }, []);

  const handleToogleDayMeal = async (recipeId, weekday, timeline) => {
    await toogleMenu(weekday, timeline, recipeId);
    const menu = await retrieveMenu();
    setMenu(menu);
  };

  const handleDeleteDay = async (day) => {
    await deleteDayMenu(day);
    const menu = await retrieveMenu();
    setMenu(menu);
    const recipes = await retrieveDay();
    setRecipes(recipes);
  };

  const handleDeleteTimeline = async (day, timeline) => {
    await deleteTimeline(day, timeline);
    const menu = await retrieveMenu();

    setMenu(menu);
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
        <TouchableOpacity
          style={styles.removalButton}
          onPress={() => setRemoval(!removal)}
        >
          <Text style={styles.removalText}>🗑️ Remove Option</Text>
        </TouchableOpacity>
        <View style={styles.schedulecontainer}>
          <View style={styles.columnDay}>
            {WEEKDAYS.map((day, index) => (
              <>
                <View key={index} style={styles.rowDay}>
                  <View style={styles.rowDayLeft}>
                    <Text style={styles.day}>
                      {day.slice(0, 3).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.rowDayRigth}>
                    <TouchableOpacity
                      style={styles.retrivefavorites}
                      onPress={() => handleDeleteDay(day)}
                    >
                      <FontAwesome5
                        style={styles.icon}
                        name="trash"
                        size={15}
                        color="#F4D35E"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            ))}
          </View>
          <View style={styles.column}>
            {WEEKDAYS.map((day, index) => (
              <>
                <TouchableOpacity
                  key={index}
                  style={styles.row}
                  onPress={() => {
                    handleToogleDayMeal(
                      recipeId,
                      (weekday = day),
                      (timeline = "lunch")
                    );
                  }}
                >
                  <View style={styles.rowRecipeLeft}>
                    {menu &&
                      menu.find(({ weekday, timeline }) => {
                        return weekday === day && timeline === "lunch";
                      }) && (
                        <>
                          <Text style={{ marginHorizontal: 5 }}>
                            {
                              menu.find(({ weekday, timeline }) => {
                                return weekday === day && timeline === "lunch";
                              }).recipe.name
                            }
                          </Text>
                        </>
                      )}
                  </View>
                  <View style={styles.rowRecipeRight}>
                    {removal &&
                      menu &&
                      menu.find(({ weekday, timeline }) => {
                        return weekday === day && timeline === "lunch";
                      }) && (
                        <>
                          <TouchableOpacity
                            style={styles.retrivefavorites}
                            onPress={() =>
                              handleDeleteTimeline(day, (timeline = "lunch"))
                            }
                          >
                            <FontAwesome5
                              style={styles.icon}
                              name="trash"
                              size={15}
                              color="#0D3B66"
                            />
                          </TouchableOpacity>
                        </>
                      )}
                  </View>
                </TouchableOpacity>
              </>
            ))}
          </View>

          <View style={styles.column}>
            {WEEKDAYS.map((day, index) => (
              <>
                <TouchableOpacity
                  key={index}
                  style={styles.row}
                  onPress={() => {
                    handleToogleDayMeal(
                      recipeId,
                      (weekday = day),
                      (timeline = "dinner")
                    );
                  }}
                >
                  <View style={styles.rowRecipeLeft}>
                    {menu &&
                      menu.find(({ weekday, timeline }) => {
                        return weekday === day && timeline === "dinner";
                      }) && (
                        <>
                          <Text style={{ marginHorizontal: 5 }}>
                            {
                              menu.find(({ weekday, timeline }) => {
                                return weekday === day && timeline === "dinner";
                              }).recipe.name
                            }
                          </Text>
                        </>
                      )}
                  </View>
                  <View style={styles.rowRecipeRight}>
                    {removal &&
                      menu &&
                      menu.find(({ weekday, timeline }) => {
                        return weekday === day && timeline === "lunch";
                      }) && (
                        <>
                          <TouchableOpacity
                            style={styles.retrivefavorites}
                            onPress={() =>
                              handleDeleteTimeline(day, (timeline = "dinner"))
                            }
                          >
                            <FontAwesome5
                              style={styles.icon}
                              name="trash"
                              size={15}
                              color="#0D3B66"
                            />
                          </TouchableOpacity>
                        </>
                      )}
                  </View>
                </TouchableOpacity>
              </>
            ))}
          </View>
        </View>
        <View style={styles.buttonbox}>
          <TouchableOpacity style={styles.buttonwraper}>
            <Text
              style={styles.button}
              onPress={() => navigation.navigate("RecipeIdeas")}
            >
              Ideas!
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonwraper}>
            <Text
              style={styles.button}
              onPress={() => navigation.navigate("Grocery")}
            >
              Grocery
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default Schedule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  schedulecontainer: {
    flex: 0.7,
    borderWidth: 1,
    borderColor: "black",
    width: "90%",
    flexDirection: "row",
    borderRadius: 20,
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
  },

  columnDay: {
    flexDirection: "column",
    flex: 0.2,
    borderRightColor: "black",
    borderWidth: 1,
    justifyContent: "center",
    backgroundColor: "#0D3B66",
  },

  column: {
    flex: 0.4,
    borderRightColor: "black",
    borderWidth: 1,
  },

  rowDay: {
    flex: 0.15,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingTop: 21,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 20,
  },
  row: {
    flex: 0.15,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  iconMenu: {
    alignSelf: "flex-end",
  },
  buttonwraper: {
    alignSelf: "center",
    backgroundColor: "#F4D35E",
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 20,
    height: 20,
    alignSelf: "center",
    justifyContent: "center",
    color: "#0D3B66",
  },
  buttonbox: {
    width: "100%",
    flexDirection: "row",
    paddingTop: 20,
    justifyContent: "space-between",
    paddingHorizontal: 7,
  },
  spinner: {
    justifyContent: "center",
    paddingTop: 250,
  },
  rowRecipeRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  icon: {
    marginHorizontal: 5,
  },
  removalButton: {
    padding: 7.5,
    backgroundColor: "#0D3B66",
    borderRadius: 10,
  },
  removalText: {
    color: "#F4D35E",
  },
  day: {
    color: "#F4D35E",
  },
});
