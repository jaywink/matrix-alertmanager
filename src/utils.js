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
        //console.log(data)

        if (data.status === 'firing') {
            if (process.env.MENTION_ROOM === "1") {
                parts.push('@room', '<br>')
            }
            let color = (function(severity) {
                switch(severity) {
                  case 'warning':
                    return '#ffc107'; // orange
                  case 'critical':
                    return '#dc3545'; // red                       
                  case 'none':
                    return '#17a2b8'; // blue
                  default:
                    return '#dc3545'; // red
                }
              })(data.labels.severity);
            parts.push('<strong>🔥🔥🔥 <font color=\"' + color + '\">FIRING:</font></strong>')
        } else if (data.status === 'resolved') {
            parts.push('<strong>✅✅✅ <font color=\"#33cc33\">RESOLVED:</font></strong>')
        } else {
            parts.push(data.status.toUpperCase() + ':')
        }

        // name and location of occurrence
        if (data.labels.alertname !== undefined) {
            parts.push('<i>', data.labels.alertname, '</i>')
            if (data.labels.host !== undefined || data.labels.instance !== undefined) {
                parts.push(' at ')
            }
        }
        if (data.labels.host !== undefined) {
            parts.push(data.labels.host)
        } else if (data.labels.instance !== undefined) {
            parts.push(data.labels.instance)
        }

        // additional descriptive content
        if (data.annotations.message !== undefined) {
            parts.push('<br>', data.annotations.message.replace("\n", "<br>"))
        }
        if (data.annotations.description !== undefined) {
            parts.push('<br>', data.annotations.description)
        }
        
        if (data.labels.severity === 'critical') {
            parts.push('<br><b>Severity: <font color="#dc3545">critical</font></b>')
        } else if (data.labels.severity === 'warning') {
            parts.push('<br><b>Severity: <font color="#ffc107">warning</font></b>')
        }        
        


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
