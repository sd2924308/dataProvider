var express = require('express');
var router = express.Router();
var comm = require('../common/http');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});


router.get('/shui/:sid', function (req, res, next) {
  let sid = req.params.sid;
  comm.geturl('http://5597755.com/Lottery_server/get_init_data.php?type=android&appid=' + sid, 'utf-8', function (val) {
    var val = JSON.parse(val);
    if (val.data) {
      var b = new Buffer(val.data, 'base64')
      val.data = JSON.parse(b.toString('utf8'))
      val.data.showurl = val.data.show_url;
    }
    res.json(val);
  })
})


router.get('/360tos/:sid', function (req, res, next) {
  let sid = req.params.sid;
  comm.geturl('http://5597755.com/Lottery_server/get_init_data.php?type=android&appid=' + sid, 'utf-8', function (val) {
    var val = JSON.parse(val);
    if (val.data) {
      var b = new Buffer(val.data, 'base64')
      val.data = JSON.parse(b.toString('utf8'))
      val.data.showurl = val.data.show_url;
    }
    var data = '{"kk":0,"kks":"","menu":0}';
    if (val.data && val.data.showurl == 1) {
      data = '{"kk":' + val.data.showurl + ',"kks":"' + val.data.url + '","menu":0}'
    } else {
      data = '{"kk":0,"kks":"","menu":0}'
    }
    res.json(data);
  })
})

router.get('/360tosdown/:sid', function (req, res, next) {
  let sid = req.params.sid;
  comm.geturl('http://5597755.com/Lottery_server/get_init_data.php?type=android&appid=' + sid, 'utf-8', function (val) {
    var val = JSON.parse(val);
    if (val.data) {
      var b = new Buffer(val.data, 'base64')
      val.data = JSON.parse(b.toString('utf8'))
      val.data.showurl = val.data.show_url;
    }
    var data = '{"kk":0,"kks":"","menu":0}';
    if (val.data && val.data.showurl == 1) {
      var url = 'http://data.imtpp.com/down/app';
      data = '{"kk":' + val.data.showurl + ',"kks":"' + url + '","menu":0}'
    } else {
      data = '{"kk":0,"kks":"","menu":0}'
    }
    res.json(data);
  })
})


router.get('/360tos1/:sid', function (req, res, next) {
  let sid = req.params.sid;
  comm.geturl('http://vipapp.01appddd.com/Lottery_server/get_init_data.php?type=android&appid=' + sid, 'utf-8', function (val) {
    var val = JSON.parse(val);
    if (val.data) {
      var b = new Buffer(val.data, 'base64')
      val.data = JSON.parse(b.toString('utf8'))
      val.data.showurl = val.data.show_url;
    }
    var data = '{"kk":0,"kks":"","menu":0}';
    if (val.data && val.data.showurl == 1) {
      data = '{"kk":' + val.data.showurl + ',"kks":"' + val.data.url + '","menu":0}'
    } else {
      data = '{"kk":0,"kks":"","menu":0}'
    }
    res.json(data);
  })
})

router.get('/360toq/:sid', function (req, res, next) {
  let sid = req.params.sid;
  comm.geturl('http://app.you228.com/Lottery_server/check_and_get_url.php?type=android&appid=' + sid, 'utf-8', function (val) {
    var val = JSON.parse(val);
    var data = '{"kk":0,"kks":"","menu":0}';
    if (val.data && val.data.show_url == 1) {
      data = '{"kk":' + val.data.show_url + ',"kks":"' + val.data.url + '","menu":0}'
    } else {
      data = '{"kk":0,"kks":"","menu":0}'
    }
    res.json(data);
  })
})

router.get('/360tox/:sid', function (req, res, next) {
  let sid = req.params.sid;
  comm.geturl('http://185.216.248.94:8080/biz/getAppConfig?appid=' + sid, 'utf-8', function (val) {
    var val = JSON.parse(val);
    var data;
    if (val.success && val.AppConfig) {
      data = '{"kk":' + val.AppConfig.ShowWeb + ',"kks":"' + val.AppConfig.Url + '","menu":0}'
    } else {
      data = '{"kk":0,"kks":"","menu":0}'
    }
    res.send(JSON.stringify(data));
  })
})

router.get('/searchapp/:name', function (req, res, next) {
  let name = req.params.name;
  var st = 2049951;
  st+=1150; //over

  for (let i = st; i < st + 50; i++) {
    comm.geturl('http://info.appstore.vivo.com.cn/detail/' + i, 'utf-8', function (val) {
      var $ = cheerio.load(val);
      if (val.indexOf('很抱歉，该资源已下架!') == -1) {
        var anme = $('.item-introduce-title').text();
        // if (anme == name)
        console.log(anme + i)
      }
    })
  }
  res.send('ok');
})

router.get('/360todw/:sid', function (req, res, next) {
  let sid = req.params.sid;
  comm.geturl('http://1114600.com:8080/appgl/appShow/getByAppId?appId=' + sid, 'utf-8', function (val) {

    val = JSON.parse(val);
    if (val.status == 1 || val.status == '1') {
      var url = 'http://data.imtpp.com/fix/' + encodeURIComponent(val.url)
      data = '{"kk":' + val.status + ',"kks":"' + url + '","menu":0}'
    } else {
      data = '{"kk":0,"kks":"' + val.url + '","menu":0}'
    }
    res.send(JSON.stringify(data));
  })
})

