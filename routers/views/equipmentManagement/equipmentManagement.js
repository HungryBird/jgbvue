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

router.get('/getClientOption', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/equipmentManagement/equipmentManagement/clientOption.json', 'utf-8', (err, data)=> {
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
})

router.get('/getEquipmentName', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/equipmentManagement/equipmentManagement/equipmentNameOption.json', 'utf-8', (err, data)=> {
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
})

router.get('/getEquipmentBrand', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/equipmentManagement/equipmentManagement/equipmentBrandOption.json', 'utf-8', (err, data)=> {
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
})

router.get('/getEquipmentCategory', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/equipmentManagement/equipmentManagement/equipmentCategoryOption.json', 'utf-8', (err, data)=> {
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
})

router.get('/getUnitMeasurement', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/equipmentManagement/equipmentManagement/getUnitMeasurementOption.json', 'utf-8', (err, data)=> {
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
})

router.post('/getuniqueCode', (req, res)=> {
	if(req.body.serialNumber == 1) {
		res.send({
			status: false,
			message: '序列号已存在'
		}).end();
	}else{
		res.send({
			status: true,
			data: generateUUID()
		}).end();
	}
})

router.get('/getAuxiliaryAttributesClassify', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/equipmentManagement/equipmentManagement/getAuxiliaryAttributesClassify.json', 'utf-8', (err, data)=> {
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
})

function generateUUID() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	return uuid;
};

module.exports = router;