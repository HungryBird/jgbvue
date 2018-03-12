const express = require('express');
const fs = require('fs');

const router = express.Router();

router.post('/data_add_save', (req, res)=> {
	res.send({
		status: true,
		message: '添加成功'
	})
})

router.post('/data_edit_save', (req, res)=> {
	res.send({
		status: true,
		message: '编辑成功'
	})
})

router.post('/data_delete', (req, res)=> {
	res.send({
		status: true,
		message: '删除成功'
	})
});

module.exports = router;