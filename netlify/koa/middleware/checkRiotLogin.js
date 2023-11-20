const { outJson } = require('../utils/utils')
const { getUserId } = require('../utils/function')
module.exports = async (ctx, next) => {
    if (ctx.path === '/api/callback') {
        await next()
        return;
    }
    let invitationCode = ctx.session.invitationCode;
    console.log(invitationCode)
    if (!invitationCode) {
        try {
            invitationCode = ctx.query.invitationCode;
            ctx.session.invitationCode = invitationCode;
        } catch (err) {
            console.log('no invitationCode')
            console.log(err)
        }
    } else {
        ctx.state.invitationCode = invitationCode;
    }

    const tokenData = ctx.session.riotAccessToken;
    if (!tokenData || tokenData.expires <= ctx.cgiStartTime) {
        ctx.body = outJson(ctx, 40001)
        return;
    }
    // const RIOT_ACCESS_TOKEN_KEY = 'riotAccessToken';
    // const RIOT_REFRESH_TOKEN_KEY = 'riotRefreshToken';
    // const RIOT_USER_OPENID_KEY = 'riotUserOpenId';
    let userOpenId = ctx.session.riotUserOpenId;
    if (!userOpenId) {
        try {
            userOpenId = await getUserId(tokenData);
            if (!userOpenId) {
                ctx.body = outJson(ctx, 40001)
                return;
            }
            console.log('userOpenId===============checkRiotLogin============')
            console.log(userOpenId)
            ctx.session.riotUserOpenId = userOpenId;
            ctx.state.userOpenId = userOpenId
            await next();
        } catch (error) {
            console.error('Error fetching user ID:', error);
            ctx.body = outJson(ctx, 50001, error);
        }
    } else {
        ctx.state.userOpenId = userOpenId;
        await next();
    }
}