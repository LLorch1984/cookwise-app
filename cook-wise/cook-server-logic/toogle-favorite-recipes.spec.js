require("dotenv").config();

const {
  env: { TEST_MONGODB_URL: MONGODB_URL },
} = process;

const toogleFavorite = require("./toogle-favorite");
const { random } = Math;
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

describe("favorite-recipes", () => {
  let name, surname, email, password, encryptedPassword, userId;
  let recipeName,
    recipeAuthor,
    description,
    time,
    ingredients = [],
    recipeId;
  let ingridient, ingredientId;
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
    const result = await toogleFavorite(userId, recipeId);

    let _user = await User.findById(userId);

    expect(_user.favoriterecipes).to.exist;
    expect(_user.favoriterecipes).to.be.instanceof(Array);
    expect(_user.favoriterecipes.length).to.be.equal(1);
    expect(_user.favoriterecipes[0].toString()).to.equal(recipeId);
  });

  it("should splice a favoriterecipe if already exist", async () => {
    await toogleFavorite(userId, recipeId);

    const resultuntoogle = await toogleFavorite(userId, recipeId);

    let _user = await User.findById(userId);

    expect(_user.favoriterecipes).to.exist;
    expect(_user.favoriterecipes).to.be.instanceof(Array);
    expect(_user.favoriterecipes.length).to.be.equal(0);
  });

  it(`should throw an error if user doesn't exist`, async () => {
    await User.deleteMany();

    try {
      await toogleFavorite(userId, recipeId);
    } catch (error) {
      expect(error).to.exist;
      expect(error).to.be.instanceof(UnexistenceError);
      expect(error.message).to.equal(`user with id ${userId} does not exist`);
    }
  });
  it(`should throw an error if recipe didn't exist`, async () => {
    await Recipes.deleteMany();

    try {
      await toogleFavorite(userId, recipeId);
    } catch (error) {
      expect(error).to.exist;
      expect(error).to.be.instanceof(UnexistenceError);
      expect(error.message).to.equal(
        `recipe with id ${recipeId} does not exist`
      );
    }
  });

  it("should throw an error if userId its not an string", () => {
    expect(function () {
      toogleFavorite(undefined, recipeId);
    }).to.throw(TypeError, "undefined is not a string");

    expect(function () {
      toogleFavorite(1, recipeId);
    }).to.throw(TypeError, "1 is not a string");

    expect(function () {
      toogleFavorite(null, recipeId);
    }).to.throw(TypeError, "null is not a string");

    expect(function () {
      toogleFavorite(true, recipeId);
    }).to.throw(TypeError, "true is not a string");
  });

  it("should throw an error if recipeId its not an string", () => {
    expect(function () {
      toogleFavorite(userId, undefined);
    }).to.throw(TypeError, "undefined is not a string");

    expect(function () {
      toogleFavorite(userId, 1);
    }).to.throw(TypeError, "1 is not a string");

    expect(function () {
      toogleFavorite(userId, null);
    }).to.throw(TypeError, "null is not a string");

    expect(function () {
      toogleFavorite(userId, true);
    }).to.throw(TypeError, "true is not a string");
  });

  after(mongoose.disconnect);
});
