const { deleteRecipe} = require('cook-server-logic')
const { handleError } = require('../../helpers')




module.exports = (req, res) => {
    const { payload: { sub: userId }, body: { recipeId } } = req

    try {
        deleteRecipe(userId,recipeId )
            .then (() => res.status(202).send())
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}