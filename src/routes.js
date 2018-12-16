const client = require('./client')
const utils = require('./utils')

const routes = {
    getRoot: (req, res) => {
        res.send('Hey 👋')
    },
    postAlerts: (req, res) => {
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
            client.sendAlert(roomId, alert)
        })

        res.json({'result': 'ok'})
    },
}

module.exports = routes
