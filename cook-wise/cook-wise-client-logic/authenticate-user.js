/**
 * Checks user credentials.
 *
 * @param {string} email The user e-mail.
 * @param {string} password The user password.
 *
 * @returns {Promise<String>} The authorization token if it resolves, an error if it rejects.
 *
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 * @throws {Error} If e-mail does not match the expected format.
 */
require("cook-wise-commons/polyfills/string");
const {
  utils: { Email, call },
} = require("cook-wise-commons");
const context = require("./context");

module.exports = function (email, password) {
  Email.validate(email);

  String.validate.notVoid(password);

  return (async () => {
    const res = await call(
      "POST",
      `${this.API_URL}/users/auth`,
      `{ "email": "${email}", "password": "${password}" }`,
      { "Content-type": "application/json" }
    );

    if (res.status === 200) {
      const { token } = JSON.parse(res.body);

      await this.storage.setItem("TOKEN", token);

      return;
    } else {
      const { error } = JSON.parse(res.body);

      throw new Error(error);
    }
  })();
}.bind(context);
