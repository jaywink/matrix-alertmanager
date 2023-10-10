const client = require('./client')
const utils = require('./utils')
const log = require('./log')

const routes = {
    getRoot: (req, res) => {
        res.send('Hey 👋')
    },
    postAlerts: async (req, res) => {
        const secret = req.query.secret || utils.getBasicAuthPassword(req)
        if (secret !== process.env.APP_ALERTMANAGER_SECRET) {
            res.status(403).end()
            return
        }
        if ( process.env.LOG_LEVEL === 'DEBUG' ) {
            log.verbose(JSON.stringify(req.body))
        }
        const alerts = utils.parseAlerts(req.body)

        if (!alerts) {
            const msg = 'no alerts found in payload'
            log.info(msg)
            res.json({'result': msg})
            return
        }

        const roomId = utils.getRoomForReceiver(req.body.receiver)
        if (!roomId) {
            const msg = 'no rooms configured for this receiver'
            log.info(msg)
            res.json({'result': msg})
            return
        }

        try {
            const promises = alerts.map(alert => client.sendAlert(roomId, alert))
            await Promise.all(promises)
            res.json({'result': 'ok'})
        } catch (e) {
            log.error(e)
            res.status(500)
            res.json({'result': 'error sending alert'})
        }
    },
}

module.exports = routes
