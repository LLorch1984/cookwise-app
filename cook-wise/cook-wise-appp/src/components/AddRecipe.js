import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Picker,
} from "react-native";
import React, { useState } from "react";
import { addRecipe } from "cook-wise-client-logic";
import { ScrollView } from "react-native-gesture-handler";

const AddRecipe = function () {
  const [time, setTime] = useState("");
  const [ingredientsQuantityArray, setIngredientsQuantityArray] = useState([]);
  const [description, setDescription] = useState("");
  const [authorRecipe, setAuthorRecipe] = useState("");
  const [nameRecipe, setNameRecipe] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedQuantity, setSelectedQuantity] = useState([]);
  const [ingredient, setIngredients] = useState();
  const [added, setAdded] = useState(false);
  const [selectedValue, setSelectedValue] = useState([]);
  const [timeRef, setTimeRef] = useState("");
  const [nameRecipeRef, setNameRecipeRef] = useState("");
  const [authorRecipeRef, setAuthorRecipeRef] = useState("");
  const [quantityRef, setQuantityRef] = useState("");
  const [descRef, setDescRef] = useState("");

  const __handleAdded__ = function () {
    setTimeout(() => {
      setAdded(false);
    }, 2500);
  };

  handleAddRecipe = async () => {
    try {
      await addRecipe(
        nameRecipe,
        authorRecipe,
        description,
        time,
        ingredientsQuantityArray
      );

      setIngredientsQuantityArray([]);
      setAuthorRecipe("");
      setDescription("");
      descRef.clear();
      authorRecipeRef.clear();
      timeRef.clear();
      nameRecipeRef.clear();
      setTime("");
    } catch (error) {
      Alert.alert("OOPS!", error.message);
    }
  };

  handleIngredients = () => {
    setSelectedValue(selectedValue);
    setSelectedQuantity(selectedQuantity);
    setIngredientsQuantityArray([
      ...ingredientsQuantityArray,
      { selectedValue, selectedQuantity },
    ]);
    setAdded(true);
    __handleAdded__();
    quantityRef.clear();
  };

  return (
    <KeyboardAvoidingView behavior="position">
      <ScrollView>
        <View style={{ margin: 30 }}>
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text style={{ fontSize: 30, paddingBottom: 20 }}>Add Recipie</Text>
          </View>
          <View>
            <Picker
              selectedValue={selectedValue}
              style={{ height: 50, width: 150 }}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValue(itemValue)
              }
            >
              <Picker.Item label="Potatos" value="potatos" />
              <Picker.Item label="Vanilla" value="vanilla" />
              <Picker.Item label="Panther" value="panther" />
              <Picker.Item label="Rice" value="rice" />
              <Picker.Item label="Beans" value="beans" />
              <Picker.Item label="Bananas" value="bananas" />
              <Picker.Item label="Garlic" value="garlic" />
              <Picker.Item label="Cucumber" value="cucumber" />
              <Picker.Item label="Tomato" value="tomato" />
              <Picker.Item label="Cinnamon" value="cinammon" />
              <Picker.Item label="Pasta" value="pasta" />
              <Picker.Item label="Tofu" value="tofu" />
              <Picker.Item label="Tempe" value="tempe" />
              <Picker.Item label="Peas" value="peas" />
              <Picker.Item label="Chickpea" value="chickpea" />
              <Picker.Item label="Lentils" value="lentils" />
              <Picker.Item label="Onion" value="onion" />
              <Picker.Item label="Milk" value="milk" />
              <Picker.Item label="Cardamom" value="cardamom" />
              <Picker.Item label="Flour" value="flour" />
            </Picker>
          </View>
          <View style={styles.quantityBox}>
            <TextInput
              placeholder="Quantity"
              defaultValue=""
              onChangeText={(val) => setSelectedQuantity(val)}
              ref={(input) => setQuantityRef(input)}
            />
          </View>
          <TouchableOpacity
            style={styles.buttonwraper}
            onPress={handleIngredients}
          >
            <Text style={styles.button}>Add</Text>
          </TouchableOpacity>
          {added && (
            <Text>
              {selectedQuantity}g of {selectedValue} added!
            </Text>
          )}
          <View style={styles.namesBox}>
            <TextInput
              placeholder="Time"
              defaultValue=""
              onChangeText={(val) => setTime(val)}
              ref={(input) => setTimeRef(input)}
            />
          </View>

          <View style={styles.namesBox}>
            <TextInput
              placeholder="Name"
              defaultValue=""
              onChangeText={(val) => setNameRecipe(val)}
              ref={(input) => setNameRecipeRef(input)}
            />
          </View>

          <View style={styles.namesBox}>
            <TextInput
              placeholder="Author"
              defaultValue=""
              onChangeText={(val) => setAuthorRecipe(val)}
              ref={(input) => setAuthorRecipeRef(input)}
            />
          </View>

          <View style={styles.descriptionBox}>
            <TextInput
              placeholder="Description"
              onChangeText={(val) => setDescription(val)}
              ref={(input) => setDescRef(input)}
            />
          </View>
          <TouchableOpacity
            style={styles.buttonwraper}
            onPress={handleAddRecipe}
          >
            <Text style={styles.button}>Add Recipie</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default AddRecipe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  quantityBox: {
    borderBottomColor: "#cfcfcf",
    borderBottomWidth: 1,
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
  namesBox: {
    borderBottomColor: "#cfcfcf",
    borderBottomWidth: 1,
    paddingTop: 10,
  },
  descriptionBox: {
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#0D3B66",
    padding: 8,
    margin: 10,
    width: 250,
    backgroundColor: "white",
    borderRadius: 20,
    height: 150,
  },
});
