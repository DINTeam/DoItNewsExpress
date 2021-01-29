const pool = require('../utils/pool')
const crypto = require('crypto');

module.exports = {
    signup: async (json) => {
        const result = await pool.query('INSERT INTO user SET ?', json);
        return result;
    },
    exist_check : async (user_email) => {
        const result = await pool.query('SELECT * FROM user WHERE user_email = ?', user_email);
        return result;
    },

    //회원가입 할때 비밀번호를 받고 salt랑 hashed를 반환한다.
    encrypt : async (password) => {
        return new Promise(async (resolve, reject) => {
            try {
                const salt = await crypto.randomBytes(64).toString('hex');
                crypto.pbkdf2(password, salt.toString(), 1, 64, 'sha512', (err, derivedKey) => {
                    if (err) throw err;
                    const user_pw = derivedKey.toString('hex');
                    resolve({salt, user_pw});
                });
            }catch(err){
                console.log(err);
                reject(err);
            }
        })
    },

    //로그인할때 저장된 salt와 비밀번호를 통해 저장된 값과 같은지 확인하기
    encryptWithSalt : async(password,salt) => {
        return new Promise(async (resolve,reject) => {
            try{
                crypto.pbkdf2(password,salt,1,64,'sha512',(err,derivedKey) => {
                    if(err) throw err;
                    const hashed = derivedKey.toString('hex');
                    resolve(hashed);
                });
            }catch (err) {
                console.log(err);
                reject(err);
            }
        })
    }
}