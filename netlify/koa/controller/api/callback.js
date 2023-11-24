const { DATA_KEY } = require('../../config/Constant')
const http = require('../../utils/axios')
const { HTTPURL } = require('../../config/Constant')

module.exports = async (ctx) => {
    const { code } = ctx.query;

    if (!code) {
        ctx.body = { message: 'code无效' }
        return
    }

    const postData = new URLSearchParams();
    postData.append('grant_type', 'authorization_code');
    postData.append('code', code);
    postData.append('redirect_uri', `https://${ctx.get('host')}/api/callback`)

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${DATA_KEY.RIOT_BASIC_NAME}:${DATA_KEY.RIOT_BASIC_PWD}`).toString('base64')}`
    };

    let resp
    // const RIOT_ACCESS_TOKEN_KEY = 'riotAccessToken';
    // const RIOT_REFRESH_TOKEN_KEY = 'riotRefreshToken';
    // const RIOT_USER_OPENID_KEY = 'riotUserOpenId';

    try {
        resp = await http.post(HTTPURL.tokenUrl, postData, { headers })
        let token = resp.access_token
        ctx.session.riotAccessToken = token
        ctx.session.maxAge = resp.expires_in * 1000

        let url = `https://${ctx.get('host')}`
        ctx.status = 302
        ctx.redirect(url)

    } catch (err) {
        console.log(err)
        ctx.body = { message: 'code验证失败', err: JSON.stringify(err) }
        // ctx.redirect('/')
    }
}