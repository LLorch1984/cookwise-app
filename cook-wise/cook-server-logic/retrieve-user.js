/**
 * it will return a user
 *
 * @param {String} userId it will find a user by his Id
 *
 * @throws {Unexistance Error} if user doesn't match  in the database
 *
 * @returns a user
 */

require("cook-wise-commons/polyfills/string");
const {
  models: { User },
} = require("cook-wise-data");

module.exports = (userId) => {
  String.validate.notVoid(userId);
  return User.findById(userId)
    .lean()
    .then((user) => {
      if (!user) throw new Error(`user with id ${userId} does not exist`);

      const { name, surname, email } = user;

      return { name, surname, email };
    });
};
