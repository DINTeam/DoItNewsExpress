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
 * /:ar_id :
 *   get:
 *     summary: 스크랩 조회
 *     tags: [scrap]
 *     parameters:
 *       - in: body.ar_id
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
 * /:ar_id :
 *   get:
 *     summary: 스크랩 목록에 저장
 *     tags: [scrap]
 *     parameters:
 *       - in: body.ar_id
 *         name : ar_id
 *         type: int
 *         description: 기사 id 조회
 *       - in: body.s_title
 *         name : s_title
 *         type: varchar(45)
 *         description: "스크랩 한 기사 제목"
 *       - in: body.s_reporter
 *         name : s_reporter
 *         type: varchar(45)
 *         description: "스크랩 한 기사 작성자"
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
router.post('/:ar_id',async(req,res) => {
    if(req.userInfo){
        try{
            let {ar_id,s_title,s_reporter} =req.body;
            let s_like = await pool.query('select ar_likes from article where ar_id=?',ar_id);
            let s_time = Date.now();
            const data = await pool.query('insert into scrap values(?,?,?,?) where ar_id=?',[s_title,s_reporter,s_like,s_time,ar_id])
            return res.json(data[0]);
        }catch(err){
            res.status(400).json(err);
        }
    }else{
        res.status(403).send({msg : "권한이 없습니다."});
    }
})
module.exports = router;