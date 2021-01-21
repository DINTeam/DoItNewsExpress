let express = require('express')
let router = express.Router()
const pool = require('../utils/pool')

/**
 * @swagger
 * tags:
 *   name: Like
 *   description: 좋아요
 */

/**
 * @swagger
 * /comment/:
 *   get:
 *     summary: 좋아요
 *     tags: [comment]
 *     parameters:
 *       - in: user_id
 *         name: user_id
 *         type: int
 *         description: 사용자 id 조회
 *       - in: ar_id
 *         name : ar_id
 *         type: int
 *         description: 기사 id 조회
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

router.post('/:ar_id/like', function(req,res){
    if(req.userInfo){
        try{
            var user_id = req.userInfo.user_id;
            var ar_id = req.body.ar_id;
            pool.beginTransaction(function(err){
                pool.query('select like_check from is_like where user_id =? and ar_id =?', user_id,ar_id,function (req,res) {
                    if(like_check == 0){
                        pool.query('insert into is_like(ar_id,user_id,like_check) values (?,?,1)',ar_id,user_id);
                        pool.query('update article set ar_likes = ar_likes+1 wehre ar_id=?', ar_id);
                    }else if(like_check==1){
                        pool.query('delete from is_like where user_id = ? and ar_id =? ',user_id,ar_id);
                    }
                });
            })

        }catch(err) {
            return res.send(500).json(err);
        }
    }else{
        res.status(403).send({msg : "권한이 없습니다."});
    }
});
module.exports = router;