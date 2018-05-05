const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/search', (req, res)=> {
	let cities = '';
	console.log(req.query)
	/*fs.readFile('api/views/systemSettings/administrativeRegion/beijing0.json', 'utf-8', (err, data)=> {
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
	});*/
});

module.exports = router;