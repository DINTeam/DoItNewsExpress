let express = require('express');
let router = express.Router();
const pool = require('../utils/pool');
const User = require('../model/user');
const jwt = require('../model/jwt');
const nodemailer = require('nodemailer');

/**
 * @swagger
 * tags:
 *   name: auth
 *   description: 회원가입 및 로그인
 */
/**
 * @swagger
 * /auth/signup :
 *   post:
 *     summary: 회원가입
 *     tags: [auth]
 *     security :
 *       - bearerAuth : []
 *     parameters:
 *       - in: body.user_email
 *         name: user_email
 *         type: varchar(45)
 *         description: "사용자 이메일 정보"
 *       - in: body.password
 *         name: password
 *         type: varchar(200)
 *         description: "사용자 비밀번호 정보"
 *       - in: body.user_phone
 *         name: user_phone
 *         type: varchar(11)
 *         description: "사용자 전화번호 정보"
 *       - in: body.user_type
 *         name: user_type
 *         type: int
 *         description: "사용자 유형 정보"

 *     responses:
 *       200:
 *         description: 성공
 *       403:
 *         $ref: '#/components/res/Forbidden'
 *       404:
 *         $ref: '#/components/res/NotFound'
 *       400:
 *         $ref: '#/components/res/BadRequest'
 */
//이메일 중복 체크 제대로 되는지 확인해보기
router.post('/signup', async (req, res) => {
    const {user_email, password, user_phone, user_type} = req.body;
    try {
        //이메일 중복되는지 확인하기
        let check = await User.exist_check(user_email);
        if (check.length) {
            res.status(400).send({msg : "존재하는 이메일입니다."});
            return;
        }

        //회원가입
        const user_token = await jwt.create(user_email);
        const {salt, user_pw} = await User.encrypt(password);
        const json = {user_email, user_pw , user_phone, salt,user_type,user_token};
        const result = await User.signup(json);
        //ip랑 등록시간 넣어주기
        let params = {
            user_id: result[0].insertId,
            user_ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            user_datetime: Date.now()
        }
        await pool.query('INSERT INTO user_register SET ? ', {params});

        res.status(200).send({msg: 'success'});
    } catch (err) {
        res.status(400).json(err);
    }
})

/**
 * @swagger
 * /auth/login :
 *   post:
 *     summary: 로그인
 *     tags: [auth]
 *     security :
 *       - bearerAuth : []
 *     parameters:
 *       - in: body.user_email
 *         name: user_email
 *         type: varchar(45)
 *         description: "사용자 이메일 정보"
 *       - in: body.password
 *         name: password
 *         type: varchar(200)

 *     responses:
 *       200:
 *         description: 성공
 *       403:
 *         $ref: '#/components/res/Forbidden'
 *       404:
 *         $ref: '#/components/res/NotFound'
 *       400:
 *         $ref: '#/components/res/BadRequest'
 */
router.post('/login', async (req, res) => {
    const {user_email, password} = req.body;
    try {
        let user_check = await pool.query('SELECT * FROM user WHERE user_email = ?', {user_email});
        console.log(user_check);

        if (user_check[0][0]) {
            const hashed = await User.encryptWithSalt(password,user_check[0][0].salt)
            console.log(hashed);
            console.log(user_check[0][0].user_pw);
            if(user_check[0][0].user_pw === hashed){
                res.json(user_check[0][0]);
            }else{
                res.status(403).send({msg : "비밀번호가 일치하지 않습니다."});
            }
        }else{
            res.status(403).send({msg : "이메일 또는 비밀번호가 일치하지 않습니다."});
        }
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
})
/**
 * @swagger
 * /auth/change :
 *   post:
 *     summary: 회원정보 변경
 *     tags: [auth]
 *     parameters:
 *       - in: body.user_email
 *         name: user_email
 *         type: varchar(45)
 *         description: "사용자 이메일 정보"
 *       - in: body.password
 *         name: password
 *         type: varchar(200)
 *         description: "사용자 비밀번호 정보"
 *       - in: body.user_phone
 *         name: user_phone
 *         type: varchar(11)
 *         description: "사용자 전화번호 정보"
 *       - in: body.newpassword
 *         name: newpassword
 *         type: varchar(200)
 *         description: "사용자 새로운 비밀번호 정보 "

 *     responses:
 *       200:
 *         description: 성공
 *       403:
 *         $ref: '#/components/res/Forbidden'
 *       404:
 *         $ref: '#/components/res/NotFound'
 *       400:
 *         $ref: '#/components/res/BadRequest'
 */
router.post('/change',async (req,res) => {
    let {user_email,password,user_phone,newpassword} = req.body;
    try{
        let user_check = await pool.query('SELECT * FROM user WHERE user_email = ?', user_email);
        console.log(user_check);

        if(user_check[0][0]){
            const user_id = user_check[0][0].user_id;
            const hashed = await User.encryptWithSalt(password,user_check[0][0].salt)
            if(user_check[0][0].user_pw === hashed){
                const {salt, user_pw} = await User.encrypt(newpassword);
                const result = await pool.query('UPDATE user SET user_pw=?,user_phone=?,salt=? WHERE user_id=?', [user_email,user_pw,user_phone,salt,user_id]);
                res.status(200).send({msg : "회원정보가 정상적으로 변경되었습니다."})
            }else{
                res.status(403).send({msg : "비밀번호가 일치하지 않습니다."});
            }
        }else{
            res.status(403).send({msg : "이메일 또는 비밀번호가 일치하지 않습니다."});
        }
    }catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});
/*
router.post('/forgot',async (req,res)=>{
    let {user_id} = req.body;
    console.log(user_id);
    try{
        const token = await pool.query('select user_token from access where user_id =?',user_id);
        if(token[0][0]){
            let transporter = nodemailer.createTransport({
                service : 'SendGrid',
                auth : {
                    user :'apikey' ,
                    pass : ''
                }
            });
            let emailOptions = {
                 from : ,
                 to : user_email,
                 subject : 'DoItNews 비밀번호 초기화 메일입니다.'
                 html : '<p>비밀번호 초기화를 위해서는 아래의 URL을 클릭하여 주세요.<p>'+
                        '<a href = `https:
            }
        }
    }catch(err) {
        console.log(err);
        res.stauts(400).json(err);
    }
})*/
module.exports = router;
