const randToken = require('rand-token');
const jwt = require('jsonwebtoken');
const secretKey = 'secret key';
const options = {
    algorithm : 'HS256',
    expiresIn : "30m"
}
module.exports={
    create : async (user_email) => {
        const payload ={
            user_email : user_email
        };
        const token ={
            user_token : jwt.sign(payload,secretKey,options),
        };
        return token;
    },

    verify : async (token) => {
        let decoded;
        try {
            decoded : jwt.verify(token,secretKey);
        }catch (err){
            if(err.message === 'jwt expired'){
                console.log('expired token');
                return TOKEN_EXPIRED;
            } else if(err.message === "invalid token"){
            console.log('invalid token');
            console.log(TOKEN_INVALID);
            return TOKEN_INVALID;
            }else{
            console.log("invalid token");
            return TOKEN_INVALID;
            }
        }
        return decoded;
    }
}