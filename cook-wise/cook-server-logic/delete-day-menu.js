/**
 *
 * It will delete a full day menu
 *
 * @param {String} weekday  that mark the day that the  function will delete
 *
 * @param {String} userId that will search for the user
 *
 * @throws {Unexistence Error} if the user doesn't exist
 *
 */

require("cook-wise-commons/polyfills/string");
require("cook-wise-commons/polyfills/number");
const {
  errors: { UnexistenceError },
} = require("cook-wise-commons");
const {
  models: { User },
} = require("cook-wise-data");

module.exports = (weekday, userId) => {

  String.validate.notVoid(userId);
  String.validate.notVoid(weekday);

  return (async () => {
    const user = await User.findById(userId);

    if (!user)
      throw new UnexistenceError(`user with id ${userId} does not exist`);

    await User.findByIdAndUpdate(userId, {
      $pull: { schedule: { weekday } },
    });
  })();
};
