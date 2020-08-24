require("dotenv").config();

const {
  env: { MONGODB_URL },
} = process;
const { mongoose } = require("cook-wise-data");
const toogleRecipe = require("./toogle-favorite");

mongoose.connect(MONGODB_URL).then(() => {
  try {
    return toogleRecipe("5edf91678e42b626f0583102", "5edf91768e42b626f0583103")
      .then(() => console.log("OK"))
      .catch((error) => console.error("KO async", error));
  } catch (error) {
    console.error("KO sync", error);
  }
});
