const express = require('express');
const fs = require('fs');

const router = express.Router();

router.use('/search', (req, res)=> {
	let jdata = '';
	console.log(req.body)
	fs.readFile('api/views/purchasingManagement/purchasePlanTraceTable/table.json', 'utf-8', (err, data)=> {
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
});

module.exports = router;