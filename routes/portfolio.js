let express = require('express');
let router = express.Router();
var bodyParser = require('body-parser');
const pool = require('../utils/pool');

router.get('/list', function(req,res){
    res.redirect('/portfolio/1'); // 포트폴리오 목록 페이지로 가게 함
});
router.get('/list/:page',function(req,res) {
    pool.query('select p_title,DATE_FORMAT(p_register_time,"%Y/%M/%D") as p_register_time , p_views from portfolio where user_id=? order by p_id desc',[user_id], function (err, rows) {
        if (err) console.log(err);
        console.log('rows: ' + rows);
        //res.render('list,',{rows}); // 포트폴리오 목록 페이지로 이동
    });
});

router.get('/detail/:p_id',function (req,res) {
    var p_id = req.params.p_id;
    console.log("p_id : " + p_id);
    //해당 포트폴리오 data를 가져오고 조회수를 업데이트하는 두가지 쿼리를 동시에 실행해야한다.
    //이렇게 하나의 요청에 여러개의 쿼리문이 실행되어야 할 때는 트랜잭션 처리를 해주어야 한다.
    pool.beginTransaction(function (err) {
        if(err) console.log(err);
        pool.query('update portfolio set p_views = p_views + 1 where p_id = ?',[p_id],function(err){
            if(err){
                console.log(err);
                pool.rollback(function () {
                    console.log('rollback error1');
                })
            }
            pool.query('select p_id,p_title,p_category,DATE_FORMAT(p_start_date,"%Y-%M-%D" as p_start_date,DATE_FORMAT(p_end_date,"%Y-%M-%D" as p_end_date,p_purpose,p_process)'+
                'from portfolio where p_id =?',[p_id],function(err,rows){
                if(err){
                    console.log(err);
                    pool.rollback(function () {
                        cosole.log('rollback error2');
                    })
                }else{
                    pool.commit(function (err) {
                        if(err) console.log(err);
                        console.log("row : "+ rows);
                        res.render('/detail',{rows : rows});
                    })
                }
            })
        })
    })
})

router.get('/create',function(req,res){
    res.render('/create');
});

router.post('/create',function(req,res){
    //post방식에선 url에 데이터가 포함되지 않고 body에 포함되어 전송된다.->body에 접근 후 데이터 가지고 오기!
    var body = req.body;
    var p_title = body.p_title;
    var p_category = body.p_category;
    var p_start_date = body.p_start_date;
    var p_end_date = body.p_end_date;
    var p_purpose = body.p_purpose;
    var p_process = body.p_process;

    pool.beginTransaction(function(err){
        if(err) console.log(err);
        pool.query('insert into portfolio(p_title,p_category,p_start_date,p_end_date,p_purpose,p_process) values (?,?,?,?,?,?)',
            [p_title,p_category,p_start_date,p_end_date,p_purpose,p_process],function(err){
                if(err){
                    console.log(err);
                    pool.rollback(function(){
                        console.log('rollback error1');
                    })
                }
                pool.query('select last_insert_id() as p_id', function(err,rows){
                    if(err){
                        console.log('rollback error1');
                        pool.rollback(function(){
                            console.log('rollback error1');
                        })
                    }
                    else{
                        pool.commit(function (err) {
                            if(err) console.log(err);
                            console.log("row: " + rows);
                            var p_id = rows[0].p_id;
                            res.redirect('/portfolio/read/'+p_id);
                        })
                    }
                })

            }
            )
    })
})
//수정 페이지 없이 어떻게 수정할건지 생각해보기
router.post("/update/:p_id", function(req,res){
    var body = req.body;
    pool.query('update portfolio set p_title=?,p_category=?,p_start_date=?,p_end_date=?,p_purpose=?,p_process=? where p_id=?',
        [body.p_title,body.p_category,body.p_start_date,body.p_end_date,body.p_purpose,body.p_process,body.p_id],function(){
        res.redirect('/list');
    })
    
})

router.get('/delete/:p_id', function(req,res){
    pool.query('delete from portfolio where p_id=?',[req.params.p_id],function(){
        res.redirect('/list');
    });
})
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

