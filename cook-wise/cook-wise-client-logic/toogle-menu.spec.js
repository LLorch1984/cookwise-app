require("dotenv").config();

const {
  env: { TEST_MONGODB_URL: MONGODB_URL, API_URL, SECRET },
} = process;

const toogleMenu = require("./toogle-menu");
const { floor, random } = Math;
const { expect } = require("chai");
require("cook-wise-commons/polyfills/json");
const {
  mongoose,
  models: { User, Recipes, Ingredients },
} = require("cook-wise-data");
const bcrypt = require("bcryptjs");
const { UnexistenceError } = require("cook-wise-commons/errors");
const logic = require(".");
global.fetch = require("node-fetch");
const notAsyncStorage = require("not-async-storage");
const jwt = require("jsonwebtoken");

logic.__context__.API_URL = API_URL;
logic.__context__.storage = notAsyncStorage;

describe("toogle-menu", () => {
  const WEEKDAYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const TIMELINE = ["lunch", "dinner"];
  let name, surname, email, password, encryptedPassword, userId;
  let recipeName,
    recipeAuthor,
    description,
    time,
    ingredients = [],
    recipeId;
  let ingredientId;
  let quantity, ingredientType;
  let schedule = {};
  let user;

  before(async () => {
    await mongoose.connect(MONGODB_URL, { unifiedTopology: true });
    await Promise.all([
      User.deleteMany(),
      Recipes.deleteMany(),
      Ingredients.deleteMany(),
    ]);
  });

  beforeEach(async () => {
    name = `name-${random()}`;
    surname = `surname-${random()}`;
    email = `email-${random()}@gmail.com`;
    password = `password-${random()}`;
    encryptedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      surname,
      email,
      password,
      encryptedPassword,
    });
    userId = user.id;
    const token = jwt.sign({ sub: userId }, SECRET, { expiresIn: "1d" });
    await logic.__context__.storage.setItem("TOKEN", token);

    ingredientName = `ingredientName-${random()}`;
    const newIngredient = await Ingredients.create({ name: ingredientName });
    ingredientId = newIngredient.id;

    quantity = random();
    ingredientType = newIngredient.id;

    ingredient = { ingredient: ingredientType, quantity };

    recipeName = `recipeName-${random()}`;
    recipeAuthor = `author_${random()}`;
    description = `description-${random()}`;
    time = random();
    ingredients.push(ingredient);

    const recipe = await Recipes.create({
      name: recipeName,
      author: recipeAuthor,
      description,
      time,
      ingredients,
    });
    recipeId = recipe.id;

    await User.findByIdAndUpdate(userId, { $addToSet: { recipes: recipe } });

    weekday = WEEKDAYS[floor(random() * WEEKDAYS.length)];
    timeline = TIMELINE[floor(random() * TIMELINE.length)];
  });
  afterEach(async () => {
    await Promise.all([
      User.deleteMany(),
      Ingredients.deleteMany(),
      Recipes.deleteMany(),
      ingredients.pop(),
    ]);
  });

  it("should add day and timeline", async () => {
    await toogleMenu(weekday, timeline, recipeId);

    const user = await User.findById(userId);

    expect(user).to.exist;
    expect(user.schedule).to.exist;
    expect(user.schedule).to.be.an("array");
    expect(user.schedule.length).to.be.equal(1);

    expect(user.schedule[0].weekday).to.equal(weekday);
    expect(user.schedule[0].timeline).to.equal(timeline);
  });

  it("should remove if day and timeline exist", async () => {
    schedule = { weekday, timeline, recipe: recipeId };
    await User.findByIdAndUpdate(userId, { $addToSet: { schedule: schedule } });
    await toogleMenu(weekday, timeline, recipeId);

    const user = await User.findById(userId);

    expect(user).to.exist;
    expect(user.schedule).to.exist;
    expect(user.schedule).to.be.an("array");
    expect(user.schedule.length).to.be.equal(0);
  });

  it("shold throw an error if not match a recipe", async () => {
    await Recipes.deleteMany();

    try {
      await toogleMenu(weekday, timeline, recipeId);
    } catch (error) {
      expect(error).to.exist;
      expect(error).to.be.instanceof(Error);
      expect(error.message).to.equal(
        `recipe with id ${recipeId} does not exist`
      );
    }
  });

  it("shold throw an error if not match a user", async () => {
    await User.deleteMany();

    try {
      await toogleMenu(weekday, timeline, recipeId);
    } catch (error) {
      expect(error).to.exist;
      expect(error).to.be.instanceof(Error);
      expect(error.message).to.equal(`user with id ${userId} does not exist`);
    }
  });

  it("should throw an error if timeline its not an string", () => {
    expect(function () {
      toogleMenu(weekday, undefined, recipeId);
    }).to.throw(TypeError, "undefined is not a string");

    expect(function () {
      toogleMenu(weekday, 1, recipeId);
    }).to.throw(TypeError, "1 is not a string");

    expect(function () {
      toogleMenu(weekday, null, recipeId);
    }).to.throw(TypeError, "null is not a string");

    expect(function () {
      toogleMenu(weekday, true, recipeId);
    }).to.throw(TypeError, "true is not a string");
  });

  it("should throw an error if weekday its not an string", () => {
    expect(function () {
      toogleMenu(undefined, timeline, recipeId);
    }).to.throw(TypeError, "undefined is not a string");

    expect(function () {
      toogleMenu(1, timeline, recipeId);
    }).to.throw(TypeError, "1 is not a string");

    expect(function () {
      toogleMenu(null, timeline, recipeId);
    }).to.throw(TypeError, "null is not a string");

    expect(function () {
      toogleMenu(true, timeline, recipeId);
    }).to.throw(TypeError, "true is not a string");
  });
  it("should throw an error if weekday its not an string", () => {
    expect(function () {
      toogleMenu(weekday, timeline, undefined);
    }).to.throw(TypeError, "undefined is not a string");

    expect(function () {
      toogleMenu(weekday, timeline, 1);
    }).to.throw(TypeError, "1 is not a string");

    expect(function () {
      toogleMenu(weekday, timeline, null);
    }).to.throw(TypeError, "null is not a string");

    expect(function () {
      toogleMenu(weekday, timeline, true);
    }).to.throw(TypeError, "true is not a string");
  });

  after(mongoose.disconnect);
});
