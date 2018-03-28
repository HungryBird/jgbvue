/**
 * Created by Segotep on 2018/1/25.
 */
JGBVue = {
    module: {}
};
JGBVue.module.auditProcess = ()=> {
    let _this = {},
    that = {};

    _this.initAudit = {
        company: '',
        searchValue: '',
        departmentList: [],
        companyList: [],
        activeIndex: -1,
        auditors: [],
        activeDepartment: '',
        selectedAuditors: []
    };

    _this.initAddForm = {
        selectSysModule: '',
        saleBossAudit: false,
        purchaseBossAudit: false,
        levelSelected: '',
        firstLevelAuditorsGroup: [],
        secondLevelAuditorsGroup: [],
        bosses: [],
        auditMethod: '1',
        remainWays: ['站内信息']
    };

    //let asideWidth = 217;

    _this.init = (getDataUrl, saveDataUrl, getEditDataUrl, saveEditDataUrl, deteleDataUrl, getAuditorsUrl)=> {
        that.vm = new Vue({
            el: '#app',
            data: {
                /**
                 * [data 获取的数据]
                 * @type {[type]}
                 */
                data: {
                    table: []
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
                    levelSelected: 0,
                    firstLevelAuditorsGroup: [],
                    secondLevelAuditorsGroup: [],
                    bosses: [],
                    auditMethod: '1',
                    remainWays: ['站内信息']
                },
                /**
                 * 新增窗口
                 * @type {Boolean}
                 */
                dialogAddFormVisible: false,
                dialogEditFormVisible: false,
                editDialogLoading: true,
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
                },
                addDialogSelectFirstAuditVisible: false,
                addDialogSelectSecondAuditVisible: false,
                /**
                 * 打开选择审核人员的模态窗数据
                 * 选中公司
                 * 搜索框的值
                 * 获得的部门列表
                 * 获得的公司列表
                 * 选中部门的index，-1表示未选中任何部门
                 * 获得员工列表
                 * 选中的部门
                 * 选中的员工列表
                 * @type {Object}
                 */
                addFirstAudit: {
                    company: '',
                    searchValue: '',
                    companyList: [],
                    departmentList: [],
                    curCompanyVal: '',
                    auditorList: [],
                    activeIndex: -1,
                    activeDepartment: '',
                    selectedAuditors: []
                },
                addSecondAudit: {
                    company: '',
                    searchValue: '',
                    companyList: [],
                    departmentList: [],
                    curCompanyVal: '',
                    auditorList: [],
                    activeIndex: -1,
                    activeDepartment: '',
                    selectedAuditors: []
                },
                /**
                 * 选择当前流程级数
                 * @type {Number}
                 */
                currentProcessLevel: -1,
                /**
                 * 选择审核人员，未点确定时暂存数组
                 * @type {Array}
                 */
                addFirstLevelAuditorsGroup: [],
                addSecondLevelAuditorsGroup: [],
                addBosses: [],
                editFirstLevelAuditorsGroup: [],
                editSecondLevelAuditorsGroup: [],
                editBosses: [],
                //asideWidth: asideWidth
            },
            mounted() {
                let _self = this;
                axios.get(getDataUrl).then((req)=> {
                    if(req.data.status) {
                        let jdata = JSON.parse(req.data.data);
                        this.data = jdata;
                        jdata.companyList.forEach((item)=> {
                            _self.addFirstAudit.companyList.push(item);
                            _self.addSecondAudit.companyList.push(item);
                        })
                        this.data.date = new Date(jdata.date*1000);
                    }
                }).catch((err)=> {
                    console.log('err', err);
                })
            },
            methods: {
                add() {
                    this.dialogAddFormVisible = true;
                    //this.asideWidth = asideWidth;
                },
                saveAdd(formName) {
                    let _self = this;
                    this.$refs[formName].validate((valid)=> {
                        if(valid) {
                            axios.post(saveDataUrl, this.addForm).then((data)=> {
                                if(data.data.status) {
                                    _self.$message({
                                        type: 'success',
                                        message: data.data.message
                                    });
                                    /**
                                     * 初始化-新增表单-选择审核人员的值
                                     */
                                    this.$refs[formName].resetFields();
                                    this.addFirstAudit.company = '';
                                    this.addFirstAudit.departmentList.splice(0, _self.addFirstAudit.departmentList.length);
                                    this.addFirstAudit.auditorList.splice(0, _self.addFirstAudit.auditorList.length);
                                    this.addFirstLevelAuditorsGroup.splice(0, _self.addFirstLevelAuditorsGroup.length);
                                    this.addSecondLevelAuditorsGroup.splice(0, _self.addSecondLevelAuditorsGroup.length);
                                    /**
                                     * 覆盖初始值
                                     * @param  {[type]} getDataUrl).then((req [description]
                                     * @return {[type]}                       [description]
                                     */
                                    this.addFirstAudit.companyList.splice(0, _self.addFirstAudit.companyList.length);
                                    this.addSecondAudit.companyList.splice(0, _self.addSecondAudit.companyList.length);
                                    axios.get(getDataUrl).then((req)=> {
                                        if(req.data.status) {
                                            let jdata = JSON.parse(req.data.data);
                                            this.data = jdata;
                                            jdata.companyList.forEach((item)=> {
                                                _self.addFirstAudit.companyList.push(item);
                                                _self.addSecondAudit.companyList.push(item);
                                            })
                                            this.data.date = new Date(jdata.date*1000);
                                        }
                                    }).catch((err)=> {
                                        console.log('err', err);
                                    })

                                    _self.dialogAddFormVisible = false;
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
                            this.currentProcessLevel = jdata.selectProcessLevel;
                            if(jdata.firstLevelAuditorsGroup.length !== 0) {
                                this.editFirstLevelAuditorsGroup.splice(0, _self.editFirstLevelAuditorsGroup.length);
                                jdata.firstLevelAuditorsGroup.forEach((item)=> {
                                    _self.editFirstLevelAuditorsGroup.push(item);
                                })
                            }
                            if(jdata.secondLevelAuditorsGroup.length !== 0) {
                                this.editSecondLevelAuditorsGroup.splice(0, _self.editSecondLevelAuditorsGroup.length);
                                jdata.secondLevelAuditorsGroup.forEach((item)=> {
                                    _self.editSecondLevelAuditorsGroup.push(item);
                                })
                            }
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
                                    });
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
                    let _self = this;
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
                    if(val) {
                        this.selectProcessLevel = val;
                    }
                },
                editChangeModule() {
                    //
                },
                handleEdit(index, row) {
                    let _self = this;
                    this.selectedRows.splice(0, _self.selectedRows.length);
                    this.$refs.auditTable.clearSelection();
                    this.edit();
                },
                handleDelete(index, row) {
                    let _self = this;
                    this.selectedRows.splice(0, _self.selectedRows.length);
                    this.$refs.auditTable.clearSelection();
                    this.remove();
                },
                /**
                 * 打开选择add审核人员dialog
                 * @param  {[type]} data  [description]
                 * @param  {[type]} level [description]
                 * @return {[type]}       [description]
                 */
                addSelectFirstAuditDialog(formName) {
                    let _self = this;
                    this.addDialogSelectFirstAuditVisible = true;
                },
                addSelectSecondAuditDialog(formName) {
                    let _self = this;
                    this.addDialogSelectSecondAuditVisible = true;
                },
                searchEmployee() {
                    /**
                     * 折叠aside
                     * @type {Number}
                     */
                    //this.asideWidth = 0;
                },
                checkSelectedemployees() {
                    //
                },
                addFirstChangeCompany(val) {
                    let _self = this;
                    this.addFirstAudit.activeDepartment = '';
                    this.addFirstAudit.searchValue = '';
                    this.addFirstAudit.activeIndex = '';
                    this.addFirstAudit.departmentList.splice(0, _self.addFirstAudit.departmentList.length);
                    this.addFirstAudit.auditorList.splice(0, _self.addFirstAudit.auditorList.length);
                    this.addFirstLevelAuditorsGroup.splice(0, _self.addFirstLevelAuditorsGroup.length);

                    for(let i = 0, companyListLength = this.addFirstAudit.companyList.length; i < companyListLength; i++) {
                        if(this.addFirstAudit.companyList[i].value === val) {
                            this.addFirstAudit.companyList[i].department.forEach((dp)=> {
                                _self.addFirstAudit.departmentList.push(dp);
                            });
                            this.addFirstAudit.curCompanyVal = this.addFirstAudit.companyList[i].value;
                            break;
                        }
                    }

                    this.addFirstAudit.companyList.forEach((cl)=> {
                        cl.department.forEach((dp)=> {
                            dp.auditors.forEach((au)=> {
                                au.isSelected = false;
                            })
                        })
                    })
                },
                addFirstSelectDepartment(item, i) {
                    if(this.addFirstAudit.activeIndex === i) return;
                    let _self = this;
                    /**
                     * 切换li的active
                     * @type {[type]}
                     */
                    this.addFirstAudit.activeIndex = i;
                    /**
                     * 切换当前选择部门
                     * @type {[type]}
                     */
                    this.addFirstAudit.activeDepartment = item.name;
                    this.addFirstAudit.auditorList.splice(0, _self.addFirstAudit.auditorList.length);

                    for(let i = 0, companyListLength = this.addFirstAudit.companyList.length; i < companyListLength; i++) {
                        if(this.addFirstAudit.companyList[i].value === this.addFirstAudit.curCompanyVal) {
                            for(let j = 0, departmentLength = _self.addFirstAudit.companyList[i].department.length; j < departmentLength; j++ ) {
                                if(_self.addFirstAudit.companyList[i].department[j].value === item.value) {
                                    _self.addFirstAudit.companyList[i].department[j].auditors.forEach((item)=> {
                                        _self.addFirstAudit.auditorList.push(item);
                                    });
                                }
                            }
                        }
                    }
                },
                /**
                 * 添加-切换已选择审核人员
                 * @param  {[type]} item  [description]
                 * @param  {[type]} index [description]
                 * @return {[type]}       [description]
                 */
                addFirstToggleSelected(item,index) {
                    let _self = this;
                    /**
                     * 改变选中审核人员isSelected布尔值
                     * @type {Boolean}
                     */
                    this.addFirstAudit.auditorList[index].isSelected = !this.addFirstAudit.auditorList[index].isSelected;
                    /**
                     * 点击被选中
                     * @param  {[type]} this.audit.auditors[index].isSelected [description]
                     * @return {[type]}                                       [description]
                     */
                    if(this.addFirstAudit.auditorList[index].isSelected) {
                        if(this.addFirstLevelAuditorsGroup.indexOf(item) === -1) {
                            this.addFirstLevelAuditorsGroup.push(item);
                        }else{
                            this.addFirstLevelAuditorsGroup.splice(_self.addFirstLevelAuditorsGroup.indexOf(item), 1);
                        }
                    /**
                     * 点击取消选中
                     * @param  {[type]} !this.audit.auditors[index].isSelected [description]
                     * @return {[type]}                                        [description]
                     */
                    }else if(!this.addFirstAudit.auditorList[index].isSelected){
                        if(this.addFirstLevelAuditorsGroup.indexOf(item) !== -1) {
                            this.addFirstLevelAuditorsGroup.splice(_self.addFirstLevelAuditorsGroup.indexOf(item), 1);
                        }
                    }
                },
                /**
                 * 新增-点击保存-选择审核人员流程
                 */
                addConfirmSelectFirstAuditors() {
                    let _self = this;
                    this.addForm.firstLevelAuditorsGroup.splice(0, _self.addForm.firstLevelAuditorsGroup.length);
                    this.addFirstLevelAuditorsGroup.forEach((item)=> {
                        _self.addForm.firstLevelAuditorsGroup.push(item);
                    })
                    this.addDialogSelectFirstAuditVisible = false;
                },
                addCloseFirstLevelTag(tag) {
                    let _self = this;
                    for(let i = 0; i < this.addFirstLevelAuditorsGroup.length; i++) {
                        if(this.addFirstLevelAuditorsGroup[i] === tag) {
                            this.addFirstLevelAuditorsGroup.splice(_self.addFirstLevelAuditorsGroup.indexOf(_self.addFirstLevelAuditorsGroup[i]), 1);
                        }
                    };
                    for(let i = 0, companyLength = this.addFirstAudit.companyList.length; i < companyLength; i++) {
                        if(this.addFirstAudit.companyList[i].value === tag.company) {
                            for(let j = 0, departmentLength = this.addFirstAudit.departmentList; j < departmentLength; j++) {
                                if(this.addFirstAudit.departmentList[j].value === tag.department) {
                                    for(let k = 0, auditorLength = this.addFirstAudit.auditorList.length; k < auditorLength; k++ ) {
                                        if(this.addFirstAudit.auditorList[k] === tag) {
                                            this.addFirstAudit.auditorList[k].isSelected = false;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.addForm.firstLevelAuditorsGroup.splice(this.addForm.firstLevelAuditorsGroup.indexOf(tag), 1);
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
                        if(arr[i].isBoss) {
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
                            if(arr[i].isBoss) {
                                _self.secondLeveAuditHasBoss = true;
                                _self.addForm.bosses.splice(0, _self.addForm.bosses.length);
                                return;
                            }
                        }
                        _self.secondLeveAuditHasBoss = false;
                    }
                },
                'editForm.firstLevelAuditorsGroup'(arr) {
                    let _self = this;
                    for(let i = 0; i < arr.length; i++) {
                        if(arr[i].isBoss) {
                            _self.firstLeveAuditHasBoss = true;
                            _self.addForm.bosses.splice(0, _self.addForm.bosses.length);
                            return;
                        }
                    }
                    _self.firstLeveAuditHasBoss = false;
                },
                'editForm.secondLevelAuditorsGroup'(arr) {
                    let _self = this;
                    if(this.selectProcessLevel === 2) {
                        for(let i = 0; i < arr.length; i++) {
                            if(arr[i].isBoss) {
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
