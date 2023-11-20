const { DATA_KEY } = require('../../config/Constant')
const http = require('../../utils/axios')
const { HTTPURL } = require('../../config/Constant')

module.exports = async (ctx) => {
    console.log(ctx.path)
    const { code } = ctx.query;

    if (!code) {
        ctx.body = { message: 'code无效' }
        return
    }

    const postData = new URLSearchParams();
    postData.append('grant_type', 'authorization_code');
    postData.append('code', code);
    postData.append('redirect_uri', `https://${ctx.get('host')}/api/callback`)
    console.log('------------redirect_uri----------------')
    console.log(`https://${ctx.get('host')}/api/callback`)

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
        console.log('resp=========callback回调==============')
        console.log(resp)
        let token = resp.access_token
        let expires_time = new Date(Date.now() + (resp.expires_in - 600) * 1000)

        ctx.session.riotAccessToken = {
            token: token,
            expires: expires_time
        };
        ctx.session.riotRefreshToken = resp.refresh_token;

        let url = `https://${ctx.get('host')}`
        ctx.status = 302
        ctx.redirect(url)

    } catch (err) {
        console.log(err)
        ctx.body = { message: 'code验证失败', err: JSON.stringify(err) }
        // ctx.redirect('/')
    }
}