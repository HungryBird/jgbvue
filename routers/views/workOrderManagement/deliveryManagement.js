/**
 * created by lanw 2018-4-24
 * 交付管理
 */
const express = require('express');
const fs = require('fs');

const router = express.Router();

router.post('/get_business_data', (req, res)=> {
	let jdata = [
		{ label: '张三', value: 1 }, 
		{ label: '李四', value: 2 }, 
		{ label: '王五', value: 3 }, 
	];
	res.send({
		status: true,
		data: JSON.stringify(jdata)
	}).end();
})

router.post('/get_maintenance_data', (req, res)=> {
	let jdata = [
		{ label: '张三', value: 1 }, 
		{ label: '李四', value: 2 }, 
		{ label: '王五', value: 3 }, 
	];
	res.send({
		status: true,
		data: JSON.stringify(jdata)
	}).end();
})

router.post('/get_delivery_order_data', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/deliveryManagement/get_delivery_order_data.json', 'utf-8', (err, data)=> {
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

router.post('/get_delivery_list_data', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/deliveryManagement/get_delivery_list_data.json', 'utf-8', (err, data)=> {
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

router.post('/get_courier_list_data', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/deliveryManagement/get_courier_list_data.json', 'utf-8', (err, data)=> {
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

router.post('/add_delivery_form_get', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/deliveryManagement/add_delivery_form_get.json', 'utf-8', (err, data)=> {
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

router.post('/is_delivery_list_exist', (req, res)=> {
  res.send({
    status: true,
    data: Math.round(Math.random()) ? true : false
  }).end();
})

router.post('/is_courier_list_exist', (req, res)=> {
  res.send({
    status: true,
    data: Math.round(Math.random()) ? true : false
  }).end();
})

router.post('/get_courier_info', (req, res)=> {
  res.send({
    status: true,
    data: JSON.stringify([
			{date: "2018-4-21", content: "卖家已发货"},
			{date: "2018-4-21", content: "卖家已发货"}
		])
  }).end();
})

module.exports = router;