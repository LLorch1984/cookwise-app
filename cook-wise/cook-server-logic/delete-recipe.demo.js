require("dotenv").config();

const {
  env: { MONGODB_URL },
} = process;
const { mongoose } = require("cook-wise-data");
const deleteRecipe = require("./delete-recipe");

mongoose.connect(MONGODB_URL).then(() => {
  try {
    return deleteRecipe("5ee33ccbde444833cccf146d", "5ee33cecde444833cccf146e")
      .then(() => console.log("OK"))
      .catch((error) => console.error("KO async", error));
  } catch (error) {
    console.error("KO sync", error);
  }
});
