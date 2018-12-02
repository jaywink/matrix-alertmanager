const express = require('express')
const app = express()

require('dotenv').config()

app.use(express.json())

app.get('/', (req, res) => res.send('Hey 👋'))

app.post('/alerts', (req, res) => {
    const secret = req.query.secret
    if (secret !== process.env.APP_ALERTMANAGER_SECRET) {
        res.status(403).end()
        return
    }
    // console.log(req.body)
    res.json({'status': 'ok'})
})

app.listen(process.env.APP_PORT, () => {})
