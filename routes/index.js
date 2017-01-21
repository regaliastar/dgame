module.exports = function (app) {
  app.get('/', function (req, res) {
    res.redirect('/home');
  });
  //主页
  app.use('/home',require('./home'));
  
  //注册
  app.use('/signup', require('./signup'));
  //登录
  app.use('/signin', require('./signin'));
  //登出
  app.use('/signout', require('./signout'));
  //投稿
  app.use('/submit', require('./submit'));
  //搜索
  app.use('/search',require('./search'));
  //新闻公告等官方资讯
  app.use('/news',require('./news'));
  //聊天室请求
  app.use('/chatroom',require('./chatroom'));

  // 404 page
  app.use(function (req, res) {
    if (!res.headersSent) {
      res.render('404');
    }
  });
};
