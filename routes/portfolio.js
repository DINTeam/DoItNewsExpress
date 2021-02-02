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
 *     parameters:
 *       - in: userInfo.user_id
 *         name: user_id
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
router.get('/',async(req,res) => {
    if (req.userInfo) {
        try {
            let user_id = req.userInfo.user.id;
            const data = pool.query('select p_title,DATE_FORMAT(p_register_time,"%Y/%M/%D") as p_register_time , p_views from portfolio where user_id=? order by p_id desc', user_id);
            return res.json(data[0]);
        } catch (err) {
            return res.status(400).json(err);
        }
    } else {
        res.status(403).send({"message": "권한이 없습니다."});
    }
});

/**
 * @swagger
 * /detail/:p_id :
 *   get:
 *     summary: 포트폴리오 상세보기
 *     tags: [portfolio]
 *     parameters:
 *       - in: body.p_id
 *         name: p_id
 *         type: int
 *         description: 포트폴리오 id 정보
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
router.get('/detail/:p_id',async (req,res) => {
    if(req.userInfo){
        try{
            let {p_id} = req.body;
            const data = await pool.query('select p_id,p_title,p_category,DATE_FORMAT(p_start_date,"%Y-%M-%D") as p_start_date,DATE_FORMAT(p_end_date,"%Y-%M-%D") as p_end_date,p_purpose,p_process from portfolio where p_id =?',[p_id]);
            return res.json(data[0]);
        }catch(err){
            return res.status(400).json(err);
        }
    }else{
        res.status(403).send({"message" : "권한이 없습니다."});
    }
})
/**
 * @swagger
 * /create :
 *   post:
 *     summary: 포트폴리오 작성하기
 *     tags: [portfolio]
 *     parameters:
 *       - in: body.p_title
 *         name: p_title
 *         type: varchar(45)
 *         description: "포트폴리오 제목"
 *       - in: body.p_category
 *         name: p_category
 *         type: varchar(45)
 *         description: "카테고리"
 *       - in: body.p_start_date
 *         name: p_start_date
 *         type: bigint
 *         description: "취재 시작 날짜"
 *       - in: body.p_end_date
 *         name: p_end_date
 *         type: bigint
 *         description: "취재 완료 날짜"
 *       - in: body.p_purpose
 *         name: p_purpose
 *         type: varchar(45)
 *         description: "취재 목적"
 *       - in: body.p_process
 *         name: p_process
 *         type: mediumtext
 *         description: "취재 과정"
 *       - in: p_register_time
 *         name: p_register_time
 *         type: bigint
 *         description: "포트폴리오 등록 시간"
 *
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
router.post('/create',async(req,res) => {
    if (req.userInfo) {
        try{
            let {p_title,p_category,p_start_date,p_end_date,p_purpose,p_process} = req.body;
            let p_register_time = Date.now();
            const data = await pool.query('INSERT INTO portfolio(p_title,p_category,p_start_date,p_end_date,p_purpose,p_process,p_register_time) values (?,?,?,?,?,?,?)',
                [p_title,p_category,p_start_date,p_end_date,p_purpose,p_process,p_register_time]);
            return res.json(data[0]);
        }catch(err){
            res.status(400).json(err);
        }
    } else {
        res.status(403).send({msg: '권한이 없습니다.'});
    }
});

/**
 * @swagger
 * /:p_id :
 *   patch:
 *     summary: 포트폴리오 수정하기
 *     tags: [portfolio]
 *     parameters:
 *       - in: body.p_id
 *         name: p_id
 *         type: int
 *         description: "포트폴리오 정보"
 *       - in: body.p_title
 *         name: p_title
 *         type: varchar(45)
 *         description: "포트폴리오 제목"
 *       - in: body.p_category
 *         name: p_category
 *         type: varchar(45)
 *         description: "카테고리"
 *       - in: body.p_start_date
 *         name: p_start_date
 *         type: bigint
 *         description: "취재 시작 날짜"
 *       - in: body.p_end_date
 *         name: p_end_date
 *         type: bigint
 *         description: "취재 완료 날짜"
 *       - in: body.p_purpose
 *         name: p_purpose
 *         type: varchar(45)
 *         description: "취재 목적"
 *       - in: body.p_process
 *         name: p_process
 *         type: mediumtext
 *         description: "취재 과정"

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
router.patch("/:p_id",async(req,res) => {
    if (req.userInfo) {
        try{
            let {p_id,p_title,p_category,p_start_date,p_end_date,p_purpose,p_process} = req.body;
            const data = await pool.query('UPDATE portfolio SET p_title=?,p_category=?,p_start_date=?,p_end_date=?,p_purpose=?,p_process=? WHERE p_id=?',
                [p_title,p_category,p_start_date,p_end_date,p_purpose,p_process,p_id]);
            return res.json(data[0]);
        }catch(err){
            res.status(400).json(err);
        }
       }else{
        res.status(403).send({msg : '권한이 없습니다.'});
    }
});

/**
 * @swagger
 * /:p_id :
 *   delete :
 *     summary: 포트폴리오 삭제하기
 *     tags: [portfolio]
 *     parameters:
 *       - in: p_id
 *         name: p_id
 *         type: int
 *         description: 포트폴리오 id 정보
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
    if(req.userInfo){
        try{
            let {p_id} = req.body;
            const data = await pool.query('DELETE FROM portfolio WHERE p_id=?',[p_id]);
            return res.json(data[0]);
        }catch(err) {
            res.status(400).json(err);
        }
    }else{
        res.status(403).send({msg : '권한이 없습니다.'});
    }
});

module.exports = router;