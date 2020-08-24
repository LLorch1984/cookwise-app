require("dotenv").config();

const {
  env: { TEST_MONGODB_URL: MONGODB_URL },
} = process;

const retrieveFavorite = require("./retrieve-favorite");
const { random } = Math;
const { expect } = require("chai");
require("cook-wise-commons/polyfills/json");
const {
  mongoose,
  models: { User, Recipes, Ingredients },
} = require("cook-wise-data");
const bcrypt = require("bcryptjs");
const { UnexistenceError } = require("cook-wise-commons/errors");

describe("retrieve favorite recipes", () => {
  let name, surname, email, password, encryptedPassword, userId;
  let recipeName,
    recipeAuthor,
    description,
    time,
    ingredients = [],
    recipeId;
  let ingridient, ingredientId;
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
    const result = await retrieveFavorite(userId);

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
      await retrieveFavorite(userId);
    } catch (error) {
      expect(error).to.exist;
      expect(error).to.be.instanceof(UnexistenceError);
      expect(error.message).to.equal(`user with id ${userId} does not exist`);
    }
  });

  it("should throw an error if userId its not an string", () => {
    expect(function () {
      retrieveFavorite(undefined, recipeId);
    }).to.throw(TypeError, "undefined is not a string");

    expect(function () {
      retrieveFavorite(1, recipeId);
    }).to.throw(TypeError, "1 is not a string");

    expect(function () {
      retrieveFavorite(null, recipeId);
    }).to.throw(TypeError, "null is not a string");

    expect(function () {
      retrieveFavorite(true, recipeId);
    }).to.throw(TypeError, "true is not a string");
  });
  after(mongoose.disconnect);
});
