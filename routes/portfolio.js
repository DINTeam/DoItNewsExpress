let express = require('express');
let router = express.Router();
const pool = require('../utils/pool');

/**
 * @swagger
 * tags:
 *   name: portfolio
 *   description: 포트폴리오
 */

/**
 * @swagger
 * /portfolio:
 *   get:
 *     summary: 사용자 포트폴리오 목록 조회
 *     tags: [portfolio]
 *     components:
 *      schemas:
 *          Portfolio:
 *                  properties:
 *                      p_title:
 *                          type: varchar(45)
 *                      p_register_time :
 *                          type: bigint
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
 *          $ref: '#/components/schemas/Portfolio'
 *       403:
 *         $ref: '#/components/res/Forbidden'
 *       404:
 *         $ref: '#/components/res/NotFound'
 *       400:
 *         $ref: '#/components/res/BadRequest'
 */
router.get('/',async(req,res) => {
        try {
            const data =await pool.query('select p_title,DATE_FORMAT(p_register_time,"%Y/%M/%D") as p_register_time from portfolio');
            return res.json(data[0]);
        } catch (err) {
            return res.status(400).json(err);
        }
});

/**
 * @swagger
 * /portfolio/{p_id} :
 *   get:
 *     summary: 포트폴리오 상세보기
 *     tags: [portfolio]
 *     parameters:
 *       - in: path
 *         name: p_id
 *         type: int
 *         required: true
 *         description: 포트폴리오 id 정보
 *     responses:
 *       200:
 *         description: 성공
 *         schema:
 *          $ref: '#/components/schemas/portfolio'
 *       403:
 *         $ref: '#/components/res/Forbidden'
 *       404:
 *         $ref: '#/components/res/NotFound'
 *       400:
 *         $ref: '#/components/res/BadRequest'
 */
router.get('/:p_id',async (req,res) => {
        try{
            let p_id = req.params.p_id;
            const data = await pool.query('select * from portfolio where p_id =?',p_id);
            return res.json(data[0]);
        }catch(err){
            return res.status(400).json(err);
        }
})
/**
 * @swagger
 * /portfolio/add :
 *   post:
 *     summary: 포트폴리오 작성하기
 *     tags: [portfolio]
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     requestBody:
 *       content:
 *          application/x-www-form-urlencoded:
 *              schema:
 *                  type: object
 *                  properties:
 *                      p_title:
 *                          type: varchar(45)
 *                      p_category:
 *                          type: varchar(45)
 *                      p_start_date:
 *                          type: bigint
 *                      p_end_date:
 *                          type: bigint
 *                      p_purpose:
 *                          type: varchar(45)
 *                      p_process:
 *                          type: mediumtext
 *              required:
 *                  - p_title
 *                  - p_category
 *                  - p_start_date
 *                  - p_end_date
 *                  - p_purpose
 *                  - p_process
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
router.post('/add',async(req,res) => {
        try{
            let {p_title,p_category,p_start_date,p_end_date,p_purpose,p_process} = req.body;
            let p_register_time = Date.now();
            const data = await pool.query('INSERT INTO portfolio SET ?',
                {p_title,p_category,p_start_date,p_end_date,p_purpose,p_process,p_register_time});
            return res.json(data[0]);
        }catch(err){
            res.status(400).json(err);
        }
});

/**
 * @swagger
 * /portfolio/update/:p_id :
 *   post:
 *     summary: 포트폴리오 수정하기
 *     tags: [portfolio]
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     requestBody:
 *       content:
 *          application/x-www-form-urlencoded:
 *              schema:
 *                  type: object
 *                  properties:
 *                      p_id:
 *                          type: int
 *                      p_title:
 *                          type: varchar(45)
 *                      p_category:
 *                          type: varchar(45)
 *                      p_start_date:
 *                          type: bigint
 *                      p_end_date:
 *                          type: bigint
 *                      p_purpose:
 *                          type: varchar(45)
 *                      p_process:
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
router.post("/update/:p_id",async(req,res) => {
        try{
            let {p_id,p_title,p_category,p_start_date,p_end_date,p_purpose,p_process} = req.body;
            const data = await pool.query('UPDATE portfolio SET p_title=?,p_category=?,p_start_date=?,p_end_date=?,p_purpose=?,p_process=? WHERE p_id=?',
                [p_title,p_category,p_start_date,p_end_date,p_purpose,p_process,p_id]);
            return res.json(data[0]);
        }catch(err){
            res.status(400).json(err);
        }
});

/**
 * @swagger
 * /portfolio/:p_id:
 *   delete :
 *     summary: 포트폴리오 삭제
 *     tags: [portfolio]
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     requestBody:
 *       content:
 *          application/x-www-form-urlencoded:
 *              schema:
 *                  type: object
 *                  properties:
 *                      p_id:
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
router.delete('/:p_id', async(req,res) =>{
        try{
            let {p_id} = req.body;
            const data = await pool.query('DELETE FROM portfolio WHERE p_id=?',p_id);
            return res.json(data[0]);
        }catch(err) {
            res.status(400).json(err);
        }
});

module.exports = router;