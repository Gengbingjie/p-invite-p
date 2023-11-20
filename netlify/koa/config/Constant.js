const SQLCONFIG = {
  host: '119.45.189.71',
  user: 'qinzhiyuan',
  password: '8j8my8XEy5MpAcwT',
  charset: 'utf8',
  port: '3306',
  database: '秦志远测试数据库'
}

// const SQLCONFIG = {
//   host: process.env.NETLIFY_DATA_URL,
//   user: process.env.NETLIFY_DATA_USER,
//   password: process.env.NETLIFY_DATA_PWD,
//   charset: 'utf8',
//   port: process.env.NETLIFY_DATA_PORT,
//   database: process.env.NETLIFY_DATA_DATABASE
// }

const HTTPURL = {
  authUser: 'https://auth.riotgames.com/userinfo',
  domainName: 'https://americas.api.riotgames.com',
  tokenUrl: 'https://auth.riotgames.com/token',
}
const DATA_KEY = {
  apiKey: 'RGAPI-1eceb4c9-dd26-4045-9288-e9da73d6c4c9',
  origin: 'TFTMServiceOpeningActivity',
  RIOT_BASIC_NAME: 'e74006e7-ba31-4446-b0f2-3a29c66919cd',
  RIOT_BASIC_PWD: 'YrlOwBQaGpVG2qYzQixI7TBTclvGYTL-W8GTwuzV3z3',
  RIOT_ACCESS_TOKEN_KEY: 'riotAccessToken',
  RIOT_REFRESH_TOKEN_KEY: 'riotRefreshToken',
  RIOT_USER_OPENID_KEY: 'riotUserOpenId',
}
// 如果在模块中导出常量，可以使用以下代码
module.exports = { SQLCONFIG, HTTPURL, DATA_KEY };
