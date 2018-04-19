/**
 * created by lanw 2018-4-19
 * 维修管理
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

router.post('/reqair_person_get', (req, res)=> {
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

router.post('/get_diagnosis_data', (req, res)=> {
	let jdata = [
		{ label: '张三', value: 1 }, 
		{ label: '李四', value: 2 }, 
		{ label: '王五', value: 3 }, 
		{ label: '张2', value: 10002 }, 
	];
	res.send({
		status: true,
		data: JSON.stringify(jdata)
	}).end();
})

router.post('/get_maintenance_order_data', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/maintenanceManagement/get_maintenance_order_data.json', 'utf-8', (err, data)=> {
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

router.post('/get_order_fault_details', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/workOrderManagement/get_fault_order_details.json', 'utf-8', (err, data)=> {
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

router.post('/get_accessories_list', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/workOrderManagement/get_accessories_list.json', 'utf-8', (err, data)=> {
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