let express = require('express');
let router = express.Router();
const pool = require('../utils/pool');
const User = require('../model/user');
const encrypt = require('../model/user');
const jwt = require('../model/jwt');
const nodemailer = require('nodemailer');

//이메일 중복 체크 제대로 되는지 확인해보기
router.post('/signup', async (req, res) => {
    const {user_email, password, user_phone, user_type} = req.body;
    try {
        //이메일 중복되는지 확인하기
        check_dup = await User.exist_check(user_email);
        if (!check_dup.length === 0) {
            res.status(400).send({msg : "존재하는 이메일입니다."});
            return;
        }

        //회원가입
        const user_token = await jwt.create(user_email);
        console.log(user_token);
        const {salt, user_pw} = await encrypt.encrypt(password);
        const json = {user_email, user_pw , user_phone, salt,user_type,user_token};
        const result = await User.signup(json);

        //ip랑 등록시간 넣어주기
        let params = {
            user_id: result[0].insertId,
            user_ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            user_datetime: Date.now()
        }
        await pool.query('INSERT INTO user_register set ? ', params);

        res.status(200).send({msg: 'success'});

    } catch (err) {
        res.status(400).json(err);
    }
})
//date.now()는 UTC 기준으로 1970년 1월 1일 기준으로 현재까지 경과된 밀리 초를 반환

router.post('/login', async (req, res) => {
    const {user_email, password} = req.body;
    try {
        let user_check = await pool.query('SELECT * FROM user WHERE user_email = ?', user_email);
        console.log(user_check);

        if (user_check[0][0]) {
            const hashed = await encrypt.encryptWithSalt(password,user_check[0][0].salt)
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

//이렇게 하려면 user_email을 바꿀 수 없을 것 같움
router.post('/change',async (req,res) => {
    let {user_email,password,user_phone,newpassword} = req.body;
    try{
        let user_check = await pool.query('SELECT * FROM user WHERE user_email = ?', user_email);
        console.log(user_check);

        if(user_check[0][0]){
            const user_id = user_check[0][0].user_id;
            const hashed = await encrypt.encryptWithSalt(password,user_check[0][0].salt)
            if(user_check[0][0].user_pw === hashed){
                const {salt, user_pw} = await encrypt.encrypt(newpassword);
                const result = await pool.query('UPDATE user SET user_email=?,user_pw=?,user_phone=?,salt=? WHERE user_id=?', [user_email,user_pw,user_phone,salt,user_id]);
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

//router.update 이거 확인해보기
router.post('/forgot',async (req,res)=>{
    let {user_email} = req.body;
    try{
        const token = await pool.query('select user_token from user where user_email =?',user_email);
        if(token[0][0]){
            let transporter = nodemailer.createTransport({
                service : 'gmail',
                port : 465,
                secure : true,
                auth : {
                    user : ,
                    pass :
                }
            });
            let emailOptions = {
                 form : ,
                 to : user_email,
                 subject : 'DoItNews 비밀번호 초기화 메일입니다.'
                 html : `<p>비밀번호 초기화를 위해서는 아래의 URL을 클릭하여 주세요.<p>` +
                        `<a href = `
            }
        }
    }catch(err) {
        console.log(err);
        res.stauts(400).json(err);
    }
})
module.exports = router;
