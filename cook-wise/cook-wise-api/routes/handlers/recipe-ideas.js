const { recipeIdeas } = require('cook-server-logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    try {
        const { query : {ingredients}, payload: { sub: userId } } = req
        
        recipeIdeas(userId, ingredients.split(','))
            .then(result => res.send(result))
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}
