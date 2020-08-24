/**
 *It will mark or unmark a recipe as favorite
 *
 *  @param {String} recipeId
 *
 * @throws {error} if status its not 204
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

    const res = await call(
      "PATCH",
      `${this.API_URL}/toogle/${recipeId}`,
      undefined,
      { "Content-type": "application/json", Authorization: `Bearer ${token}` }
    );
    if (res.status === 204) {
      return;
    } else {
      const { error } = JSON.parse(res.body);

      throw new Error(error);
    }
  })();
}.bind(context);
