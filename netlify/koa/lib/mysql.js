const { SQLCONFIG } = require('../config/Constant')
const mysql = require("mysql")

class DB {
    constructor() {
        this.connection = mysql.createConnection(SQLCONFIG);
    }

    async init() {
        await this.connectionAsync();
    }

    async connectionAsync() {
        return new Promise((resolve, reject) => {
            this.connection.connect(err => {
                if (err) {
                    console.log("SQL连接失败!");
                    reject(err);
                }
                resolve(true);
            });
        });
    }

    async readMysql(sql) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }

    async writeMySql(sql, arr) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, arr, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    // 同样的更改也适用于 deleteMysql, updateMysql 方法
    async deleteMysql(sql) {
        return this.readMysql(sql);
    }

    async updateMysql(sql) {
        return this.readMysql(sql);
    }

    async end() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        });
    }
}

module.exports = new DB();
