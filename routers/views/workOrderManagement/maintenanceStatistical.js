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

router.post('/is_visit_list_exist', (req, res)=> {
  res.send({
    status: true,
    data: true //Math.round(Math.random()) ? true : false
  }).end();
})

module.exports = router;