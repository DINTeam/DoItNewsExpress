let express = require('express')
let router = express.Router()
const pool = require('../utils/pool')

/**
 * @swagger
 * tags:
 *   name: comment
 *   description: 댓글
 */
/**
 * @swagger
 * /comment:
 *   get:
 *     summary: 댓글 조회
 *     tags: [comment]
 *     parameters:
 *       - in: userInfo
 *         name: userInfo
 *         type: string
 *         description: "사용자 정보 조회"
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

        try{
            const data = await pool.query('SELECT * FROM comment')
            return res.json(data[0])
        }catch (err){
            return  res.status(400).json(err)
        }
})

/**
 * @swagger
 * /comment/:ar_id :
 *   get:
 *     summary: 기사 댓글 조회
 *     tags: [comment]
 *     parameters:
 *       - in: body.ar_id
 *         name: ar_id
 *         type: int
 *         description: "기사 id 정보"
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
router.get('/:ar_id', async (req,res,next) => {

        try{
            let {ar_id} = req.params;
            const data = await pool.query('SELECT * FROM comment WHERE ar_id = ?', ar_id)
            return res.json(data[0])
        }catch (err){
            return  res.status(400).json(err)
        }
})

/**
 * @swagger
 * /comment/:user-id :
 *   post:
 *     summary: 댓글 달기
 *     tags: [comment]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *         type: string
 *         format: uuid
 *         required: true
 *
 *       - in: userInfo.user_id
 *         name: userInfo.user_id
 *         type: int
 *         description: 사용자 id 정보
 *         
 *       - in: body.ar_id
 *         name: ar_id
 *         type: int
 *         description: "기사 id 정보"
 *
 *       - in: body.c_comment
 *         name: c_comment
 *         type: string
 *         description: 댓글 내용
 *         
 *       - in: body.c_time
 *         name: c_time
 *         type: bogint
 *         description: 댓글 등록 시간
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
router.post('/user-id', async (req,res,next) => {
    if (req.userInfo){
        try{
            let user_id = req.userInfo.user_id;
            let {ar_id,c_comment,c_time}=req.body;
            const data = await pool.query('INSERT INTO search_history SET ?', [user_id, ar_id,c_comment,c_time])
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
 * /comment/user-id:
 *   delete:
 *     summary: 댓글 삭제
 *     tags: [comment]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *         type: string
 *         format: uuid
 *         required: true
 *
 *       - in: userInfo.user_id
 *         name: userInfo.user_id
 *         type: int
 *         description: 사용자 id 정보
 *         
 *       - in: body.c_id
 *         name: c_id
 *         type: int
 *         description: 댓글 id 정보
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
            let {c_id} = req.body;
            const data = await pool.query('DELETE from comment WHERE user_id = ? && comment.c_id', [user_id,c_id])
            return res.json(data[0])
        }catch (err){
            return  res.status(400).json(err)
        }
    }else{
        res.status(403).send({"message" : "권한이 없습니다"});
    }
})
module.exports = router