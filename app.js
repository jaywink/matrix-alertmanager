const express = require('express')
const matrix = require('matrix-js-sdk')

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
})

// Routes
app.get('/', (req, res) => res.send('Hey 👋'))

app.post('/alerts', (req, res) => {
    const secret = req.query.secret
    if (secret !== process.env.APP_ALERTMANAGER_SECRET) {
        res.status(403).end()
        return
    }
    const data = req.body

    // Post the event to the room
    const content = {
        'body': JSON.stringify(data),
        'msgtype': 'm.text',
    }
    matrixClient.sendEvent(
        process.env.MATRIX_ROOM,
        'm.room.message',
        content,
        '',
    ).done((err, res) => {})
    res.json({'status': 'ok'})
})

app.listen(process.env.APP_PORT, () => {})
