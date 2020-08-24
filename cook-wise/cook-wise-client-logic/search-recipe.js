/**
 * @param {String} query it will search a recipe by the query
 */

require("cook-wise-commons/polyfills/string");
const {
  utils: { call },
} = require("cook-wise-commons");
const context = require("./context");

module.exports = function (query) {
  String.validate.notVoid(query);

  return (async () => {
    const token = await this.storage.getItem("TOKEN");

    const res = await call(
      "GET",
      `${this.API_URL}/searchrecipes?name=${query}`,
      undefined,
      { "Content-type": "application/json", Authorization: `Bearer ${token}` }
    );

    if (res.status === 200) {
      const recipes = JSON.parse(res.body);

      return recipes;
    } else {
      const { error } = JSON.parse(res.body);

      throw new Error(error);
    }
  })();
}.bind(context);
