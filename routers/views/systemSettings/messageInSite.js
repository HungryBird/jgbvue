const express = require('express');
const fs = require('fs');

const router = express.Router();

router.post('/data_get', (req, res)=> {
	let jdata = '';
	if(req.body.selectedType === 'all') {
		fs.readFile('api/views/systemSettings/messageInSite/messageInSite_all.json', (err, data)=> {
			if(err) {
				res.send({
					status: false,
					message: err
				})
				return false;
			}
			jdata += data;
			res.send({
				status: true,
				message: jdata
			})
		})
	}else if(req.body.selectedType === 'readed') {
		fs.readFile('api/views/systemSettings/messageInSite/messageInSite_readed.json', (err, data)=> {
			if(err) {
				res.send({
					status: false,
					message: err
				})
				return false;
			}
			jdata += data;
			res.send({
				status: true,
				message: jdata
			})
		})
	}else if(req.body.selectedType === 'unread') {
		fs.readFile('api/views/systemSettings/messageInSite/messageInSite_unread.json', (err, data)=> {
			if(err) {
				res.send({
					status: false,
					message: err
				})
				return false;
			}
			jdata += data;
			res.send({
				status: true,
				message: jdata
			})
		})
	}
});

router.post('/data_delete', (req, res)=> {
	console.log('data_delete', req.body)
	res.send({
		status: true,
		message: '删除成功'
	})
});

router.post('/data_read', (req, res)=> {
	res.send({
		status: true,
		message: '操作成功'
	})
});

module.exports = router;