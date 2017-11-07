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
  //个人主页——用于展示给其他人看
  app.use('/user',require('./user'));
  //个人中心——用于用户自己完善、修改自己的信息，属于自己看的页面
  app.use('/site',require('./site'));
  //投稿
  app.use('/submit', require('./submit'));
  //搜索
  app.use('/search',require('./search'));
  //新闻公告等官方资讯
  app.use('/news',require('./news'));
  //私信
  app.use('/msg',require('./msg'));
  //管理员
  app.use('/admin',require('./admin'));
  // 404 page
  app.use(function (req, res) {
    if (!res.headersSent) {
      res.render('404');
    }
  });
};
