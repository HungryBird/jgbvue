const express = require('express');
const fs = require('fs');

const router = express.Router();

router.post('/keeping_show', (req, res)=> {
	fs.writeFile('api/guidance.json', JSON.stringify(req.body), (err)=> {
		if(err) throw err;
	})
})

module.exports = router;