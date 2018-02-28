const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/data_get', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/companyOrganization/companyManagement/data_get.json', 'utf-8', (err, data)=> {
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

router.get('/address', (req, res)=> {
	let jdata = '';
	fs.readFile('api/common/address/beijing0.json', 'utf-8', (err, data)=> {
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
		});
	})
})

router.post('/address', (req, res)=> {
	console.log('req: ', req.body[0]);
	let jdata = '';
	if(req.body[0] === 'bj') {
		fs.readFile('api/common/address/beijing1.json', 'utf-8', (err, data)=> {
			if(err) {
				res.send({
					status: false,
					message: err
				})
				console.log('err', err);
				return;
			}else{
				jdata += data;
				res.send({
					status: true,
					data: jdata
				});
			}
		});
	} else if(req.body === 'bjs') {
		fs.readFile('api/common/address/beijing2.json', 'utf-8', (err, data)=> {
			if(err) {
				res.send({
					status: false,
					message: err
				})
				console.log('err', err);
				return;
			}else{
				jdata += data;
				res.send({
					status: true,
					data: jdata
				});
			}
		});
	} else if(req.body === 'bjsdcq') {
		fs.readFile('api/common/address/beijing3.json', 'utf-8', (err, data)=> {
			if(err) {
				res.send({
					status: false,
					message: err
				})
				console.log('err', err);
				return;
			}else{
				jdata += data;
				res.send({
					status: true,
					data: jdata
				});
			}
		});
	}
})

module.exports = router;