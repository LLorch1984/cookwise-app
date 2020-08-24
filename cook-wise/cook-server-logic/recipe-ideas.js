/**
 *
 * It will return ideas for next week recipes
 *
 * @param {String} UserId that will find a user in the database
 *
 * @param {Object} with data that will find of
 *
 * @throws {TypeError} if ingredient haven't an array
 *
 * @throws {Unexistence Error} if user doesn't exist
 *
 * @returns a recipes based on the ingredients passed
 */

require("cook-wise-commons/polyfills/string");
require("cook-wise-commons/polyfills/number");
const {
  errors: { UnexistenceError },
} = require("cook-wise-commons");
const {
  models: { User },
} = require("cook-wise-data");

module.exports = (userId, ingredients) => {
  String.validate.notVoid(userId);
  if (!(ingredients instanceof Array))
    throw new TypeError("ingredients must be an array");
  let recipeMatches = [];

  return (async () => {
    const user = await User.findById(userId)
      .populate({
        path: "recipes",
        populate: {
          path: "ingredients.ingredient",
          model: "Ingredients",
        },
      })
      .lean();
    if (!user)
      throw new UnexistenceError(`user with id ${userId} does not exist`);

    ingredients.forEach((_ingredient) => {
      user.recipes.forEach((recipe) => {
        recipe.ingredients.forEach(({ ingredient }) => {
          const index = recipeMatches.findIndex(
            (item) => item.name === recipe.name
          );
          if (ingredient.name === _ingredient && index === -1) {
            recipeMatches.push(recipe);
          }
        });
      });
    });
    return recipeMatches;
  })();
};
