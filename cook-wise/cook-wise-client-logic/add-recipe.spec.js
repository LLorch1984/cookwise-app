require("dotenv").config();

const {
  env: { TEST_MONGODB_URL: MONGODB_URL, API_URL, SECRET },
} = process;

const addRecipe = require("./add-recipe");
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
const logic = require(".");
global.fetch = require("node-fetch");
const notAsyncStorage = require("not-async-storage");
const jwt = require("jsonwebtoken");

logic.__context__.API_URL = API_URL;
logic.__context__.storage = notAsyncStorage;

describe("createRecipe", () => {
  let name, surname, email, password, encryptedPassword, userId;
  let recipeName,
    recipeAuthor,
    description,
    time,
    ingredients = [],
    recipeId;
  let ingridient, ingredientId;
  let quantity, ingredientType;

  before(async () => {
    await mongoose.connect(MONGODB_URL, { unifiedTopology: true });
    await Promise.all([
      User.deleteMany(),
      Ingredients.deleteMany(),
      Recipes.deleteMany(),
    ]);
  });

  beforeEach(async () => {
    //USER-ORIENTED DATA
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

    //INGREDIENT-ORIENTED DATA
    ingredientName = `ingredientName-${random()}`;
    const newIngredient = await Ingredients.create({ name: ingredientName });
    ingredientId = newIngredient.id;

    //INGREDIENTS QUANTITY-ORIENTED DATA
    quantity = random();
    ingredientType = newIngredient.id;

    ingredient = { ingredient: ingredientType, quantity };

    //RECIPE-ORIENTED DATA
    recipeName = `recipeNme-${random()}`;
    recipeAuthor = `author_${random()}`;
    description = `description-${random()}`;
    time = random();
    ingredients.push(ingredient);
  });

  afterEach(async () => {
    await Promise.all([
      User.deleteMany(),
      Ingredients.deleteMany(),
      Recipes.deleteMany(),
      ingredients.pop(),
    ]);
  });

  it("should suceed on creating a new recipe based on all the previous data", async () => {
    const result = await addRecipe(
      recipeName,
      recipeAuthor,
      description,
      time,
      ingredients
    );

    expect(result).to.be.undefined;

    const recipes = await Recipes.find().populate("ingredients").lean();

    expect(recipes).to.exist;
    expect(recipes).to.be.instanceof(Array);
    expect(recipes.length).to.equal(1);

    const [singleRecipe] = recipes;
    expect(singleRecipe).to.exist;
    expect(singleRecipe).to.be.instanceof(Object);

    expect(singleRecipe.name).to.equal(recipeName);
    expect(singleRecipe.description).to.equal(description);
    expect(singleRecipe.author).to.equal(recipeAuthor);
    expect(singleRecipe.time).to.equal(time);
    expect(singleRecipe.ingredients).to.be.instanceof(Array);
    expect(singleRecipe.ingredients.length).to.equal(0);

    singleRecipe.ingredients.forEach(async (ingredient) => {
      expect(ingredient).to.be.instanceof(Object);
      expect(ingredient._id.toString()).to.equal(ingredientId.toString());
      expect(ingredient.quantity).to.equal(quantity);

      const _ingredient = await Ingredients.findById(ingredient._id);
      expect(_ingredient).to.exist;
      expect(_ingredient).to.be.instanceof(Object);
      expect(_ingredient.name).to.equal(ingredientName);
    });

    const user = await User.findById(userId);
    expect(user).to.exist;
    expect(user.recipes.length).to.equal(1);
    expect(user.recipes[0]._id.toString()).to.equal(
      singleRecipe._id.toString()
    );
  });

  it("should throw an error when recipe with same name an author already exist", async () => {
    await Recipes.create({
      name: recipeName,
      author: recipeAuthor,
      description,
      time,
      ingredients,
    });

    try {
      await addRecipe(recipeName, recipeAuthor, description, time, ingredients);
    } catch (error) {
      expect(error).to.exist;
      expect(error).to.be.instanceof(Error);
      expect(error.message).to.equal(
        `${recipeName} of ${recipeAuthor} already exist`
      );
    }
  });

  it("should fail to create the recipe if the user doesnt exist", async () => {
    await User.deleteMany();

    try {
      await addRecipe(recipeName, recipeAuthor, description, time, ingredients);
    } catch (error) {
      expect(error).to.exist;
      expect(error).to.be.instanceof(Error);
      expect(error.message).to.equal(`user with id ${userId} does not exist`);
    }
  });

  it("should fail if ingredients have no quantity or quantity under 0", async () => {
    ingredients.quantity = 0;

    try {
      await addRecipe(recipeName, recipeAuthor, description, time, ingredients);
    } catch (error) {
      expect(error).to.exist;
      expect(error).to.be.instanceof(UnexistenceError);
      expect(error.message).to.equal(`ingredient must have a quantity`);
    }
  });

  it("should throw an error if author its not an string", () => {
    expect(function () {
      addRecipe(recipeName, undefined, description, time, ingredients);
    }).to.throw(TypeError, "undefined is not a string");

    expect(function () {
      addRecipe(recipeName, 1, description, time, ingredients);
    }).to.throw(TypeError, "1 is not a string");

    expect(function () {
      addRecipe(recipeName, null, description, time, ingredients);
    }).to.throw(TypeError, "null is not a string");

    expect(function () {
      addRecipe(recipeName, true, description, time, ingredients);
    }).to.throw(TypeError, "true is not a string");
  });

  it("should throw an error if name its not an string", () => {
    expect(function () {
      return addRecipe(undefined, recipeAuthor, description, time, ingredients);
    }).to.throw(TypeError, "undefined is not a string");

    expect(function () {
      addRecipe(1, recipeAuthor, description, time, ingredients);
    }).to.throw(TypeError, "1 is not a string");

    expect(function () {
      addRecipe(null, recipeAuthor, description, time, ingredients);
    }).to.throw(TypeError, "null is not a string");

    expect(function () {
      addRecipe(true, recipeAuthor, description, time, ingredients);
    }).to.throw(TypeError, "true is not a string");
  });

  it("should throw an error if description its not an string", () => {
    expect(function () {
      addRecipe(recipeName, recipeAuthor, undefined, time, ingredients);
    }).to.throw(TypeError, "undefined is not a string");

    expect(function () {
      addRecipe(recipeName, recipeAuthor, 1, time, ingredients);
    }).to.throw(TypeError, "1 is not a string");

    expect(function () {
      addRecipe(recipeName, recipeAuthor, null, time, ingredients);
    }).to.throw(TypeError, "null is not a string");

    expect(function () {
      addRecipe(recipeName, recipeAuthor, true, time, ingredients);
    }).to.throw(TypeError, "true is not a string");
  });

  it("should throw an error if time its not a number", () => {
    expect(function () {
      return addRecipe(
        recipeName,
        recipeAuthor,
        description,
        undefined,
        ingredients
      );
    }).to.throw(TypeError, "undefined is not a number");

    expect(function () {
      return addRecipe(
        recipeName,
        recipeAuthor,
        description,
        "hola",
        ingredients
      );
    }).to.throw(TypeError, "hola is not a number");
  });

  it("should throw an error if ingredients its not an Array", () => {
    expect(function () {
      addRecipe(recipeName, recipeAuthor, description, time, undefined);
    }).to.throw(Error, "you must put ingredients on the recipe");

    expect(function () {
      addRecipe(recipeName, recipeAuthor, description, time, 1);
    }).to.throw(Error, "you must put ingredients on the recipe");

    expect(function () {
      addRecipe(recipeName, recipeAuthor, description, time, null);
    }).to.throw(Error, "you must put ingredients on the recipe");

    expect(function () {
      addRecipe(recipeName, recipeAuthor, description, time, true);
    }).to.throw(Error, "you must put ingredients on the recipe");
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
