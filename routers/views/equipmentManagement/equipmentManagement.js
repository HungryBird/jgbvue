const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/search', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/equipmentManagement/equipmentManagement/data_get.json', 'utf-8', (err, data)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			});
			console.log('err', err);
			return;
		}
		jdata += data;
		res.send({
			status: true,
			data: jdata
		})
	})
});

module.exports = router;