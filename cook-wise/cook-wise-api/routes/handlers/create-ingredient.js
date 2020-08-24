const { createIngredient} = require('cook-server-logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    const { body: { name } } = req

    try {
        createIngredient(name)
            .then (() => res.status(201).send())
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}