/**
 *
 * must found recipes by query
 *
 * @param {String} query must search by this param
 *
 * @param {String} userId it must find the user owner of the recipes
 *
 * @throws {Unexistance Error} if user doesn't exist
 *
 * @throws {Unexistance Error} if recipe doesn't match
 */
require("cook-wise-commons/polyfills/string");
const {
  errors: { UnexistenceError },
} = require("cook-wise-commons");
const {
  models: { User },
} = require("cook-wise-data");

module.exports = (query, userId) => {
  String.validate.notVoid(query);
  String.validate.notVoid(userId);

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

    let recipesFind = user.recipes.filter(
      (recipe) => recipe.name === query || recipe.author === query
    );

    if (recipesFind.length === 0)
      throw new UnexistenceError(`${query} is not found like recipe or author`);

    recipesFind.forEach((recipeFind) => {
      recipeFind.id = recipeFind._id.toString();

      delete recipeFind._id;
      delete recipeFind.__v;

      recipeFind.ingredients.forEach((singleIng) => {
        delete singleIng._id;
        const name = singleIng.ingredient.name;

        singleIng.ingredient = name;
      });
    });

    return recipesFind;
  })();
};
