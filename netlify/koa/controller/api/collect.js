const { fulfillStatus, insertGiftLog, fulfillment } = require('../utils/function')
module.exports = async (ctx) => {
    const prizePosition = ctx.request.body.prizePosition || 0;
    const skuId = PRIZE_MAP[String(prizePosition)];
    let requestSuccess = false;
    let userLog = await getUserLog(ctx, ctx.state.user.sub)

    if (!skuId) {
        ctx.body = outJson(ctx, 10001)
        return
    }
    if (userLog[0]['loginDays'] < prizePosition) {
        ctx.body = outJson(ctx, 10002)
        return
    }
    try {
        let sql = `select * from prizeLog where userId = "${ctx.state.user.sub}"  and position = "${prizePosition}"`
        prizeLog = await db.readMysql(sql)
    } catch (err) {
        ctx.body = outJson(ctx, 50001)
        return
    }
    if (!prizeLog) {
        ctx.body = outJson(ctx, 50001)
        return
    }

    if (prizeLog.length > 0) {
        ctx.body = outJson(ctx, 10004)  //奖励已领取
        return
    }
    let prizeStatus = await fulfillStatus(ctx.state.user.sub, skuId);

    switch (prizeStatus) {
        case -1:
            outJson(ctx, 10001);
            break;
        case 0:
            outJson(ctx, 50001);
            break;
        case 1:
        case 2:
            // 已经领取奖励但还没添加记录时添加记录
            await insertGiftLog(
                ctx,
                ctx.state.user.sub,
                prizePosition,
                skuId,
                parseInt(ctx.cgiStartTime / 1000)
            );
            break;
        default:
            // 还未请求发起请求
            try {
                requestSuccess = await fulfillment(ctx.state.user.sub, skuId)
            } catch (err) {
                ctx.body = outJson(ctx, 50001);
                return
            }
            if (requestSuccess) {
                try {
                    await insertGiftLog(
                        ctx,
                        ctx.state.user.sub,
                        prizePosition,
                        skuId,
                        parseInt(ctx.cgiStartTime / 1000)
                    );
                    ctx.body = outJson(ctx, 200);
                } catch (err) {
                    ctx.body = outJson(ctx, 50001);
                    return
                }
            } else {
                ctx.body = outJson(ctx, 50001);
                return
            }
            break;
    }
}