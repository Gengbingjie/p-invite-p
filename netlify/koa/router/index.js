const api = require('../controller/index')

module.exports = (router) => {
    router.get('/api/init', api.init)
    router.get('/api/callback', api.callback)
}