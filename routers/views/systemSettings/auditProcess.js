const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/data_get', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/systemSettings/auditProcess/auditProcess_data_get.json', 'utf-8', (err, data)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			});
			return;
		}
		jdata += data;
		res.send({
			status: true,
			message: jdata
		})
	});
});

router.post('/data_save', (req, res)=> {
	res.send({
		status: true,
		message: '保存成功'
	})
});

router.post('/data_edit_save', (req, res)=> {
	res.send({
		status: true,
		message: '编辑成功'
	})
});

router.post('/data_edit_get', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/systemSettings/auditProcess/auditProcess_data_edit.json', 'utf-8', (err, data)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			})
		}
		jdata += data;
		res.send({
			status: true,
			message: jdata
		})
	})
});

router.post('/data_edit_save', (req, res)=> {
	res.send({
		status: true,
		message: '编辑成功'
	})
})

router.post('/data_delete', (req, res)=> {
	res.send({
		status: true,
		message: '删除成功'
	})
});

router.post('/getAudit', (req, res)=> {
	let jdata = '';
	fs.readFile('api/common/audit/basic.json', 'utf-8', (err, data)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			})
			console.log('err: ', err);
		}
		jdata += data;
		res.send({
			status: true,
			data: jdata
		})
	})
});

router.post('/getDepartments', (req, res)=> {
	let jdata = '';
	if(req.body.company === 'companyOne') {
		fs.readFile('api/common/audit/department1.json', 'utf-8', (err, data)=> {
			if(err) {
				res.send({
					status: false,
					message: err
				})
				console.log('err: ', err);
			}
			jdata += data;
			res.send({
				status: true,
				data: jdata
			})
		})
	} else if(req.body.company === 'companyTwo') {
		fs.readFile('api/common/audit/department2.json', 'utf-8', (err, data)=> {
			if(err) {
				res.send({
					status: false,
					message: err
				})
				console.log('err: ', err);
			}
			jdata += data;
			res.send({
				status: true,
				data: jdata
			})
		})
	} else if(req.body.company === 'companyThree') {
		fs.readFile('api/common/audit/department3.json', 'utf-8', (err, data)=> {
			if(err) {
				res.send({
					status: false,
					message: err
				})
				console.log('err: ', err);
			}
			jdata += data;
			res.send({
				status: true,
				data: jdata
			})
		})
	}
});

router.post('/getAuditors', (req, res)=> {
	let jdata = '';
	fs.readFile('api/common/audit/auditors.json', (err, data)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			})
			console.log('err: ', err);
		}
		jdata += data;
		console.log('jdata: ', jdata);
		res.send({
			status: true,
			data: jdata
		})
	})
})



module.exports = router;