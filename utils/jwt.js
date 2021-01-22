const jwt = require('jsonwebtoken');
const secretOrPrivateKey = "jwtSecretKey";

const options = {
    algorithm : "HS256",
    expiresIn : "1d",
    issuer : "withDev"
}

const refreshOptions = {
    algorithm: "HS256",
    expiresIn: "1d",
    issuer: "withDev"
}

module.exports = {
    sign : (user) => {
        const payload = {
            user_email : user.user_email
        };
        const result = {
             token : jwt.sign(payload,secretOrPrivateKey,options)
        };
        return result;
    },

    verify : (token) => {
        let decoded;
        try{
            decoded = jwt.verify(token,secretOrPrivateKey);
        }catch(err){
            if(err.message ==='jwt exired'){
                console.log('토큰 유효기간 만료');
                return -3;
            }else if(err.message === 'invalid token'){
                console.log('invalid token');
                return -2;
            }else{
                console.log("error");
                return -2;
            }
        }
        return decoded;
    }
}