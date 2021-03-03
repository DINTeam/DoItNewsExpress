let express = require('express');
let router = express.Router();
const pool = require('../utils/pool');

/**
 * @swagger
 * tags:
 *   name: article
 *   description: 기사
 */
/**
 * @swagger
 * /article :
 *   get:
 *     summary: 메인페이지에서 기사 조회
 *     tags: [article]
 *     components:
 *      schemas:
 *          Article:
 *                  properties:
 *                      ar_title:
 *                          type: varchar(45)
 *                      ar_content:
 *                          type: mediumtext
 *                      ar_views:
 *                          type: int
 *                      ar_register_time:
 *                          type: bigint
 *                      ar_reporter:
 *                          type: varchar(45)
 *                      like_cnt:
 *                          type: int
 *                      ar_thumbnail_id:
 *                          type: int
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         format: uuid
 *         required: true
 *     responses:
 *       200:
 *         description: 성공
 *         schema:
 *          $ref: '#/components/schemas/Article'
 *       403:
 *         $ref: '#/components/res/Forbidden'
 *       404:
 *         $ref: '#/components/res/NotFound'
 *       400:
 *         $ref: '#/components/res/BadRequest'
 */

router.get('/', async (req, res) => {
        try {
            const data = await pool.query('select ar_title,ar_content,ar_views, ar_likes,ar_regist_time,ar_reporter,like_cnt, ar_thumbnail_id from article');
            return res.json(data[0]);
        } catch (err) {
            return res.status(400).json(err);
        }
});

/**
 * @swagger
 * /article/{ar_id}:
 *   get:
 *     summary: 기사 조회
 *     tags: [article]
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
router.get('/:ar_id', async (req, res) => {
        try {
            let ar_id = req.params.ar_id;
            const result =await pool.query('update article set ar_views = ar_views + 1 where ar_id = ?',{ar_id});
            const data=await pool.query('select * from article where ar_id =?',ar_id);
            return res.json(data[0]);
        }catch (err) {
            return res.status(400).json(err);
        }
});
/**
 * @swagger
 * /article/add:
 *   post:
 *     summary: 기사 작성하기
 *     tags: [article]
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     requestBody:
 *       content:
 *          application/x-www-form-urlencoded:
 *              schema:
 *                  type: object
 *                  properties:
 *                      ar_title:
 *                          type: varchar(45)
 *                      ar_subtitle:
 *                          type: varchar(45)
 *                      ar_content:
 *                          type: mediumtext
 *                      ar_reporter:
 *                          type: varchar(45)
 *                      ar_regist_time:
 *                          type: int
 *              required:
 *                  - ar_title
 *                  - ar_subtitle
 *                  - ar_content
 *                  - ar_reporter
 *                  - ar_regist_time
 *     parameters:
 *       - in: header
 *         name: x-access-token
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
router.post('/add', async (req, res) => {
        try {
            const {ar_title, ar_subtitle, ar_content,ar_reporter,ar_regist_time} = req.body;
            const data = await pool.query('INSERT INTO article SET ?', {ar_title, ar_subtitle, ar_content,ar_reporter,ar_regist_time})
            return res.json(data[0]);
        } catch (err) {
            return res.status(400).json(err);
        }
});

/**
 * @swagger
 * /article/update/:ar_id:
 *   post:
 *     summary: 기사 수정하기
 *     tags: [article]
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
 *                      ar_title:
 *                          type: varchar(45)
 *                      ar_subtitle:
 *                          type: varchar(45)
 *                      ar_content:
 *                          type: mediumtext
 *     parameters:
 *       - in: header
 *         name: x-access-token
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
router.post("/update/:ar_id", async (req, res) => {
        try {
            let {ar_id,ar_title, ar_subtitle, ar_content} = req.body;
            const result = await pool.query('UPDATE article SET ar_title=?, ar_subtitle=?, ar_content=? WHERE ar_id=?', [ar_title,ar_subtitle,ar_content,ar_id]);
            return res.json(result[0])
        } catch (err) {
            res.status(400).json(err);
        }
});

/**
 * @swagger
 * /article/:ar_id:
 *   delete:
 *     summary: 기사 삭제
 *     tags: [article]
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
 *              required:
 *                  - ar_id
 *     parameters:
 *       - in: header
 *         name: x-access-token
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
router.delete('/:ar_id', async (req, res) => {
        try {
            let {ar_id} = req.body;
            const data = await pool.query('DELETE FROM article WHERE ar_id =?', ar_id)
            return res.json(data[0]);
        } catch (err) {
            res.status(403).send({msg: "권한이 없습니다."});
        }
});

module.exports = router;
