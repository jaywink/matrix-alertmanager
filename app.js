const express = require('express')
const matrix = require('matrix-js-sdk')
const utils = require('./utils')

// Config
require('dotenv').config()

// App
const app = express()
app.use(express.json())

// Init Matrix client
const matrixClient = matrix.createClient({
    baseUrl: process.env.MATRIX_HOMESERVER_URL,
    accessToken: process.env.MATRIX_TOKEN,
    userId: process.env.MATRIX_USER,
    localTimeoutMs: 10000,
})

// Routes
app.get('/', (req, res) => res.send('Hey 👋'))

app.post('/alerts', (req, res) => {
    const secret = req.query.secret
    if (secret !== process.env.APP_ALERTMANAGER_SECRET) {
        res.status(403).end()
        return
    }
    const alerts = utils.parseAlerts(req.body)

    if (!alerts) {
        res.json({'result': 'no alerts found in payload'})
        return
    }

    const roomId = utils.getRoomForReceiver(req.body.receiver)
    if (!roomId) {
        res.json({'result': 'no rooms configured for this receiver'})
        return
    }

    alerts.forEach(alert => {
        matrixClient.sendEvent(
            roomId,
            'm.room.message',
            {
                'body': alert,
                'msgtype': 'm.notice',
            },
            '',
        ).done((err, res) => {})
    })

    res.json({'result': 'ok'})
})

app.listen(process.env.APP_PORT, () => {})
