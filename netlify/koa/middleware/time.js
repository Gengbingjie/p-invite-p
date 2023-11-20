// 记录请求用时
module.exports = async (ctx, next) => {

    ctx.cgiStartTime = Math.floor(Date.now() / 1000)
    // 执行下一个中间件
    await next();
}