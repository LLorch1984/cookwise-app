const { retrieveRecipe } = require('cook-server-logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    try {
        const { params : {recipeId} } = req
        
        retrieveRecipe(recipeId)
            .then(recipe => res.send(recipe))
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}
