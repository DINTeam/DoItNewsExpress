let express = require('express')
let router = express.Router()
const pool = require('../utils/pool')

/**
 * @swagger
 * tags:
 *   name: coin
 *   description: 코인
 */
/**
 * @swagger
 * /coin/:
 *   get:
 *     summary: 사용자 코인 조회
 *     tags: [coin]
 *     parameters:
 *       - in: userInfo.user_id
 *         name: user_id
 *         type: int
<<<<<<< HEAD
 *         description: "사용자 id 정보"
=======
 *         description: 사용자 id 정보
>>>>>>> 8fb61494caf60e8f17fc3b86e20673f7306365fe
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
            var user_id = req.userInfo.user_id;
            const data = await pool.query('SELECT * FROM coin WHERE user_id = ?', user_id)
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
 * /coin/add:
 *   patch:
 *     summary: 코인 추가
 *     tags: [coin]
 *     parameters:
 *       - in: userInfo.user_id
 *         name: userInfo.user_id
 *         type: int
 *         description: 사용자 id 정보
 *
 *       - in: body.coin
 *         name: coin
 *         type: string
 *         description: 추가할 코인 개수
 *
 *       - in: body.c_private_key
 *         name: c_private_key
 *         type: string
 *         description: 코인 키값
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
router.patch('/add', async (req,res,next) => {
    if (req.userInfo){
        try{
            var user_id = req.userInfo.user_id;
            var params = {
                user_id : user_id,
                coin: req.body.coin,
                c_private_key: req.body.c_private_key
            };
            const data = await pool.query('UPDATE coin SET c_available=?, c_private_key=? WHERE user_id = ?', params)
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
 * /coin/delete :
 *   delete:
 *     summary: 코인 삭제
 *     tags: [coin]
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
router.delete('/delete', async (req,res,next) => {
    if (req.userInfo){
        try{
            var user_id = req.userInfo.user_id;
            const data = await pool.query('DELETE from search_history WHERE user_id = ?', user_id)
            return res.json(data[0])
        }catch (err){
            return  res.status(500).json(err)
        }
    }else{
        res.status(403).send({"message" : "권한이 없습니다"});
    }
})

module.exports = router
