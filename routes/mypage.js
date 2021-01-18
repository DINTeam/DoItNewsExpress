let express = require('express')
let router = express.Router()
const pool = require('../utils/pool')

/**
 * @swagger
 * tags:
 *   name: mypage
 *   description:  마이페이지
 */

/**
 * @swagger
 * /mypage/:
 *   get:
 *     summary:  마이페이지조회
 *     tags: [mypage]
 *     parameters:
 *       - in: userInfo
 *         name: userInfo
 *         type: string
 *         description: 사용자 정보 조회
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
router.get('/', async (req,res,next) => {
    if (req.userInfo){
        try{
            const data = await pool.query('SELECT * FROM user')
            return res.json(data[0])
        }catch (err){
            return  res.status(500).json(err)
        }
    }else{
        res.status(403).send({"message" : "Token error!"});
    }
})

/**
 * @swagger
 * /mypage/:user_id :
 *   get:
 *     summary:  마이페이지 조회
 *     tags: [mypage]
 *     parameters:
 *       - in: userInfo.user_id
 *         name: user_id
 *         type: int
 *         description:사용자 id 정보
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
router.get('/:user_id', async (req,res,next) => {
    if (req.userInfo){
        try{
            var user_id = req.userInfo.user_id;
            const data = await pool.query('SELECT * FROM user WHERE user_id = ?', user_id)
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
 * /mypage/:user_id :
 *   get:
 *     summary: 비밀번호 수정
 *     tags: [mypage]
 *     parameters:
 *       - in: userInfo.user_id
 *         name: userInfo.user_id
 *         type: int
 *         description: 사용자 id 정보
 *
 *       - in: body.user_pw
 *         name: user_pw
 *         type: string
 *         description: 새로운 비밀번호
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
router.post('/:user_id',function (req,res,next) {
    if (req.userInfo) {
        var user_id = req.userInfo.user_id;
        var params = {
            user_id : user_id,
            user_pw: req.body.user_pw
        };
        pool.query('UPDATE user SET user_pw=? WHERE user_id = ?' , params, function (err, result) {
            if(err){
                console.log(err);
                res.status(500).json(err);
            } else{
                res.status(200).send({msg: 'success'});
            }
        });
    }else{
        res.status(403).send({msg: '권한이 없습니다.'});
    }
});


/**
 * @swagger
 * /mypage/:user_id :
 *   get:
 *     summary: 마이페이지 삭제
 *     tags: [mypage]
 *     parameters:
 *       - in: userInfo.user_id
 *         name: userInfo.user_id
 *         type: int
 *         description: 사용자 id 정보
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
router.post('/:user_id',function (req,res,next) {
    if (req.userInfo) {
        var user_id = req.userInfo.user_id;

        pool.query('DELETE from user WHERE user_id = ?' , user_id, function (err, result) {
            if(err){
                console.log(err);
                res.status(500).json(err);
            } else{
                res.status(200).send({msg: 'success'});
            }
        });
    }else{
        res.status(403).send({msg: '권한이 없습니다.'});
    }
});
module.exports = router;