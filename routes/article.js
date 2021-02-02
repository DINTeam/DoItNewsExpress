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
 * /article:
 *   get:
 *     summary: 기사 조회
 *     tags: [aticle]
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
 *       500:
 *         $ref: '#/components/res/BadRequest'
 */
router.get('/', async (req,res) => {
    if(req.userInfo){
        try{
            const data = await pool.query('select ar_title,ar_content,ar_views, ar_likes,ar_register_time, ar_thumbnail_id from article');
            return res.json(data[0]);
        }catch (err) {
            return res.status(400).json(err);
        }
    }else{
        res.status(403).send({msg : "Token error!"});
    }
});

/**
 * @swagger
 * /article/detail/:ar_id :
 *   get:
 *     summary: 기사 상세보기
 *     tags: [article]
 *     parameters:
 *       - in: body.ar_id
 *         name: ar_id
 *         type: int
 *         description: ar_id 정보
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

router.get('/detail/:ar_id',function (req,res) {
    if(req.userInfo){
        try{
            let ar_id = req.body.ar_id;
            pool.beginTransaction(function(err){
                pool.query('update article set ar_views = ar_views + 1 where ar_id = ?',ar_id,function(err){
                    if(err){
                        console.log(err);
                        pool.rollback(function () {
                            console.log('rollback error1');
                        })
                    }
                    pool.query('select * from article where ar_id =?', ar_id ,function(err,rows) {
                        if (err) {
                            console.log(err);
                            pool.rollback(function () {
                                cosole.log('rollback error2');
                            })
                        } else {
                            pool.commit(function (err) {
                                if (err) console.log(err);
                                console.log("row : " + rows);
                                res.render('/detail', {rows: rows});
                            })
                        }
                    })
                });
            })
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        res.status(403).send({"message" : "권한이 없습니다."});
    }
});
/**
 * @swagger
 * /article/:user_id :
 *   post:
 *     summary: 기사 작성하기
 *     tags: [article]
 *     parameters:
 *       - in: userInfo.user_id
 *         name: userInfo.user_id
 *         type: int
 *         description: user_id 정보
 *
 *       - in: user_type
 *         name: user_type
 *         type: tinyint
 *         description: user_type 정보
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
router.post('/:user_id',async (req,res) => {
    if (req.userInfo) {
        try{
            let user_id = req.userInfo.user_id;
            let user_type = await pool.query('select user_type from user where user_id = ?',user_id);
            //기자로 가입한 사람만 작성 가능
            if(user_type === 1) {
                let {ar_id, ar_title, ar_subtitle, ar_content, ar_reporter} = req.body;
                const data = await pool.query('INSERT INTO article(ar_id,ar_title,ar_subtitle,ar_content,ar_reporter) SET ?', [ar_id, ar_title, ar_subtitle, ar_content, ar_reporter])
                return res.json(data[0]);
            }else {
                res.status(403).send({msg: '기자 회원만 작성 가능합니다. '});
            }
        }catch (err){
            return res.status(400).json(err);
        }

    } else {
        res.status(403).send({msg: '권한이 없습니다.'});
    }
});

/**
 * @swagger
 * /article/:ar_id :
 *   get:
 *     summary: 기사 수정하기
 *     tags: [article]
 *     parameters:
 *       - in: userInfo.user_id
 *         name: userInfo.user_id
 *         type: int
 *         description: 사용자 id 정보
 *       - in: body.ar_id
 *         name: ar_id
 *         type: int
 *         description: ar_id 정보
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
router.patch("/:ar_id",async (req,res) => {
    if (req.userInfo) {
        try{
            let user_id = req.userInfo.user_id;
            let {ar_id} = req.body;
            let user_type = await pool.query('select user_type from user where user_id = ?',user_id);

            //기자인 사람만 수정 가능
            if(user_type === 1) {
                let {ar_title, ar_subtitle, ar_content} = req.body;
                const data = await pool.query('UPDATE article SET ar_title=?,ar_subtitle=?,ar_content=? WHERE ar_id=?', [ar_title, ar_subtitle, ar_content,ar_id]);
                return res.json(data[0]);
            }else {
                res.status(403).send({msg: '권한이 없습니다.'});
            }
        }catch(err){
            res.status(400).json(err);
        }
    }else{
        res.status(403).send({msg : '권한이 없습니다.'});
    }
});

/**
 * @swagger
 * /article/:ar_id :
 *   delete:
 *     summary: 기사 삭제하기
 *     tags: [article]
 *     parameters:
 *       - in: userInfo.user_id
 *         name: userInfo.user_id
 *         type: int
 *         description: 사용자 id 정보
 *       - in: body.ar_id
 *         name: body.ar_id
 *         type: int
 *         description : ar_id 정보
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
router.delete('/:ar_id', async (req,res) => {
    if(req.userInfo){
        try{
            let user_id = req.userInfo.user_id;
            let ar_id = req.body;
            let user_type = await pool.query('select user_type from user where user_id = ?',user_id);

            if(user_type ===1){
                const data= await pool.query('DELETE FROM article WHERE user_id =? AND ar_id =?',{user_id,ar_id})
                return res.json(data[0]);
            }
        }catch (err) {
            res.status(403).send({msg : "권한이 없습니다."});
        }


    }else{
        res.status(403).send({msg : '권한이 없습니다.'});
    }
});

module.exports = router;
