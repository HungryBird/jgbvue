const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/data_get_all', (req, res)=> {
	let message = '';
	fs.readFile('api/views/messageInSite/messageInSite_all.json', (err, data)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			})
			return false;
		}
		message += data;
		res.send({
			status: true,
			message: message
		})
	})
});

router.get('/data_get_read', (req, res)=> {
	let message = '';
	fs.readFile('api/views/messageInSite/messageInSite_read.json', (err, data)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			})
			return false;
		}
		message += data;
		res.send({
			status: true,
			message: message
		})
	})
});

router.get('/data_get_unread', (req, res)=> {
	let message = '';
	fs.readFile('api/views/messageInSite/messageInSite_unread.json', (err, data)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			})
			return false;
		}
		message += data;
		res.send({
			status: true,
			message: message
		})
	})
});

router.post('/data_delete', (req, res)=> {
	res.send({
		status: true,
		message: '删除成功'
	})
});

router.post('/data_red', (req, res)=> {
	res.send({
		status: true,
		message: '操作成功'
	})
});

module.exports = router;