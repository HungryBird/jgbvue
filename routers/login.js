const express = require('express');
const fs = require('fs');

const router = express.Router();

router.post('/login', (req, res)=> {
	fs.readFile('api/login.json', 'utf-8', (err, data)=> {
		if(err) {
			console.log('err', err);
			res.send({
				status: false,
				message: err
			})
			return;
		}
		let jdata = JSON.parse(data);
		if(req.body.user != jdata[0]['user'] || req.body.pass != jdata[0]['pass']) {
			res.send({
				status: false,
				message: '账号或密码错误'
			})
		}else{
			res.send({
				status: true,
				message: '登陆成功'
			})
		}
	});
});

module.exports = router;