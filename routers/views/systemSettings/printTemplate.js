const express = require('express');
const fs = require('fs');
const multer = require('multer');

const router = express.Router();

router.get('/data_get', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/systemSettings/printTemplate/printTemplate_data_get.json', 'utf-8', (err, data)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			});
			return;
		}
		jdata += data;
		res.send({
			status: true,
			message: jdata
		})
	});
});

router.post('/data_load_save', (req, res)=> {
	res.send({
		status: true,
		message: '保存成功'
	})
})

router.post('/data_delete', (req, res)=> {
	res.send({
		status: true,
		message: '删除成功'
	})
});

let uploadBackup = multer({dest: 'api/uploads/'}).any();

router.post('/upload', (req, res)=> {
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
		console.log('upload: ', req.body);
	})
})

module.exports = router;