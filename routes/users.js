var express = require('express');
var app= express();
var router = express.Router();
var serveStatic = require('serve-static');      //특정 폴더의 파일들을 특정 패스로 접근할 수 있도록 열어주는 역할
var path = require('path');
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var expressErrorHandler = require('express-error-handler');
var bodyParser_post = require('body-parser');

//use사용해서 미들웨어 등록하기
app.use(bodyParser_post.urlencoded({extende : false}));
app.use(bodyParser_post.json());

var conn = mysql.createConnection({
  port : 3000,
  user : 'admin',
  password : 'doitnews',
  database : 'doitnews'
});
conn.connect();

router.post("/sign_up", function(req,res,next){
  var body = req.body;
  var email = body.email;
  var phone = body.phone;
  var pw = body.password;

  var query = conn.query('insert into user (user_email, user_pw,user_phone ) values ("' + email + '","' + phone + '","' + pw + '")', function(err, rows) {
    if(err) { throw err;}
    console.log("Data inserted!");
  })
})

/* GET users listing. */
/**
 * @swagger
 * tags: -"tag-for-user"
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
 *       - in : "query"
 *         name : "password"
 *         type : "string"
 *         description : "사용자 비밀번호 정보"
 *
 *       - in : "query"
 *         name : "email"
 *         type : "string"
 *         description : "사용자 이메일 정보"
 *
 *       - in : "query"
 *         name : "phone"
 *         type : "string"
 *         description : "사용자 전화번호 정보"
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
