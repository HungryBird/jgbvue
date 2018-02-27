const express = require('express');
const fs = require('fs');
const multer = require('multer');

const router = express.Router();

router.get('/get_table_data', (req, res)=> {
	let tableData = '';
	fs.readFile('api/views/systemSettings/FBackup/data_get.json', 'utf-8', (err, data)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			})
		}else{
			tableData += data
			res.send({
				status: true,
				message: tableData
			})
		}
	})
});

let uploadBackup = multer({dest: 'api/uploads/'}).any();

router.use('/backup', (req, res)=> {
	uploadBackup(req, res, (err)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			})
			return;
		}
		res.send({
			status: true,
			message: '备份成功'
		})
	})
});

router.post('/setTiming', (req, res)=> {
	res.send({
		status: true,
		message: '设置成功'
	})
});

router.post('/recover', (req, res)=> {
	res.send({
		status: true,
		message: '恢复成功'
	})
});

router.post('/download', (req, res)=> {
	res.send({
		status: true,
		message: '下载成功'
	})
});

router.post('/delete', (req, res)=> {
	res.send({
		status: true,
		message: '删除成功'
	})
});

router.get('/getTiming', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/systemSettings/FBackup/time_get.json', 'utf-8', (err, data)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			})
		}else{
			jdata += data
			res.send({
				status: true,
				message: jdata
			})
		}
	})
})

module.exports = router;