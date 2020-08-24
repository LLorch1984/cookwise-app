require("dotenv").config();

const {
  env: { TEST_MONGODB_URL: MONGODB_URL },
} = process;
const { mongoose } = require("cook-wise-data");

const authenticateUser = require("./authenticate-user");

mongoose
  .connect(MONGODB_URL)
  .then(() => {

    return authenticateUser("menganito@mail.com", "123");
  })
  .then(console.log)
  .catch(console.error)
  .finally(mongoose.disconnect);
