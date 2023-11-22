const db = require('../lib/mysql')
const { outJson } = require('../utils/utils')

module.exports = async (ctx, next) => {
    db.init().then(async res => {
        console.log('mysql连接成功')
        await next()
    }).catch(err => {
        console.log(err)
        console.log('mysql连接失败')
        ctx.body = outJson(ctx, 50001)
        return
    })
}