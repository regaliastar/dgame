var express = require('express');
var path = require('path');
var routes = require('./routes/index');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var handlebars = require('express3-handlebars').create();
var config = require('./config/default');
var pkg = require('./package');

var app = express();

//设置模板目录
app.set('views',path.join(__dirname,'views'));
//设置模板引擎
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

app.use(bodyParser());
app.use(cookieParser('cookieSecret_saveinafile'));
app.use(expressSession());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'public')));

//解析路由
routes(app);

app.use(function (err, req, res, next) {
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
