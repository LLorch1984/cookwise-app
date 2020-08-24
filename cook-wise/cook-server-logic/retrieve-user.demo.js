require("dotenv").config();

const {
  env: { MONGODB_URL },
} = process;
const { mongoose } = require("../data");

const retrieveUser = require("./retrieve-user");

mongo
  .connect(MONGODB_URL)
  .then(() => retrieveUser("1590156394031-0.29786867989032717"))
  .then(console.log)
  .catch(console.error);
