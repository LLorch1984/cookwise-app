require("dotenv").config();

const {
  env: { MONGODB_URL },
} = process;
const { mongoose } = require("cook-wise-data");

const retriveDay = require("./retrive-day");

mongoose
  .connect(MONGODB_URL)
  .then(() => retriveDay("tuesday", "5ee10df88a1e593aa8ad02f0"))
  .then((schedule) => console.log(schedule))
  .catch(console.error);
