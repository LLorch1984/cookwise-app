import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions, BackHandler } from "react-native";
import { groceryList } from "cook-wise-client-logic";

function GroceryList({ navigation }) {
  const [grocery, setGrocery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const grocery = await groceryList();
      setGrocery(grocery);
      setLoading(false);
    })();
  }, []);

  if (loading) return <Text>esperate chaval</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.grocery}>
        <View style={styles.cardUp}>
          <Text style={styles.title}>GROCERY</Text>
        </View>
        <View style={styles.cardDown}>
          {grocery.map((item, index) => (
            <Text key={index} style={styles.ingredients}>
              {item.name}: {item.quantity}g
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}
export default GroceryList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  grocery: {
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
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
  },
  cardDown: {
    alignItems: "center",
    justifyContent: "center",
  },
  cardDownLeft: {
   
  },
  cardDownRigth: {
    flex: 0.5,
   
  },
  ingredients: {
    fontSize: 18,
    paddingTop: 5,
    fontFamily: "shadow",
    fontSize: 30,
  },
});
