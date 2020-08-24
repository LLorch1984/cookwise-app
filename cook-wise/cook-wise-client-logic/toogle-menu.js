/**
 * 
it must put a recipe on the menu
 * 
 * @param {String} weekday the weekday for that recipe
 * 
 * @param {String} timeline it will be for lunch or dinner
 * 
 * @param {String} recipeId it will mark what recipe it will added
 * 
 */
require("cook-wise-commons/polyfills/string");
const {
  utils: { call },
} = require("cook-wise-commons");
const context = require("./context");

module.exports = function (weekday, timeline, recipeId) {
  String.validate.notVoid(recipeId);
  String.validate.notVoid(timeline);
  String.validate.notVoid(weekday);

  return (async () => {
    const token = await this.storage.getItem("TOKEN");

    let schedule = { weekday, timeline, recipeId };

    const res = await call(
      "PATCH",
      `${this.API_URL}/tooglemenu`,
      `{"schedule" : {"weekday": "${weekday}", "timeline": "${timeline}", "recipe":"${recipeId}"} }`,
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
