/**
 * it will register a user
 *
 * @param {name} name name of the new user
 *
 * @param {surname} surname surname of the new user
 *
 * @param {String} email  will be used as username
 *
 * @param {String} password will be used as a pass key
 *
 *
 */
require("cook-wise-commons/polyfills/string");
require("cook-wise-commons/polyfills/json");
const {
  utils: { Email },
  errors: { DuplicityError },
} = require("cook-wise-commons");
const {
  models: { User },
} = require("cook-wise-data");
const bcrypt = require("bcryptjs");

module.exports = (name, surname, email, password) => {
  String.validate.notVoid(name);
  String.validate.notVoid(surname);
  String.validate.notVoid(email);
  Email.validate(email);
  String.validate.notVoid(password);

  return (async () => {
    const user = await User.findOne({ email });

    if (user)
      throw new DuplicityError(`user with e-mail ${email} already exists`);

    const hash = await bcrypt.hash(password, 10);

    await User.create({ name, surname, email, password: hash });
  })();
};
