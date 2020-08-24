require("dotenv").config();

const {
  env: { TEST_MONGODB_URL: MONGODB_URL },
} = process;

const groceryList = require("./grocery-list");
const { random } = Math;
const { expect } = require("chai");
require("cook-wise-commons/polyfills/json");
const {
  mongoose,
  models: { User, Recipes, Ingredients },
} = require("cook-wise-data");
const bcrypt = require("bcryptjs");
const { UnexistenceError } = require("cook-wise-commons/errors");

describe("grocery list", () => {
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

    recipeName = `recipeName-${random()}`;
    recipeAuthor = `author_${random()}`;
    description = `description-${random()}`;
    time = random();
    ingredients.push(ingredient);

    const recipeTwo = await Recipes.create({
      name: recipeName,
      author: recipeAuthor,
      description,
      time,
      ingredients,
    });
    recipeIdTwo = recipeTwo.id;

    await User.findByIdAndUpdate(userId, { $addToSet: { recipes: recipe } });

    schedule.weekday = "monday";
    schedule.timeline = "lunch";
    schedule.recipe = recipeId;

    user.schedule.push(schedule);

    schedule.weekday = "monday";
    schedule.timeline = "dinner";
    schedule.recipe = recipeIdTwo;

    user.schedule.push(schedule);

    schedule.weekday = "tuesday";
    schedule.timeline = "lunch";
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

  it("should organize the grocery list without repeat any ingredient", async () => {
    const result = await groceryList(userId);

    expect(result).to.exist;
    expect(result).to.be.an("array");
    expect(result.length).to.be.greaterThan(0);
  });

  it("should return an empty array if not schudle in the user", async () => {
    await User.findByIdAndUpdate(userId, { $set: { schedule: [] } });

    const result = await groceryList(userId);

    expect(result).to.exist;
    expect(result).to.be.an("array");
    expect(result.length).to.equal(0);
    /* for (let pos of array) {
            array.filter(string => string === pos).length > 1 && return true;
          }
        
          return false; */
  });

  it("shold throw an error if not match a user", async () => {
    await User.deleteMany();

    try {
      await groceryList(userId);
    } catch (error) {
      expect(error).to.exist;
      expect(error).to.be.instanceof(UnexistenceError);
      expect(error.message).to.equal(`user with id ${userId} does not exist`);
    }
  });

  it("should throw an error if userId its not an string", () => {
    expect(function () {
      groceryList(undefined);
    }).to.throw(TypeError, "undefined is not a string");

    expect(function () {
      groceryList(1);
    }).to.throw(TypeError, "1 is not a string");

    expect(function () {
      groceryList(null);
    }).to.throw(TypeError, "null is not a string");

    expect(function () {
      groceryList(true);
    }).to.throw(TypeError, "true is not a string");
  });

  after(async () => {
    await Promise.all([
      User.deleteMany(),
      Ingredients.deleteMany(),
      Recipes.deleteMany(),
    ]);
    await mongoose.disconnect();
  });
});
