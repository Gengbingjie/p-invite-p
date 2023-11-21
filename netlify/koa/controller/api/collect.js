const { outJson } = require('../../utils')
const db = require('../../lib/mysql')

module.exports = async (ctx)=>{
    const userOpenId = ctx.state.userOpenId;
    const userInfo = await db.readMysql(`SELECT * FROM preRegisterUser WHERE userOpenId="${userOpenId}"`);
    if(!userInfo){
        return ctx.body = outJson(ctx, 40001);
    }
    if(userInfo.invitationNum !== 3){
        return ctx.body = outJson(ctx, 20003);
    }
    ctx.body = {
        status: 'success',
        message: 'Hello, frontend!',
    }
}