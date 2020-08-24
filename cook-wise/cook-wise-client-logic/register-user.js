/**
 *
 * it must recive the user params and send it to the DB
 *
 * @param {String} name will be the name of the user
 *
 * @param {String} surname will be the surname of the user
 *
 * @param {String} email will be the username of the user
 *
 * @param {String} password will be the key for authenticate the user
 *
 *
 */

require("cook-wise-commons/polyfills/string");
const {
  utils: { Email, call },
} = require("cook-wise-commons");
const context = require("./context");

module.exports = function (name, surname, email, password) {
  String.validate(name);
  String.validate(surname);
  Email.validate(email);
  String.validate.lengthGreaterEqualThan(password, 8);

  return call(
    "POST",
    `${this.API_URL}/users`,
    `{ "name": "${name}", "surname": "${surname}", "email": "${email}", "password": "${password}" }`,
    { "Content-type": "application/json" }
  ).then(({ status, body }) => {
    if (status === 201) return;

    const { error } = JSON.parse(body);

    throw new Error(error);
  });
}.bind(context);
