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

router.post('/role_delete', (req, res) => {
  res.send({
    status: true,
    message: '删除角色成功'
  }).end();
})

router.post('/role_status', (req, res) => {
  res.send({
    status: true,
    message: '操作角色状态成功'
  }).end();
})

router.post('/role_access_time_get', (req, res) => {
  let data = [{
    'weekday': '星期一',
    'time': '上午10:00--下午15:00'
  }, {
    'weekday': '星期二',
    'time': '上午10:00--下午15:00'
  }, {
    'weekday': '星期三',
    'time': '上午10:00--下午15:00'
  }, {
    'weekday': '星期四',
    'time': '上午10:00--下午15:00'
  }]
  res.send({
    status: true,
    data: JSON.stringify(data)
  }).end();
})

router.post('/add_access_time', (req, res) => {
  res.send({
    status: true,
    message: '添加禁止访问时段成功'
  }).end();
})

router.post('/del_access_time', (req, res) => {
  res.send({
    status: true,
    message: '删除禁止访问时段成功'
  }).end();
})

router.post('/role_member_get', (req, res) => {
  let jdata = '';
  fs.readFile('api/views/companyOrganization/roleManagement/member_data_get.json', 'utf-8', (err, data) => {
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

router.post('/department_member_get', (req, res) => {
  let jdata = '';
  fs.readFile('api/views/companyOrganization/roleManagement/department_member_get.json', 'utf-8', (err, data) => {
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

router.post('/update_role_member', (req, res) => {
  res.send({
    status: true,
    message: '设置角色成员成功'
  }).end();
})

module.exports = router; 