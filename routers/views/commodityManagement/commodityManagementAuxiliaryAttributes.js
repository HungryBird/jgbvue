const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/search', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/commodityManagement/commodityManagementAuxiliaryAttributes/search.json', 'utf-8', (err, data)=> {
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

let i = 8;
router.post('/addClassify', (req, res)=> {
	res.send({
		status: true,
		data: {
			uid: 'aaa1' + i,
			label: '颜色' + i
		}
	}).end()
	i++;
})

router.post('/getInfo', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/commodityManagement/commodityManagementAuxiliaryAttributes/info.json', 'utf-8', (err, data)=> {
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

module.exports = router;