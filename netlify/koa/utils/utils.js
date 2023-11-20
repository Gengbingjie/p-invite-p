const errorMsg = require('../config/errMsg')
const utils = {
    outJson(ctx, iRet, jData = {}) {
        // 如果没有，请根据实际情况修改
        const cgiEndTime = Date.now();
        const execTime = (cgiEndTime - ctx.cgiStartTime) / 1000;
        return {
            iRet,
            sMsg: errorMsg[iRet] || '',
            jData,
            execTime
        }
    }
}

module.exports = utils