const context = require("./context");

module.exports = async function () {
  const token = await this.storage.getItem("TOKEN");

  return !!token;
}.bind(context);
