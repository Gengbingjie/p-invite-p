module.exports = async (ctx, next) => {
    if (ctx.path === '/api/init') {
        let invitationCode = ctx.session.invitationCode
        if (!invitationCode) {
            ctx.session.invitationCode = ctx.query.invitationCode
        }
        await next()
        return
    }
    await next()
}