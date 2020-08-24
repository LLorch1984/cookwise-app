/**
 *
 * throw a recipeId for delete a recipe
 *
 * @param {String} recipeId the recipeId that will be deleted
 *
 * @throw {Error} if status is not 200
 */

require("cook-wise-commons/polyfills/string");
const { getDate } = require("./helpers");
const {
  utils: { call },
} = require("cook-wise-commons");
const context = require("./context");

module.exports = function (recipeId) {

  String.validate.notVoid(recipeId);

  return (async () => {
    const token = await this.storage.getItem("TOKEN");

    const res = await call(
      "DELETE",
      `${this.API_URL}/deleterecipe`,
      `{ "recipeId": "${recipeId}"}`,
      { "Content-type": "application/json", Authorization: `Bearer ${token}` }
    );

    if (res.status === 202) {
      return;
    } else {
      const { error } = JSON.parse(res.body);

      throw new Error(error);
    }
  })();
}.bind(context);
