require("dotenv").config();

const {
  env: { TEST_MONGODB_URL: MONGODB_URL, API_URL, SECRET },
} = process;

const retrieveFavorites = require("./retrieve-favorites");
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

describe("retrieve favorite recipes", () => {
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

    await User.findByIdAndUpdate(userId, {
      $addToSet: { favoriterecipes: recipeId },
    });
  });
  afterEach(async () => {
    await Promise.all([
      User.deleteMany(),
      Ingredients.deleteMany(),
      Recipes.deleteMany(),
      ingredients.pop(),
    ]);
  });

  it("should retrieve all favorite recipes of the user", async () => {
    const result = await retrieveFavorites(userId);

    expect(result).to.exist;
    expect(result).to.be.instanceof(Array);
    expect(result.length).to.be.equal(1);

    const [singleRecipe] = result;
    expect(singleRecipe.name).to.exist;
    expect(singleRecipe.author).to.exist;
    expect(singleRecipe.time).to.exist;
    expect(singleRecipe.description).to.exist;
    expect(singleRecipe.ingredients).to.exist;
  });

  it("shold throw an error if not match a user", async () => {
    await User.deleteMany();

    try {
      await retrieveFavorites(userId);
    } catch (error) {
      expect(error).to.exist;
      expect(error).to.be.instanceof(Error);
      expect(error.message).to.equal(`user with id ${userId} does not exist`);
    }
  });

  after(mongoose.disconnect);
});
