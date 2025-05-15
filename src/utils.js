const utils = {

    getBasicAuthPassword: req => {
        const content = req.get("Authorization").replace(/^Basic /, '')
        return atob(content).replace(/^alertmanager:/, '')
    },

    getRoomForReceiver: receiver => {
        /*
        Get the right roomId for the given receiver from MATRIX_ROOMS configuration item.

        For is <receiver/roomId> separated by pipe for multiple receiver/rooms.
         */
        const roomConfigs = process.env.MATRIX_ROOMS.split('|')
        let roomId = false
        for (let config of roomConfigs) {
            const i = config.lastIndexOf('/')
            if (config.slice(0, i) === receiver) {
                roomId = config.slice(i+1)
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
                  case 'none':
                    return '#17a2b8'; // blue
                  default:
                    return '#dc3545'; // red
                }
              })(data.labels.severity);
            parts.push('<strong><font color=\"' + color + '\">FIRING:</font></strong>')
        } else if (data.status === 'resolved') {
            parts.push('<strong><font color=\"#33cc33\">RESOLVED:</font></strong>')
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
        // Add custom links if configured
        if (process.env.ALERT_LINKS) {
            const linkConfigs = process.env.ALERT_LINKS.split('|')
            for (let linkConfig of linkConfigs) {
                const firstColonIndex = linkConfig.indexOf(':')
                if (firstColonIndex === -1) {
                    console.error("Misconfigured ALERT_LINKS option")
                    continue
                }

                const name = linkConfig.substring(0, firstColonIndex)
                let url = linkConfig.substring(firstColonIndex + 1)

                if (name && url) {
                    if (url.includes('{generatorURL}')) {
                        url = url.replace('{generatorURL}', data.generatorURL)
                    }

                    // This is a way to check if the `url` contains a single
                    // annotation. If it's a single annotation and the data for
                    // it is empty or isn't in the data then skip this entry
                    // completely.
                    const singleAnnotation = url.match(/^\{annotations\.([^}]+)\}$/)
                    if (singleAnnotation && (!data.annotations[singleAnnotation[1]] || data.annotations[singleAnnotation[1]] === '')) {
                        continue
                    }

                    url = url.replace(/{labels\.([^}]+)}/g, (match, labelName) => {
                        return data.labels[labelName] || ''
                    })
                    url = url.replace(/{annotations\.([^}]+)}/g, (match, annotationName) => {
                        return data.annotations[annotationName] || ''
                    })
                    parts.push('<br><a href="', url, '">', name, '</a>')
                }
            }
        } else {
            // Fallback to the original message if no custom links configured
            parts.push('<br><a href="', data.generatorURL,'">Alert link</a>')
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
