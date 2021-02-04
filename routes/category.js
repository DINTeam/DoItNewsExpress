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
 * /category:
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
 *       400:
 *         $ref: '#/components/res/BadRequest'
 */
router.get('/', async (req, res, next) => {
    try {
        const data = await pool.query('select * from article', [])
        return res.json(data[0])
    } catch (err) {
        return res.status(400).json(err)
    }
})

/**
 * @swagger
 * /category/:c_name :
 *   get:
 *     summary: 특정 카테고리 리스트 조회
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
 *       400:
 *         $ref: '#/components/res/BadRequest'
 */
router.get('/:c_name', async (req,res,next) => {
        try{
            let c_name = req.params.c_name;
            const data = await pool.query('SELECT c_id FROM category WHERE c_name = ?', c_name)
            console.log(data[0])
            let c_id = data[0];
            const data2 = await pool.query('SELECT * FROM article WHERE c_id = ?', c_id)
            return res.json(data2[0])
        }catch (err){
            return  res.status(400).json(err)
        }
})

/**
 * @swagger
 * /category/lev2 :
 *   post:
 *     summary: 레벨 2 카테고리 추가
 *     tags: [category]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *         type: string
 *         format: uuid
 *         required: true
 *
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
 *       400:
 *         $ref: '#/components/res/BadRequest'
 */
router.post('/lev2', async (req,res,next) => {
    if (req.userInfo.user_type === 1){
        try{
            let c_name = req.body.c_name;
            const data1 = await pool.query('SELECT @myLeft := c_left FROM category WHERE c_name = \'전체\'')
            const data2 = await pool.query('UPDATE category SET c_right = category.c_right + 2 WHERE category.c_right > @myLeft')
            const data3 = await pool.query('UPDATE category SET c_left = category.c_left + 2 WHERE category.c_left > @myLeft')
            const data4 = await pool.query('INSERT INTO category(c_name, c_left, c_right) VALUES(c_name, @myLeft + 1, @myLeft + 2)', c_name)
            return res.json(data1[0])
        }catch (err){
            return  res.status(400).json(err)
        }
    }else{
        res.status(403).send({"message" : "권한이 없습니다"});
    }
})

/**
 * @swagger
 * /category/lev3 :
 *   post:
 *     summary: 레벨 3 카테고리 추가
 *     tags: [category]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *         type: string
 *         format: uuid
 *         required: true
 *
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
 *       400:
 *         $ref: '#/components/res/BadRequest'
 */
router.post('/lev3', async (req,res,next) => {
    if (req.userInfo.user_type === 1){
        try{
            let c_name = req.body.c_name;
            let parent_name = req.body.parent_name;
            const data1 = await pool.query('SELECT @myLeft := c_left FROM category WHERE c_name = ?',parent_name)
            const data2 = await pool.query('UPDATE category SET c_right = category.c_right + 2 WHERE category.c_right > @myLeft')
            const data3 = await pool.query('UPDATE category SET c_left = category.c_left + 2 WHERE category.c_left > @myLeft')
            const data4 = await pool.query('INSERT INTO category(c_name, c_left, c_right) VALUES(c_name, @myLeft + 1, @myLeft + 2)', c_name)
            return res.json(data1[0])
        }catch (err){
            return  res.status(400).json(err)
        }
    }else{
        res.status(403).send({"message" : "권한이 없습니다"});
    }
})

/**
 * @swagger
 * /category/:c-id :
 *   delete:
 *     summary: 카테고리 삭제
 *     tags: [category]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *         type: string
 *         format: uuid
 *         required: true
 *
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
 *       400:
 *         $ref: '#/components/res/BadRequest'
 */
router.delete('/:c-id', async (req,res,next) => {
    if (req.userInfo.user_type === 1){
        try{
            let c_id=req.params.c_id;
            const data = await pool.query('DELETE from category WHERE c_id', c_id)
            return res.json(data[0])
        }catch (err){
            return  res.status(400).json(err)
        }
    }else{
        res.status(403).send({"message" : "권한이 없습니다"});
    }
})
module.exports = router
