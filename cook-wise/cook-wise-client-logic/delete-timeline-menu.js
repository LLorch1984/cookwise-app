/**
 *
 * it will delete th recipes of one day on each timeline
 *
 * @param {String} weekday the recipeId that will be deleted
 *
 * @param {String} timeline
 *
 * @throw {Error} if status is not 200
 */

require("cook-wise-commons/polyfills/string");
const {
  utils: { call },
} = require("cook-wise-commons");
const context = require("./context");

module.exports = function (weekday, timeline) {
  String.validate.notVoid(weekday);
  String.validate.notVoid(timeline);

  return (async () => {
    const token = await this.storage.getItem("TOKEN");

    const res = await call(
      "DELETE",
      `${this.API_URL}/deletetimelinemenu`,
      `{ "weekday": "${weekday}", "timeline": "${timeline}"}`,
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
