/**
 * @param {String} recipeId the recipeId
 *
 * @throws {error} if status its not 200
 *
 */

require("cook-wise-commons/polyfills/string");
const {
  utils: { call },
} = require("cook-wise-commons");
const context = require("./context");

module.exports = function (recipeId) {

  String.validate.notVoid(recipeId);

  return (async () => {
    const token = await this.storage.getItem("TOKEN");

    const res = await call("GET", `${this.API_URL}/${recipeId}`, undefined, {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    if (res.status === 200) {
      const recipe = JSON.parse(res.body);

      return recipe;
    } else {
      const { error } = JSON.parse(res.body);

      throw new Error(error);
    }
  })();
}.bind(context);
