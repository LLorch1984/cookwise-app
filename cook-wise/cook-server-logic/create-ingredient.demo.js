require("dotenv").config();

const {
  env: { TEST_MONGODB_URL: MONGODB_URL },
} = process;
const { mongoose } = require("cook-wise-data");
const createIngredient = require("./create-ingredient");
mongoose.connect(MONGODB_URL).then(() => {
  try {
    return createIngredient("onion")
      .then(() => console.log("OK"))
      .catch((error) => console.error("KO async", error));
  } catch (error) {
    console.error("KO sync", error);
  }
});