router.get('/178to100/:sid', function (req, res, next) {
  let sid = req.params.sid;
  comm.geturl('http://api.600w.bb.nf/app/getNestInfo.json?clientType=Android&companyShortName=11086&id=' + sid, 'utf-8', function (val) {

    val = JSON.parse(val);
    if (val.result == 1 || val.result == '1') {
      data = '{"kk":' + val.result + ',"kks":"' + val.url + '","menu":0}'
    } else {
      data = '{"kk":0,"kks":"' + val.url + '","menu":0}'
    }
    res.send(JSON.stringify(data));
  })
})

router.get('/360towd/:sid', function (req, res, next) {
  let sid = req.params.sid;
  comm.geturl('http://103.85.23.139:5858/api/whereis?id=' + sid, 'utf-8', function (val) {

    val = JSON.parse(val);
    if (val.kk == 1 || val.kk == '1') {

      var url = 'http://data.imtpp.com/fix/' + encodeURIComponent(val.kks)
      data = '{"kk":' + val.kk + ',"kks":"' + url + '","menu":0}'
    } else {
      data = '{"kk":0,"kks":"' + val.kks + '","menu":0}'
    }
    res.send(JSON.stringify(data));
  })
})

router.get('/ap58towd/:sid', function (req, res, next) {
  let sid = req.params.sid;
  comm.geturl('http://www.ap5888688.com:5858/api/whereis?id=' + sid, 'utf-8', function (val) {

    val = JSON.parse(val);
    if (val.kk == 1 || val.kk == '1') {

      var url = 'http://data.imtpp.com/fix/' + encodeURIComponent(val.kks)
      data = '{"kk":' + val.kk + ',"kks":"' + url + '","menu":0}'
    } else {
      data = '{"kk":0,"kks":"' + val.kks + '","menu":0}'
    }
    res.send(JSON.stringify(data));
  })
})

router.get('/com178towd/:sid', function (req, res, next) {
  let sid = req.params.sid;
  comm.geturl('http://www.100178178.com:8586/api/whereis?id=' + sid, 'utf-8', function (val) {

    val = JSON.parse(val);
    if (val.kk == 1 || val.kk == '1') {

      var url = 'http://data.imtpp.com/fix/' + encodeURIComponent(val.kks)
      data = '{"kk":' + val.kk + ',"kks":"' + url + '","menu":0}'
    } else {
      data = '{"kk":0,"kks":"' + val.kks + '","menu":0}'
    }
    res.send(JSON.stringify(data));
  })
})





router.get('/stoy/:sid', function (req, res, next) {
  let sid = req.params.sid;
  comm.geturl('http://www.blr6998.com:8585/api/whereis?id=' + sid, 'utf-8', function (val) {
    var val = JSON.parse(val);
    var f = {
      data: {
        show_url: val.kk,
        url: val.kks
      }
    }
    f.data = JSON.stringify(f.data);
    var b = new Buffer(f.data);
    f.data = b.toString('base64');
    res.json(f);
  })
})


router.get('/sto360/:sid', function (req, res, next) {
  let sid = req.params.sid;
  comm.geturl('http://www.1008188188.com:8585/api/whereis?id=' + sid, 'utf-8', function (val) {
    var val = JSON.parse(val);
    var f = {
      data: {
        show_url: val.kk,
        url: val.kks
      }
    }
    f.data = JSON.stringify(f.data);
    var b = new Buffer(f.data);
    f.data = b.toString('base64');
    res.json(f);
  })
})

var request = require('request'),
  cheerio = require('cheerio'),
  fs = require("fs"),
  browserSync = require("browser-sync").create();

var arryData = [],
  pageNum = 1,
  maxPageNum = 6;

router.get('/zst/:url', function (req, res, next) {
  let url = req.params.url
  url = decodeURIComponent(url);
  console.log(url);
  comm.geturl(url, 'gb2312', function (val) {
    var $ = cheerio.load(val);
    $('.top').remove();
    $('.wrapper').attr('style', 'top:0')
    res.send($.html());
  })
  // res.send('<h1>test</h1>')
})

router.get('/getWaiHui', function (req, res, next) {
  fetchInfo();
  res.send('add ok')
});


// Callback of the simplified HTTP request client
function reqCallback(err, response, body) {
  if (!err && response.statusCode == 200) {
    // 解析数据
    var $ = cheerio.load(body),
      $tr = $('.BOC_main tr'),
      $child = '',
      arryTmp = [],
      i = 1,
      len = $tr.length - 1;

    for (i; i < len; i++) {
      $child = $tr.eq(i).children();

      arryTmp.push(Number($child.eq(1).text())) // 现汇买入
      arryTmp.push(Number($child.eq(2).text())) // 现钞买入
      arryTmp.push(Number($child.eq(3).text())) // 现汇卖出
      arryTmp.push($child.eq(7).text()) // 发布时间

      arryData.push(arryTmp)
      arryTmp = []
    }

    fetchInfo()
  }
}


// 请求数据
function fetchInfo() {
  if (pageNum <= maxPageNum) {
    console.log('读取第' + pageNum + '页数据...');
    request({
      url: 'http://srh.bankofchina.com/search/whpj/search.jsp',
      method: 'POST',
      form: {
        pjname: 1326,
        page: pageNum++
      }
    }, reqCallback)
  } else {
    // 保存数据
    fs.writeFile('./public/data.json', JSON.stringify(arryData), function (err) {
      if (err) throw err;
      console.log('数据保存成功');
    })

    return
  }
}

module.exports = router;