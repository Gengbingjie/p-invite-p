const { outJson } = require('../../utils/utils');
// const getReward = require('../../utils/getReward');
const db = require('../../lib/mysql');
const { SKUID_DATA } = require('../../config/Constant')
const { fulfillStatus, fulfillment, insertGiftLog } = require('../../utils/function')

module.exports = async (ctx) => {
    let prizePosition = ctx.query.prizePosition
    if (!prizePosition) {
        ctx.body = outJson(ctx, 50001)
    }
    const userOpenId = ctx.state.userOpenId;
    const skuId = SKUID_DATA[String(prizePosition)];
    let userInfo = {};
    userInfo.invitationNum = undefined;

    try {
        userInfo = await db.readMysql(`SELECT * FROM preRegisterUser WHERE userOpenId="${userOpenId}"`);
    } catch (err) {
        return ctx.body = outJson(ctx, 50001);
    }

    if (userInfo.length === 0) {
        return ctx.body = outJson(ctx, 50001);
    } else {
        userInfo = userInfo[0]
    }
    //查询是否满足领取条件
    if (userInfo.invitationNum !== 3 && prizePosition === 6) {
        return ctx.body = outJson(ctx, 20003);
    }

    //查询是否已领取
    try {
        let sql = `select * from prePrizeCollect where userOpenId = "${userOpenId}" and skuId="${skuId}"`
        checkSkuCollect = await db.readMysql(sql)
    } catch (err) {
        ctx.body = outJson(ctx, 50001)
        return
    }
    if (Array.isArray(checkSkuCollect) && checkSkuCollect.length > 0) {
        return ctx.body = outJson(ctx, 20001);
    }

    //查询状态
    let prizeStatus = await fulfillStatus(userOpenId, skuId, ctx);
    switch (prizeStatus) {
        case -1:
            ctx.body = outJson(ctx, 20002);
            break;
        case 0:
            ctx.body = outJson(ctx, 50001);
            break;
        case 1:
        case 2:
            // 已经领取奖励但还没添加记录时添加记录
            await insertGiftLog(
                ctx,
                userOpenId,
                skuId,
                ctx.cgiStartTime
            );
            break;
        default:
            //还未发起请求
            let requestSuccess = false;
            try {
                requestSuccess = await fulfillment(userOpenId, skuId)
            } catch (err) {
                return ctx.body = outJson(ctx, 50001);
            }

            if (requestSuccess) {
                try {
                    await insertGiftLog(
                        ctx,
                        userOpenId,
                        skuId,
                        ctx.cgiStartTime
                    );
                    return ctx.body = outJson(ctx, 0);
                } catch (err) {
                    return ctx.body = outJson(ctx, 50001);
                }
            } else {
                return ctx.body = outJson(ctx, 50001);
            }
    }

}