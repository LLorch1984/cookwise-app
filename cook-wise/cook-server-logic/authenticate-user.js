/**
 * It must authentincate an existing user
 *
 * @param {String} email the username email
 *
 * @param {String} password the username secret key
 *
 * @throws {Unexistance Error} if user dosen't exist
 *
 * @throws {Credentials Error} if username and password dosen't match
 *
 * @returns a username token
 *
 */

require("cook-wise-commons/polyfills/string");
const {
  models: { User },
} = require("cook-wise-data");
const {
  utils: { Email },
  errors: { UnexistenceError, CredentialsError },
} = require("cook-wise-commons");
const bcrypt = require("bcryptjs");

module.exports = (email, password) => {
  String.validate.notVoid(email);
  Email.validate(email);
  String.validate.notVoid(password);

  return User.findOne({ email }).then((user) => {
    if (!user)
      throw new UnexistenceError(`user with e-mail ${email} does not exist`);

    return bcrypt.compare(password, user.password).then((match) => {
      if (!match) throw new CredentialsError("wrong password");

      return user.id;
    });
  });
};
