const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/search', (req, res)=> {
	console.log(9999)
	let jdata = '';
	fs.readFile('api/views/afterSale/offerAndContract/search.json', 'utf-8', (err, data)=> {
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