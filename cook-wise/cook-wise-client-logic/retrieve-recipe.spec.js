require("dotenv").config();

const {
  env: { TEST_MONGODB_URL: MONGODB_URL, API_URL, SECRET },
} = process;

const retrieveRecipe = require("./retrieve-recipe");
const { random } = Math;
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

describe("retrive recipe", () => {
  let name, surname, email, password, encryptedPassword, userId;
  let recipeName,
    recipeAuthor,
    description,
    time,
    ingredients = [],
    recipeId;
  let ingredientId;
  let quantity, ingredientType;
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

  it("should succeed on correct user recipeId", () =>
    retrieveRecipe(recipeId).then((recipe) => {
      expect(recipe.name).to.equal(recipeName);
      expect(recipe.author).to.equal(recipeAuthor);
      expect(recipe.description).to.equal(description);
      expect(recipe.time).to.be.equal(time);
      expect(recipe.ingredients.length).to.be.greaterThan(0);
    }));

  it("should fail when user does not exist", () => {
    const recipeId = "5ed1204ee99ccf6fae798aef";

    return retrieveRecipe(recipeId)
      .then(() => {
        throw new UnexistenceError("should not reach this point");
      })
      .catch((error) => {
        expect(error).to.exist;

        expect(error).to.be.an.instanceof(Error);
        expect(error.message).to.equal(
          `recipe with id ${recipeId} does not exist`
        );
      });
  });

  it("should throw an error if recipeId its not an string", () => {
    expect(function () {
      retrieveRecipe(undefined);
    }).to.throw(TypeError, "undefined is not a string");

    expect(function () {
      retrieveRecipe(1);
    }).to.throw(TypeError, "1 is not a string");

    expect(function () {
      retrieveRecipe(null);
    }).to.throw(TypeError, "null is not a string");

    expect(function () {
      retrieveRecipe(true);
    }).to.throw(TypeError, "true is not a string");
  });

  afterEach(() => User.deleteMany());

  after(mongoose.disconnect);
});
