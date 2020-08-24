require("dotenv").config();

const {
  env: { TEST_MONGODB_URL: MONGODB_URL, API_URL, SECRET },
} = process;

const recipeSearchIdeas = require("./recipe-ideas");
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

describe("recipe ideas", () => {
  let name, surname, email, password, encryptedPassword, userId;
  let description,
    time = [];
  let ingredients = { ingredients: [] };
  let recipes = {};

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

    for (let i = 0; i < 3; i++) {
      name = `recipeName-${random()}`;
      author = `author_${random()}`;
      description = `description-${random()}`;
      time = random();

      const recipe = await Recipes.create({ name, author, description, time });
      await User.findByIdAndUpdate(userId, {
        $addToSet: { recipes: recipe.id },
      });

      for (let j = 0; j < 3; j++) {
        const name = `ingredientName-${random()}`;
        const ingredient = await Ingredients.create({ name });

        await Recipes.findByIdAndUpdate(recipe.id, {
          $addToSet: {
            ingredients: { ingredient: ingredient.id, quantity: random() },
          },
        });

        ingredients.ingredients.push(name);
      }

      recipes[`${i}`] = recipe.id;
    }
  });

  afterEach(async () => {
    await Promise.all([
      User.deleteMany(),
      Ingredients.deleteMany(),
      Recipes.deleteMany(),
      (_ingredients = []),
    ]);
  });

  it("should find recipes with any match and return results", async () => {
    result = await recipeSearchIdeas(ingredients.ingredients);

    expect(result).to.exist;
    expect(result).to.be.instanceof(Array);
    expect(result.length).to.be.equal(3);
  });

  it("should throw an empty arrya if not matches found", async () => {
    for (let i = 0; i < ingredients.ingredients.length; i++) {
      ingredients.ingredients[i] = random();
    }

    result = await recipeSearchIdeas(ingredients.ingredients);

    expect(result).to.exist;
    expect(result).to.be.instanceof(Array);
    expect(result.length).to.be.equal(0);
  });

  it("should throw an error if not match a user", async () => {
    await User.deleteMany();

    try {
      await recipeSearchIdeas(ingredients.ingredients);
    } catch (error) {
      expect(error).to.exist;
      expect(error).to.be.instanceof(Error);
      expect(error.message).to.equal(`user with id ${userId} does not exist`);
    }
  });

  it("should throw an error if ingredients its not an array", () => {
    expect(function () {
      recipeSearchIdeas({ ingredients: undefined });
    }).to.throw(TypeError, "you must put ingredients on the recipe");

    expect(function () {
      recipeSearchIdeas({ ingredients: "hola" });
    }).to.throw(TypeError, "you must put ingredients on the recipe");

    expect(function () {
      recipeSearchIdeas({ ingredients: null });
    }).to.throw(TypeError, "you must put ingredients on the recipe");

    expect(function () {
      recipeSearchIdeas({ ingredients: true });
    }).to.throw(TypeError, "you must put ingredients on the recipe");
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
