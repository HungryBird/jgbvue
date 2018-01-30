const express = require('express');
const fs = require('fs');

const router = express.Router();

router.post('/data_delete', (req, res)=> {
	res.send({
		status: true,
		message: '删除成功'
	})
});

module.exports = router;