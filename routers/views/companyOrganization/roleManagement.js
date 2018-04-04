/**
 * created by lanw 2018-4-4
 * 角色管理
 */
const express = require('express');
const fs = require('fs');

const router = express.Router();

router.post('/role_data_get', (req, res) => {
  let jdata = '';
  fs.readFile('api/views/companyOrganization/roleManagement/role_data_get.json', 'utf-8', (err, data) => {
    if (err) {
      console.log('err: ', err);
      return;
    }
    jdata += data;
    res.send({
      status: true,
      data: jdata
    }).end();
  });
})

router.post('/role_add', (req, res)=> {
  res.send({
    status: true,
    message: '添加角色成功'
  }).end();
})

router.post('/role_edit', (req, res) => {
  res.send({
    status: true,
    message: '修改角色成功'
  }).end();
})

module.exports = router;