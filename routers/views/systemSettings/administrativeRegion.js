const express = require('express');
const fs = require('fs');

const router = express.Router();

router.post('/data_get', (req, res)=> {
	let cities = '';
	if(req.body.level === 1) {
		fs.readFile('api/views/systemSettings/administrativeRegion/beijing1.json', 'utf-8', (err, data)=> {
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
					data: cities
				});
			}
		});
	} else if(req.body.level === 2) {
		fs.readFile('api/views/systemSettings/administrativeRegion/beijing2.json', 'utf-8', (err, data)=> {
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
					data: cities
				});
			}
		});
	} else if(req.body.level === 3) {
		fs.readFile('api/views/systemSettings/administrativeRegion/beijing3.json', 'utf-8', (err, data)=> {
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
					data: cities
				});
			}
		});
	}
});

router.get('/data_get_0', (req, res)=> {
	let cities = '';
	fs.readFile('api/views/systemSettings/administrativeRegion/beijing0.json', 'utf-8', (err, data)=> {
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
				data: cities
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