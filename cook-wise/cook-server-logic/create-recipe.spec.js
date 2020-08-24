require("dotenv").config();

const {
  env: { TEST_MONGODB_URL: MONGODB_URL },
} = process;

const createRecipe = require("./create-recipe");
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
    const result = await createRecipe({
      name: recipeName,
      author: recipeAuthor,
      description,
      time,
      ingredients,
      userId,
    });

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

  it("shold throw an error when recipe with same name an author already exist", async () => {
    await Recipes.create({
      name: recipeName,
      author: recipeAuthor,
      description,
      time,
      ingredients,
    });

    try {
      await createRecipe({
        name: recipeName,
        author: recipeAuthor,
        description,
        time,
        ingredients,
        userId,
      });
    } catch (error) {
      expect(error).to.exist;
      expect(error).to.be.instanceof(DuplicityError);
      expect(error.message).to.equal(
        `${recipeName} of ${recipeAuthor} already exist`
      );
    }
  });

  it("should fail to create the recipe if the user doesnt exist", async () => {
    await User.deleteMany();

    try {
      await createRecipe({
        name: recipeName,
        author: recipeAuthor,
        description,
        time,
        ingredients,
        userId,
      });
    } catch (error) {
      expect(error).to.exist;
      expect(error).to.be.instanceof(UnexistenceError);
      expect(error.message).to.equal(`user with id ${userId} does not exist`);
    }
  });

  it("should fail if ingredients have no quantity or quantity under 0", async () => {
    ingredients.quantity = 0;

    try {
      await createRecipe({
        name: recipeName,
        author: recipeAuthor,
        description,
        time,
        ingredients,
        userId,
      });
    } catch (error) {
      expect(error).to.exist;
      expect(error).to.be.instanceof(UnexistenceError);
      expect(error.message).to.equal(`ingredient must have a quantity`);
    }
  });

  it("should throw an error if author its not an string", () => {
    expect(function () {
      createRecipe({
        name: recipeName,
        author: undefined,
        description,
        time,
        ingredients,
        userId,
      });
    }).to.throw(TypeError, "undefined is not a string");

    expect(function () {
      createRecipe({
        name: recipeName,
        author: 1,
        description,
        time,
        ingredients,
        userId,
      });
    }).to.throw(TypeError, "1 is not a string");

    expect(function () {
      createRecipe({
        name: recipeName,
        author: null,
        description,
        time,
        ingredients,
        userId,
      });
    }).to.throw(TypeError, "null is not a string");

    expect(function () {
      createRecipe({
        name: recipeName,
        author: true,
        description,
        time,
        ingredients,
        userId,
      });
    }).to.throw(TypeError, "true is not a string");
  });

  it("should throw an error if name its not an string", () => {
    expect(function () {
      createRecipe({
        name: undefined,
        author: recipeAuthor,
        description,
        time,
        ingredients,
        userId,
      });
    }).to.throw(TypeError, "undefined is not a string");

    expect(function () {
      createRecipe({
        name: 1,
        author: recipeAuthor,
        description,
        time,
        ingredients,
        userId,
      });
    }).to.throw(TypeError, "1 is not a string");

    expect(function () {
      createRecipe({
        name: null,
        author: recipeAuthor,
        description,
        time,
        ingredients,
        userId,
      });
    }).to.throw(TypeError, "null is not a string");

    expect(function () {
      createRecipe({
        name: true,
        author: recipeAuthor,
        description,
        time,
        ingredients,
        userId,
      });
    }).to.throw(TypeError, "true is not a string");
  });

  it("should throw an error if description its not an string", () => {
    expect(function () {
      createRecipe({
        name: recipeName,
        author: recipeAuthor,
        description: undefined,
        time,
        ingredients,
        userId,
      });
    }).to.throw(TypeError, "undefined is not a string");

    expect(function () {
      createRecipe({
        name: recipeName,
        author: recipeAuthor,
        description: 1,
        time,
        ingredients,
        userId,
      });
    }).to.throw(TypeError, "1 is not a string");

    expect(function () {
      createRecipe({
        name: recipeName,
        author: recipeAuthor,
        description: null,
        time,
        ingredients,
        userId,
      });
    }).to.throw(TypeError, "null is not a string");

    expect(function () {
      createRecipe({
        name: recipeName,
        author: recipeAuthor,
        description: true,
        time,
        ingredients,
        userId,
      });
    }).to.throw(TypeError, "true is not a string");
  });

  it("should throw an error if time its not a number", () => {
    expect(function () {
      createRecipe({
        name: recipeName,
        author: recipeAuthor,
        description,
        time: undefined,
        ingredients,
        userId,
      });
    }).to.throw(TypeError, "undefined is not a number");

    expect(function () {
      createRecipe({
        name: recipeName,
        author: recipeAuthor,
        description,
        time: "hola",
        ingredients,
        userId,
      });
    }).to.throw(TypeError, "hola is not a number");
  });

  it("should throw an error if description its not an string", () => {
    expect(function () {
      createRecipe({
        name: recipeName,
        author: recipeAuthor,
        description,
        time,
        ingredients: undefined,
        userId,
      });
    }).to.throw(Error, "you must put ingredients on the recipe");

    expect(function () {
      createRecipe({
        name: recipeName,
        author: recipeAuthor,
        description,
        time,
        ingredients: 1,
        userId,
      });
    }).to.throw(Error, "you must put ingredients on the recipe");

    expect(function () {
      createRecipe({
        name: recipeName,
        author: recipeAuthor,
        description,
        time,
        ingredients: 1,
        userId,
      });
    }).to.throw(Error, "you must put ingredients on the recipe");

    expect(function () {
      createRecipe({
        name: recipeName,
        author: recipeAuthor,
        description,
        time,
        ingredients: true,
        userId,
      });
    }).to.throw(Error, "you must put ingredients on the recipe");
  });
  it("should throw an error if userid its not an string", () => {
    expect(function () {
      createRecipe({
        name: recipeName,
        author: recipeAuthor,
        description,
        time,
        ingredients,
        userId: undefined,
      });
    }).to.throw(TypeError, "undefined is not a string");

    expect(function () {
      createRecipe({
        name: recipeName,
        author: recipeAuthor,
        description,
        time,
        ingredients,
        userId: 1,
      });
    }).to.throw(TypeError, "1 is not a string");

    expect(function () {
      createRecipe({
        name: recipeName,
        author: recipeAuthor,
        description,
        time,
        ingredients,
        userId: null,
      });
    }).to.throw(TypeError, "null is not a string");

    expect(function () {
      createRecipe({
        name: recipeName,
        author: recipeAuthor,
        description,
        time,
        ingredients,
        userId: true,
      });
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
