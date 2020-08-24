require("dotenv").config();

const {
  env: { TEST_MONGODB_URL: MONGODB_URL, API_URL, SECRET },
} = process;

const toogleFavorites = require("./toogle-favorites");
const { random } = Math;
const { expect } = require("chai");
require("cook-wise-commons/polyfills/json");
const {
  mongoose,
  models: { User, Recipes, Ingredients },
} = require("cook-wise-data");
const bcrypt = require("bcryptjs");
const logic = require(".");
global.fetch = require("node-fetch");
const notAsyncStorage = require("not-async-storage");
const jwt = require("jsonwebtoken");

logic.__context__.API_URL = API_URL;
logic.__context__.storage = notAsyncStorage;

describe("favorite-recipes", () => {
  let name, surname, email, password, encryptedPassword, userId;
  let recipeName,
    recipeAuthor,
    description,
    time,
    ingredients = [],
    recipeId;
  let quantity, ingredientType;
  let query;
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
  });
  afterEach(async () => {
    await Promise.all([
      User.deleteMany(),
      Ingredients.deleteMany(),
      Recipes.deleteMany(),
      ingredients.pop(),
    ]);
  });

  it("should put the id of your favorite recipes", async () => {
    const result = await toogleFavorites(recipeId);

    let _user = await User.findById(userId);

    expect(_user.favoriterecipes).to.exist;
    expect(_user.favoriterecipes).to.be.instanceof(Array);
    expect(_user.favoriterecipes.length).to.be.equal(1);
    expect(_user.favoriterecipes[0].toString()).to.equal(recipeId);
  });

  it("should splice a favoriterecipe if already exist", async () => {
    await toogleFavorites(recipeId);

    const resultuntoogle = await toogleFavorites(recipeId);

    let _user = await User.findById(userId);

    expect(_user.favoriterecipes).to.exist;
    expect(_user.favoriterecipes).to.be.instanceof(Array);
    expect(_user.favoriterecipes.length).to.be.equal(0);
  });

  it(`should throw an error if user doesn't exist`, async () => {
    await User.deleteMany();

    let _error;
    try {
      await toogleFavorites(recipeId);
    } catch (error) {
      _error = error;
    }

    expect(_error).to.exist;
    expect(_error).to.be.instanceof(Error);
    expect(_error.message).to.equal(`user with id ${userId} does not exist`);
  });
  it(`should throw an error if recipe didn't exist`, async () => {
    await Recipes.deleteMany();

    let _error;
    try {
      await toogleFavorites(recipeId);
    } catch (error) {
      _error = error;
    }

    expect(_error).to.exist;
    expect(_error).to.be.instanceof(Error);
    expect(_error.message).to.equal(
      `recipe with id ${recipeId} does not exist`
    );
  });

  it("should throw an error if recipeId its not an string", () => {
    expect(function () {
      toogleFavorites(undefined);
    }).to.throw(TypeError, "undefined is not a string");

    expect(function () {
      toogleFavorites(1);
    }).to.throw(TypeError, "1 is not a string");

    expect(function () {
      toogleFavorites(null);
    }).to.throw(TypeError, "null is not a string");

    expect(function () {
      toogleFavorites(true);
    }).to.throw(TypeError, "true is not a string");
  });

  after(mongoose.disconnect);
});
