const { searchRecipe } = require('cook-server-logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    try {
        const { payload: { sub: userId }, query: {name: query} } = req
        
        searchRecipe(query, userId)
            .then(recipes => res.send(recipes))
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}
