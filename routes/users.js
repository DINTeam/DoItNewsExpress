var express = require('express');
var app= express();
var router = express.Router();
var serveStatic = require('serve-static');      //특정 폴더의 파일들을 특정 패스로 접근할 수 있도록 열어주는 역할
var path = require('path');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var expressErrorHandler = require('express-error-handler');

var bodyParser_post = require('body-parser');

//use사용해서 미들웨어 등록하기
app.use(bodyParser_post.urlencoded({extende : false}));
app.use(bodyParser_post.json());
app.use(serveStatic(path.join(__dirname, 'public')));


app.use(expressSession({
  secret : 'doitnews',
  resave : true,
  saveUninitialized : true
}));

var router = express.Router();
router.route('/addUser').post(
    function(req,res) {
        var paramID = req.body.id || req.qeury.id;
        var paramPW = req.body.password || req.query.password;
        var paramEMAIL = req.body.email || req.query.email;
        var paramPHONE = req.body.phone || req.query.phone;
        cosole.log('id : ' + paramID + ', paramPW : ' + paramPW + ',paramEmail :' + paramEMAIL + ", paramPHONE : " + paramPHONE);

        addUser(paramID, paramPW, paramEMAIL, paramPHONE, function (err, result) {
                if (err) {
                    console.log("Error");
                    res.wrtieHead(200);
                    res.end();
                    return;
                }
                if (result) {
                    console.dir(result);
                    res.writeHead(200);
                    res.end();
                } else {
                    console.log('DB 추가 에러');
                    res.writeHead(200);
                    res.end();
                }
            }
        );
    }
);

router.route('/login').post(
    function (req,res) {
        var paramID = req.body.id || req.query.id;
        var paramPW = req.body.password || req.query.password;
        console.log('parmaID : '+paramID + ', paramPW : ' + paramPW);

        authUser(paramID, paramPW, function(err, rows){
            if (err) {
                console.log("Error");
                res.wrtieHead(200);
                res.end();
                return;
            }
            if (rows) {
                console.dir(rows);
                res.writeHead(200);
                res.end();
            } else {
                console.log('empty Error');
                res.writeHead(200);
                res.end();
            }
        });
    }
);

app.use('/', router);
var addUser = function(id,password,email,phone,callback){
    console.log('addUser 호출');

    pool.getConnection(
        function(err,poolConn)
        {
            if(err)
            {
                if(poolConn){poolConn.release();}
                callback(err,null);
                return;
            }
            console.log('데이터베이스 연결 스레드 아이디' + poolConn.threadId);
            var data = {id : id, password : password , email : email, phone: phone};
            var exec = poolConn.query('insert into user set ?',data, function(err,result){
                poolConn.release();
                console.log('실행된 sql : ' + exec.sql);

                if(err){
                    console.log('sql 실행 시 에러 발생');
                    callback(err,null);
                    return;
                }
                callback(null,result);
            });
        }
    );
}

var authUser = function(id,password,callback){
    console.log('input id: ' + id + ', pw : ' + password);

    pool.getConnection(function(err,poolConn){
        if(err){
            if(poolConn){
                poolConn.release();
            }
            callback(err,null);
            return;
        }
        console.log('데이터베이스 연결 스레드 아이디' + poolConn.threadId);

        var tablename='user';
        var columns= ['id','email','phone'];

        var exec=poolConn.query("select ?? from ?? where id = ? and password = ?", [columns, tablename, id, password],
            function(err,rows){
            poolConn.release();
            console.log('실행된 sql : ' + exec.sql);

            if(err){
                callback(err,null);
                return;
            }
            if(rows.length > 0){
                console.log('사용자 확인');
                callback(null, rows);
            }else{
                console.log('사용자 확인 불가');
                callback(null,null);
            }
            });
    });
};

/* GET users listing. */
/**
 * @swagger
 * tags:
 *   name: User
 *   description: 사용자 정보 가져오기
 */
/**
 * @swagger
 * /path/:
 *   get:
 *     summary:
 *     tags:
 *     parameters:
 *       - in:
 *         name:
 *         type:
 *         enum:
 *         description: |
 *
 *     responses:
 *       200:
 *         description: 성공
 *       403:
 *         $ref: '#/components/res/Forbidden'
 *       404:
 *         $ref: '#/components/res/NotFound'
 *       500:
 *         $ref: '#/components/res/BadRequest'
 */

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
