/**
 * created by lanw 2018-4-9
 * 工单管理
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

router.post('/order_add_init', (req, res)=> {
	let jdata = {
		order_id: Math.round(new Date().getTime()/1000),
		level: [ //紧急程度
			{ label: '灰常紧急', value: '1' },
			{ label: '不急不急', value: '2' },
			{ label: '你慢慢修', value: '3' },
		],
		assigned: [ //委派维修
			{ label: '是',  value: true },
			{ label: '否',  value: false },
		],
		repaired: [ //报修方式
			{ label: '送修', value: 'songxiu' },
		],
	};
	res.send({
		status: true,
		data: JSON.stringify(jdata)
	}).end();
})

router.post('/equipment_code_get', (req, res)=> {
	let jdata = [
		{ label: '设备1设备1设备1设备1设备1', value: '100001100001100001100001100001' }, 
		{ label: '设备2', value: '100002' }, 
		{ label: '设备3', value: '100003' }, 
	];
	res.send({
		status: true,
		data: JSON.stringify(jdata)
	}).end();
})

router.post('/equipment_info_get', (req, res)=> {
	let src = '../../assets/img/index/portrait.png'
	let jdata = {
		equipmentName: '设备1', 
		equipmentBrand: '品牌1',
		equipmentSource: '偷渡来的',
		equipmentPic: [src, src, src, src]
	}
	res.send({
		status: true,
		data: JSON.stringify(jdata)
	}).end();
})

module.exports = router;