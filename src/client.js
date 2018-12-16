const matrix = require('matrix-js-sdk')

const client = {
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
                    client.connection.joinRoom(room[1])
                }
            })
        })
    },
    sendAlert: function(roomId, alert) {
        try {
            this.connection.sendEvent(
                roomId,
                'm.room.message',
                {
                    'body': alert,
                    'msgtype': 'm.notice',
                },
                '',
            )
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err)
        }
    },
}

module.exports = client
