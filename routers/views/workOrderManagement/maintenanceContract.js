const express = require('express');
const fs = require('fs');

const router = express.Router();

router.use('/search', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/offerAndContract/maintenanceContract/search.json', 'utf-8', (err, data)=> {
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

router.use('/getContractInfo', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/offerAndContract/maintenanceContract/contractInfo.json', 'utf-8', (err, data)=> {
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

router.use('/examine', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/offerAndContract/maintenanceContract/examine.json', 'utf-8', (err, data)=> {
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

module.exports = router;