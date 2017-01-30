module.exports = {
  port: 2017,

  mongodb: 'mongodb://localhost:27017/dgame',

  AppKey:'23616239',

  //不定时重置密码，以防乱用
  AppSecret:'关于这个密码请查看我的阿里大于',

  sms_template_code:'SMS_44250002',
  
  sms_free_sign_name:'dgame短信',

  cookieSecret:'ngdlg265oepwjhiure8861fgd1g56fd1',

  sessionSecret:'rbrubgsuldnjblaf4894161safafhbuj',

  //表示一个小时的时间
  sessionMaxAge:1000*60*60,

  //当前开发环境
  ENV:'production'

};
