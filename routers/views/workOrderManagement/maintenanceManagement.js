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

router.post('/get_maintenace_report_cost_data', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/maintenanceManagement/get_maintenace_report_cost_data.json', 'utf-8', (err, data)=> {
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

router.post('/get_maintenace_report', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/maintenanceManagement/get_maintenace_report.json', 'utf-8', (err, data)=> {
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

router.post('/is_report_exist', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/maintenanceManagement/is_report_exist.json', 'utf-8', (err, data)=> {
		if(err) {
			console.log('err: ', err);
			return;
		}
		jdata += data;
		res.send({
			status: true,
			data: JSON.stringify({
				data: jdata,
				status: Math.round(Math.random()) ? true : false
			})
		}).end();
	});
})

router.post('/is_cost_exist', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/maintenanceManagement/is_cost_exist.json', 'utf-8', (err, data)=> {
		if(err) {
			console.log('err: ', err);
			return;
		}
		jdata += data;
		res.send({
			status: true,
			data: JSON.stringify({
				data: jdata,
				status: Math.round(Math.random()) ? true : false
			})
		}).end();
	});
})

router.post('/get_accessories_data', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/maintenanceManagement/get_accessories_data.json', 'utf-8', (err, data)=> {
		if(err) {
			console.log('err: ', err);
			return;
		}
		jdata += data;
		let _data = JSON.parse(jdata)
		_data.exist_SN = Math.round(Math.random()) ? true : false //随机商品是否有序列号
		res.send({
			status: true,
			data: JSON.stringify(_data)
		}).end();
	});
})

module.exports = router;