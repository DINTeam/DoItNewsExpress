var express = require('express');
var app= express();
var router = express.Router();
const pool = require('../utils/pool')
const crypto = require('crypto');
var User = ('../routes');

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
 *       - in : user_id
 *         name : user_id
 *         type : int
 *         description : "user_id 정보"
 *       - in : user_pw
 *         name : user_pw
 *         type : varchar(45)
 *         description : "사용자 비밀번호 정보"
 *       - in :user_email
 *         name : user_email
 *         type : varchar(45)
 *         description : "사용자 이메일 정보"
 *       - in : user_phone
 *         name : user_phone
 *         type : varchar(45)
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
router.get('/register',function(req,res){
  res.render("/register");
});
router.post('/register',function (req,res) {
  if(req.userInfo) {
    var params = {
      user_id :req.body.user_id,
      user_email : req.body.user_email,
      user_type : req.body.user_type
    }
    pool.query('insert into user_check values(?,?,?)', params);
      var params = {
        user_id : req.body.user_id,
        user_ip : req.headers['x-forwarded-for'] ||  req.connection.remoteAddress,
        user_datetime : new Date()
      }
    pool.query('insert into user_register values (?,?,?)',params);

    var input_password = req.body.password;
    var salt = Math.round((new Date().valueOf() + Math.random())) + "";
    var hash_password = crypto.createHash("sha512").update(input_password + salt).digest("hex");
    var params = {
      user_id: req.body.user_id,
      user_email: req.body.user_email,
      user_pw: hash_password,
      user_phone: req.body.user_phone,
      salt: salt}

    pool.query('insert into users values (?,?,?,?,?)', params,function(req,res){
      if(err){
        console.log(err);
        res.status(500).json(err);
      } else{
        res.status(200).send({msg: 'success'});
      }
    });
  }else{
    res.status(403).send({msg: '권한이 없습니다.'});
  }
});


router.get('/login',function(req,res){
  var session = req.session;

  res.render('/login',{
    session : session
  });
});

router.post('/login',function(req,res){
  if(req.userInfo){
    var user_email = req.body.user_email;
    var db_password = pool.query('select user_pw from user where user_email=?',user_email);
    var input_password = req.body.password;
    var salt = pool.query('select salt from user where user_id=?',user_id);
    var hash_password = crypto.createHash("sha512").update(input_password+salt).digest("hex");

    if(db_password==hash_password){
      console.log("비밀번호 일치");
      req.session.email = req.body.user_email;
      res.status(200).send({msg: 'success'});
    }else{
      console.log("비밀번호 불일치");
      return res.status(500).json(err);
    }
  }else{
    res.status(403).send({msg: '권한이 없습니다.'});
  }
})

router.get("/logout",function(req,res){
  req.session.destroy();
  res.clearCookie('sid');

  res.redirect('/login');
});

module.exports = router;
