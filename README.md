# <img src="public/img/logo/big-logo.ico" width="25"> Dgame
<img src="public/img/logo/sign-logo.png" width="50%">

独立游戏分享制作平台
网址：http://www.regaliastar.com

# 技术栈

## 前端:
* bootstrape(定义样式)
* ajax(交互)
* jquery(操作元素快捷简便)
* handlebars(模板引擎)

## 后端:
* nodejs
* express(框架)
* mongodb(数据库)
* socket.io

***

## 进度
* 完成注册部分的表单验证功能，使用短信注册，待添加写入数据库的操作；
* 实现将注册用户保存进数据库中，async是个好工具;uid.js还存在较大缺陷;验证功能，与数据库的交互基本实现了；注(!important):数据库操作写在路由里不容易出错！下一步考虑实现登录功能；
* 实现登录功能及会话，下一步制作视图文件；
* 实现基本的模板制作，下一步设计个人主页，可修改个人信息；
* 基本实现个人中心界面，还有诸如特长等元素待添加；完善了session会话；下一步提供上传头像的功能；
* 完善了注册与登录界面的UI；
* 使用mutilparty实现用户上传头像的功能；
* 使用imagecorpper头像裁剪；文件写入和删除；
* 部署到服务器；
* 部署日志文件；

## 各文件分区
* models：用于存放封装好的类
* public：静态文件，用于存放客户端能够得到的内容
* routes：路由文件，用于管理用户的访问
* views：视图文件，内置模板，用于提供网页视图
* config：配置文件，保存了端口等重要信息
* lib：用于存储数据库
* middlewares：自己编写的中间件保存在这里，用于检查用户等操作
* app.js：入口文件，类似于C++中的main函数，每个用户的请求必经过这个文件以分配到各个路由处理
* package.json：配置文件，记录了本项目所依赖的包等信息
* README.md：这个就是你现在正在看的文件，无视之

## 功能及路由设计如下
1. 注册
	1. 注册页：`GET /signup`
	2. 注册：`POST /signup`
	3. 短信验证：`POST /signup/identify`
	4. 登录：`GET /signin`
	5. 找回密码：`GET /reminder`
2. 登录
	1. 登录页：`GET /signin`
	2. 登录：`POST /signin`
	3. 注册：`GET /signup`
	4. 找回密码：`GET /reminder`
3. 登出
	1. 登出：`GET /signout`
4. 个人主页
	1. 个人主页：`GET /users/:userId`
5. 个人中心
	1. 个人中心页：`GET /site`
	2. 修改信息：`POST /site/setting`
	3. 头像页：`GET /site/avatar`
	4. 设置头像：`POST /site/avatar`
	5. 安全中心页：`GET /site/safe`
	6. 安全中心：`POST /site/safe`
6. 搜索
	1. 搜索：`GET /search/:keyword=???`
7. 投稿
	1. 投稿页：`GET /submit`
	2. 投稿：`POST /submit`
8. 作品
	1. 作品页：`GET /:gameId`
	2. 评论：`POST /:gameId/comment`
9. 私信
	1. 私信：`POST /:mid`
10. 聊天室
	1. 聊天室页：`GET /chat/:roomId`
	2. 信息：`POST /chat/:roomId`
11. 官方推送
	1. 推送页：`GET /news/:newsId`

  ...

#### 注：
1. URL采用REST设计风格
2. 页面的多样性主要通过在渲染模板时从服务器得到，为方便易学起见，故采用弱逻辑性的handlebars

## How to use
1. Create logs folder at root dictionary
2. Install nodejs, npm and mongodb
   (如何配置node环境？ http://jingyan.baidu.com/article/91f5db1b2bb6941c7f05e33c.html )
3. At root directory, `npm install`, then `node app`
4. Server set up at http://127.0.0.1:2017/

> If you have any problem, please contact 1183080130@qq.com (ﾉﾟ▽ﾟ)ﾉ
