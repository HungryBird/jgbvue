/**
 * created by lanw 2018-4-25
 * 客户回访
 */
const express = require('express');
const fs = require('fs');

const router = express.Router();

router.post('/get_visit_order_data', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/clientVisit/get_visit_order_data.json', 'utf-8', (err, data)=> {
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

router.post('/get_visit_list_data', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/clientVisit/get_visit_list_data.json', 'utf-8', (err, data)=> {
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

router.post('/get_header', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/workOrderManagement/get_column_default.json', 'utf-8', (err, data)=> {
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

router.post('/is_visit_list_exist', (req, res)=> {
  res.send({
    status: true,
    data: true //Math.round(Math.random()) ? true : false
  }).end();
})

module.exports = router;