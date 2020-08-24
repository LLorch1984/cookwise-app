/**
 
it will show all day recipes 

*@param {String} weekday that will mark the day that will search for
 
 @param {String} userId  it will find a user in the database

 @throws {UnexistenceError} if the user doesn't exist
 * 
 */

require("cook-wise-commons/polyfills/string");
const {
  errors: { UnexistenceError },
} = require("cook-wise-commons");
const {
  models: { Recipes, User },
} = require("cook-wise-data");

module.exports = (weekday, userId) => {
  String.validate.notVoid(userId);
  String.validate.notVoid(weekday);

  return (async () => {
    const user = await User.findById(userId).lean().populate("user.schedule");
    if (!user)
      throw new UnexistenceError(`user with id ${userId} does not exist`);
    let recipeArray = [];
    let result = [];

    for (var i = 0; i < user.schedule.length; i++) {
      if (user.schedule[i].weekday === weekday) {
        recipeArray.push(user.schedule[i].recipe);
      }
    }
    for (var j = 0; j < recipeArray.length; j++) {
      const recipe = await Recipes.findById(recipeArray[j])
        .lean()
        .populate("ingredients.ingredient", "name");

      if (!recipe)
        throw new UnexistenceError(
          `recipe with id ${recipeArray[j]} does not exist`
        );

      recipe.id = recipe._id.toString();

      delete recipe._id;
      delete recipe.__v;

      recipe.ingredients.forEach((singleIng) => {
        delete singleIng._id;
        const name = singleIng.ingredient.name;

        singleIng.ingredient = name;

        ;
      });
      result.push(recipe)
    }

    return result;
  })();
};
