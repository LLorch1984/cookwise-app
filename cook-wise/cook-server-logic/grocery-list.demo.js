require("dotenv").config();

const {
  env: { MONGODB_URL },
} = process;
const { mongoose } = require("cook-wise-data");
const groceryList = require("./grocery-list");

mongoose.connect(MONGODB_URL).then(() => {
  try {
    return groceryList("5ee10df88a1e593aa8ad02f0")
      .then(() => console.log("OK"))
      .catch((error) => console.error("KO async", error));
  } catch (error) {
    console.error("KO sync", error);
  }
});
