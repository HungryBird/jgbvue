const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/search', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/commodityManagement/commodityInfo/table.json', 'utf-8', (err, data)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			}).end();
			console.log('err', err);
			return;
		}
		jdata += data;
		res.send({
			status: true,
			data: jdata
		}).end()
	})
});

router.get('/getQuickQuery', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/commodityManagement/commodityInfo/quickQuery.json', 'utf-8', (err, data)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			}).end();
			console.log('err', err);
			return;
		}
		jdata += data;
		res.send({
			status: true,
			data: jdata
		}).end()
	})
});

router.post('/toggleCommonUse', (req, res)=> {
	res.send({
		status: true,
		message: '切换成功'
	}).end();
});

router.post('/edit_data_get', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/commodityManagement/commodityInfo/edit.json', 'utf-8', (err, data)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			}).end();
			console.log('err', err);
			return;
		}
		jdata += data;
		res.send({
			status: true,
			data: jdata
		}).end()
	})
});

router.post('/examine', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/commodityManagement/commodityInfo/examine.json', 'utf-8', (err, data)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			}).end();
			console.log('err', err);
			return;
		}
		jdata += data;
		res.send({
			status: true,
			data: jdata
		}).end()
	})
});

router.get('/getAuxiliaryAttributesClassify', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/commodityManagement/commodityInfo/auxiliaryAttributesClassify.json', 'utf-8', (err, data)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			}).end();
			console.log('err', err);
			return;
		}
		jdata += data;
		res.send({
			status: true,
			data: jdata
		}).end()
	})
});

router.post('/quickGenerate', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/commodityManagement/commodityInfo/quickGenerate.json', 'utf-8', (err, data)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			}).end();
			console.log('err', err);
			return;
		}
		jdata += data;
		res.send({
			status: true,
			data: jdata
		}).end()
	})
})

router.use('/defaultColumnSettingUrl', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/commodityManagement/commodityInfo/header.json', 'utf-8', (err, data)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			}).end();
			console.log('err', err);
			return;
		}
		jdata += data;
		res.send({
			status: true,
			data: jdata
		}).end()
	})
})

router.get('/duodanwei', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/commodityManagement/commodityInfo/duodanwei.json', 'utf-8', (err, data)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			}).end();
			console.log('err', err);
			return;
		}
		jdata += data;
		res.send({
			status: true,
			data: jdata
		}).end()
	})
})

router.get('/checkNumber', (req, res)=> {
	res.send({
		status: true
	}).end()
})

module.exports = router;