require("dotenv").config();

const {
  env: { TEST_MONGODB_URL: MONGODB_URL },
} = process;
const { mongoose } = require("cook-wise-data");
const registerUser = require("./register-user");
mongoose.connect(MONGODB_URL).then(() => {
  try {
    //registerUser('Pepito', 'Grillo', 'pepigri@mail.com', '123')
    return registerUser("Menga", "Nito", "menganito2@mail.com", "123")
      .then(() => console.log("OK"))
      .catch((error) => console.error("KO async", error));
  } catch (error) {
    console.error("KO sync", error);
  }
});
