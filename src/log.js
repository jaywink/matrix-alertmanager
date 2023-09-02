// DEBUG | VERBOSE | INFO | WARNING | ERROR
const logLevel = process.env.LOG_LEVEL || 'INFO'

const log = {
    error: message => {
        console.error(message)
    },
    warn: message => {
        if ( ['DEBUG', 'VERBOSE', 'INFO', 'WARNING'].indexOf(logLevel) > -1 ) {
            console.warning(message)
        }
    },
    info: message => {
        if ( ['DEBUG', 'VERBOSE', 'INFO'].indexOf(logLevel) > -1 ) {
            console.info(message)
        }
    },
    verbose: message => {
        if ( ['DEBUG', 'VERBOSE'].indexOf(logLevel) > -1 ) {
            console.log(message)
        }
    },
    debug: message => {
        if ( ['DEBUG'].indexOf(logLevel) > -1 ) {
            console.debug(message)
        }
    }
}

module.exports = log
