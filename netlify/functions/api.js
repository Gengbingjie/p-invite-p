const app = require('../koa/app')
const serverless = require('serverless-http')

module.exports.handler = serverless(app)
