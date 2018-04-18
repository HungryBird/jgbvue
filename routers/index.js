const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/is_show_guidance', (req, res)=> {
	fs.readFile('api/guidance.json', 'utf-8', (err, data)=> {
		let jdata = '';
		if(err) {
			res.send({
				status: false,
				message: err
			})
			return;
		}
		jdata += data;
		res.send({
			status: true,
			message: jdata
		})
	})
})

router.post('/get_menu', (req, res)=> {
	fs.readFile('api/common/nav/data.json', 'utf-8', (err, data)=> {
		let jdata = '';
		if(err) {
			res.send({
				status: false,
				message: err
			})
			return;
		}
		jdata += data;
		res.send({
			status: true,
			data: jdata
		})
	})
})

module.exports = router;