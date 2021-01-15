var express = require('express');
var app= express();
var router = express.Router();
var bodyParser_post = require('body-parser');
const pool = require('../utils/pool')
const crypto = require('crypto');
var User = ('../routes');

//use사용해서 미들웨어 등록하기
app.use(bodyParser_post.urlencoded({extende : false}));
app.use(bodyParser_post.json());
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

router.post('/:register',async function (req,res) {
  var id = req.body.id;
  var email=req.body.email;
  var input_password = req.body.password;
  var salt = Math.round((new Date().valueOf() + Math.random())) + "";
  var hashPassword = crypto.createHash("sha512").update(input_password+salt).digest("hex");
  var phone = req.body.phone;

  pool.query("INSERT INTO user (user_id,user_email,user_pw,user_phone,salt) VALUES(?,?,?,?,?)",
      [id,email,hashPassword,phone,salt], function(err, rows){
    if(err){
      console.log(err);
      res.status(500).send(mysql_odbc.error);
      }else {
      res.status(200).send(mysql_odbc.success);
      }
  });
});

router.post("/:login",async function(req,res,next){
  var result = User.findOne({
    where : {
      email : req.body.email
    }
  });

  var db_password = result.dataValues.password;
  var input_password = req.body.password;
  var salt = result.dataValues.salt;
  var hash_password = crypto.createHash("sha512").update(input_password+salt).digest("hex");

  if(db_password == hash_password){
    console.log("비밀번호 일치");
    req.session.email =req.body.email;
  }else{
    console.log("비밀번호 불일치");
    res.redirect("/:login");
  }
});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
