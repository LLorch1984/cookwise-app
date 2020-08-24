/**
 * @param {String} userId it will fin a user
 *
 * @throws {Unexistence Error} an error if don't match a user
 *
 * @returns favorite recipes
 */

require("cook-wise-commons/polyfills/string");
const {
  errors: { UnexistenceError },
} = require("cook-wise-commons");
const {
  models: { User },
} = require("cook-wise-data");

module.exports = (userId) => {
  String.validate.notVoid(userId);

  return (async () => {
    const user = await User.findById(userId)
      .populate({
        path: "schedule",
        options: { lean: true },
        populate: {
          path: "recipe",
          model: "Recipes",
          options: { lean: true },
        },
      })
      .lean();

    if (!user)
      throw new UnexistenceError(`user with id ${userId} does not exist`);

    if (!user.schedule) return [];

    const { schedule } = user;

    schedule.forEach((scheduleElement) => {
      delete scheduleElement["_id"];
      delete scheduleElement["__v"];

      delete scheduleElement.recipe["_id"];
      delete scheduleElement.recipe["__v"];
      delete scheduleElement.recipe.ingredients;
    });

    return schedule;
  })();
};
