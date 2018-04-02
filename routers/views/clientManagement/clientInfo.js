const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/data_init', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/clientManagement/clientInfo/data_get.json', 'utf-8', (err, data)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			}).end();
			console.log('err', err);
			return;
		}
		jdata += data;
		res.send({
			status: true,
			data: jdata
		}).end();
	})
})

module.exports = router;