const { createRecipe} = require('cook-server-logic')
const { handleError } = require('../../helpers')




module.exports = (req, res) => {
    const { payload: { sub: userId }, body: { name, author, time, ingredients, description} } = req

    try {
        createRecipe({name, author, time, ingredients,description,userId} )
            .then (() => res.status(201).send())
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}