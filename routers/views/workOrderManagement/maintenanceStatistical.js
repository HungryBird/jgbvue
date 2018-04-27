/**
 * created by lanw 2018-4-26
 * 维修统计报表
 */
const express = require('express');
const fs = require('fs');

const router = express.Router();

let dataInfoPage = 1
router.post('/get_data_info', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/maintenanceStatistical/get_data_info.json', 'utf-8', (err, data)=> {
		if(err) {
			console.log('err: ', err);
			return;
		}
    jdata += data;
    let _data = JSON.parse(jdata)
    _data.page.now_page = dataInfoPage++
		res.send({
			status: true,
			data: JSON.stringify(_data)
		}).end();
	});
})

let dataDetailsPage = 1
router.post('/get_data_details', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/maintenanceStatistical/get_data_details.json', 'utf-8', (err, data)=> {
		if(err) {
			console.log('err: ', err);
			return;
		}
    jdata += data;
    let _data = JSON.parse(jdata)
    _data.page.now_page = dataDetailsPage++
		res.send({
			status: true,
			data: JSON.stringify(_data)
		}).end();
	});
})

router.post('/get_details_select', (req, res)=> {
	let jdata = []
	for(let i = 0; i < 10; i++) {
		jdata.push({
			label: `品牌${i+1}`,
			value: i+1
		})
	}
  res.send({
    status: true,
    data: JSON.stringify(jdata)
  }).end();
})

router.post('/get_chart_info', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/afterSale/maintenanceStatistical/get_chart_info.json', 'utf-8', (err, data)=> {
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