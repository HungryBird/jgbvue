const express = require('express');
const fs = require('fs');

router = express.Router();

router.post('/data_get_data', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/systemSettings/phoneInfo/phoneInfo_get_data.json', 'utf-8', (err, data)=>{
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
	})
});

router.post('/data_save', (req, res)=> {
	res.send({
		status: true,
		message: '保存成功'
	})
});

module.exports = router;