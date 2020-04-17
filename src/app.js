const express = require('express')
const client = require('./client')
const routes = require('./routes')

// Config
require('dotenv').config()

// App
const app = express()
app.use(express.json())
// Routes
app.get('/', routes.getRoot)
app.post('/alerts', routes.postAlerts)
// Initialize Matrix client
client.init().then(() => {
    // eslint-disable-next-line no-console
    console.log('matrix-alertmanager initialized and ready')
    app.listen(process.env.APP_PORT, () => {})
}).catch(e => {
    // eslint-disable-next-line no-console
    console.error('initialization failed')
    // eslint-disable-next-line no-console
    console.error(e)
})

module.exports = app
