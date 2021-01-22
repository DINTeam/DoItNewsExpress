var express = require('express');
var router = express.Router();
const pool = require('../utils/pool');
const crypto = require('crypto-promise');
const User = require('../model/user');


async function hash_pw(user_pw){
    try{
        let buf=await crypto.randomBytes(64);
        let salt = buf.toString();
        let hash_pw = await crypto.pbkdf2(user_pw.toString(), salt, 1000, 64, 'SHA512'); // 버터 형태로 리턴해주므로 base64 방식으로 문자열 만들어기주
        let password = hash_pw.toString('hex');
    }catch(err){
        throw err;
    }
}
router.post('/signup', async (req, res) => {
    const {user_email, user_pw, user_phone, user_type} = req.body;
    try {
        //이메일 중복되는지 확인하기
        check_dup = await User.exist_check(user_email);
        if (!check_dup.length === 0) {
            res.status(500).json(err);
            return;
        }

        //회원가입
        const buf = await crypto.randomBytes(64); // 64비트 salt 값 생성
        const salt = buf.toString('hex') // 비트를 문자열로 바꿈
        const hash_pw = await crypto.pbkdf2(user_pw.toString(), salt, 1000, 64, 'SHA512'); // 버터 형태로 리턴해주므로 base64 방식으로 문자열 만들어기주
        const password = hash_pw.toString('hex');
        const json = {user_email, user_pw : password, user_phone, salt,user_type};
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
        res.status(500).json(err);
    }
})

router.post('/login', async (req, res) => {
    const {user_email, user_pw} = req.body;
    try {
        let user_check = await pool.query('SELECT * FROM user WHERE user_email = ? ', user_email);
        console.log(user_check);
        if (user_check[0][0]) {
            const buf = await crypto.randomBytes(64); // 64비트 salt 값 생성
            const salt = buf.toString('hex') // 비트를 문자열로 바꿈
            const hash_pw = await crypto.pbkdf2(user_pw.toString(), salt, 1000, 64, 'SHA512'); // 버터 형태로 리턴해주므로 base64 방식으로 문자열 만들어기주
            const password = hash_pw.toString('hex');

            if(user_check[0][0].user_pw === password){
                res.json(user_check[0][0]);
            }else{
                res.status(403).send({msg : "비밀번호가 일치하지 않습니다."});
            }
        }else{
            res.status(403).send({msg : "이메일 또는 비밀번호가 일치하지 않습니다."});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})
//비밀번호 변경하는거 찾아보기
router.post('/change', async (req, res) => {
    const {user_email} = req.body;
    if (req.userInfo) {
        const buf = await crypto.randomBytes(64); // 64비트 salt 값 생성
        const salt = buf.toString('hex') // 비트를 문자열로 바꿈
        const hash_pw = await crypto.pbkdf2(user_pw.toString(), salt, 1000, 64, 'SHA512'); // 버터 형태로 리턴해주므로 base64 방식으로 문자열 만들어기주
        const password = hash_pw.toString('hex');

        pool.query('UPDATE user SET user_pw =?, salt =? WHERE user_email =?', password, salt, user_email, function (req, res) {
            if (err) {
                res.status(500).send({msg: "비밀번호 변경 실패"})
            } else {
                res.status(200).send({msg: "비밀번호 변경 성공"});
            }
        });
    }


})
module.exports = router;
