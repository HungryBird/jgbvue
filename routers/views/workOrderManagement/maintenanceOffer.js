const express = require('express');
const fs = require('fs');

const router = express.Router();

router.use('/search', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/offerAndContract/maintenanceOffer/search.json', 'utf-8', (err, data)=> {
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