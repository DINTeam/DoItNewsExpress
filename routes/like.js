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
 * /:ar_id/like :
 *   post:
 *     summary: 좋아요
 *     tags: [like]
 *     parameters:
 *       - in: body.ar_id
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

router.post('/:ar_id/like', async(req,res) =>{
    if(req.userInfo){
        try{
            var {ar_id} = req.body;
            pool.beginTransaction(async(err) => {
                pool.query('select like_check from is_like where ar_id =?',ar_id,async (req,res) => {
                    if(like_check == 0){
                        pool.query('insert into is_like(ar_id,like_check) values (?,1)',ar_id);
                        pool.query('update article set ar_likes = ar_likes+1 where ar_id=?', ar_id);
                    }else if(like_check==1){
                        pool.query('delete from is_like where ar_id =? ',ar_id);
                    }
                })
            })
        }catch(err) {
            return res.send(500).json(err);
        }
    }else{
        res.status(403).send({msg : "권한이 없습니다."});
    }
});
module.exports = router;