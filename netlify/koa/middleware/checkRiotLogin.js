const { outJson } = require('../utils/utils')
const { getUserId } = require('../utils/function')
module.exports = async (ctx, next) => {
    if (ctx.path === '/api/callback') {
        await next()
        return;
    }
    let invitationCode = ctx.session.invitationCode;
    if (!invitationCode) {
        try {
            invitationCode = ctx.query.invitationCode;
            ctx.session.invitationCode = invitationCode;
        } catch (err) {
            console.log('no invitationCode')
            console.log(err)
        }
    }

    const tokenData = ctx.session.riotAccessToken;
    // console.log('tokenData')
    // console.log(tokenData)
    if (!tokenData || tokenData.expires <= ctx.cgiStartTime) {
        ctx.body = outJson(ctx, 40001)
        return;
    }

    try {
        let userOpenId = await getUserId(ctx, tokenData)
        // console.log('userOpenId')
        // console.log(userOpenId)
        if (!userOpenId) {
            ctx.body = outJson(ctx, 40001)
            return;
        } else {
            ctx.state.userOpenId = userOpenId
        }
        await next();
    } catch (err) {
        console.log(err)
        ctx.body = outJson(ctx, 40001)
        return;
    }
    // if (!userOpenId) {
    //     try {
    //         userOpenId = await getUserId(ctx, tokenData);
    //         if (!userOpenId) {
    //             ctx.body = outJson(ctx, 40001)
    //             return;
    //         }
    //         console.log('userOpenId===============checkRiotLogin============')
    //         console.log(userOpenId)
    //         ctx.session.riotUserOpenId = userOpenId;
    //         ctx.state.userOpenId = userOpenId
    //         await next();
    //     } catch (error) {
    //         console.error('Error fetching user ID:', error);
    //         ctx.body = outJson(ctx, 50001, error);
    //     }
    // } else {
    //     ctx.state.userOpenId = userOpenId;
    //     await next();
    // }
}