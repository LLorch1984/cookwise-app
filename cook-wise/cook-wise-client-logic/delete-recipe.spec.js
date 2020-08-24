require("dotenv").config();

const {
  env: { TEST_MONGODB_URL: MONGODB_URL, API_URL, SECRET },
} = process;

const deleteRecipe = require("./delete-recipe");
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

describe("delete recipe", () => {
  let name, surname, email, password, encryptedPassword, userId;
  let recipeName,
    recipeAuthor,
    description,
    time,
    ingredients = [],
    recipeId;
  let ingredientId;
  let quantity, ingredientType;
  let recipe;

  before(async () => {
    await mongoose.connect(MONGODB_URL, { unifiedTopology: true });
    await Promise.all([
      User.deleteMany(),
      Ingredients.deleteMany(),
      Recipes.deleteMany(),
    ]);
  });

  beforeEach(async () => {
    name = `name-${random()}`;
    surname = `surname-${random()}`;
    email = `email-${random()}@gmail.com`;
    password = `password-${random()}`;
    encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      surname,
      email,
      password: encryptedPassword,
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

    recipeName = `recipeNme-${random()}`;
    recipeAuthor = `author_${random()}`;
    description = `description-${random()}`;
    time = random();
    ingredients.push(ingredient);

    recipe = await Recipes.create({
      name: recipeName,
      author: recipeAuthor,
      description,
      time,
      ingredients,
    });
    recipeId = recipe.id;

    User.findByIdAndUpdate(userId, { $addToSet: { recipes: recipe } });
  });

  it("should remove the recipe from  user recipes", async () => {
    await deleteRecipe(recipeId);

    let result = await User.findById(userId).populate("user").lean();

    expect(result).to.exist;
    expect(result.recipes).to.be.instanceof(Array);
    expect(result.recipes.length).to.be.equal(0);
  });

  it("should remove the recipe from user recipes and from favorite recipes", async () => {
    User.findOneAndUpdate(userId, { $addToSet: { favoriterecipes: recipe } });

    await deleteRecipe(recipeId);

    let result = await User.findById(userId).populate("user").lean();

    expect(result).to.exist;
    expect(result.recipes).to.be.instanceof(Array);
    expect(result.favoriterecipes).to.be.instanceof(Array);
    expect(result.recipes.length).to.be.equal(0);
    expect(result.favoriterecipes.length).to.be.equal(0);
  });

  it("should throw an error if user dont exist", async () => {
    await User.deleteMany();
    try {
      await deleteRecipe(recipeId);
    } catch (error) {
      expect(error).to.exist;
      expect(error).to.be.instanceof(Error);
      expect(error.message).to.equal(`user with id ${userId} does not exist`);
    }
  });

  it("should throw an error if recipeId its not an string", () => {
    expect(function () {
      deleteRecipe(undefined);
    }).to.throw(TypeError, "undefined is not a string");

    expect(function () {
      deleteRecipe(1);
    }).to.throw(TypeError, "1 is not a string");

    expect(function () {
      deleteRecipe(null);
    }).to.throw(TypeError, "null is not a string");

    expect(function () {
      deleteRecipe(true);
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
