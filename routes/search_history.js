let express = require('express')
let router = express.Router()
const pool = require('../utils/pool')

/**
 * @api {get} search_history/ 검색기록 목록 보기
 * @apiVersion 0.1.0
 * @apiGroup SearchHistory
 * @apiName 검색기록 목록보기
 *
 * @apiHeader {String} x-access-token Users Login Token
 *
 */
router.get('/', async (req,res,next) => {
    if (req.userInfo){
        try{
            const data = await pool.query('SELECT * FROM search_history')
                return res.json(data[0])
        }catch (err){
            return  res.status(500).json(err)
        }
    }else{
        res.status(403).send({"message" : "Token error!"});
    }
})

/**
 * @api {get} search_history/:userSeq 검색기록 목록 보기
 * @apiVersion 0.1.0
 * @apiGroup SearchHistory
 * @apiName 검색기록 목록보기
 *
 * @apiHeader {String} x-access-token Users Login Token
 */
router.get('/:userSeq', function (req, res, next) {
    if (req.userInfo) {
        var userSeq = req.userInfo.userSeq;
        conn.query('SELECT * FROM search_history WHERE user_id = ?', userSeq, function (err, searchHistoryList) {
            if (err) {
                console.log(err);
                res.status(500).send(mysql_odbc.error);
            } else {
                res.status(200).send(searchHistoryList[0]);
            }
        })
    } else {
        res.status(403).send({msg: '권한이 없습니다.'});
    }
});

/**
 * @api {post} search_history/ 검색기록 등록
 * @apiVersion 0.1.0
 * @apiGroup SearchHistory
 * @apiName 검색기록 등록
 *
 * @apiHeader {String} x-access-token Users Login Token
 * @apiParam  {String} searchContent
 * @apiParam {Int} searchTime
 *
 *
 */

router.post('/', function (req, res, next) {
    if (req.userInfo) {
        var userSeq = req.userInfo.userSeq;
        var params = {
            userSeq : userSeq,
            searchContent: req.body.searchContent,
            searchTime: req.body.searchTime
        };
        conn.query('INSERT INTO search_history SET ?' , params, function (err, result) {
            if(err){
                console.log(err);
                res.status(500).send(mysql_odbc.error);
            } else{
                res.status(200).send(mysql_odbc.success);
            }
        });
    }else{
        res.status(403).send({msg: '권한이 없습니다.'});
    }
});

/**
 * @api {post} search_history/:userSeq 검색기록 수정
 * @apiVersion 0.1.0
 * @apiGroup SearchHistory
 * @apiName 검색기록 수정
 *
 * @apiHeader {String} x-access-token Users Login Token
 * @apiParam  {String} searchContent
 * @apiParam {Int} searchTime
 */
router.post('/:userSeq',function (req,res,next) {
    if (req.userInfo) {
        var userSeq = req.userInfo.userSeq;
        var params = {
            userSeq : userSeq,
            searchContent: req.body.searchContent,
            searchTime: req.body.searchTime
        };
        conn.query('UPDATE search_history SET s_keyword=?,s_time=?WHERE user_id = ?' , [params, userSeq], function (err, result) {
            if(err){
                console.log(err);
                res.status(500).send(mysql_odbc.error);
            } else{
                res.status(200).send(mysql_odbc.success);
            }
        });
    }else{
        res.status(403).send({msg: '권한이 없습니다.'});
    }
});

/**
 * @api {post} search_history/:userSeq 검색기록 삭제
 * @apiVersion 0.1.0
 * @apiGroup SearchHistory
 * @apiName 검색기록 삭제
 *
 * @apiHeader {String} x-access-token Users Login Token
 */
router.post('/:userSeq',function (req,res,next) {
    if (req.userInfo) {
        var userSeq = req.userInfo.userSeq;

        conn.query('DELETE from search_history WHERE user_id = ?' , userSeq, function (err, result) {
            if(err){
                console.log(err);
                res.status(500).send(mysql_odbc.error);
            } else{
                res.status(200).send(mysql_odbc.success);
            }
        });
    }else{
        res.status(403).send({msg: '권한이 없습니다.'});
    }
});
module.exports = router