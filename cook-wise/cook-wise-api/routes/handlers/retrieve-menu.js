const { retrieveMenu } = require('cook-server-logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    try {
        const { payload: { sub: userId } } = req
        
        retrieveMenu(userId)
            .then(menu => res.send(menu))
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}
