/**
 *
 * It will delete a recipe
 *
 * @param {String} userId it will find the user by this string
 *
 * @param {String} recipeId it will recipe by his id
 *
 * @throws {Unexistence Error} if don't match a user
 *
 * @throws {Unexistence Error} if don't match recipe
 */

require("cook-wise-commons/polyfills/string");
require("cook-wise-commons/polyfills/number");
const {
  errors: { UnexistenceError },
} = require("cook-wise-commons");
const {
  models: { Recipes, User },
} = require("cook-wise-data");

module.exports = (userId, recipeId) => {
  String.validate.notVoid(userId);
  String.validate.notVoid(recipeId);

  return (async () => {
    const [user, recipe] = await Promise.all([
      User.findById(userId),
      Recipes.findById(recipeId),
    ]);

    if (!user)
      throw new UnexistenceError(`user with id ${userId} does not exist`);

    if (!recipe)
      throw new UnexistenceError(`recipe with id ${recipeId} does not exist`);

    await Promise.all([
      User.findByIdAndUpdate(userId, {
        $pull: {
          recipes: recipeId,
          favoriterecipes: recipeId,
          schedule: { recipe: recipeId },
        },
      }),
      Recipes.findByIdAndRemove(recipeId),
    ]);
  })();
};
