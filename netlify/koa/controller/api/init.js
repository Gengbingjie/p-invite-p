const { outJson } = require('../../utils/utils')
const { getUserByInvitationCode, getUserInfoByUserOpenId, savePreRegisterUser } = require('../../utils/logic')

module.exports = async (ctx) => {
    const userOpenId = ctx.state.userOpenId
    let invitationCode = ctx.query.invitationCode || ctx.session.invitationCode

    let captainUser, userInfo
    try {
        captainUser = await getUserByInvitationCode(invitationCode)
    } catch (err) {
        ctx.body = outJson(ctx, 50001)
        return
    }
    console.log('===========captainUser=================')
    console.log(captainUser)
    try {
        userInfo = await getUserInfoByUserOpenId(userOpenId)
        userInfo = userInfo[0]
    } catch (err) {
        ctx.body = outJson(ctx, 50001)
        return
    }

    if (!userInfo) {
        try {
            userInfo = await savePreRegisterUser(userOpenId);
        } catch (err) {
            ctx.body = outJson(ctx, 50001)
            return
        }
        if (!userInfo) {
            ctx.body = outJson(ctx, 50001)
            return
        }
    }

    let userCode = userInfo.invitationCode
    let userCount = userInfo.invitationNum
    console.log('============当前userInfo ===================')
    console.log(userInfo)

    if (captainUser) {
        invitationCount = captainUser.invitationNum
        if (!userInfo.captainOpenId && userInfo.userOpenId !== captainUser.userOpenId && captainUser.invitationNum < 3) {
            let invitationCount = captainUser.invitationNum + 1;
            try {
                saveFlag = await updateUserInvitationInfo(captainUser.userOpenId, invitationCount, userOpenId);
            } catch (err) {
                ctx.body = outJson(ctx, 50001)
                return
            }
        }
    }

    let json = {
        invitationCount: userCount,
        invitationCode: userCode
    }
    console.log('===================json')
    console.log(json)
    ctx.body = outJson(ctx, 0, json)
}