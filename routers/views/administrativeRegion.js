const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/data_get', (req, res)=> {
	let cities = '';
	fs.readFile('api/views/administrativeRegion/administrativeRegion.json', 'utf-8', (err, data)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			})
			console.log('err', err);
			return;
		}else{
			cities += data;
			res.send({
				status: true,
				cities: cities
			});
		}
	});
});

router.post('/data_write', (req, res)=> {
	if(req.body.number == '001') {
		res.send({
			status: true,
			message: '写入成功'
		})
	}else if(req.body.number == '002') {
		res.send({
			status: false,
			message: '行政区域已经存在'
		})
	}else{
		res.send({
			status: false,
			message: '格式错误'
		})
	}
});

router.post('/data_edit', (req, res)=> {
	if(req.body.number == '001') {
		res.send({
			status: true,
			message: '编辑成功'
		})
	}else if(req.body.number == '002'){
		res.send({
			status: false,
			message: '行政区域已经存在'
		})
	}else{
		res.send({
			status: false,
			message: '格式错误'
		})
	}
})

router.post('/data_delete', (req, res)=> {
	res.send({
		status: true,
		message: '删除成功'
	})
});

module.exports = router;