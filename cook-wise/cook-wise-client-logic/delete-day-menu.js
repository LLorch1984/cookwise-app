/**
 * it will delete a recipes of one day
 *
 * @param {String} weekday it will mark what day will be deleted
 */

require("cook-wise-commons/polyfills/string");
const {
  utils: { call },
} = require("cook-wise-commons");
const context = require("./context");

module.exports = function (weekday) {
  String.validate.notVoid(weekday);

  return (async () => {
    const token = await this.storage.getItem("TOKEN");

    const res = await call(
      "DELETE",
      `${this.API_URL}/deletedaymenu`,
      `{ "weekday": "${weekday}"}`,
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
