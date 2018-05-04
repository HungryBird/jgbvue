/**
 * created by lanw 2018-5-4
 * 采购管理
 */
const express = require('express');
const fs = require('fs');

const router = express.Router();

router.post('/get_purchase_plan_list_data', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/purchasingManagement/purchasePlanList/get_purchase_plan_list_data.json', 'utf-8', (err, data)=> {
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

module.exports = router;