/**
 *
 * it must put favorite recipe on an array or sliced if already exist
 *
 * @param {String} UserId it find the  user by this param
 *
 * @param {String} recipeId it will find that recipe in the favoriteArray
 *
 * @throws {Unexistance Error} if the user doesn't exist
 *
 */
require("cook-wise-commons/polyfills/string");
const {
  errors: { UnexistenceError },
} = require("cook-wise-commons");
const {
  models: { User, Recipes },
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

    const index = user.favoriterecipes.indexOf(recipeId);

    if (index === -1) user.favoriterecipes.push(recipeId);
    else user.favoriterecipes.splice(index, 1);

    await user.save();

    return;
  })();
};
