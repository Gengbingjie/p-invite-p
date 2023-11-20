const { outJson } = require('./utils')
const http = require('./axios')
const { HTTPURL } = require('../config/Constant')
module.exports = {
    async getUserId(tokenData) {
        const { token } = tokenData
        if (!token) {
            ctx.body = outJson(ctx, 40002)
            return;
        }

        const checkResult = await http.get(HTTPURL.authUser, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).catch((err) => {
            console.log('token无效!')
            ctx.body = outJson(ctx, 40002)
            return
        })

        if (checkResult) {
            return checkResult.sub
        } else {
            ctx.body = outJson(ctx, 40002)
            return;
        }
    }
}