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
 *     summary: 사용자 정보 조회
 *     tags: [portfolio]
 *     parameters:
 *       - in: userInfo
 *         name: userInfo
 *         type: string
 *         description: 사용자 정보 조회 후 포트폴리오 목록 페이지로 이동
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
router.get('/', function(req,res) {
    if (req.userInfo) {
        try {
            res.redirect('/portfolio_list'); // 포트폴리오 목록 페이지로 가게 함
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        res.status(403).send({"message" : "error!"});
    }
});

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
 *       500:
 *         $ref: '#/components/res/BadRequest'
 */
router.get('/portfolio_list',function(req,res) {
    if (req.userInfo) {
        try {
            var user_id = req.userInfo.user.id;
            const data = pool.query('select p_title,DATE_FORMAT(p_register_time,"%Y/%M/%D") as p_register_time , p_views from portfolio where user_id=? order by p_id desc', user_id);
            return res.json(data[0]);
        } catch (err) {
            return res.status(500).json(err);
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
 *       500:
 *         $ref: '#/components/res/BadRequest'
 */
//해당 포트폴리오 data를 가져오고 조회수를 업데이트하는 두가지 쿼리를 동시에 실행해야한다.
//이렇게 하나의 요청에 여러개의 쿼리문이 실행되어야 할 때는 트랜잭션 처리를 해주어야 한다.
router.get('/detail/:p_id',function (req,res) {
    if(req.userInfo){
        try{
            var p_id = req.body.p_id;
            pool.query('select p_id,p_title,p_category,DATE_FORMAT(p_start_date,"%Y-%M-%D" as p_start_date,DATE_FORMAT(p_end_date,"%Y-%M-%D" as p_end_date,p_purpose,p_process)'+
                        'from portfolio where p_id =?',[p_id],function(req,res){
                if(err){
                    console.log(err);
                    res.status(500).json(err);
                }else{
                    res.status(200).send({msg: 'success'});
                }
            });
        }catch(err){
            return res.status(500).json(err);
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
 *       500:
 *         $ref: '#/components/res/BadRequest'
 */
router.post('/create',function(req,res) {
    if (req.userInfo) {
        var user_id = req.userInfo.user_id;
        var params = {
            user_id: user_id,
            p_title: req.body.p_title,
            p_category: body.p_category,
            p_start_date: body.p_start_date,
            p_end_date: body.p_end_date,
            p_purpose: body.p_purpose,
            p_process: body.p_process
        };
        pool.query('INSERT INTO portfolio(p_title,p_category,p_start_date,p_end_date,p_purpose,p_process) values (?,?,?,?,?,?) where user_id = ?', params,user_id, function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                res.status(200).json({msg: 'success'});
            }
        });
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
 *       500:
 *         $ref: '#/components/res/BadRequest'
 */
router.post("/update/:p_id",function(req,res){
    if (req.userInfo) {
        var user_id = req.userInfo.user_id;
        var p_id = req.body.p_id;
        var params = {
            user_id: user_id,
            p_title: req.body.p_title,
            p_category: body.p_category,
            p_start_date: body.p_start_date,
            p_end_date: body.p_end_date,
            p_purpose: body.p_purpose,
            p_process: body.p_process
        };
        pool.query('UPDATE portfolio SET p_title=?,p_category=?,p_start_date=?,p_end_date=?,p_purpose=?,p_process=? WHERE p_id=? AND user_id=?',params,p_id,user_id,function(req,res){
            if(err){
                console.log(err);
                res.status(500).json(err);
            } else{
                res.status(200).send({msg: 'success'});
            }
        });
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
 *       500:
 *         $ref: '#/components/res/BadRequest'
 */
router.post('/delete/:p_id', function(req,res){
    if(req.userInfo){
        var user_id = req.userInfo.user_id;
        var p_id = req.body.p_id;

        pool.query('DELETE FROM portfolio WHERE user_id =? AND p_id =? ',user_id,p_id,function(req,res){
            if(err){
                console.log(err);
                res.status(500).json(err);
            }else{
                res.status(200).send({msg : 'success'});
            }
        });
    }else{
        res.status(403).send({msg : '권한이 없습니다.'});
    }
});

module.exports = router;
/* 페이징
router.get('/list/:page', function(req,res){
    var page_size = 10;
    var page_list_size =10;
    var no ="";
    var total_page_count =0;

    pool.query('select count(*) as cnt from portfolio',function(err,data){
        if(err){
            console.log(err + "메인 화면 mysql 조회 실패");
            return;
        }
        total_page_count=data[0].cnt;
        var cur_page = req.params.page;

        console.log("현재 페이지 : " + cur_page, "전체 페이지 : "+ total_page_count);

        if(total_page_count<0){
            total_page_count =0;
        }

        var total_page = Math.ceil(total_page_count / page_size);
        var total_set = Math.ceil(total_page / page_list_size);
        var cur_set = Math.ceil(cur_page / page_list_size);
        var start_page = ((cur_set-1)*10)+1;
        var end_page = (start_page + page_list_size)-1;

        if(cur_page < 0){
            no=0;
        }else{
            no=(cur_page-1)*10;
        }

        var result2 = {
            "cur_page" : cur_page,
            "page_list_size" : page_list_size,
            "page_size" : page_size,
            "total_page" : total_page,
            "total_set" : total_set,
            "cur_set" : cur_set,
            "start_page" : start_page,
            "end_page" : end_page
        };


    })
})*/ // 나중에 다시