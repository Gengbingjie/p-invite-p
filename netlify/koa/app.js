const Koa = require('koa');
const Router = require('koa-router');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');

const routeConfig = require('./router')

const time = require('./middleware/time')
const checkRiotLogin = require('./middleware/checkRiotLogin')
const setInvitationCode = require('./middleware/setInvitationCode')

const app = new Koa();
const router = new Router();


// 使用路由中间件
//校验登录态
app.use(time)
app.use(session({ signed: false }, app));
app.use(setInvitationCode)
app.use(checkRiotLogin)
app.use(bodyParser())
app.use(router.routes());
app.use(router.allowedMethods());
routeConfig(router)
module.exports = app