const Koa = require('koa');
const Router = require('koa-router');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');

const routeConfig = require('./router')

const time = require('./middleware/time')
const checkRiotLogin = require('./middleware/checkRiotLogin')
const mysqlStatus = require('./middleware/mysqlStatus')

const app = new Koa();
const router = new Router();
const db = require('./lib/mysql')

// 使用路由中间件

//校验登录态
// app.use(mysqlStatus)

app.use(time)
app.use(checkRiotLogin)
app.use(session({ signed: false }, app));
app.use(bodyParser())
app.use(router.routes());
app.use(router.allowedMethods());
routeConfig(router)


module.exports = app