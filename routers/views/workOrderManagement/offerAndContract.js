const express = require('express');
const fs = require('fs');

const router = express.Router();

router.use('/search', (req, res)=> {
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

router.get('/getOption', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/offerAndContract/option.json', 'utf-8', (err, data)=> {
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

router.use('/print', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/offerAndContract/print.json', 'utf-8', (err, data)=> {
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