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
 * /comment/:
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
 * /comment/:
 *   get:
 *     summary: 포트폴리오 상세보기
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
//해당 포트폴리오 data를 가져오고 조회수를 업데이트하는 두가지 쿼리를 동시에 실행해야한다.
//이렇게 하나의 요청에 여러개의 쿼리문이 실행되어야 할 때는 트랜잭션 처리를 해주어야 한다.
router.get('/detail/:p_id',async (req,res) => {
    if(req.userInfo){
        try{
            let {p_id} = req.body;
            const data = await pool.query('select p_id,p_title,p_category,DATE_FORMAT(p_start_date,"%Y-%M-%D" as p_start_date,DATE_FORMAT(p_end_date,"%Y-%M-%D" as p_end_date,p_purpose,p_process) from portfolio where p_id =?',[p_id]);
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
 * /comment/:
 *   get:
 *     summary: 포트폴리오 작성하기
 *     tags: [portfolio]
 *     parameters:
 *       - in: user_id
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
router.post('/create',async(req,res) => {
    if (req.userInfo) {
        try{
            let user_id = req.userInfo.user_id;
            let {p_title,p_category,p_start_date,p_end_date,p_purpose,p_process} = req.body;
            const data = await pool.query('INSERT INTO portfolio(p_title,p_category,p_start_date,p_end_date,p_purpose,p_process) values (?,?,?,?,?,?) where user_id = ?',
                [p_title,p_category,p_start_date,p_end_date,p_purpose,p_process,user_id]);
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
 * /comment/:
 *   get:
 *     summary: 포트폴리오 수정하기
 *     tags: [portfolio]
 *     parameters:
 *       - in: user_id
 *         name: user_id
 *         type: int
 *         description: 사용자 id 정보
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
router.patch("/:p_id",async(req,res) => {
    if (req.userInfo) {
        try{
            let user_id = req.userInfo.user_id;
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
 * /comment/:
 *   get:
 *     summary: 포트폴리오 삭제하기
 *     tags: [portfolio]
 *     parameters:
 *       - in: user_id
 *         name: user_id
 *         type: int
 *         description: 사용자 id 정보
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
            let user_id = req.userInfo.user_id;
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