const utils = {

    getRoomForReceiver: receiver => {
        /*
        Get the right roomId for the given receiver from MATRIX_ROOMS configuration item.

        For is <receiver/roomId> separated by pipe for multiple receiver/rooms.
         */
        const roomConfigs = process.env.MATRIX_ROOMS.split('|')
        let roomId = false
        for (let config of roomConfigs) {
            const roomConfig = config.split('/')
            if (roomConfig[0] === receiver) {
                roomId = roomConfig[1]
                break
            }
        }
        return roomId
    },

    formatAlert: data => {
        /*
        Format a single alert into a message string.
         */
        let parts = []

        if (data.status === 'firing') {
            parts.push('<strong><font color=\"#ff0000\">FIRING:</font></strong>')
        } else if (data.status === 'resolved') {
            parts.push('<strong><font color=\"#33cc33\">RESOLVED:</font></strong>')
        } else {
            parts.push(data.status.toUpperCase() + ':')
        }

        if (data.labels.host !== undefined) {
            parts.push(data.labels.host)
        } else {
            if (data.labels.instance !== undefined) {
                parts.push(data.labels.instance)
            }
        }

        parts.push('<br>', data.annotations.description)
        parts.push('<br><a href="', data.generatorURL,'">Alert link</a>')

        return parts.join(' ')
    },

    parseAlerts: data => {
        /*
        Parse AlertManager data object into an Array of message strings.
         */
        if (!data.alerts) {
            return []
        }

        let alerts = []

        data.alerts.forEach(alert => {
            alerts.push(utils.formatAlert(alert))
        })
        return alerts
    },
}

module.exports = utils
