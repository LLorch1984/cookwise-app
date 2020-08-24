require("dotenv").config();

const {
  env: { MONGODB_URL },
} = process;
const { mongoose } = require("cook-wise-data");

const toogleMenu = require("./toogle-menu-day");

mongoose
  .connect(MONGODB_URL)
  .then(() =>
    toogleMenu("5ee0b1e52d612c2144824b36", {
      weekday: "monday",
      timeline: "lunch",
    })
  )
  .then((recipe) => console.log(recipe))
  .catch(console.error);
