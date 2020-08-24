require('dotenv').config()

const { argv: [, , PORT_CLI], env: { PORT: PORT_ENV, MONGODB_URL } } = process
const PORT = PORT_CLI || PORT_ENV || 8080

const path = require('path')


 const { api } = require('./routes') 

const express = require('express')

const { name, version } = require('./package.json')
const { cors } = require('./middlewares')
const { mongoose } = require('cook-wise-data')

console.debug('starting server')
debugger
try {
    console.debug('connecting to database')

    mongoose.connect(MONGODB_URL)
        .then(() => {
            console.info(`connected to database ${MONGODB_URL}`)

            const app = express()

            app.use(cors)

             app.use('/api', api) 

            // other

            app.get('*', (req, res) => {
                res.status(404).send('Not Found :(')
            })

            app.listen(PORT, () => console.info(`server ${name} ${version} running on port ${PORT}`))

            let interrupted = false

            process.on('SIGINT', () => {
               /*  if (!interrupted) {
                    interrupted = true

                    console.debug('stopping server')

                    console.debug('disconnecting database') */

                    mongoose.disconnect()
                        /* .then(() => console.info('disconnected database'))
                        .catch(error => file.error('could not disconnect from mongo', error))
                        .finally(() => {
                            console.info(`server ${name} ${version} stopped`)
 */
                .then(()=>setTimeout(() => {
                process.exit()
                }, 500))
                       /*  }) */
               /*  } */
            }) 
        })
       
}catch(error) {
    console.error(error)
}