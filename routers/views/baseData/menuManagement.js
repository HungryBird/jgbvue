const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/data_catalogue_get', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/baseData/menuManagement/data_tree_get.json', 'utf-8', (err, data)=> {
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
		}).end();
	})
})

router.post('/data_table_get', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/baseData/menuManagement/data_table_get.json', 'utf-8', (err, data)=> {
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
		}).end();
	})
});

router.post('/data_edit_get', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/baseData/menuManagement/data_edit_get.json', 'utf-8', (err, data)=> {
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
		}).end();
	})
})

router.get('/data_btn_get', (req, res)=> {
	const buttonList = ['per_add_btn', 'per_edit_btn', 'per_remove_btn'];
	res.send({
		status: true,
		data: buttonList
	})
});

router.get('/data_col_get', (req, res)=> {
	const columnList = ['per_number_col', 'per_opera_col', 'per_add_col', 'per_target_col', 'per_menu_col', 'per_unfold_col', 'per_public_col', 'per_menu_col', 'per_valid_col', 'per_describe_col'];
	res.send({
		status: true,
		data: columnList
	})
});

router.post('/menu', (req, res)=> {
	res.send({
		status: true,
		message: '菜单状态修改成功'
	})
});

router.post('/unfold', (req, res)=> {
	res.send({
		status: true,
		message: '展开状态修改成功'
	})
})

router.post('/public', (req, res)=> {
	res.send({
		status: true,
		message: '公共状态修改成功'
	})
})

router.post('/valid', (req, res)=> {
	res.send({
		status: true,
		message: '有效状态修改成功'
	})
})

module.exports = router;