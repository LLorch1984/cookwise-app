require("dotenv").config();

const {
  env: { TEST_MONGODB_URL: MONGODB_URL },
} = process;

const toogleMenu = require("./toogle-menu-day");
const { floor, random } = Math;
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

describe("toogle-menu", () => {
  const WEEKDAYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const TIMELINE = ["lunch", "dinner"];
  let name, surname, email, password, encryptedPassword, userId;
  let recipeName,
    recipeAuthor,
    description,
    time,
    ingredients = [],
    recipeId;
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

    await User.findByIdAndUpdate(userId, { $addToSet: { recipes: recipe } });

    schedule.weekday = WEEKDAYS[floor(random() * WEEKDAYS.length)];
    schedule.timeline = TIMELINE[floor(random() * TIMELINE.length)];
    schedule.recipe = recipeId;
  });
  afterEach(async () => {
    await Promise.all([
      User.deleteMany(),
      Ingredients.deleteMany(),
      Recipes.deleteMany(),
      ingredients.pop(),
    ]);
  });

  it("should add day and timeline", async () => {
    await toogleMenu(schedule, userId);

    const user = await User.findById(userId);

    expect(user).to.exist;
    expect(user.schedule).to.exist;
    expect(user.schedule).to.be.an("array");
    expect(user.schedule.length).to.be.equal(1);

    expect(user.schedule[0].weekday).to.equal(schedule.weekday);
    expect(user.schedule[0].timeline).to.equal(schedule.timeline);
  });

  it("should remove if day and timeline exist", async () => {
    await User.findByIdAndUpdate(userId, { $addToSet: { schedule: schedule } });
    await toogleMenu(schedule, userId);

    const user = await User.findById(userId);

    expect(user).to.exist;
    expect(user.schedule).to.exist;
    expect(user.schedule).to.be.an("array");
    expect(user.schedule.length).to.be.equal(0);
  });

  it("shold throw an error if not match a recipe", async () => {
    await Recipes.deleteMany();

    try {
      await toogleMenu(schedule, userId);
    } catch (error) {
      expect(error).to.exist;
      expect(error).to.be.instanceof(UnexistenceError);
      expect(error.message).to.equal(
        `recipe with id ${recipeId} does not exist`
      );
    }
  });

  it("shold throw an error if not match a user", async () => {
    await User.deleteMany();

    try {
      await toogleMenu(schedule, userId);
    } catch (error) {
      expect(error).to.exist;
      expect(error).to.be.instanceof(UnexistenceError);
      expect(error.message).to.equal(`user with id ${userId} does not exist`);
    }
  });

  it("should throw an error if userId its not an string", () => {
    expect(function () {
      toogleMenu(schedule, undefined);
    }).to.throw(TypeError, "undefined is not a string");

    expect(function () {
      toogleMenu(schedule, 1);
    }).to.throw(TypeError, "1 is not a string");

    expect(function () {
      toogleMenu(schedule, null);
    }).to.throw(TypeError, "null is not a string");

    expect(function () {
      toogleMenu(schedule, true);
    }).to.throw(TypeError, "true is not a string");
  });

  it("should throw an error if schedule its not an object", () => {
    expect(function () {
      toogleMenu(undefined, userId);
    }).to.throw(TypeError, "undefined must be an object");

    expect(function () {
      toogleMenu(1, userId);
    }).to.throw(TypeError, "1 must be an object");

    expect(function () {
      toogleMenu(null, userId);
    }).to.throw(TypeError, "null must be an object");

    expect(function () {
      toogleMenu(true, userId);
    }).to.throw(TypeError, "true must be an object");
  });

  it("should throw an error if timeline its not an string", () => {
    (schedule.weekday = WEEKDAYS[floor(random() * WEEKDAYS.length)]),
      (schedule.timeline = undefined);
    schedule.recipe = recipeId;

    expect(function () {
      toogleMenu(schedule, userId);
    }).to.throw(TypeError, "undefined is not a string");

    (schedule.weekday = WEEKDAYS[floor(random() * WEEKDAYS.length)]),
      (schedule.timeline = 1);
    schedule.recipe = recipeId;

    expect(function () {
      toogleMenu(schedule, userId);
    }).to.throw(TypeError, "1 is not a string");

    (schedule.weekday = WEEKDAYS[floor(random() * WEEKDAYS.length)]),
      (schedule.timeline = null);
    schedule.recipe = recipeId;

    expect(function () {
      toogleMenu(schedule, userId);
    }).to.throw(TypeError, "null is not a string");

    (schedule.weekday = WEEKDAYS[floor(random() * WEEKDAYS.length)]),
      (schedule.timeline = true);
    schedule.recipe = recipeId;

    expect(function () {
      toogleMenu(schedule, userId);
    }).to.throw(TypeError, "true is not a string");
  });

  it("should throw an error if weekday its not an string", () => {
    (schedule.timeline = WEEKDAYS[floor(random() * WEEKDAYS.length)]),
      (schedule.weekday = undefined);
    schedule.recipe = recipeId;

    expect(function () {
      toogleMenu(schedule, userId);
    }).to.throw(TypeError, "undefined is not a string");

    (schedule.timeline = WEEKDAYS[floor(random() * WEEKDAYS.length)]),
      (schedule.weekday = 1);
    schedule.recipe = recipeId;

    expect(function () {
      toogleMenu(schedule, userId);
    }).to.throw(TypeError, "1 is not a string");

    (schedule.timeline = WEEKDAYS[floor(random() * WEEKDAYS.length)]),
      (schedule.weekday = null);
    schedule.recipe = recipeId;

    expect(function () {
      toogleMenu(schedule, userId);
    }).to.throw(TypeError, "null is not a string");

    (schedule.timeline = WEEKDAYS[floor(random() * WEEKDAYS.length)]),
      (schedule.weekday = true);
    schedule.recipe = recipeId;

    expect(function () {
      toogleMenu(schedule, userId);
    }).to.throw(TypeError, "true is not a string");
  });
  it("should throw an error if recipeId its not an string", () => {
    (schedule.timeline = WEEKDAYS[floor(random() * WEEKDAYS.length)]),
      (schedule.weekday = WEEKDAYS[floor(random() * WEEKDAYS.length)]);
    schedule.recipe = undefined;

    expect(function () {
      toogleMenu(schedule, userId);
    }).to.throw(TypeError, "undefined is not a string");

    (schedule.timeline = WEEKDAYS[floor(random() * WEEKDAYS.length)]),
      (schedule.weekday = WEEKDAYS[floor(random() * WEEKDAYS.length)]);
    schedule.recipe = 1;

    expect(function () {
      toogleMenu(schedule, userId);
    }).to.throw(TypeError, "1 is not a string");

    (schedule.timeline = WEEKDAYS[floor(random() * WEEKDAYS.length)]),
      (schedule.weekday = WEEKDAYS[floor(random() * WEEKDAYS.length)]);
    schedule.recipe = null;

    expect(function () {
      toogleMenu(schedule, userId);
    }).to.throw(TypeError, "null is not a string");

    (schedule.timeline = WEEKDAYS[floor(random() * WEEKDAYS.length)]),
      (schedule.weekday = WEEKDAYS[floor(random() * WEEKDAYS.length)]);
    schedule.recipe = true;

    expect(function () {
      toogleMenu(schedule, userId);
    }).to.throw(TypeError, "true is not a string");
  });

  after(mongoose.disconnect);
});
