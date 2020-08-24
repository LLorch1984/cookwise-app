const { toogleMenu } = require('cook-server-logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {debugger
    try {
        
        const { body: {schedule } , payload : { sub :userId} } = req
        
        
        toogleMenu(schedule,userId)
            .then(() => res.status(204).send())
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}
