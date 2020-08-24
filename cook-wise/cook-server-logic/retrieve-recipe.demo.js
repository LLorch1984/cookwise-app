require("dotenv").config();

const {
  env: { MONGODB_URL },
} = process;
const { mongoose } = require("cook-wise-data");

const retrieveRecipe = require("./retrieve-recipe");

mongoose
  .connect(MONGODB_URL)
  .then(() => retrieveRecipe("5ee0fa2041ad54305ca1031d"))
  .then((recipe) => console.log(recipe))
  .catch(console.error);
