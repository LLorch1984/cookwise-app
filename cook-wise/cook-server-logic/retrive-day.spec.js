require("dotenv").config();

const {
  env: { TEST_MONGODB_URL: MONGODB_URL },
} = process;

const retriveDay = require("./retrive-day");
const { floor, random } = Math;
const { expect } = require("chai");
require("cook-wise-commons/polyfills/json");
const {
  mongoose,
  models: { User, Recipes, Ingredients },
} = require("cook-wise-data");
const bcrypt = require("bcryptjs");
const {
  DuplicityError,
  UnexistenceError,
} = require("cook-wise-commons/errors");

describe("retrieve day", () => {
  let name, surname, email, password, encryptedPassword, userId;
  let recipeName,
    recipeAuthor,
    description,
    time,
    ingredients = [],
    recipeId;
  let weekday;
  let ingridient, ingredientId;
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

    schedule.weekday = "monday";
    schedule.timeline = "lunch";
    schedule.recipe = recipeId;

    user.schedule.push(schedule);

    schedule.weekday = "monday";
    schedule.timeline = "dinner";
    schedule.recipe = recipeId;

    user.schedule.push(schedule);

    await user.save();

    weekday = "monday";
  });
  afterEach(async () => {
    await Promise.all([
      User.deleteMany(),
      Ingredients.deleteMany(),
      Recipes.deleteMany(),
      ingredients.pop(),
    ]);
  });

  it("should find the recipes of the day that you are searching if the day its full", async () => {
    const result = await retriveDay(weekday, userId);

    expect(result).to.exist;
    expect(result).to.be.an("array");
    expect(result.length).to.equal(2);
    result.forEach((meal) => {
      expect(meal.name).to.exist;
      expect(meal.author).to.exist;
      expect(meal.description).to.exist;
      expect(meal.ingredients).to.exist;
      expect(meal.time).to.exist;
    });
  });

  it("should find the recipe of the day that you are searching if only have one", async () => {
    user.schedule[0].weekday = "tuesday";
    await user.save();
    const result = await retriveDay(weekday, userId);

    expect(result).to.exist;
    expect(result).to.be.an("array");
    expect(result.length).to.equal(1);
    result.forEach((meal) => {
      expect(meal.name).to.exist;
      expect(meal.author).to.exist;
      expect(meal.description).to.exist;
      expect(meal.ingredients).to.exist;
      expect(meal.time).to.exist;
    });
  });
  it("it must return an empty array if no matches found", async () => {
    await User.findByIdAndUpdate(userId, { $set: { schedule: [] } });

    const result = await retriveDay(weekday, userId);

    expect(result).to.exist;
    expect(result).to.be.an("array");
    expect(result.length).to.equal(0);
  });

  it("shold throw an error if not match a recipe", async () => {
    await Recipes.deleteMany();

    try {
      await retriveDay(weekday, userId);
    } catch (error) {
      expect(error).to.exist;
      expect(error).to.be.instanceof(UnexistenceError);
      expect(error.message).to.equal(
        `recipe with id ${recipeId} does not exist`
      );
    }
  });

  it("shold throw an error if not match a user", async () => {
    await User.deleteMany();

    try {
      await retriveDay(weekday, userId);
    } catch (error) {
      expect(error).to.exist;
      expect(error).to.be.instanceof(UnexistenceError);
      expect(error.message).to.equal(`user with id ${userId} does not exist`);
    }
  });
  it("should throw an error if userId its not an string", () => {
    expect(function () {
      retriveDay(weekday, undefined);
    }).to.throw(TypeError, "undefined is not a string");

    expect(function () {
      retriveDay(weekday, 1);
    }).to.throw(TypeError, "1 is not a string");

    expect(function () {
      retriveDay(weekday, null);
    }).to.throw(TypeError, "null is not a string");

    expect(function () {
      retriveDay(weekday, true);
    }).to.throw(TypeError, "true is not a string");
  });
  it("should throw an error if weekday its not an string", () => {
    expect(function () {
      retriveDay(undefined, userId);
    }).to.throw(TypeError, "undefined is not a string");

    expect(function () {
      retriveDay(1, userId);
    }).to.throw(TypeError, "1 is not a string");

    expect(function () {
      retriveDay(null, userId);
    }).to.throw(TypeError, "null is not a string");

    expect(function () {
      retriveDay(true, userId);
    }).to.throw(TypeError, "true is not a string");
  });

  after(mongoose.disconnect);
});
