const matrix = require('matrix-js-sdk')
const striptags = require('striptags')

let joinedRoomsCache = []

const client = {
    ensureInRoom: async function(roomId) {
        if (joinedRoomsCache.indexOf(roomId === -1)) {
            try {
                const room = await client.connection.joinRoom(roomId)
                if (room) {
                    joinedRoomsCache.push(room.roomId)
                }
            } catch (ex) {
                console.warn(`Could not join room ${roomId} - ${ex}`)
            }
        }
    },
    init: function() {
        // Init Matrix client
        this.connection = matrix.createClient({
            baseUrl: process.env.MATRIX_HOMESERVER_URL,
            accessToken: process.env.MATRIX_TOKEN,
            userId: process.env.MATRIX_USER,
            localTimeoutMs: 10000,
        })

        // Ensure in right rooms
        this.connection.getJoinedRooms().then(rooms => {
            const joinedRooms = rooms.joined_rooms
            const roomConfigs = process.env.MATRIX_ROOMS.split('|')
            roomConfigs.forEach(roomConfig => {
                const room = roomConfig.split('/')
                if (joinedRooms.indexOf(room[1]) === -1) {
                    this.ensureInRoom(room[1])
                }
            })
        })
    },
    sendAlert: function(roomId, alert) {
        try {
            this.ensureInRoom(roomId)
                .then(() => {
                    this.connection.sendEvent(
                        roomId,
                        'm.room.message',
                        {
                            'body': striptags(alert),
                            'formatted_body': alert,
                            'msgtype': 'm.text',
                            'format': 'org.matrix.custom.html'
                        },
                        '',
                    )
                })
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err)
        }
    },
}

module.exports = client
