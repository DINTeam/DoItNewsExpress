const pool = require('../utils/pool')

const user = {

    signup: async (json) => {
        const result = await pool.query('INSERT INTO user SET ?', json);
        return result;
    },
    exist_check : async (user_email) => {
        const result = await pool.query('SELECT * FROM user WHERE user_email = ?', user_email);
        return result;
    }
}
module.exports = user;