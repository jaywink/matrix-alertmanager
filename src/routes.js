const client = require('./client')
const utils = require('./utils')

const routes = {
    getRoot: (req, res) => {
        res.send('Hey 👋')
    },
    postAlerts: async (req, res) => {
        let secret = req.query.secret
        if (!secret && req.get("Authorization")) {
            secret = utils.getBasicAuthPassword(req)
        }
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

        try {
            const promises = alerts.map(alert => client.sendAlert(roomId, alert))
            await Promise.all(promises)
            res.json({'result': 'ok'})
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e)
            res.status(500)
            res.json({'result': 'error'})
        }
    },
}

module.exports = routes
