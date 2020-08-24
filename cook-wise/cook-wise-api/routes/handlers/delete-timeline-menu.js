const { deleteTimelineMenu} = require('cook-server-logic')
const { handleError } = require('../../helpers')




module.exports = (req, res) => {
    const { payload: { sub: userId }, body:  { weekday, timeline } } = req

    try {
        deleteTimelineMenu(weekday, timeline, userId )
            .then (() => res.status(202).send())
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}