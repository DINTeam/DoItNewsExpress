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
 * /like/{user_id}/{ar_id} :
 *   post:
 *     summary: 좋아요 체크하기
 *     tags: [like]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         format: uuid
 *         required: true
 *       - in: path
 *         name : user_id
 *         required : true
 *         type: int
 *         description: 사용자 id 정보
 *       - in: path
 *         name : ar_id
 *         required : true
 *         type: int
 *         description: 기사 id 정보
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

router.post('/:user_id/:ar_id', async(req,res) =>{
        try{
            let user_id = req.params.user_id;
            let ar_id = req.params.ar_id;
            let data = await pool.query('update is_like set like_check=? where ar_id =? and user_id=?',[1,ar_id,user_id]);
            return res.json(data[0]);
        }catch(err) {
            res.status(400).json(err);
        }
});

/**
 * @swagger
 * /like/{user_id}/{ar_id} :
 *   get:
 *     summary: 좋아요 체크 여부
 *     tags: [like]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         format: uuid
 *         required: true
 *       - in: path
 *         name : user_id
 *         required : true
 *         type: int
 *         description: 사용자 id 정보
 *       - in: path
 *         name : ar_id
 *         required : true
 *         type: int
 *         description: 기사 id 정보
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
router.get('/:user_id/:ar_id',async(req,res)=>{
    try{
        let user_id = req.params.user_id;
        let ar_id = req.params.ar_id;
        let data = await pool.query('select like_check from is_like where user_id =? and ar_id=?',[user_id,ar_id]);
        console.log(data[0]);
        return res.json(data[0]);
    }catch (err) {
        res.status(400).json(err);
    }
})
module.exports = router;