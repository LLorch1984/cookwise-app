require("dotenv").config();

const {
  env: { TEST_MONGODB_URL: MONGODB_URL, API_URL },
} = process;

const registerUser = require("./register-user");
const { random } = Math;
const { expect } = require("chai");
require("cook-wise-commons/polyfills/json");
const {
  mongoose,
  models: { User },
} = require("cook-wise-data");
const bcrypt = require("bcryptjs");
require("cook-wise-commons/ponyfills/xhr");
const context = require("./context");
const logic = require(".");
global.fetch = require("node-fetch");
const notAsyncStorage = require("not-async-storage");

logic.__context__.API_URL = API_URL;
logic.__context__.storage = notAsyncStorage;

describe("logic - register user", () => {
  before(() => mongoose.connect(MONGODB_URL));

  let name, surname, email, password;

  beforeEach(() =>
    User.deleteMany().then(() => {
      name = `name-${random()}`;
      surname = `surname-${random()}`;
      email = `e-${random()}@mail.com`;
      password = `password-${random()}`;
    })
  );

  it("should succeed on valid data", () =>
    registerUser(name, surname, email, password)
      .then(() => User.find())
      .then((users) => {
        expect(users.length).to.equal(1);

        const [user] = users;

        expect(user.name).to.equal(name);
        expect(user.surname).to.equal(surname);
        expect(user.email).to.equal(email);

        return bcrypt.compare(password, user.password);
      })
      .then((match) => expect(match).to.be.true));

  describe("when user already exists", () => {
    beforeEach(() => User.create({ name, surname, email, password }));

    it("should fail on trying to register an existing user", () =>
      registerUser(name, surname, email, password)
        .then(() => {
          throw new Error("should not reach this point");
        })
        .catch((error) => {
          expect(error).to.exist;

          expect(error).to.be.an.instanceof(Error);
          expect(error.message).to.equal(
            `user with e-mail ${email} already exists`
          );
        }));
  });

  afterEach(() => User.deleteMany());

  after(mongoose.disconnect);
});
