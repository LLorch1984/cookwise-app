/**
 *
 * it must retrive the day and the recipes
 *
 *@throws {error} if status its not 200
 *
 *
 */

require("cook-wise-commons/polyfills/string");
const { getDate } = require("./helpers");
const {
  utils: { call },
} = require("cook-wise-commons");
const context = require("./context");

module.exports = function () {
  const day = getDate();

  return (async () => {
    const token = await this.storage.getItem("TOKEN");

    const res = await call("GET", `${this.API_URL}/day/${day}`, undefined, {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    if (res.status === 200) {
      const result = JSON.parse(res.body);

      return { result, day };
    } else {
      const { error } = JSON.parse(res.body);

      throw new Error(error);
    }
  })();
}.bind(context);
