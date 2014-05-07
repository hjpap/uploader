//所有路由映射配置

var site = require('./controllers/site');
var config = require('./config').config;

var adminRequired = function (req, res, next) {
    if (!req.session.userInfo) {
        req.session.referer = req.url;
        return res.render('login', {error: '你还没有登录。', siteInfo:config.siteInfo});
    }
    next();
};

module.exports=function(app){
    app.get('/', site.index);
    app.post("/upload",site.upload);
    app.post("/upload2",site.upload2);
}