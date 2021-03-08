let express = require('express')
let router = express.Router()
const pool = require('../utils/pool')

/**
 * @swagger
 * tags:
 *   name: like
 *   description: 좋아요
 */

/**
 * @swagger
 * /like/{ar_id} :
 *   post:
 *     summary: 좋아요
 *     tags: [like]
 *     parameters:
 *       - in: path
 *         name : ar_id
 *         required : true
 *         type: int
 *         description: 기사 id 정보
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

router.post('/:ar_id', async(req,res) =>{
        try{
            var ar_id = req.params.ar_id;
            await pool.beginTransaction(async(err) => {
                await pool.query('select like_check from is_like where ar_id =?',ar_id,async (req,res) => {
                    if(like_check == 0){
                        let data = await pool.query('insert into is_like(ar_id,like_check) values (?,1)',ar_id);
                        let data2 = await pool.query('update article set ar_likes = ar_likes+1 where ar_id=?', ar_id);
                    }else if(like_check==1){
                        pool.query('delete from is_like where ar_id =? ',ar_id);
                    }
                })
            })
        }catch(err) {
            return res.send(500).json(err);
        }
});
module.exports = router;