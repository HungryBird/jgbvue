const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/user_data_get', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/companyOrganization/userManagement/user_data_get.json', 'utf-8', (err, data)=> {
		if(err) {
			console.log('err: ', err);
			return;
		}
		jdata += data;
		res.send({
			status: true,
			data: jdata
		}).end();
	});
})

router.post('/user_data_get', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/companyOrganization/userManagement/user_data_get.json', 'utf-8', (err, data)=> {
		if(err) {
			console.log('err: ', err);
			return;
		}
		jdata += data;console.log(jdata)
		res.send({
			status: true,
			data: jdata
		}).end();
	});
})

module.exports = router;