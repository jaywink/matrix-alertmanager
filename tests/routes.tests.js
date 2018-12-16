/* eslint-disable no-undef */
const chai = require('chai')
const sinon = require('sinon')
const client = require('../src//client')
const fixtures = require('./fixtures')
const routes = require('../src/routes')
const utils = require('../src/utils')

const expect = chai.expect
require('dotenv').config({path: '.env.default'})

describe('routes', function() {
    describe('getRoot', function() {
        it('waves', function() {
            let req = {}
            let res = {
                send: sinon.spy()
            }
            routes.getRoot(req, res)

            expect(res.send.calledOnce).to.be.true
            expect(res.send.firstCall.args[0]).to.equal('Hey 👋')
        })
    })

    describe('postAlerts', function() {
        before(function() {
            this.clientStub = sinon.stub(client, 'sendAlert').returns(true)
            this.req = {
                body: fixtures.alerts,
                query: {
                    secret: process.env.APP_ALERTMANAGER_SECRET,
                },
            }
            this.res = {
                json: sinon.spy()
            }
        })

        it('calls client sendAlert for each alert', function() {
            routes.postAlerts(this.req, this.res)

            expect(this.clientStub.calledTwice).to.be.true
        })

        it('calls parseAlerts', function() {
            const parseStub = sinon.stub(utils, 'parseAlerts').returns([])

            routes.postAlerts(this.req, this.res)

            expect(parseStub.calledOnce).to.be.true
            expect(parseStub.firstCall.args[0]).to.eql(fixtures.alerts)

            parseStub.restore()
        })

        it('returns ok', function() {
            routes.postAlerts(this.req, this.res)

            expect(this.res.json.calledOnce).to.be.true
            expect(this.res.json.firstCall.args[0]).to.eql({'result': 'ok'})
        })

        afterEach(function() {
            this.clientStub.reset()
            sinon.reset(this.res.json)
        })
    })
})
