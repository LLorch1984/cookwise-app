const { env: { SECRET } } = process

const { authenticateUser } = require('cook-server-logic')
const { handleError } = require('../../helpers')
const jwtPromised = require('cook-wise-node-commons')

module.exports = (req, res) => {
    const { body: { email, password } } = req

    try {
        authenticateUser(email, password)
            .then(userId => jwtPromised.sign({ sub: userId }, SECRET, { expiresIn: '1d' }))
            .then(token => res.send({ token }))
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}