/**
 * Created by wei.wang on 11/4/13.
 *
 * That should work if the dates you saved in the DB are without time (just day, month, year).

 Chances are that the dates you saved were new Date(), which includes the time components. To query those times you need to create a date range that includes all moments in a day.

 db.posts.find( //query today up to tonight
 {"created_on": {"$gte": new Date(2012, 7, 14), "$lt": new Date(2012, 7, 15)}})
 *
 */
//相应的controller
var config = require('../config').config;
var Article = require('../dao/articleDao');
var Type = require('../dao/typeDao');
var EventProxy = require('eventproxy');

exports.index=function(req,res){
   res.render('index',{
       siteInfo:config.siteInfo
   });
};

exports.upload = function(req,res,next){
    req.form.on('end',function(){
        console.log("end---done");
        res.send("done");
    });
    req.form.on('progress',function(bytesReceived, bytesExpected){
        console.log(((bytesReceived / bytesExpected)*100)+"% uploaded");
    });

    //console.log("body---"+req.body);
   // console.log("files---"+req.files);
   // res.render('index',{
    //    siteInfo:config.siteInfo
   // });
};

exports.upload2 = function(req, res){
    var body = '';
    var header = '';
    var content_type = req.headers['content-type'];
    var boundary = content_type.split('; ')[1].split('=')[1];
    var content_length = parseInt(req.headers['content-length']);
    var headerFlag = true;
    var filename = 'dummy.bin';
    var filenameRegexp = /filename="(.*)"/m;
    console.log('content-type: ' + content_type);
    console.log('boundary: ' + boundary);
    console.log('content-length: ' + content_length);

    req.on('data', function(raw) {
        console.log('received data length: ' + raw.length);
        var i = 0;
        while (i < raw.length)
            if (headerFlag) {
                var chars = raw.slice(i, i+4).toString();
                if (chars === '\r\n\r\n') {
                    headerFlag = false;
                    header = raw.slice(0, i+4).toString();
                    console.log('header length: ' + header.length);
                    console.log('header: ');
                    console.log(header);
                    i = i + 4;
                    // get the filename
                    var result = filenameRegexp.exec(header);
                    if (result[1]) {
                        filename = result[1];
                    }
                    console.log('filename: ' + filename);
                    console.log('header done');
                }
                else {
                    i += 1;
                }
            }
            else {
                // parsing body including footer
                body += raw.toString('binary', i, raw.length);
                i = raw.length;
                console.log('actual file size: ' + body.length);
            }
    });

    req.on('end', function() {
        // removing footer '\r\n'--boundary--\r\n' = (boundary.length + 8)
        body = body.slice(0, body.length - (boundary.length + 8))
        console.log('final file size: ' + body.length);
        fs.writeFileSync('files/' + filename, body, 'binary');
        console.log('done');
        res.redirect('back');
    })
}