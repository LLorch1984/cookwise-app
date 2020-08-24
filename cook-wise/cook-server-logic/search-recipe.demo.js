require("dotenv").config();

const {
  env: { MONGODB_URL },
} = process;
const { mongoose } = require("cook-wise-data");
const searchRecipe = require("./search-recipe");

mongoose.connect(MONGODB_URL).then(() => {
  try {
    return searchRecipe("alex", "5ede123507c905341ce3a634")
      .then(() => console.log("OK"))
      .catch((error) => console.error("KO async", error));
  } catch (error) {
    console.error("KO sync", error);
  }
});
