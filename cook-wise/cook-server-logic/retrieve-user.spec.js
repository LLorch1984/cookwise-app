require("dotenv").config();

const {
  env: { TEST_MONGODB_URL: MONGODB_URL },
} = process;

const retrieveUser = require("./retrieve-user");
const { random } = Math;
const { expect } = require("chai");

const {
  mongoose,
  models: { User },
} = require("cook-wise-data");

describe("logic - retrieve user", () => {
  before(() => mongoose.connect(MONGODB_URL));

  let name, surname, email, password, userId;

  beforeEach(() =>
    User.deleteMany().then(() => {
      name = `name-${random()}`;
      surname = `surname-${random()}`;
      email = `e-${random()}@mail.com`;
      password = `password-${random()}`;
    })
  );

  describe("when user already exists", () => {
    beforeEach(() =>
      User.create({ name, surname, email, password }).then(
        (user) => (userId = user.id)
      )
    );

    it("should succeed on correct user id", () =>
      retrieveUser(userId).then((user) => {
        expect(user).to.be.undefined;
      }));
  });

  it("should fail when user does not exist", () => {
    const userId = "5ed1204ee99ccf6fae798aef";

    return retrieveUser(userId)
      .then(() => {
        throw new Error("should not reach this point");
      })
      .catch((error) => {
        expect(error).to.exist;

        expect(error).to.be.an.instanceof(Error);
        expect(error.message).to.equal(`user with id ${userId} does not exist`);
      });
  });

  afterEach(() => User.deleteMany());

  it("should throw an error if userId its not an string", () => {
    expect(function () {
      retrieveUser(undefined);
    }).to.throw(TypeError, "undefined is not a string");

    expect(function () {
      retrieveUser(1);
    }).to.throw(TypeError, "1 is not a string");

    expect(function () {
      retrieveUser(null);
    }).to.throw(TypeError, "null is not a string");

    expect(function () {
      retrieveUser(true);
    }).to.throw(TypeError, "true is not a string");
  });

  after(mongoose.disconnect);
});
