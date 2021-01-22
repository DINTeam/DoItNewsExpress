let express = require('express')
let router = express.Router()
const pool = require('../utils/pool')

/**
 * @swagger
 * tags:
 *   name: search-history
 *   description: 검색기록
 */
/**
 * @swagger
 * /search-history:
 *   get:
 *     summary: 검색기록 조회
 *     tags: [search-history]
 *     parameters:
 *       - in: userInfo.user_id
 *         name: user_id
 *         type: int
 *         description: "사용자 id 정보"
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
router.get('/', async (req,res,next) => {
    if (req.userInfo){
        try{
            let user_id = req.userInfo.user_id;
            const data = await pool.query('SELECT * FROM search_history WHERE user_id = ?', user_id)
            return res.json(data[0])
        }catch (err){
            return  res.status(400).json(err)
        }
    }else{
        res.status(403).send({"message" : "권한이 없습니다"});
    }
})

/**
 * @swagger
 * /search-history/:user-id :
 *   post:
 *     summary: 검색 기록 추가
 *     tags: [search-history]
 *     parameters:
 *       - in: userInfo.user_id
 *         name: userInfo.user_id
 *         type: int
 *         description: 사용자 id 정보
 *
 *       - in: body.s_keyword
 *         name: s_keyword
 *         type: string
 *         description: 검색 키워드
 *
 *       - in: body.s_time
 *         name: s_time
 *         type: bigint
 *         description: "검색 시간"
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
router.post('/:user-id', async (req,res,next) => {
    if (req.userInfo){
        try{
            let user_id = req.userInfo.user_id;

            let params = {
                user_id : user_id,
                s_keyword: req.body.s_keyword,
                s_time: req.body.s_time
            };
            const data = await pool.query('INSERT INTO search_history SET ?', params)
            return res.json(data[0])
        }catch (err){
            return  res.status(400).json(err)
        }
    }else{
        res.status(403).send({"message" : "권한이 없습니다"});
    }
})
/**
 * @swagger
 * /search-history/:s-id :
 *    delete:
 *     summary: 검색 기록 삭제
 *     tags: [search-history]
 *     parameters:
 *       - in: userInfo.user_id
 *         name: userInfo.user_id
 *         type: int
 *         description: 사용자 id 정보
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
router.delete('/:s-id', async (req,res,next) => {
    if (req.userInfo){
        try{
            let s_id = req.params.s_id;
            const data = await pool.query('DELETE from search_history WHERE s_id = ?', s_id)
            return res.json(data[0])
        }catch (err){
            return  res.status(400).json(err)
        }
    }else{
        res.status(403).send({"message" : "권한이 없습니다"});
    }
})
/**
 * @swagger
 * /search-history/:user-id :
 *    delete:
 *     summary: 전체 검색 기록 삭제
 *     tags: [search-history]
 *     parameters:
 *       - in: userInfo.user_id
 *         name: userInfo.user_id
 *         type: int
 *         description: 사용자 id 정보
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
router.delete('/:user-id', async (req,res,next) => {
    if (req.userInfo){
        try{
            let user_id = req.userInfo.user_id;
            const data = await pool.query('DELETE from search_history WHERE user_id = ?', user_id)
            return res.json(data[0])
        }catch (err){
            return  res.status(400).json(err)
        }
    }else{
        res.status(403).send({"message" : "권한이 없습니다"});
    }
})
module.exports = router