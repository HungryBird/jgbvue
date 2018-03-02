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

router.get('/get_provinces', (req, res)=> {
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
});

router.post('/get_cities', (req, res)=> {
	let jdata = '';
	fs.readFile('api/common/address/beijing1.json', 'utf-8', (err, data)=> {
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
});

router.post('/get_district', (req, res)=> {
	let jdata = '';
	fs.readFile('api/common/address/beijing2.json', 'utf-8', (err, data)=> {
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
});

router.post('/get_block', (req, res)=> {
	let jdata = '';
	fs.readFile('api/common/address/beijing3.json', 'utf-8', (err, data)=> {
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
});

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
});

router.post('/add_save', (req, res)=> {
	res.send({
		status: true,
		data: '保存成功'
	}).end();
});

router.post('/edit_get', (req, res)=> {
	let editData = ''
	,provinces = ''
	,cities = ''
	,districts = ''
	,blocks = '';
	fs.readFile('api/views/companyOrganization/companyManagement/edit_data_get.json', 'utf-8', (err, ed)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			})
			console.log('err', err);
			return;
		}else{
			editData += ed;
			fs.readFile('api/common/address/beijing0.json', 'utf-8', (err, pd)=> {
				if(err) {
					res.send({
						status: false,
						message: err
					})
					console.log('err', err);
					return;
				}else{
					provinces += pd;
					fs.readFile('api/common/address/beijing1.json', 'utf-8', (err, cd)=> {
						if(err) {
							res.send({
								status: false,
								message: err
							})
							console.log('err', err);
							return;
						}else{
							cities += cd;
							fs.readFile('api/common/address/beijing2.json', 'utf-8', (err, dd)=> {
								if(err) {
									res.send({
										status: false,
										message: err
									})
									console.log('err', err);
									return;
								}else{
									districts += dd;
									fs.readFile('api/common/address/beijing3.json', 'utf-8', (err, bd)=> {
										if(err) {
											res.send({
												status: false,
												message: err
											})
											console.log('err', err);
											return;
										}else{
											blocks += bd;
											let obj = {};
											obj.provinces = provinces;
											obj.cities = cities;
											obj.districts = districts;
											obj.blocks = blocks;
											obj.editData = editData;
											res.send({
												status: true,
												data: obj
											}).end();
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
})

module.exports = router;