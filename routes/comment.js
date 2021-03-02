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
 * /comment/{ar-id}:
 *   get:
 *     summary: 기사 댓글 조회
 *     tags: [comment]
 *     parameters:
 *       - in: path
 *         name: ar-id
 *         required: true
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
router.get('/:ar_id', async (req,res,next) => {
        try{
            let ar_id = req.params.ar_id;
            console.log("ar_id : "+ar_id);
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
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     requestBody:
 *       content:
 *          application/x-www-form-urlencoded:
 *              schema:
 *                  type: object
 *                  properties:
 *                      ar_id:
 *                          type: int
 *                      c_comment:
 *                          type: string
 *                      c_time:
 *                          type: bigint
 *              required:
 *                  - ar_id
 *                  - c_comment
 *                  - c_time
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *         type: string
 *         format: uuid
 *         required: true
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
            let {ar_id,c_comment,c_time}=req.body;
            console.log(ar_id+"&"+c_comment);
            const data = await pool.query('INSERT INTO comment (ar_id, c_comment, user_id, c_time) VALUES (?,?,?,?)', [ar_id,c_comment,user_id,c_time])
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
 * /comment/:c-id:
 *   delete:
 *     summary: 댓글 삭제
 *     tags: [comment]
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     requestBody:
 *       content:
 *          application/x-www-form-urlencoded:
 *              schema:
 *                  type: object
 *                  properties:
 *                      c_id:
 *                          type: int
 *              required:
 *                  - c_id
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *         type: string
 *         format: uuid
 *         required: true
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
router.delete('/:c-id', async (req,res,next) => {
    if (req.userInfo){
        try{
            let user_id = req.userInfo.user_id;
            let {c_id} = req.body;
            let row = await pool.query('select user_id from comment where c_id=?',c_id);
            let parsedResult = JSON.parse(JSON.stringify(row[0]));
            let proc_user_id = parsedResult[0].user_id;
            let c_user_id = parseInt(proc_user_id);
            console.log("c_user_id : "+c_user_id);
            if(user_id === c_user_id) {
                const data = await pool.query('DELETE from comment WHERE c_id=?', c_id)
                return res.json(data[0])
            }
            else res.status(403).send({"message" : "자신의 댓글만 삭제 가능합니다"});
        }catch (err){
            return  res.status(400).json(err)
        }
    }else{
        res.status(403).send({"message" : "권한이 없습니다"});
    }
})
module.exports = router