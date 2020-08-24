/**
 * it will return a recipe
 *
 * @param {String}  RecipeId will find a recipe in the database
 *
 * @throws {Unexistence Error} if the recipe doesn't exist
 */

require("cook-wise-commons/polyfills/string");
const {
  errors: { UnexistenceError },
} = require("cook-wise-commons");
const {
  models: { Recipes },
} = require("cook-wise-data");

module.exports = (recipeId) => {
  String.validate.notVoid(recipeId);

  return (async () => {
    const recipe = await Recipes.findById(recipeId)
      .populate("ingredients.ingredient", "name")
      .lean();

    if (!recipe)
      throw new UnexistenceError(`recipe with id ${recipeId} does not exist`);

    delete recipe._id;
    delete recipe.__v;

    recipe.ingredients.forEach((singleIng) => {
      delete singleIng._id;
      const name = singleIng.ingredient.name;

      singleIng.ingredient = name;
    });

    return recipe;
  })();
};
