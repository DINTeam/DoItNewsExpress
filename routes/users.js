var express = require('express');
var router = express.Router();

/* GET users listing. */
/**
 * @swagger
 * tags:
 *   name: User
 *   description: 사용자 정보 가져오기
 */
/**
 * @swagger
 * /path/:
 *   get:
 *     summary:
 *     tags:
 *     parameters:
 *       - in:
 *         name:
 *         type:
 *         enum:
 *         description: |
 *
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

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
