const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/tree_data_get', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/companyOrganization/departmentManagement/data_tree_get.json', 'utf-8', (err, data)=> {
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

router.post('/data_table_get', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/companyOrganization/departmentManagement/data_department_get.json', 'utf-8', (err, data)=> {
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
});

router.post('/data_edit_get', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/companyOrganization/departmentManagement/data_edit_get.json', 'utf-8', (err, data)=> {
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

module.exports = router;