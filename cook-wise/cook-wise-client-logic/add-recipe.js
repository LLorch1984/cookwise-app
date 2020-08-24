/**
 *
 * it must recive the recipe params and send it to the DB
 *
 * @param {String} nameRecipie will be the name of the recipe
 *
 * @param {String} authorRecipe will be the author of the recipe
 *
 * @param {String} description a few description of the recipe
 *
 * @param {Number} time the time of the recipe it will be cooked
 *
 * @param {Array} array that contains the ingredients of de recipe and his quantity
 */

require("cook-wise-commons/polyfills/string");
require("cook-wise-commons/polyfills/number");
const context = require("./context");
const {
  utils: { Email, call },
} = require("cook-wise-commons");

module.exports = function (
  nameRecipe,
  authorRecipe,
  description,
  time,
  ingredients
) {
  String.validate(nameRecipe);
  String.validate(authorRecipe);
  String.validate(description);
  Number.validate(time);
  if (!(ingredients instanceof Array))
    throw new Error("you must put ingredients on the recipe");

  return (async () => {
    const token = await this.storage.getItem("TOKEN");

    const res = await call(
      "POST",
      `${this.API_URL}/recipes`,
      JSON.stringify({
        name: nameRecipe,
        author: authorRecipe,
        description,
        time,
        ingredients,
      }),
      { "Content-type": "application/json", Authorization: `Bearer ${token}` }
    );

    if (res.status === 201) return;

    const { error } = JSON.parse(res.body);

    throw new Error(error);
  })();
}.bind(context);
