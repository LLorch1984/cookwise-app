/**
 *
 * it will delete th recipes of one day on each timeline
 *
 *
 *
 * @throw {Error} if status is not 200
 */

require("cook-wise-commons/polyfills/string");
const {
  utils: { call },
} = require("cook-wise-commons");
const context = require("./context");
const { UnexistenceError } = require("cook-wise-commons/errors");

module.exports = function () {
  return (async () => {
    const token = await this.storage.getItem("TOKEN");

    const res = await call("GET", `${this.API_URL}/grocerylist`, undefined, {
      Authorization: `Bearer ${token}`,
    });

    if (res.status === 200) {
      if (!res.body) return [];
      const groceryList = JSON.parse(res.body);

      return groceryList;
    } else {
      const { error } = JSON.parse(res.body);

      throw new Error(error);
    }
  })();
}.bind(context);
