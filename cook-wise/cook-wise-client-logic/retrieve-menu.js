/**
 * @throws {error} if status its not 200
 *
 */

require("cook-wise-commons/polyfills/string");
const {
  utils: { call },
} = require("cook-wise-commons");
const context = require("./context");

module.exports = function () {
  return (async () => {
    const token = await this.storage.getItem("TOKEN");

    const res = await call("GET", `${this.API_URL}/retrieve/menu`, undefined, {
      Authorization: `Bearer ${token}`,
    });

    if (res.status === 200) {
      if (!res.body) return [];
      const schedule = JSON.parse(res.body);

      return schedule;
    } else {
      const { error } = JSON.parse(res.body);

      throw new Error(error);
    }
  })();
}.bind(context);
