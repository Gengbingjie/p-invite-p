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
    //下面四个函数是七日签到活动领奖所需方法，需自行判断哪些需要哪些不需要
    async fulfillStatus(userId, skuId) {
        if (!userId || !Object.values(PRIZE_MAP).includes(skuId)) {
            return -1
        }
        let url = `${HTTPURL.domainName}/fulfillment/v2/status/${userId}/${skuId}?api_key=${DATA_KEY.apiKey}`;
        let resp, status;
        try {
            resp = await http.get(url)
        } catch (err) {
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
        if (!userId || !Object.values(PRIZE_MAP).includes(skuId)) {
            return false
        }

        let url = `${HTTPURL.domainName}/fulfillment/v2/fulfill/${userId}/${skuId}?origin=${DATA_KEY.origin}&api_key=${DATA_KEY.apiKey}`;
        let resp;
        try {
            resp = await http.post(url)
        } catch (err) {
            resp = false;
        }

        if (!resp) return false
        return typeof resp.status === 'string' && resp.status === 'REQUESTED'
    },
    async getUserLog(ctx, userId) {
        let userLog;
        try {
            userLog = await db.readMysql(`select * from userLog where userId = "${userId}"`)
        } catch (err) {
            ctx.body = outJson(ctx, 500001)
            return
        }
        return userLog
    },
    async insertGiftLog(ctx, userId, position, skuId, time) {
        let sql = `insert into prizeLog (userId, position, skuId, getTime) values ("${userId}","${position}","${skuId}",${time})`;
        let insertPrizeStatus;
        try {
            insertPrizeStatus = await db.writeMySql(sql)
        } catch (err) {
            insertPrizeStatus = false
        }
        if (!insertPrizeStatus) {
            ctx.body = outJson(ctx, 50001);
            return
        }
        ctx.body = outJson(ctx, 200);
        return
    },
}