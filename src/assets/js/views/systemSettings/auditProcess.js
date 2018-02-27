/**
 * Created by Segotep on 2018/1/25.
 */
JGBVue = {
    module: {}
};
JGBVue.module.auditProcess = ()=> {
    let _this = {},
    that = {};

    _this.init = (getDataUrl, saveDataUrl, getEditDataUrl, saveEditDataUrl, deteleDataUrl)=> {
        new Vue({
            el: '#app',
            data: {
                /**
                 * [data 获取的数据]
                 * @type {[type]}
                 */
                data: {
                    table: null
                },
                /**
                 * [addForm 要提交的数据]
                 * @type {
                 *       选择的模块
                 *       销售老板审核
                 *       采购老板审核
                 *       选择审核级数
                 *       一级审核人员
                 *       二级审核人员
                 *       当1、2级没有老板的时候选择的老板
                 *       多人审核方式
                 *       提醒方式
                 * }
                 */
                addForm: {
                    selectSysModule: '',
                    saleBossAudit: false,
                    purchaseBossAudit: false,
                    levelSelected: '',
                    firstLevelAuditorsGroup: [],
                    secondLevelAuditorsGroup: [],
                    bosses: [],
                    auditMethod: '1',
                    remainWays: ['站内信息']
                },
                /**
                 * 预填信息
                 * @type {Object}
                 */
                editForm: {
                    selectSysModule: '',
                    saleBossAudit: false,
                    purchaseBossAudit: false,
                    levelSelected: '',
                    firstLevelAuditorsGroup: [],
                    secondLevelAuditorsGroup: [],
                    bosses: [],
                    auditMethod: '1',
                    remainWays: ['站内信息']
                },
                dialogAddFormVisible: false,
                dialogEditFormVisible: false,
                editDialogLoading: true,
                selectProcessLevel: null,
                firstLeveAuditHasBoss: false,
                secondLeveAuditHasBoss: false,
                selectedRows: [],
                rules: {
                    selectSysModule: [
                        {required: true, message: '请选择系统模块'}
                    ],
                    levelSelected: [
                        {required: true, message: '请选择审核级数'}
                    ],
                    firstLevelAuditorsGroup: [
                        {required: true, message: '请选择1级审核人员'}
                    ],
                    secondLevelAuditorsGroup: [
                        {required: true, message: '请选择2级审核人员'}
                    ],
                    bosses: [
                        {required: true, message: '请选择老板'}
                    ]
                }
            },
            mounted() {
                axios.get(getDataUrl).then((req)=> {
                    if(req.data.status) {
                        let jdata = JSON.parse(req.data.message);
                        this.data = jdata;
                        this.data.date = new Date(jdata.date*1000);
                    }
                }).catch((err)=> {
                    console.log('err', err);
                })
            },
            methods: {
                add() {
                    this.dialogAddFormVisible = true;
                },
                saveAdd(formName) {
                    let _self = this;
                    this.$refs[formName].validate((valid)=> {
                        if(valid) {
                            axios.post(saveDataUrl, this.addForm).then((data)=> {
                                if(data.data.status) {
                                    _self.dialogAddFormVisible = false;
                                    _self.$message({
                                        type: 'success',
                                        message: data.data.message
                                    })
                                }else{
                                    _self.$message({
                                        type: 'error',
                                        message: data.data.message
                                    })
                                }
                            }).catch((err)=> {
                                _self.$message({
                                    type: 'error',
                                    message: err
                                });
                            });
                        }else{
                            return false;
                        }
                    })
                },
                closeAdd(formName) {
                    let _self = this;
                    this.$refs[formName].resetFields();
                    this.dialogAddFormVisible = false;
                },
                edit() {
                    let _self = this;
                    this.dialogEditFormVisible = true;
                    axios.post(getEditDataUrl, this.selectedRows).then((data)=> {
                        if(data.data.status) {
                            let jdata = JSON.parse(data.data.message);
                            this.editForm = jdata;
                            this.editDialogLoading = false;
                        }
                    })
                },
                saveEdit() {
                    this.editDialogLoading = true;
                    axios.post(saveEditDataUrl, this.editForm).then((data)=> {
                        if(data.data.status) {
                            this.editDialogLoading = false;
                            this.dialogEditFormVisible = false;
                            this.$message({
                                type: 'success',
                                message: data.data.message
                            })
                        }else{
                            this.editDialogLoading = false;
                            this.$message({
                                type: 'error',
                                message: data.data.message
                            })
                        }
                    })
                },
                closeEdit(formName) {
                    let _self = this;
                    this.$refs[formName].resetFields();
                    this.dialogEditFormVisible = false;
                },
                remove() {
                    this.$confirm('确定删除?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        beforeClose: function(action, instance, done) {
                            done(action);
                        }
                    }).then((action)=> {
                        if(action == 'confirm') {
                            axios.post(deteleDataUrl, this.selectedRows).then((data)=> {
                                if(data.data.status) {
                                    this.$message({
                                        type: 'success',
                                        message: data.data.message
                                    })
                                }
                            }).catch(function(err) {
                                _self.$message({
                                    type: 'error',
                                    message: req.data.message || err
                                });
                            })
                        }
                    }).catch(() => {
                       this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
                },
                handleSizeChange() {
                    //size变化时
                },
                handleCurrentChange() {
                    //当前页改变时
                },
                objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                    /*let _self = this;
                    if(columnIndex == 6) {
                        return {
                            rowspan: _self.data.table.length,
                            colspan: 1
                        }
                    }*/
                },
                tableRowClassName({row, rowIndex}) {
                    if(rowIndex%2 != 0) {
                        return 'default-row';
                    }
                },
                rowClick(row) {
                    let _self = this;
                    this.$refs.auditTable.toggleRowSelection(row);
                    if(_self.selectedRows.indexOf(row) == -1) {
                        _self.selectedRows.push(row)
                    }else{
                        _self.selectedRows.splice(_self.selectedRows.indexOf(row), 1);
                    }
                },
                selectAll(selection) {
                    let _self = this;
                    if(selection.length == 0) {
                        _self.selectedRows.splice(0, _self.selectedRows.length);
                    }else{
                        _self.selectedRows.splice(0, _self.selectedRows.length);
                        selection.forEach((item)=> {
                            _self.selectedRows.push(item);
                        })
                    }
                },
                selectItem(selection, row) {
                    let = _self = this;
                    this.selectedRows.splice(0, _self.selectedRows.length);
                    for(let i = 0; i < selection.length; i++) {
                        _self.selectedRows.push(selection[i]);
                    }
                },
                changeModule() {
                    this.addForm.checked = false;
                },
                changeLevel(val) {
                    let _self = this;
                    this.selectProcessLevel = val;
                    this.addForm.firstLevelAuditorsGroup.splice(0, _self.addForm.firstLevelAuditorsGroup.length);
                    this.addForm.secondLevelAuditorsGroup.splice(0, _self.addForm.secondLevelAuditorsGroup.length);
                    this.addForm.bosses.splice(0, _self.addForm.bosses.length);
                },
                editChangeModule() {
                    //
                }
            },
            filters: {
                auditorFilter(arr) {
                    let str = arr.join('，');
                    return str;
                }
            },
            watch: {
                'addForm.firstLevelAuditorsGroup'(arr) {
                    let _self = this;
                    for(let i = 0; i < arr.length; i++) {
                        if(arr[i] > 1000) {
                            _self.firstLeveAuditHasBoss = true;
                            _self.addForm.bosses.splice(0, _self.addForm.bosses.length);
                            return;
                        }
                    }
                    _self.firstLeveAuditHasBoss = false;
                },
                'addForm.secondLevelAuditorsGroup'(arr) {
                    let _self = this;
                    if(this.selectProcessLevel === 2) {
                        for(let i = 0; i < arr.length; i++) {
                            if(arr[i] > 1000) {
                                _self.secondLeveAuditHasBoss = true;
                                _self.addForm.bosses.splice(0, _self.addForm.bosses.length);
                                return;
                            }
                        }
                        _self.secondLeveAuditHasBoss = false;
                    }
                }
            }
        })
    }

    that.init = (getDataUrl, saveDataUrl, getEditDataUrl, saveEditDataUrl, deteleDataUrl)=> {
        _this.init(getDataUrl, saveDataUrl, getEditDataUrl, saveEditDataUrl, deteleDataUrl);
    }
    return that;
}
