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
 * /comment/:
 *   get:
 *     summary: 기사 목록
 *     tags: [aticle]
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
router.get('/',function(req,res) {
    if(req.userInfo){
        pool.query('select ar_title,ar_content,ar_views, ar_likes,ar_register_time, ar_thumbnail_id from article', function(req,res){
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                res.status(200).json({msg: 'success'});
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
 *     summary: 기사 상세보기
 *     tags: [article]
 *     parameters:
 *       - in: ar_id
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
            var ar_id = req.body.ar_id;
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
 * /comment/:
 *   get:
 *     summary: 기사 작성하기
 *     tags: [article]
 *     parameters:
 *       - in: user_id
 *         name: user_id
 *         type: int
 *         description: user_id 정보
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
router.post('/create',function(req,res) {
    if (req.userInfo) {
        var user_id = req.userInfo.user_id;
        var user_type = pool.query('select user_type from user_check where user_id = ?',user_id);
        //기자로 가입한 사람만 작성 가능
        if(user_type === 1){
            var params = {
                ar_id : req.body.ar_id,
                ar_title : req.body.ar_title,
                ar_subtitle : req.body.ar_subtitle,
                ar_content : req.body.ar_content,
                ar_reporter : req.body.ar_reporter
            };

            pool.query('INSERT INTO article(ar_id,ar_title,ar_subtitle,ar_content,ar_reporter) values (?,?,?,?,?) where user_id = ?', params,user_id, function (err) {
                if (err) {
                    console.log(err);
                    res.status(500).json(err);
                } else {
                    res.status(200).json({msg: 'success'});
                }
            });
        }
    } else {
        res.status(403).send({msg: '권한이 없습니다.'});
    }
});

/**
 * @swagger
 * /comment/:
 *   get:
 *     summary: 기사 수정하기
 *     tags: [article]
 *     parameters:
 *       - in: user_id
 *         name: user_id
 *         type: int
 *         description: 사용자 id 정보
 *       - in: ar_id
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
router.post("/update/:ar_id",function(req,res){
    if (req.userInfo) {
        var user_id = req.userInfo.user_id;
        var ar_id = req.body.ar_id;
        var user_type = pool.query('select user_type from user_check where user_id = ?',user_id);
        if(user_type === 1) {
            var params = {
                ar_title : req.body.ar_title,
                ar_subtitle : req.body.ar_subtitle,
                ar_content : req.body.ar_content,
                ar_reporter : req.body.ar_reporter
            };
            pool.query('UPDATE article SET ar_title=?,ar_subtitle=?,ar_content=?,ar_reporter=? WHERE ar_id=? AND user_id=?',params,ar_id,user_id,function(req,res){
                if(err){
                    console.log(err);
                    res.status(500).json(err);
                } else{
                    res.status(200).send({msg: 'success'});
                }
            });
        }
    }else{
        res.status(403).send({msg : '권한이 없습니다.'});
    }
});

/**
 * @swagger
 * /comment/:
 *   get:
 *     summary: 기사삭제하기
 *     tags: [article]
 *     parameters:
 *       - in: user_id
 *         name: user_id
 *         type: int
 *         description: 사용자 id 정보
 *       - in: ar_id
 *         name: ar_id
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
router.post('/delete/:ar_id', function(req,res){
    if(req.userInfo){
        var user_id = req.userInfo.user_id;
        var ar_id = req.body.ar_id;
        var user_type = pool.query('select user_type from user_check where user_id = ?',user_id);

        if(user_type === 1) {
            pool.query('DELETE FROM article WHERE user_id =? AND ar_id =? ',user_id,ar_id,function(req,res){
                if(err){
                    console.log(err);
                    res.status(500).json(err);
                }else{
                    res.status(200).send({msg : 'success'});
                }
            });
        }
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