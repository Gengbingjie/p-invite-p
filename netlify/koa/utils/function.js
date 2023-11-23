const { outJson } = require('./utils');
const http = require('./axios');
const { HTTPURL, DATA_KEY } = require('../config/Constant');
const db = require('../lib/mysql')
module.exports = {
    async getUserId(ctx, token) {
        if (!token) {
            return '';
        }
        console.log('token')
        console.log(token)
        const checkResult = await http.get(HTTPURL.authUser, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).catch((err) => {
            console.log('token无效!')
            console.log(err)
            return ''
        })

        if (checkResult) {
            return checkResult.sub
        } else {
            return '';
        }
    },
    async fulfillStatus(userId, skuId, ctx) {
        if (!userId) {
            return -1
        }
        let url = `${HTTPURL.domainName}/fulfillment/v2/status/${userId}/${skuId}?api_key=${DATA_KEY.apiKey}`;
        let resp, status;
        try {
            resp = await http.get(url)
        } catch (err) {
            console.log('=============查询礼物状态错误信息=================')
            console.log(err)
            resp = false;
            ctx.body = outJson(ctx, 50001)
            return
        }

        if (resp === false) {
            return 0;
        }
        if (resp === false || !resp.status) {
            return 0
        }
        // 查询状态 -1 错误参数 0 系统繁忙 1 完成 2 请求中 3 未找到
        switch (resp.status) {
            case 'FULFILLED':
                status = 1;
                break;
            case 'REQUESTED':
                status = 2;
                break;
            case 'NOT_FOUND':
                status = 3;
                break;
            default:
                status = 0;
                break
        }
        return status

    },
    async fulfillment(userId, skuId) {
        if (!userId) {
            return false
        }
        let url = `${HTTPURL.domainName}/fulfillment/v2/fulfill/${userId}/${skuId}?origin=${DATA_KEY.origin}&api_key=${DATA_KEY.apiKey}`;
        let resp;
        console.log('===========请求发货url==================')
        console.log(url)
        try {
            resp = await http.post(url)
        } catch (err) {
            console.log('=========发货请求======err')
            console.log(err)
            resp = false;
        }

        if (!resp) return false
        return typeof resp.status === 'string' && resp.status === 'REQUESTED'
    },
    async insertGiftLog(ctx, userOpenId, skuId, time) {
        let sql = `insert into prePrizeCollect (userOpenId, skuId, createTime) values ("${userOpenId}","${skuId}",${time})`;
        // console.log('sql')
        // console.log(sql)
        let insertPrizeStatus;
        try {
            insertPrizeStatus = await db.writeMySql(sql)
        } catch (err) {
            // console.log('err')
            // console.log(err)
            return ctx.body = outJson(ctx, 50001);
        }
        if (!insertPrizeStatus) {
            return ctx.body = outJson(ctx, 50001);

        }
        return ctx.body = outJson(ctx, 0);
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