const { retrieveFavorite } = require('cook-server-logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    try {
        const { payload: { sub: userId } } = req
        
        retrieveFavorite(userId)
            .then(recipes => res.json(recipes))
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}
