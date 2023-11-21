## Netlify Functions

Use Netlify Functions to have a Backend for your static site. It uses AWS Serverless Lambdas with your static website.

* Netlify 操作文档 https://docs.netlify.com/functions/lambda-compatibility/
* 函数代码位于 `netlify/functions/` 中
* 该文件夹中的每个“.mjs”或“.js”文件将自动创建为应用程序中的端点
    * 如果文件名为“hello.js”，则您的 URL 将为 `site.com/.netlify/functions/hello`

## Run Locally

* 安装 Netlify CLI - https://docs.netlify.com/cli/get-started/
* 从包含网站代码的文件夹中在终端中运行  “netlify dev”

成功后会启动本地服务 http://localhost:8888

后端接口地址是 http://localhost:8888/api/init
