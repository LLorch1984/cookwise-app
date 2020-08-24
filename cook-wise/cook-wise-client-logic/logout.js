require("cook-wise-commons/polyfills/string");

const context = require("./context");

module.exports = function () {
  return (async () => {
    await this.storage.clear();

    return;
  })();
}.bind(context);
