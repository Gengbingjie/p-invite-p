const { outJson } = require('../../utils/utils');
const { fulfillStatus, insertGiftLog, fulfillment } = require('../../utils/function');
const db = require('../../lib/mysql');

module.exports = async (ctx) => {
    const userOpenId = ctx.state.userOpenId;
    let userInfo = {};
    userInfo.invitationNum = undefined;
    const skuId = 'LOL_HEXTECH_CHEST_KEY_SKU_2';
    try {
        userInfo = await db.readMysql(`SELECT * FROM preRegisterUser WHERE userOpenId="${userOpenId}"`);
    } catch (err) {
        return ctx.body = outJson(ctx, 50001);
    }
    //会话是否过期
    if (!userInfo) {
        return ctx.body = outJson(ctx, 40001);
    }
    //查询是否满足领取条件
    if (userInfo[0].invitationNum !== 3) {
        return ctx.body = outJson(ctx, 20003);
    }
    //查询是否已领取
    const checkSkuCollect = await db.readMysql(`SELECT * FROM prePrizeCollect WHERE userOpenId="${userOpenId}" AND skuId="${skuId}"`)
    if (Array.isArray(checkSkuCollect) && checkSkuCollect.length > 0) {
        return ctx.body = outJson(ctx, 20001);
    }

    //查询状态
    let requestSuccess = false;
    let prizeStatus = await fulfillStatus(userOpenId, skuId, ctx);
    switch (prizeStatus) {
        case -1:
            outJson(ctx, 20002);
            break;
        case 0:
            outJson(ctx, 50001);
            break;
        case 1:
        case 2:
            // 已经领取奖励但还没添加记录时添加记录
            await insertGiftLog(
                ctx,
                userOpenId,
                skuId,
                parseInt(ctx.cgiStartTime / 1000)
            );
            break;
        default:
            //还未发起请求
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
                        parseInt(ctx.cgiStartTime / 1000)
                    );
                    return ctx.body = outJson(ctx, 200);
                } catch (err) {
                    return ctx.body = outJson(ctx, 50001);
                }
            } else {
                return ctx.body = outJson(ctx, 50001);
            }
    }
}