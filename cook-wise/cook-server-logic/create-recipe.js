/**
 * It must create a new recipe
 *
 * @param {Object} with the data for create the recipe
 *
 * @throws {Unexistance Error} if user doesn't exist
 *
 * @throws {Duplicity Error} if the recipe already exist
 *
 * @throws {Duplicity Error} if the ingredients quantity is 0 or less
 *
 * @returns a recipe
 */

require("cook-wise-commons/polyfills/string");
require("cook-wise-commons/polyfills/number");
const {
  errors: { DuplicityError, UnexistenceError },
} = require("cook-wise-commons");
const {
  models: { Recipes, User, Ingredients },
} = require("cook-wise-data");

module.exports = ({ name, author, time, ingredients, description, userId }) => {

  String.validate.notVoid(name);
  String.validate.notVoid(author);
  String.validate.notVoid(userId);
  Number.validate(time);
  if (!(ingredients instanceof Array))
    throw new Error("you must put ingredients on the recipe");
  String.validate.notVoid(description);

  return (async () => {
   
    const _ingredients = [];
    ingredients.forEach(async (ingredient) => {
      const { selectedValue: name, selectedQuantity: quantity } = ingredient;
      const ingredientsFind = await Ingredients.findOne({ name }).lean();

      if (!ingredientsFind)
        throw new UnexistenceError(`that ingredient does not exist`);

      ingredientsFind.quantity = quantity;
      ingredientsFind.ingredient = ingredientsFind._id;
      delete ingredientsFind._id;

      _ingredients.push(ingredientsFind);
    });

    const user = await User.findById(userId);
    if (!user)
      throw new UnexistenceError(`user with id ${userId} does not exist`);

    _ingredients.forEach((ingredient) => {
      if (ingredient.quantity <= 0)
        throw new UnexistenceError(`ingredient must have a quantity`);
    });

    const recipes = await Recipes.findOne({ name, author });
    if (recipes) throw new DuplicityError(`${name} of ${author} already exist`);

    const recipe = await Recipes.create({
      name,
      author,
      description,
      time,
      ingredients: _ingredients,
    });
    await User.findByIdAndUpdate(userId, { $addToSet: { recipes: recipe } });

    return;
  })();
};
