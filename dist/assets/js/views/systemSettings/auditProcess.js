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
                dialogSelectAuditVisible: false,
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
                audit: {
                    company: '',
                    searchValue: '',
                    departmentList: [],
                    companyList: [],
                    activeIndex: -1,
                    auditors: [],
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
                auditorLevel: '',
                //asideWidth: asideWidth
            },
            mounted() {
                let _self = this;
                axios.get(getDataUrl).then((req)=> {
                    if(req.data.status) {
                        let jdata = JSON.parse(req.data.message);
                        this.data = jdata;
                        jdata.companyList.forEach((item)=> {
                            _self.audit.companyList.push(item);
                        })
                        console.log('this.audit.companyList: ', this.audit.companyList);
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
                                    _self.dialogAddFormVisible = false;
                                    _self.$message({
                                        type: 'success',
                                        message: data.data.message
                                    });
                                    Object.assign(this.addForm, _this.initAddForm);
                                    Object.assign(this.audit, _this.initAudit);
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
                    this.addForm.firstLevelAuditorsGroup.splice(0, _self.addForm.firstLevelAuditorsGroup.length);
                    this.addForm.secondLevelAuditorsGroup.splice(0, _self.addForm.secondLevelAuditorsGroup.length);
                    this.addForm.bosses.splice(0, _self.addForm.bosses.length);
                    this.addFirstLevelAuditorsGroup.splice(0, _self.addFirstLevelAuditorsGroup.length);
                    this.addSecondLevelAuditorsGroup.splice(0, _self.addSecondLevelAuditorsGroup.length);
                    this.addBosses.splice(0, _self.addBosses.length);
                    this.editFirstLevelAuditorsGroup.splice(0, _self.editFirstLevelAuditorsGroup.length);
                    this.editSecondLevelAuditorsGroup.splice(0, _self.editSecondLevelAuditorsGroup.length);
                    this.editBosses.splice(0, _self.editBosses.length);
                    /*this.audit.auditors.splice(0, _self.audit.auditors.length);
                    this.audit.company = '';
                    this.audit.activeDepartment = '';
                    this.audit.searchValue = '';
                    this.audit.activeIndex = '';
                    this.audit.companyList.splice(0, _self.audit.companyList.length);
                    this.audit.departmentList.splice(0, _self.audit.departmentList.length);*/
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
                    console.log('companyList: ', this.audit.companyList);
                    this.dialogSelectAuditVisible = true;
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
                changeCompany(val) {
                    let _self = this;
                    this.audit.activeDepartment = '';
                    this.audit.searchValue = '';
                    this.audit.activeIndex = '';
                    //this.asideWidth = asideWidth;
                    this.audit.departmentList.splice(0, _self.audit.departmentList.length);
                    this.audit.auditors.splice(0, _self.audit.auditors.length);
                    axios.post('/auditProcess/getDepartments', {company: this.audit.company}).then((res)=> {
                        if(res.data.status) {
                            this.audit.departmentList.splice(0, _self.audit.departmentList.length);
                            let jdata = JSON.parse(res.data.data);
                            jdata.forEach((item)=> {
                                _self.audit.departmentList.push(item);
                            })
                        }
                    })
                },
                selectDepartment(item, i) {
                    if(this.audit.activeIndex === i) return;
                    let _self = this;
                    /**
                     * 切换li的active
                     * @type {[type]}
                     */
                    this.audit.activeIndex = i;
                    /**
                     * 切换当前选择部门
                     * @type {[type]}
                     */
                    this.audit.activeDepartment = item.name;
                    /**
                     * if增加模态框打开
                     * if当前流程级数为1
                     * if 1级的长度不为0
                     * 循环改变获取的职员的选中状态
                     * @param  {[type]} this.dialogAddFormVisible [description]
                     * @return {[type]}                           [description]
                     */
                    axios.post(getAuditorsUrl, item).then((res)=> {
                        if(res.data.status) {
                            let jdata = JSON.parse(res.data.data);
                            this.audit.auditors.splice(0, _self.audit.auditors.length);
                            jdata.forEach((item)=> {
                                _self.audit.auditors.push(item);
                            })
                            if(this.dialogAddFormVisible) {
                                if(this.currentProcessLevel === 1) {
                                    if(this.addFirstLevelAuditorsGroup.length !== 0) {
                                        for(let i = 0; i < _self.addFirstLevelAuditorsGroup.length; i++ ) {
                                            for(let j = 0; j < _self.audit.auditors.length; j++) {
                                                if(_self.audit.auditors[j].jobNumber == _self.addFirstLevelAuditorsGroup[i].jobNumber) {
                                                    _self.audit.auditors[j].isSelected = !_self.audit.auditors[j].isSelected;
                                                }
                                            }
                                        }
                                    }
                                }else if(this.currentProcessLevel === 2) {
                                    if(this.addSecondLevelAuditorsGroup.length !== 0) {
                                        for(let i = 0; i < _self.addSecondLevelAuditorsGroup.length; i++ ) {
                                            for(let j = 0; j < _self.audit.auditors.length; j++) {
                                                if(_self.audit.auditors[j].jobNumber == _self.addSecondLevelAuditorsGroup[i].jobNumber) {
                                                    _self.audit.auditors[j].isSelected = !_self.audit.auditors[j].isSelected;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if(this.dialogEditFormVisible) {
                                if(this.currentProcessLevel === 1) {
                                    if(this.editFirstLevelAuditorsGroup.length !== 0) {
                                        for(let i = 0; i < _self.editFirstLevelAuditorsGroup.length; i++ ) {
                                            for(let j = 0; j < _self.audit.auditors.length; j++) {
                                                if(_self.audit.auditors[j].jobNumber == _self.editFirstLevelAuditorsGroup[i].jobNumber) {
                                                    _self.audit.auditors[j].isSelected = !_self.audit.auditors[j].isSelected;
                                                }
                                            }
                                        }
                                    }
                                }else if(this.currentProcessLevel === 2) {
                                    if(this.editSecondLevelAuditorsGroup.length !== 0) {
                                        for(let i = 0; i < _self.editSecondLevelAuditorsGroup.length; i++ ) {
                                            for(let j = 0; j < _self.audit.auditors.length; j++) {
                                                if(_self.audit.auditors[j].jobNumber == _self.editSecondLevelAuditorsGroup[i].jobNumber) {
                                                    _self.audit.auditors[j].isSelected = !_self.audit.auditors[j].isSelected;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }).catch((err)=> {
                        console.log('err: ', err);
                    })
                },
                /**
                 * 切换已选择审核人员
                 * @param  {[type]} item  [description]
                 * @param  {[type]} index [description]
                 * @return {[type]}       [description]
                 */
                toggleSelected(item,index) {
                    let _self = this;
                    /**
                     * 改变选中审核人员isSelected布尔值
                     * @type {Boolean}
                     */
                    this.audit.auditors[index].isSelected = !this.audit.auditors[index].isSelected;
                    /**
                     * 点击被选中
                     * @param  {[type]} this.audit.auditors[index].isSelected [description]
                     * @return {[type]}                                       [description]
                     */
                    if(this.audit.auditors[index].isSelected) {
                        if(this.currentProcessLevel === 1) {
                            if(this.dialogAddFormVisible) {
                                if(this.addFirstLevelAuditorsGroup.indexOf(item) === -1) {
                                    this.addFirstLevelAuditorsGroup.push(item);
                                }else{
                                    this.addFirstLevelAuditorsGroup.splice(_self.addFirstLevelAuditorsGroup.indexOf(item), 1);
                                }
                            }
                        }else if(this.currentProcessLevel === 2) {
                            if(this.addSecondLevelAuditorsGroup.indexOf(item) === -1) {
                                if(this.dialogAddFormVisible) {
                                    this.addSecondLevelAuditorsGroup.push(item);
                                }
                            }
                        }
                    /**
                     * 点击取消选中
                     * @param  {[type]} !this.audit.auditors[index].isSelected [description]
                     * @return {[type]}                                        [description]
                     */
                    }else if(!this.audit.auditors[index].isSelected){
                        if(this.addFirstLevelAuditorsGroup.indexOf(item) !== -1) {
                            if(this.dialogAddFormVisible) {
                                this.addFirstLevelAuditorsGroup.splice(_self.addFirstLevelAuditorsGroup.indexOf(item), 1);
                            }
                        }
                    }
                },
                confirmSelectAuditors() {
                    let _self = this;
                    /**
                     * 如果dialog打开新增/编辑edit的dialog打开状态
                     *     如果当前选择流程级数
                     * @param  {[type]} this.dialogAddFormVisible [description]
                     * @return {[type]}                           [description]
                     */
                    if(this.dialogAddFormVisible) {
                        if(this.currentProcessLevel === 1) {
                            this.addForm.firstLevelAuditorsGroup.splice(0, _self.addForm.firstLevelAuditorsGroup.length);
                            this.addFirstLevelAuditorsGroup.forEach((item)=> {
                                _self.addForm.firstLevelAuditorsGroup.push(item);
                            })
                        } else if(this.currentProcessLevel === 2){
                            this.addForm.secondLevelAuditorsGroup.splice(0, _self.addForm.secondLevelAuditorsGroup.length);
                            this.addSecondLevelAuditorsGroup.forEach((item)=> {
                                _self.addForm.secondLevelAuditorsGroup.push(item);
                            })
                        }
                    }else if(this.dialogEditFormVisible) {
                        if(this.currentProcessLevel === 1) {
                            this.editForm.firstLevelAuditorsGroup.splice(0, _self.editForm.firstLevelAuditorsGroup.length);
                            this.addFirstLevelAuditorsGroup.forEach((item)=> {
                                _self.editForm.firstLevelAuditorsGroup.push(item);
                            })
                        } else if(this.currentProcessLevel === 2){
                            this.editForm.secondLevelAuditorsGroup.splice(0, _self.editForm.secondLevelAuditorsGroup.length);
                            this.editSecondLevelAuditorsGroup.forEach((item)=> {
                                _self.editForm.secondLevelAuditorsGroup.push(item);
                            })
                        }
                    }
                    this.dialogSelectAuditVisible = false;
                },
                addCloseFirstLevelTag(tag) {
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

    that.init = (getDataUrl, saveDataUrl, getEditDataUrl, saveEditDataUrl, deteleDataUrl, getAuditorsUrl)=> {
        _this.init(getDataUrl, saveDataUrl, getEditDataUrl, saveEditDataUrl, deteleDataUrl, getAuditorsUrl);
    }
    return that;
}
