const express = require('express');

const router = express.Router();

let number = 10;

router.get('/a', (req, res)=> {
	setTimeout(function() {
		res.send({
			status: true,
			number: number
		}).end();
	}, 500);
	number--;
})

module.exports = router;