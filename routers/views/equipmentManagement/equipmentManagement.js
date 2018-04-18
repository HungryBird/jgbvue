const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/search', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/equipmentManagement/equipmentManagement/data_get.json', 'utf-8', (err, data)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			});
			console.log('err', err);
			return;
		}
		jdata += data;
		res.send({
			status: true,
			data: jdata
		})
	})
});

router.use('/defaultColumnSetting', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/equipmentManagement/equipmentManagement/defalutColumnSet.json', 'utf-8', (err, data)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			});
			console.log('err', err);
			return;
		}
		jdata += data;
		res.send({
			status: true,
			message: '默认设置成功',
			data: jdata
		})
	})
});

router.use('/columnSettingComplete', (req, res)=> {
	res.send({
			status: true,
			message: '列设置成功'
		})
});

module.exports = router;