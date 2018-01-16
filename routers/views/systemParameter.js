const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/data_get', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/systemParameter.json', 'utf-8', (err, data)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			})
			return;
		}
		jdata += data;
		res.send({
			status: true,
			data: jdata
		})
	})
});

router.post('/data_save', (req, res)=> {
	console.log('save_data', req.body);
	res.send({
		status: true,
		message: '保存成功'
	})
});

module.exports = router;