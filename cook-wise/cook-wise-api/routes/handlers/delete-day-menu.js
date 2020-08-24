const { deleteDayMenu} = require('cook-server-logic')
const { handleError } = require('../../helpers')




module.exports = (req, res) => {
    const { payload: { sub: userId }, body:  { weekday} } = req

    try {
        deleteDayMenu(weekday, userId )
            .then (() => res.status(202).send())
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}