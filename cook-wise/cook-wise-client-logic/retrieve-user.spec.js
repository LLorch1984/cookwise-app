require("dotenv").config();

const {
  env: { TEST_MONGODB_URL: MONGODB_URL, SECRET, API_URL },
} = process;

const retrieveUser = require("./retrieve-user");
const { random } = Math;
const { expect } = require("chai");
require("cook-wise-commons/polyfills/json");
const {
  mongoose,
  models: { User, Recipes, Ingredients },
} = require("cook-wise-data");
require("cook-wise-commons/ponyfills/xhr");
const {
  utils: { jwtPromised },
} = require("cook-wise-commons");
const context = require("./context");
const logic = require(".");
global.fetch = require("node-fetch");
const notAsyncStorage = require("not-async-storage");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

logic.__context__.API_URL = API_URL;
logic.__context__.storage = notAsyncStorage;

describe("recipe ideas", () => {
  let name, surname, email, password, encryptedPassword, userId, token;
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
    token = jwt.sign({ sub: userId }, SECRET, { expiresIn: "1d" });
    await logic.__context__.storage.setItem("TOKEN", token);
  });

  it("should suceed when user already exist", async () => {
    const user = await retrieveUser(token);
    expect(user).to.exist;
    expect(user.name).to.equal(name);
    expect(user.surname).to.equal(surname);
    expect(user.email).to.equal(email);
    expect(user.password).to.be.undefined;
  });

  afterEach(() => User.deleteMany());

  after(mongoose.disconnect);
});
