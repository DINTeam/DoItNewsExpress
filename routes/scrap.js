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
 * /scrap/{user_id} :
 *   get:
 *     summary: 스크랩 조회
 *     tags: [scrap]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         format: uuid
 *         required: true
 *       - in: path
 *         name: user_id
 *         required: true
 *         type: int
 *         description: 스크랩을 한 사용자 id 정보
 *     responses:
 *       200:
 *         description: 성공
 *       403:
 *         $ref: '#/components/res/Forbidden'
 *       404:
 *
 *         $ref: '#/components/res/NotFound'
 *       500:
 *         $ref: '#/components/res/BadRequest'
 */
router.get('/:user_id',async(req,res) => {
        try{
            let user_id = req.params.user_id;
            const data =await pool.query('select s_title,s_reporter,s_like from scrap where user_id=?',user_id);
            return res.json(data[0][0]);
        }catch (err) {
            return res.status(500).json(err);
        }
});

/**
 * @swagger
 * /scrap/{user_id}/{ar_id} :
 *   post:
 *     summary: 스크랩한 기사들 목록에 넣기
 *     tags: [scrap]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         format: uuid
 *         required: true
 *       - in: path
 *         name: user_id
 *         required: true
 *         type: int
 *         description: 스크랩을 하는 사용자의 id 정보
 *       - in: path
 *         name: ar_id
 *         required: true
 *         type: int
 *         description: 스크랩 한 기사의 id 정보
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
router.post('/:user_id/:ar_id',async(req,res) => {
        try{
            let user_id = req.params.user_id;
            let ar_id = req.params.ar_id;
            let ar_title = await pool.query('select ar_title from article where ar_id=?',ar_id);
            let ar_reporter = await pool.query('select ar_reporter from article where ar_id=?',ar_id);
            let like_cnt= await pool.query('select like_cnt from article where ar_id=?',ar_id);
            let s_time = Date.now();
            const data = await pool.query('insert into scrap(ar_title,ar_reporter,s_time,like_cnt,ar_id,user_id) values (?,?,?,?,?,?)',[ar_title,ar_reporter,s_time,like_cnt,ar_id,user_id]);
            return res.json(data[0]);
        }catch(err){
            res.status(400).json(err);
        }
})
module.exports = router;