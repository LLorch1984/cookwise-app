require("dotenv").config();

const {
  env: { MONGODB_URL },
} = process;
const { mongoose } = require("cook-wise-data");
const retrieveFavorite = require("./retrieve-recipe");

mongoose.connect(MONGODB_URL).then(() => {
  try {
    return retrieveFavorite("5edf91678e42b626f0583102")
      .then(() => console.log("OK"))
      .catch((error) => console.error("KO async", error));
  } catch (error) {
    console.error("KO sync", error);
  }
});
