var express = require('express');
var path = require('path');
var routes = require('./routes/index');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var handlebars = require('express3-handlebars').create({
	partialsDir:"views/partials"
});
var config = require('./config/default');
var pkg = require('./package');
var log4js = require('./log');
var log = require("./log").logger("app");

var mongoose = require('mongoose');
mongoose.connect(config.mongodb);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("数据库成功开启");
});

var app = express();

//配置日志文件
log4js.configure();
//不需要在日志中输出url请求，则注释掉这段话
//app.use(log4js.useLog());

//设置模板目录
app.set('views',path.join(__dirname,'views'));
//设置模板引擎
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

app.use(bodyParser());

app.use(cookieParser(config.cookieSecret));
app.use(expressSession({
	secret:config.sessionSecret,
	cookie:{maxAge:config.sessionMaxAge}
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'public')));

//解析路由
routes(app);

//捕获错误代码并返回错误界面
app.use(function (err, req, res, next) {
	log.error('error:'+err);
  res.render('error', {
    error: err
  });
});

if (module.parent) {
  module.exports = app;
} else {
  // 监听端口，启动程序
  app.listen(config.port, function () {
    console.log(`${pkg.name} listening on port ${config.port}`);
  });
}
