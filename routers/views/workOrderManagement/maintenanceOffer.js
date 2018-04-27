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

router.use('/getDetailInfo', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/offerAndContract/maintenanceOffer/detailInfo.json', 'utf-8', (err, data)=> {
		if(err) {
			console.log('err: ', err);
			return;
		}
		jdata += data;
		let pJdata = JSON.parse(jdata);
		Math.random() > .5 ? pJdata.status = 1 : pJdata.status = 0;
		res.send({
			status: true,
			data: pJdata
		}).end();
	});
})

router.use('/template', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/offerAndContract/maintenanceOffer/template.json', 'utf-8', (err, data)=> {
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

router.use('/getTable', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/offerAndContract/maintenanceOffer/table.json', 'utf-8', (err, data)=> {
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

router.use('/edit_data_get', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/offerAndContract/maintenanceOffer/edit.json', 'utf-8', (err, data)=> {
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