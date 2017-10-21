var http = require('http');
var https = require('https');
//编码问题iconv.decode(bufferHelper.toBuffer(), 'utf-8');    
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper'); //关于Buffer我后面细说 

var url = require('url');
var fs = require('fs');
//获取网页内容
exports.geturl = function(url, encoder, callback) {
    var _encoder = "utf-8";
    encoder && (_encoder = encoder);
    http.get(url, function(res) {
        var bufferHelper = new BufferHelper(); //解决中文编码问题
        res.on('data', function(chunk) {
            bufferHelper.concat(chunk);
        });
        res.on('end', function() {
            var val = iconv.decode(bufferHelper.toBuffer(), _encoder);
            callback(val);
        }).on('error', function() {
            console.log('页面加载错误');
        });
    });
}


//获取网页内容
exports.geturlbyhttps = function(url, encoder, callback) {
    var _encoder = "utf-8";
    encoder && (_encoder = encoder);
    https.get(url, function(res) {
        var bufferHelper = new BufferHelper(); //解决中文编码问题
        res.on('data', function(chunk) {
            bufferHelper.concat(chunk);
        });
        res.on('end', function() {
            var val = iconv.decode(bufferHelper.toBuffer(), _encoder);
            callback(val);
        }).on('error', function() {
            console.log('页面加载错误');
        });
    });
}




//通过代理获取页面内容
exports.proxyhttp = function(_url, type, encoder, host, port, callback) {
    var _encoder = "utf-8";
    encoder && (_encoder = encoder);
    var _op = {
        host: '120.52.72.21',
        port: 80,
        method: 'GET',
        path: 'http://1212.ip138.com/ic.asp',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'request'
        }
    };
    host && (_op.host = host);
    port && (_op.port = port);
    url && (_op.path = _url);
    type && (_op.method = type);
    var req = http.request(_op, function(res) {
        if (res.statusCode != 200) {
            callback(null);
            return;
        }
        var bufferHelper = new BufferHelper(); //解决中文编码问题
        res.on('data', function(chunk) {
            bufferHelper.concat(chunk);
        }).on('end', function() {
            var val = iconv.decode(bufferHelper.toBuffer(), _encoder);
            callback(val);
        });
    });
    req.on('error', function(e) {
        //            console.log('err');
    });
    req.setTimeout(2000, function() {
        //            console.log('timeout');
    });
    req.end();
}





//通过代理获取页面内容
exports.proxyhttps = function(_url, type, encoder, host, port, callback) {
    var _encoder = "utf-8";
    encoder && (_encoder = encoder);
    var _cookie = 'a=b;c=d;'
    var _post_data = '';


    var post_option = {};
    post_option.path = _url;
    post_option.host = host;
    post_option.port = port;
    post_option.method = 'POST';
    post_option.rejectUnauthorized = false;
    post_option.requestCert = true;
    post_option['Accept-Encoding'] = 'gzip, deflate';

    //    post_option.port = 443;
    post_option.headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': _post_data.length,
        Cookie: _cookie,
    };


    var req = https.request(post_option, function(res) {

        if (res.statusCode != 200) {
            callback(null);
            return;
        }
        var bufferHelper = new BufferHelper(); //解决中文编码问题
        res.on('data', function(chunk) {
            bufferHelper.concat(chunk);
        }).on('end', function() {
            var val = iconv.decode(bufferHelper.toBuffer(), _encoder);
            callback(val);
        });
    });
    req.on('error', function(e) {
        console.log(e);
    });
    req.setTimeout(12000, function() {
        console.log('timeout');
    });
    req.write(_post_data);
    req.end();
}