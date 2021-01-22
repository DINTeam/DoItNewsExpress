let express = require('express')
let router = express.Router()
const pool = require('../utils/pool')

/**
 * @swagger
 * tags:
 *   name: category
 *   description: 카테고리
 */

/**
 * @swagger
 * /category/:
 *   get:
 *     summary: 전체 카테고리 리스트 조회
 *     tags: [category]
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
router.get('/', async (req, res, next) => {
    try {
        const data = await pool.query('select * from category', [])
        return res.json(data[0])
    } catch (err) {
        return res.status(500).json(err)
    }
})

/**
 * @swagger
 * /category/:c_name :
 *   get:
 *     summary: 특정 카테고리 리스트 조회
 *     tags: [category]
 *     parameters:
 *       - in: body.ar_id
 *         name: ar_id
 *         type: int
 *         description: "기사 id 정보"
 *       - in: body.c_name
 *         name: c_name
 *         type: string
 *         description: 카테고리 이름
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
router.get('/:c_name', async (req,res,next) => {
    if (req.userInfo){
        try{
            var c_name = req.body.c_name;
            const data = await pool.query('SELECT * FROM category WHERE c_name = ?', c_name)
            return res.json(data[0])
        }catch (err){
            return  res.status(500).json(err)
        }
    }else{
        res.status(403).send({"message" : "권한이 없습니다"});
    }
})

/**
 * @swagger
 * /category/add :
 *   put:
 *     summary: 카테고리 추가
 *     tags: [category]
 *     parameters:
 *       - in: body.c_name
 *         name: c_name
 *         type: string
 *         description: 카테고리 이름
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
router.put('/add', async (req,res,next) => {
    if (req.userInfo){
        try{
            var c_name = req.body.c_name;
            const data = await pool.query('INSERT INTO search_history SET ?', c_name)
            return res.json(data[0])
        }catch (err){
            return  res.status(500).json(err)
        }
    }else{
        res.status(403).send({"message" : "권한이 없습니다"});
    }
})

/**
 * @swagger
 * /category/delete :
 *   delete:
 *     summary: 카테고리 삭제
 *     tags: [category]
 *     parameters:
 *       - in: body.c_id
 *         name: c_id
 *         type: int
 *         description: 카테고리 id 정보
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
router.delete('/delete', async (req,res,next) => {
    if (req.userInfo){
        try{
            var c_id=req.body.c_id;
            const data = await pool.query('DELETE from category WHERE c_id', c_id)
            return res.json(data[0])
        }catch (err){
            return  res.status(500).json(err)
        }
    }else{
        res.status(403).send({"message" : "권한이 없습니다"});
    }
})
module.exports = router
