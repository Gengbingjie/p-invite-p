const axios = require('axios')
// 创建 Axios 实例
const http = axios.create({
    timeout: 5000,
});

// 请求拦截器
http.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么
        // 例如，可以在请求头中添加认证信息、修改请求参数等
        return config;
    },
    (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 响应拦截器
http.interceptors.response.use(
    (response) => {
        // 对响应数据做些什么
        return response.data;
    },
    (error) => {
        // 对响应错误做些什么
        return Promise.reject(error);
    }
);

module.exports = http