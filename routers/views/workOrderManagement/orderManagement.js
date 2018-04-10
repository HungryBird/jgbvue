/**
 * created by lanw 2018-4-9
 * 工单管理
 */
const express = require('express');
const fs = require('fs');

const router = express.Router();

router.post('/get_business_data', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/workOrderManagement/get_work_order_data.json', 'utf-8', (err, data)=> {
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

router.post('/get_maintenance_data', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/workOrderManagement/get_work_order_data.json', 'utf-8', (err, data)=> {
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

router.post('/get_work_order_data', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/workOrderManagement/get_work_order_data.json', 'utf-8', (err, data)=> {
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

router.post('/order_receive', (req, res)=> {
	res.send({
		status: true,
		message: '领取成功!'
	})
})

router.post('/order_back', (req, res)=> {
	res.send({
		status: true,
		message: '退回成功!'
	})
})

router.post('/order_withdraw', (req, res)=> {
	res.send({
		status: true,
		message: '撤回成功!'
	})
})

router.post('/order_invalid', (req, res)=> {
	res.send({
		status: true,
		message: '工单已作废!'
	})
})

router.post('/get_waiting_order_data', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/workOrderManagement/get_waiting_order_data.json', 'utf-8', (err, data)=> {
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

router.post('/get_order_details', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/workOrderManagement/get_order_details.json', 'utf-8', (err, data)=> {
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