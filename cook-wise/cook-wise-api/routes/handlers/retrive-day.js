const { retriveDay } = require('cook-server-logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    try {
        const { params : {weekday}, payload: { sub: userId } } = req
        
        retriveDay(weekday,userId)
            .then(result => res.send(result))
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}
