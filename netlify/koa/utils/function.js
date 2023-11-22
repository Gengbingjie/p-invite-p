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
    },
    generateInvitationCode(userOpenId) {
        const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let invitationCode = '';

        // 随机选择一个字符作为组合的第一个字符
        const firstChar = characters[Math.floor(Math.random() * characters.length)];
        invitationCode += firstChar;

        // 从给定字符串中选择一个字符作为组合的第二个字符
        const secondChar = userOpenId[Math.floor(Math.random() * userOpenId.length)];
        invitationCode += secondChar;

        // 继续随机选择五个字符作为组合的剩余部分
        for (let i = 2; i < 7; i++) {
            invitationCode += characters[Math.floor(Math.random() * characters.length)];
        }

        return invitationCode;
    }
}