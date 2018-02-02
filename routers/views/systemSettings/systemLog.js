const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/data_get_all', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/systemSettings/systemLog/systemLog_data_all.json', 'utf-8', (err, data)=> {
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
			message: jdata
		})
	})
})

router.post('/data_delete', (req, res)=> {
	res.send({
		status: true,
		message: '删除成功'
	})
});

module.exports = router;