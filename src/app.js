const express = require('express')
const client = require('./client')
const routes = require('./routes')
const log = require('./log')

// Config
require('dotenv').config()

// App
const app = express()
app.use(express.json({ limit: 1048576 })) // 1MiB
// Routes
app.get('/', routes.getRoot)
app.post('/alerts', routes.postAlerts)
// Initialize Matrix client
client.init().then(() => {
    log.info('matrix-alertmanager initialized and ready')
    app.listen(process.env.APP_PORT, () => {})
}).catch(e => {
    log.error('initialization failed')
    log.error(e)
})

module.exports = app
