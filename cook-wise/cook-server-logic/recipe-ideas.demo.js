require("dotenv").config();

const {
  env: { MONGODB_URL },
} = process;
const { mongoose } = require("cook-wise-data");
const recipeIdeas = require("./recipe-ideas");

mongoose.connect(MONGODB_URL).then(() => {
  try {
    return recipeIdeas("5ee10df88a1e593aa8ad02f0", [
      "patatoes",
      "lenties",
      "chocolate",
    ])
      .then(() => console.log("OK"))
      .catch((error) => console.error("KO async", error));
  } catch (error) {
    console.error("KO sync", error);
  }
});
