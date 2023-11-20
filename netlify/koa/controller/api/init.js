const { outJson } = require('../../utils/utils')

module.exports = async (ctx) => {

    ctx.body = outJson(ctx, 0)
}