require("dotenv").config();

const {
  env: { TEST_MONGODB_URL: MONGODB_URL, API_URL },
} = process;

const authenticateUser = require("./authenticate-user");
const { random } = Math;
const { expect } = require("chai");
const {
  mongoose,
  models: { User },
} = require("cook-wise-data");
const bcrypt = require("bcryptjs");
const logic = require(".");
global.fetch = require("node-fetch");
const notAsyncStorage = require("not-async-storage");

logic.__context__.storage = notAsyncStorage;
logic.__context__.API_URL = API_URL;

describe("logic - authenticate user", () => {
  before(() => mongoose.connect(MONGODB_URL));

  let name, surname, email, password, userId, hash;

  beforeEach(() =>
    User.deleteMany()
      .then(() => {
        name = `name-${random()}`;
        surname = `surname-${random()}`;
        email = `e-${random()}@mail.com`;
        password = `password-${random()}`;

        return bcrypt.hash(password, 10);
      })
      .then((_hash) => (hash = _hash))
  );

  describe("when user already exists", () => {
    beforeEach(() =>
      User.create({ name, surname, email, password: hash }).then(
        (user) => (userId = user.id)
      )
    );

    it("should succeed on correct credentials", () =>
      authenticateUser(email, password).then((_userId) =>
        expect(_userId).to.equal(userId)
      ));

    it("should fail on wrong password", () => {
      password += "wrong-";

      return authenticateUser(email, password)
        .then(() => {
          throw new Error("should not reach this point");
        })
        .catch((error) => {
          expect(error).to.be.an.instanceof(Error);
          expect(error.message).to.equal(`wrong password`);
        });
    });
  });

  it("should fail when user does not exist", () =>
    authenticateUser(email, password)
      .then(() => {
        throw new Error("should not reach this point");
      })
      .catch((error) => {
        expect(error).to.be.an.instanceof(Error);
        expect(error.message).to.equal(
          `user with e-mail ${email} does not exist`
        );
      }));

  afterEach(() => User.deleteMany());
});
