var express = require('express');
var router = express.Router();
const pool = require('../utils/pool')
const crypto = require('crypto');

/**
 * @swagger
 *   tags:
 *   name: User
 *   description: "사용자 정보 가져오기"
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
 *       - in : user_email
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
router.post('/signup',function(req,res) {
  const {user_email, user_pw, user_pw_check, user_phone} = req.body;

  try {
    let data = {
      user_email: user_email,
      user_pw: user_pw,
      user_pw_check: user_pw_check,
      user_phone: user_phone,
      salt: salt
    }

    const user = {
      signup: async (json) => {

        const user_data = await pool.query('INSERT INTO user SET ?', [data]);
        return user_data;
      },
      user_check : async (user_email) => {
        const user_exist_data = await pool.query('SELECT * FROM users WHERE user_email = ?', user_email);
        return user_exist_data;
      }
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

  /*//입력해야할 내용들을 입력했는지 검증
  if(!user_email || !user_pw || !user_pw_check || !user_phone){
    return res.status(404).json({msg : "모든 칸에 입력해주세요"});
  }
  //비밀번호 양식이나 길이에 대해서 검증해야되나?
  if(user_pw !== user_pw_check){
    return res.status(400).json({msg : "비밀번호가 일치하지 않습니다."});
  }

  const exist_user = await*/




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


module.exports = router;
