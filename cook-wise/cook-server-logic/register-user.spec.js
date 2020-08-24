require("dotenv").config();

const {
  env: { TEST_MONGODB_URL: MONGODB_URL },
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

describe("logic - register user", () => {
  before(() => mongoose.connect(MONGODB_URL));

  let name, surname, email, password;

  beforeEach(async () => {
    await User.deleteMany();

    name = `name-${random()}`;
    surname = `surname-${random()}`;
    email = `e-${random()}@mail.com`;
    password = `password-${random()}`;
  });

  it("should succeed on valid data", async () => {
    const result = await registerUser(name, surname, email, password);

    expect(result).to.be.undefined;

    const users = await User.find();

    expect(users.length).to.equal(1);

    const [user] = users;

    expect(user.name).to.equal(name);
    expect(user.surname).to.equal(surname);
    expect(user.email).to.equal(email);

    const match = await bcrypt.compare(password, user.password);

    expect(match).to.be.true;
  });

  describe("when user already exists", () => {
    beforeEach(() => User.create({ name, surname, email, password }));S

    it("should fail on trying to register an existing user", async () => {
      try {
        await registerUser(name, surname, email, password);

        throw new Error("should not reach this point");
      } catch (error) {
        expect(error).to.exist;

        expect(error).to.be.an.instanceof(Error);
        expect(error.message).to.equal(
          `user with e-mail ${email} already exists`
        );
      }
    });
  });

  afterEach(() => User.deleteMany());

  after(mongoose.disconnect);
});
