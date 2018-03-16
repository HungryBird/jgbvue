const express = require('express');

const router = express.Router();

router.get('/a', (req, res)=> {
	setTimeout(function() {
		res.send({
			status: true,
			message: 'a方法执行完毕'
		}).end();
	}, 2000);
})

router.get('/b', (req, res)=> {
	setTimeout(function() {
		res.send({
			status: true,
			message: 'b方法执行完毕'
		}).end();
	}, 2000);
});

module.exports = router;