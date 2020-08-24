/**
 *
 * I will delete a timeline menu
 *
 * @param {String} weekday that mark the day that will delete
 *
 * @param {String} timeline that mark the timeline that will delete
 *
 * @param {String} userId  that will find a userId in the databas
 *
 * @throws {Unexistence Error} if don't match a user
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

module.exports = (weekday, timeline, userId) => {
 
  String.validate.notVoid(userId);
  String.validate.notVoid(weekday);
  String.validate.notVoid(timeline);

  return (async () => {
    const user = await User.findById(userId);

    if (!user)
      throw new UnexistenceError(`user with id ${userId} does not exist`);

    await User.findByIdAndUpdate(userId, {
      $pull: { schedule: { weekday, timeline } },
    });
  })();
};
