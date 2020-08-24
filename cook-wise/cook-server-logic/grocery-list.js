/**

It will create a grocery list by menu recipes

* @param {String} userId will find a userId in the database
 * 
 * @throws {Unexistence Error} if user doesn't match
 * 
 * @returns a grocery list
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

module.exports = (userId) => {
  String.validate.notVoid(userId);

  return (async () => {
    const user = await User.findById(userId)
      .populate({
        path: "schedule.recipe",
        populate: {
          path: "ingredients.ingredient",
          model: "Ingredients",
        },
      })
      .lean();

    if (!user)
      throw new UnexistenceError(`user with id ${userId} does not exist`);

    let { schedule } = user;

    let groceryList = [];

    schedule.forEach(({ recipe: { ingredients } }) => {
      ingredients.forEach((ingredient) => {
        if (groceryList.length) {
          groceryList.forEach((grocery) => {
            typeof groceryList.find(
              (grocery) => grocery.name === ingredient.ingredient.name
            ) !== "undefined"
              ? (grocery.quantity += ingredient.quantity)
              : groceryList.push({
                  name: ingredient.ingredient.name,
                  quantity: ingredient.quantity,
                });
          });
        }

        !groceryList.length &&
          groceryList.push({
            name: ingredient.ingredient.name,
            quantity: ingredient.quantity,
          });
      });
    });

    return groceryList;
  })();
};
