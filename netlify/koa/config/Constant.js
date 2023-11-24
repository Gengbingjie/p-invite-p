// const SQLCONFIG = {
//   host: '119.45.189.71',
//   user: 'qinzhiyuan',
//   password: '8j8my8XEy5MpAcwT',
//   // password: '8j8my8XEy5M',
//   charset: 'utf8',
//   port: '3306',
//   database: '秦志远测试数据库'
// }

const SKUID_DATA = {
  '1': 'APAC_EVENT_STAR_SHARD_SKU_1',
  '2': 'APAC_EVENT_STAR_SHARD_SKU_2',
  '3': 'APAC_EVENT_LITTLE_LEGEND_TOGETHER_SKU_4',
  '4': 'APAC_EVENT_TREASURE_TOKEN_ONETWENTY_SKU_3',
  '5': 'APAC_EVENT_BOBA_SPRITE_SKU_6',
  '6': '2023_TFT_APAC_YAY_EMOTE'
}

const SQLCONFIG = {
  host: process.env.NETLIFY_DATA_URL,
  user: process.env.NETLIFY_DATA_USER,
  password: process.env.NETLIFY_DATA_PWD,
  charset: 'utf8',
  port: process.env.NETLIFY_DATA_PORT,
  database: process.env.NETLIFY_DATA_DATABASE
}

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
module.exports = { SQLCONFIG, HTTPURL, DATA_KEY, SKUID_DATA };
