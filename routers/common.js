const express = require('express');
const fs = require('fs');

const router = express.Router();

router.post('/data_add_save', (req, res)=> {
	res.send({
		status: true,
		message: '添加成功'
	})
})

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

router.post('/data_give_out', (req, res)=> {
	res.send({
		status: true,
		message: '作废成功'
	})
});

router.post('/switch', (req, res)=> {
	res.send({
		status: true,
		message: 'success!'
	})
});

router.post('/search', (req, res)=> {
	res.sedn({
		status: true,
		message: 'success'
	})
});

router.post('/getEmployee', (req, res)=> {
	console.log(req.body.value)
	if(req.body.value === 'finance1') {
		let jdata = '';
		fs.readFile('api/common/audit/auditors1.json', 'utf-8', (err, data)=> {
			jdata += data;
			res.send({
				status: true,
				data: jdata
			})
		})
	}else if(req.body.value === 'purchase1') {
		let jdata = '';
		fs.readFile('api/common/audit/auditors2.json', 'utf-8', (err, data)=> {
			jdata += data;
			res.send({
				status: true,
				data: jdata
			})
		})
	}else if(req.body.value === 'personnel1') {
		let jdata = '';
		fs.readFile('api/common/audit/auditors3.json', 'utf-8', (err, data)=> {
			jdata += data;
			res.send({
				status: true,
				data: jdata
			})
		})
	}else if(req.body.value === 'finance2') {
		let jdata = '';
		fs.readFile('api/common/audit/auditors4.json', 'utf-8', (err, data)=> {
			jdata += data;
			res.send({
				status: true,
				data: jdata
			})
		})
	}else if(req.body.value === 'purchase2') {
		let jdata = '';
		fs.readFile('api/common/audit/auditors5.json', 'utf-8', (err, data)=> {
			jdata += data;
			res.send({
				status: true,
				data: jdata
			})
		})
	}else if(req.body.value === 'personnel2') {
		let jdata = '';
		fs.readFile('api/common/audit/auditors6.json', 'utf-8', (err, data)=> {
			jdata += data;
			res.send({
				status: true,
				data: jdata
			})
		})
	}
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


router.use('/getCompany', (req, res)=> {
	let jdata = '';
	fs.readFile('api/common/company/company.json', 'utf-8', (err, data)=> {
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

router.post('/getDepartment', (req, res)=> {
	let jdata = '';
	fs.readFile('api/common/company/department.json', 'utf-8', (err, data)=> {
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

router.post('/getUser', (req, res)=> {
	let jdata = '';
	fs.readFile('api/common/audit/auditors1.json', 'utf-8', (err, data)=> {
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

router.post('/upload_info', (req, res)=> {
	let jdata = '';
	fs.readFile('api/common/upload/info.json', 'utf-8', (err, data)=> {
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

router.post('/upload_img', (req, res)=> {
	res.send({
		status: true,
		message: 'upload success'
	}).end();
})

router.post('/slideshow', (req, res)=> {
	let slideshow = [
		{
			width: 500,
			height: 400,
			src: '../../img/slideshow/1.jpg'
		},
		{
			width: 640,
			height: 480,
			src: '../../img/slideshow/2.jpg'
		},
		{
			width: 500,
			height: 375,
			src: '../../img/slideshow/3.jpg'
		}
	];

	res.send({
		status: true,
		data: slideshow
	})
})

router.get('/getRepo', (req, res)=> {
	let jdata = '';
	fs.readFile('api/common/repo/repo.json', 'utf-8', (err, data)=> {
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

router.use('/getQuickQueryOption', (req, res)=> {
	let jdata = '';
	fs.readFile('api/common/getOption/quickQueryOption.json', 'utf-8', (err, data)=> {
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

router.post('/examine', (req, res)=> {
	let jdata = '';
	fs.readFile('api/common/slide_detailsInfo/detailsInfo.json', 'utf-8', (err, data)=> {
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

module.exports = router;