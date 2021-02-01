let express = require('express')
let router = express.Router()
const pool = require('../utils/pool')

/**
 * @swagger
 * tags:
 *   name: scrap
 *   description: 스크랩
 */

/**
 * @swagger
 * /comment/:
 *   get:
 *     summary: 스크랩 조회
 *     tags: [scrap]
 *     parameters:
 *       - in: user_id
 *         name: user_id
 *         type: int
 *         description: 사용자 id 조회
 *       - in: ar_id
 *         name : ar_id
 *         type: int
 *         description: 기사 id 조회
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
router.get('/:ar_id',async(req,res) => {
    if(req.userInfo){
        try{
            var user_id = req.userInfo.user_id;
            var {ar_id} = req.body;
            const data =await pool.query('select s_title,s_reporter,s_likes from scrap where ar_id=?',ar_id);
            return res.json(data[0]);
        }catch (err) {
            return res.status(500).json(err);
        }
    }else{
        res.status(403).send({msg : "권한이 없습니다."});
    }
});

/**
 * @swagger
 * /comment/:
 *   get:
 *     summary: 스크랩 목록에 저장
 *     tags: [scrap]
 *     parameters:
 *       - in: user_id
 *         name: user_id
 *         type: int
 *         description: 사용자 id 조회
 *       - in: ar_id
 *         name : ar_id
 *         type: int
 *         description: 기사 id 조회
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
router.post('/:ar_id',async(req,res) => {
    if(req.userInfo){
        try{
            let user_id= req.userInfo.user_id;
            let {ar_id,s_title,s_reporter} =req.body;
            let s_like = await pool.query('select ar_likes from article where ar_id',ar_id);
            let s_time = Date.now();
            const data = await pool.query('insert into scrap values(?,?,?,?,?,?) where ar_id=?',[s_title,s_reporter,s_like,s_time,ar_id])
            return res.json(data[0]);
        }catch(err){
            res.status(400).json(err);
        }
    }else{
        res.status(403).send({msg : "권한이 없습니다."});
    }
})
module.exports = router;