const db = require('../lib/mysql')
const { generateInvitationCode } = require('./function')
const logic = {
    async getUserByInvitationCode(invitationCode) {
        let sql = `SELECT * FROM preRegisterUser WHERE invitationCode = '${invitationCode}' LIMIT 1`;
        let captainInfo
        try {
            captainInfo = await db.readMysql(sql)
            return captainInfo
        } catch (err) {
            return ''
        }
    },
    async getUserInfoByUserOpenId(userOpenId) {
        let sql = `SELECT * FROM preRegisterUser WHERE userOpenId = '${userOpenId}' LIMIT 1`;
        let userInfo
        try {
            userInfo = await db.readMysql(sql)
            console.log('userInfo==================')
            console.log(userInfo)
            return userInfo
        } catch (err) {
            console.log(err)
            return ''
        }
    },
    async savePreRegisterUser(userOpenId, captainOpenId = '') {
        const invitationCode = generateInvitationCode(userOpenId); // 生成邀请码
        const invitationNum = 0; // 邀请数量初始值

        // 构建 SQL 插入语句
        const sql = `INSERT INTO preRegisterUser (userOpenId, captainOpenId, invitationCode, invitationNum) VALUES ('${userOpenId}', '${captainOpenId}', '${invitationCode}', '${invitationNum}')`;

        console.log('============sql============')
        console.log(sql)
        // 执行 SQL 查询
        try {
            result = await db.writeMySql(sql)
            console.log('===========插入数据库result============result')
            console.log(result)
            return result
        } catch (err) {
            console.log('err=================')
            console.log(err)
            return false
        }
    },
    async updateUserInvitationInfo(captainUserId, invitationCount, userOpenId) {
        try {
            await db.beginTransaction()
        } catch (err) {
            console.log(err)
            return false
        }

        let sql = sql = `UPDATE preRegisterUser SET invitationNum = '${invitationCount}'
        WHERE invitationNum < 3 AND userOpenId = '${userOpenId}'`
        let saveFlag
        try {
            saveFlag = await db.writeMySql(sql)
        } catch (err) {
            console.log(err)
            return false
        }

        let updateSql = `UPDATE preRegisterUser SET captainOpenId = '${captainUserId}' WHERE userOpenId = '${userOpenId}'`;
        let updateFlag
        try {
            updateFlag = await db.writeMySql(updateSql)
        } catch (err) {
            console.log(err)
            await db.rollbackTransaction()
            return false
        }

        if (!updateFlag) {
            await db.rollbackTransaction()
            return false
        }

        try {
            await db.commitTransaction()
            return true
        } catch (err) {
            return false
        }
    }
}
module.exports = logic