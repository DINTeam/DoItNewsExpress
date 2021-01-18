let express = require('express')
let router = express.Router()
const pool = require('../utils/pool')

/**
 * @swagger
 * tags:
 *   name: scrab
 *   description: 스크랩
 */

/**
 * @swagger
 * /comment/:
 *   get:
 *     summary: 스크랩 조회
 *     tags: [scrab]
 *     parameters:
 *       - in: user_id
 *         name: user_id
 *         type: int
 *         description: 사용자 id 조회
 *       - in: ar_id
 *         name : ar_id
 *         type: int
 *         description: 기사 id 조회
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
router.get('/:ar_id',function(req,res){
    if(req.userInfo){
        try{
            var user_id = req.userInfo.id;
            var ar_id = req.body.ar_id;
            const data = pool.query('select s_title,s_reporter,s_likes from scrab where user_id=? and ar_id=?',user_id,ar_id);
            return res.json(data[0]);
        }catch (err) {
            return res.status(500).json(err);
        }
    }else{
        res.status(403).send({msg : "권한이 없습니다."});
    }
});

/**
 * @swagger
 * /comment/:
 *   get:
 *     summary: 스크랩 목록에 저장
 *     tags: [scrab]
 *     parameters:
 *       - in: user_id
 *         name: user_id
 *         type: int
 *         description: 사용자 id 조회
 *       - in: ar_id
 *         name : ar_id
 *         type: int
 *         description: 기사 id 조회
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
router.post('/:ar_id',function(req,res){
    if(req.userInfo){
        var user_id = req.userInfo.user_id;
        var ar_id = req.userInfo.ar_id;
        var params ={
            user_id : user_id,
            ar_id : ar_id,
            s_title : req.body.s_title,
            s_reporter : req.body.s_reporter,
            s_like : pool.query('select ar_likes from article where ar_id =?', ar_id),
            s_time : date
        };
        pool.query('insert into scrab values(?,?,?,?,?,?) where user_id=? and ar_id=?', params,user_id,ar_id,function(req,res){
            if(err){
                console.log(err);
                res.status(500).json(err);
            }else{
                res.status(200).send({msg: 'success'});
            }
        });
    }else{
        res.status(403).send({msg : "권한이 없습니다."});
    }
})