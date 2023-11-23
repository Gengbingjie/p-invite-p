const { outJson, isEmpty } = require('../../utils/utils')
const { getUserByInvitationCode, getUserInfoByUserOpenId, savePreRegisterUser, updateUserInvitationInfo } = require('../../utils/logic')
const { SKUID_DATA } = require('../../config/Constant')
const db = require('../../lib/mysql')

module.exports = async (ctx) => {
    const userOpenId = ctx.state.userOpenId
    let invitationCode = ctx.session.invitationCode
    if (!invitationCode) {
        invitationCode = ctx.query.invitationCode
        ctx.session.invitationCode = invitationCode
    }

    // console.log('invitationCode')
    // console.log(invitationCode)
    let captainUser, userInfo
    try {
        captainUser = await getUserByInvitationCode(invitationCode)
    } catch (err) {
        console.log('============获取队长用户错误信息================')
        console.log(err)
        ctx.body = outJson(ctx, 50001)
        return
    }
    // console.log('===========captainUser=================')
    // console.log(captainUser)
    try {
        userInfo = await getUserInfoByUserOpenId(userOpenId)

    } catch (err) {
        console.log('获取用户useropenid错误信息')
        console.log(err)
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
        if (isEmpty(userInfo)) {
            ctx.body = outJson(ctx, 50001)
            return
        }
    }

    let userCode = userInfo.invitationCode
    let userCount = userInfo.invitationNum
    console.log('============当前userInfo ===================')
    console.log(userInfo)

    if (!isEmpty(captainUser)) {
        invitationCount = captainUser.invitationNum
        if (!userInfo.captainOpenId && userInfo.userOpenId !== captainUser.userOpenId && captainUser.invitationNum < 3) {
            let invitationCount = captainUser.invitationNum + 1;
            // console.log('==========队长用户邀请次数========invitationCount')
            // console.log(invitationCount)
            try {
                saveFlag = await updateUserInvitationInfo(captainUser.userOpenId, invitationCount, userOpenId);
            } catch (err) {
                // console.log('===========更新次数错误===================')
                // console.log(err)
                ctx.body = outJson(ctx, 50001)
                return
            }
            if (!saveFlag) {
                ctx.body = outJson(ctx, 50001)
                return
            }
        }
    }

    //查询领奖状态
    const sql = `select * from prePrizeCollect where userOpenId = "${userOpenId}"`
    let getPrizeInfo = []
    try {
        getPrizeInfo = await db.readMysql(sql)
    } catch (err) {
        console.log('============获取礼物状态错误信息==========')
        console.log(err)
        ctx.body = outJson(ctx, 50001, err)
        return
    }
    console.log('getPrizeInfo')
    console.log(getPrizeInfo)
    const getPrizeSkuIds = getPrizeInfo.map(item => item.skuId)
    const prizeStatus = Object.fromEntries(
        Object.entries(SKUID_DATA).map(([pos, skuId]) => [pos, getPrizeSkuIds.includes(skuId)])
    );
    // console.log('prizeStatus')
    // console.log(prizeStatus)
    let json = {
        invitationCount: userCount,
        invitationCode: userCode,
        prizeStatus: prizeStatus
    }
    // console.log('===================json')
    // console.log(json)
    ctx.body = outJson(ctx, 0, json)
}