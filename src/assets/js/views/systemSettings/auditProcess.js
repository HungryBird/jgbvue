/**
 * Created by Segotep on 2018/1/25.
 */
JGBVue = {
    module: {}
};
JGBVue.module.auditProcess = ()=> {
    let _this = {},
    that = {};

    //let asideWidth = 217;

    _this.init = (getDataUrl, getEditDataUrl, saveEditDataUrl, examineUrl, handleStartUsingUrl, searchEmployeeUrl, getEmployeeUrl)=> {
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
                 * [editForm 要提交的数据]
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
                /**
                 * 预填信息
                 * @type {Object}
                 */
                editForm: {
                    title: '',
                    bossAudit: {
                        status: false,
                        describe: ''
                    },
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
                dialogEditFormVisible: false,
                editDialogLoading: true,
                firstLeveAuditHasBoss: false,
                secondLeveAuditHasBoss: false,
                selectedRow: null,
                rules: {
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
                dialogSelectFirstAuditVisible: false,
                dialogSelectSecondAuditVisible: false,
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
                firstAudit: {
                    company: '',
                    companyName: '',
                    departmentName: '',
                    searchValue: '',
                    companyList: [],
                    departmentList: [],
                    curCompanyVal: '',
                    auditorList: [],
                    activeIndex: -1,
                    activeDepartment: '',
                    selectedAuditors: []
                },
                secondAudit: {
                    company: '',
                    companyName: '',
                    departmentName: '',
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
                tempFirstLevelAuditorsGroup: [],
                tempSecondLevelAuditorsGroup: [],
                tempBosses: [],
                exmaineDialogVisiable: false,
                examineForm: {
                    bossAudit: {
                        status: true,
                        describe: ""
                    },
                    processLevel: "",
                    auditors: {
                        firstLevel: [],
                        secondLevel: [],
                        bosses: []
                    },
                    auditMethod: "",
                    remainWays: []
                },
                showFirstSelectedAuditors: true,
                showSecondSelectedAuditors: true
            },
            mounted() {
                let _self = this;
                axios.get(getDataUrl).then((req)=> {
                    if(req.data.status) {
                        let jdata = JSON.parse(req.data.data);
                        this.data = jdata;
                        let arr1= [],
                        arr2 = [];
                        jdata.companyList.forEach((item)=> {
                            _self.firstAudit.companyList.push(item);
                            _self.secondAudit.companyList.push(item);
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
                },
                saveEdit(formName) {
                    let _self = this;
                    this.$refs[formName].validate((valid)=> {
                        if(valid) {
                            axios.post(saveEditDataUrl, this.editForm).then((data)=> {
                                if(data.data.status) {
                                    _self.$message({
                                        type: 'success',
                                        message: data.data.message
                                    });
                                    /**
                                     * 初始化-新增表单-选择审核人员的值
                                     */
                                    this.$refs[formName].resetFields();
                                    this.firstAudit.company = '';
                                    this.firstAudit.departmentList.splice(0, _self.firstAudit.departmentList.length);
                                    this.firstAudit.auditorList.splice(0, _self.firstAudit.auditorList.length);
                                    this.secondAudit.company = '';
                                    this.secondAudit.departmentList.splice(0, _self.secondAudit.departmentList.length);
                                    this.secondAudit.auditorList.splice(0, _self.secondAudit.auditorList.length);
                                    this.tempFirstLevelAuditorsGroup.splice(0, _self.tempFirstLevelAuditorsGroup.length);
                                    this.tempSecondLevelAuditorsGroup.splice(0, _self.tempSecondLevelAuditorsGroup.length);
                                    /**
                                     * 覆盖初始值
                                     * @param  {[type]} getDataUrl).then((req [description]
                                     * @return {[type]}                       [description]
                                     */
                                    this.firstAudit.companyList.splice(0, _self.firstAudit.companyList.length);
                                    this.secondAudit.companyList.splice(0, _self.secondAudit.companyList.length);
                                    axios.get(getDataUrl).then((req)=> {
                                        if(req.data.status) {
                                            let jdata = JSON.parse(req.data.data);
                                            this.data = jdata;
                                            /*jdata.companyList.forEach((item)=> {
                                                _self.firstAudit.companyList.push(item);
                                                _self.secondAudit.companyList.push(item);
                                            });*/
                                            this.data.date = new Date(jdata.date*1000);
                                            this.dialogEditFormVisible = false;
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
                edit(row) {
                    let _self = this;
                    this.dialogEditFormVisible = true;
                    axios.post(getEditDataUrl, this.selectedRow).then((data)=> {
                        if(data.data.status) {
                            let jdata = JSON.parse(data.data.message);
                            this.editForm = jdata;
                            this.currentProcessLevel = jdata.selectProcessLevel;
                            if(jdata.firstLevelAuditorsGroup.length !== 0) {
                                this.tempFirstLevelAuditorsGroup.splice(0, _self.tempFirstLevelAuditorsGroup.length);
                                jdata.firstLevelAuditorsGroup.forEach((item)=> {
                                    _self.tempFirstLevelAuditorsGroup.push(item);
                                })
                            }
                            if(jdata.secondLevelAuditorsGroup.length !== 0) {
                                this.tempSecondLevelAuditorsGroup.splice(0, _self.tempSecondLevelAuditorsGroup.length);
                                jdata.secondLevelAuditorsGroup.forEach((item)=> {
                                    _self.tempSecondLevelAuditorsGroup.push(item);
                                })
                            }
                            this.editDialogLoading = false;
                        }
                    })
                },
                handleSizeChange() {
                    //size变化时
                },
                handleCurrentChange() {
                    //当前页改变时
                },
                rowClick(row) {
                    this.selectedRow = row;
                },
                selectItem(selection, row) {
                    this.selectedRow = row;
                },
                changeLevel(val) {
                    let _self = this;
                    if(val) {
                        this.selectProcessLevel = val;
                    }
                },
                handleEdit(index, row) {
                    this.edit(row);
                },
                handleExamine(index, row) {
                    let _self = this;
                    axios.post(examineUrl, row.uid).then((res)=> {
                        if(res.data.status) {
                            let jdata = JSON.parse(res.data.data);
                            this.examineForm = jdata;
                            console.log('jdata: ', jdata.bossAudit.status)
                            this.exmaineDialogVisiable = true;
                        }
                    })
                },
                /**
                 * 打开选择审核人员dialog
                 * @param  {[type]} data  [description]
                 * @param  {[type]} level [description]
                 * @return {[type]}       [description]
                 */
                selectFirstAuditDialog(formName) {
                    let _self = this;
                    this.dialogSelectFirstAuditVisible = true;
                },
                selectSecondAuditDialog(formName) {
                    let _self = this;
                    this.dialogSelectSecondAuditVisible = true;
                },
                searchFirstEmployee() {
                    let _self = this;
                    axios.post(searchEmployeeUrl, this.firstAudit.searchValue).then((res)=> {
                        if(res.data.status) {
                            let jdata = JSON.parse(res.data.data);
                            this.firstAudit.company = '';
                            this.firstAudit.departmentList.splice(0, _self.firstAudit.departmentList.length);
                            this.firstAudit.auditorList.splice(0, _self.firstAudit.auditorList.length);
                            this.tempFirstLevelAuditorsGroup.splice(0, _self.tempFirstLevelAuditorsGroup.length);
                            jdata.forEach((item)=> {
                                _self.firstAudit.auditorList.push(item);
                            })
                        }
                    })
                },
                searchSecondEmployee() {
                    let _self = this;
                    axios.post(searchEmployeeUrl, this.secondAudit.searchValue).then((res)=> {
                        if(res.data.status) {
                            let jdata = JSON.parse(res.data.data);
                            this.secondAudit.company = '';
                            this.secondAudit.departmentList.splice(0, _self.secondAudit.departmentList.length);
                            this.secondAudit.auditorList.splice(0, _self.secondAudit.auditorList.length);
                            this.tempSecondLevelAuditorsGroup.splice(0, _self.tempSecondLevelAuditorsGroup.length);
                            jdata.forEach((item)=> {
                                _self.secondAudit.auditorList.push(item);
                            })
                        }
                    })
                },
                firstChangeCompany(val) {
                    let _self = this;
                    this.firstAudit.activeDepartment = '';
                    this.firstAudit.searchValue = '';
                    this.firstAudit.activeIndex = '';
                    this.firstAudit.departmentList.splice(0, _self.firstAudit.departmentList.length);
                    this.firstAudit.auditorList.splice(0, _self.firstAudit.auditorList.length);

                    for(let i = 0, companyListLength = this.firstAudit.companyList.length; i < companyListLength; i++) {
                        if(this.firstAudit.companyList[i].value === val) {
                            this.firstAudit.companyList[i].department.forEach((dp)=> {
                                _self.firstAudit.departmentList.push(dp);
                            });
                            this.firstAudit.curCompanyVal = this.firstAudit.companyList[i].value;
                            break;
                        }
                    }
                },
                secondChangeCompany(val) {
                    let _self = this;
                    this.secondAudit.activeDepartment = '';
                    this.secondAudit.searchValue = '';
                    this.secondAudit.activeIndex = '';
                    this.secondAudit.departmentList.splice(0, _self.secondAudit.departmentList.length);
                    this.secondAudit.auditorList.splice(0, _self.secondAudit.auditorList.length);

                    for(let i = 0, companyListLength = this.secondAudit.companyList.length; i < companyListLength; i++) {
                        if(this.secondAudit.companyList[i].value === val) {
                            this.secondAudit.companyList[i].department.forEach((dp)=> {
                                _self.secondAudit.departmentList.push(dp);
                            });
                            this.secondAudit.curCompanyVal = this.secondAudit.companyList[i].value;
                            break;
                        }
                    }
                },
                firstSelectDepartment(item, i) {
                    if(this.firstAudit.activeIndex === i) return;
                    let _self = this;
                    /**
                     * 切换li的active
                     * @type {[type]}
                     */
                    this.firstAudit.activeIndex = i;
                    /**
                     * 切换当前选择部门
                     * @type {[type]}
                     */
                    this.firstAudit.activeDepartment = item.name;
                    this.firstAudit.auditorList.splice(0, _self.firstAudit.auditorList.length);

                    axios.post(getEmployeeUrl, item).then((res)=> {
                        if(res.data.status) {
                            let jdata = JSON.parse(res.data.data);
                            this.firstAudit.auditorList.splice(0, _self.firstAudit.auditorList.length);
                            jdata.forEach((item)=> {
                                _self.firstAudit.auditorList.push(item);
                            });

                            /**
                             * 遍历一级审核人员已选人员数组，改变firstAudit.audtorList[i].isSelected的值
                             * @param  {Number} let        i             [description]
                             * @param  {[type]} edAuLength [description]
                             * @return {[type]}            [description]
                             */

                            this.tempFirstLevelAuditorsGroup.forEach((item)=> {
                                for(let j = 0, auditorListLength = this.firstAudit.auditorList.length; j < auditorListLength; j++ ) {
                                    if(item.jobNumber === _self.firstAudit.auditorList[j].jobNumber) {
                                        _self.firstAudit.auditorList[j].isSelected = true;
                                    }
                                }
                            });
                        }
                    })

                },
                secondSelectDepartment(item, i) {
                    if(this.secondAudit.activeIndex === i) return;
                    let _self = this;
                    /**
                     * 切换li的active
                     * @type {[type]}
                     */
                    this.secondAudit.activeIndex = i;
                    /**
                     * 切换当前选择部门
                     * @type {[type]}
                     */
                    this.secondAudit.activeDepartment = item.name;
                    this.secondAudit.auditorList.splice(0, _self.secondAudit.auditorList.length);

                    axios.post(getEmployeeUrl, item).then((res)=> {
                        if(res.data.status) {
                            let jdata = JSON.parse(res.data.data);
                            this.secondAudit.auditorList.splice(0, _self.secondAudit.auditorList.length);
                            jdata.forEach((item)=> {
                                _self.secondAudit.auditorList.push(item);
                            })
                            this.tempSecondLevelAuditorsGroup.forEach((item)=> {
                                for(let j = 0, auditorListLength = this.secondAudit.auditorList.length; j < auditorListLength; j++ ) {
                                    if(item.jobNumber === _self.secondAudit.auditorList[j].jobNumber) {
                                        _self.secondAudit.auditorList[j].isSelected = true;
                                    }
                                }
                            });
                        }
                    })

                },
                /**
                 * 一级审核人员-切换已选择审核人员
                 * @param  {[type]} item  [description]
                 * @param  {[type]} index [description]
                 * @return {[type]}       [description]
                 */
                firstToggleSelected(item,index) {
                    let _self = this;
                    /**
                     * 改变选中审核人员isSelected布尔值
                     * @type {Boolean}
                     */
                    this.firstAudit.auditorList[index].isSelected = !this.firstAudit.auditorList[index].isSelected;
                    /**
                     * 点击被选中
                     * @param  {[type]} this.audit.auditors[index].isSelected [description]
                     * @return {[type]}                                       [description]
                     */
                    if(this.firstAudit.auditorList[index].isSelected) {
                        for(let i = 0; i < this.tempFirstLevelAuditorsGroup.length; i++ ) {
                            if(this.tempFirstLevelAuditorsGroup[i].jobNumber === this.firstAudit.auditorList[index].jobNumber) return;
                        }
                        this.tempFirstLevelAuditorsGroup.push(item);
                    /**
                     * 点击取消选中
                     * @param  {[type]} !this.audit.auditors[index].isSelected [description]
                     * @return {[type]}                                        [description]
                     */
                    }else if(!this.firstAudit.auditorList[index].isSelected){
                        for(let j = 0; j < this.tempFirstLevelAuditorsGroup.length; j++ ) {
                            if(this.tempFirstLevelAuditorsGroup[j].jobNumber === this.firstAudit.auditorList[index].jobNumber) {
                                this.tempFirstLevelAuditorsGroup.splice(j, 1);
                            };
                        }
                    }
                },
                secondToggleSelected(item,index) {
                    let _self = this;
                    /**
                     * 改变选中审核人员isSelected布尔值
                     * @type {Boolean}
                     */
                    this.secondAudit.auditorList[index].isSelected = !this.secondAudit.auditorList[index].isSelected;
                    /**
                     * 点击被选中
                     * @param  {[type]} this.audit.auditors[index].isSelected [description]
                     * @return {[type]}                                       [description]
                     */
                    if(this.secondAudit.auditorList[index].isSelected) {
                        for(let i = 0; i < this.tempSecondLevelAuditorsGroup.length; i++ ) {
                            if(this.tempSecondLevelAuditorsGroup[i].jobNumber === this.secondAudit.auditorList[index].jobNumber) return;
                        }
                        this.tempSecondLevelAuditorsGroup.push(item);
                    /**
                     * 点击取消选中
                     * @param  {[type]} !this.audit.auditors[index].isSelected [description]
                     * @return {[type]}                                        [description]
                     */
                    }else if(!this.secondAudit.auditorList[index].isSelected){
                        for(let j = 0; j < this.tempSecondLevelAuditorsGroup.length; j++ ) {
                            if(this.tempSecondLevelAuditorsGroup[j].jobNumber === this.secondAudit.auditorList[index].jobNumber) {
                                this.tempSecondLevelAuditorsGroup.splice(j, 1);
                            };
                        }
                    }
                },
                /**
                 * 新增-点击保存-选择审核人员流程
                 */
                confirmSelectFirstAuditors() {
                    let _self = this
                    ,arr = [];
                    this.editForm.firstLevelAuditorsGroup.splice(0, _self.editForm.firstLevelAuditorsGroup.length);

                    this.tempFirstLevelAuditorsGroup.forEach((item)=> {
                        for(let i = 0; i < _self.editForm.firstLevelAuditorsGroup.length; i++ ) {
                            if(_self.editForm.firstLevelAuditorsGroup[i].jobNumber === item.jobNumber) {
                                return;
                            }
                        }
                        _self.editForm.firstLevelAuditorsGroup.push(item);
                    });
                    this.dialogSelectFirstAuditVisible = false;
                },
                confirmSelectSecondAuditors() {
                    let _self = this;
                    this.editForm.secondLevelAuditorsGroup.splice(0, _self.editForm.secondLevelAuditorsGroup.length);
                    this.tempSecondLevelAuditorsGroup.forEach((item)=> {
                        for(let i = 0; i < _self.editForm.secondLevelAuditorsGroup.length; i++ ) {
                            if(_self.editForm.secondLevelAuditorsGroup[i].jobNumber === item.jobNumber) {
                                return;
                            }
                        }
                        _self.editForm.secondLevelAuditorsGroup.push(item);
                    });
                    this.dialogSelectSecondAuditVisible = false;
                },
                closeFirstLevelTag(tag) {
                    let _self = this;
                    for(let i = 0, companyLength = this.firstAudit.companyList.length; i < companyLength; i++) {
                        if(this.firstAudit.companyList[i].value === tag.company) {
                            for(let j = 0, departmentLength = _self.firstAudit.departmentList.length; j < departmentLength; j++) {
                                if(this.firstAudit.departmentList[j].value === tag.department) {
                                    for(let k = 0, auditorLength = this.firstAudit.auditorList.length; k < auditorLength; k++ ) {
                                        if(this.firstAudit.auditorList[k] === tag) {
                                            this.firstAudit.auditorList[k].isSelected = false;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.editForm.firstLevelAuditorsGroup.splice(this.editForm.firstLevelAuditorsGroup.indexOf(tag), 1);
                    this.tempFirstLevelAuditorsGroup.splice(this.tempFirstLevelAuditorsGroup.indexOf(tag), 1);
                },
                closeSecondLevelTag(tag) {
                    let _self = this;
                    for(let i = 0, companyLength = this.secondAudit.companyList.length; i < companyLength; i++) {
                        if(this.secondAudit.companyList[i].value === tag.company) {
                            for(let j = 0, departmentLength = _self.secondAudit.departmentList.length; j < departmentLength; j++) {
                                if(this.secondAudit.departmentList[j].value === tag.department) {
                                    for(let k = 0, auditorLength = this.secondAudit.auditorList.length; k < auditorLength; k++ ) {
                                        if(this.secondAudit.auditorList[k] === tag) {
                                            this.secondAudit.auditorList[k].isSelected = false;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.editForm.secondLevelAuditorsGroup.splice(this.editForm.secondLevelAuditorsGroup.indexOf(tag), 1);
                    this.tempSecondLevelAuditorsGroup.splice(this.tempSecondLevelAuditorsGroup.indexOf(tag), 1);
                },
                handleStartUsing(index, row) {
                    axios.post(handleStartUsingUrl, row).then((res)=> {
                        this.loading = true;
                        if(res.data.status) {
                            this.$message({
                                type: 'success',
                                message: res.data.message
                            })
                            this.loading = false;
                        }
                    }).catch((err)=> {
                        console.log('err: ', err);
                    })
                },
                cancelFirstAudit(item) {
                    let _self = this;
                    for(let i = 0; i < this.tempFirstLevelAuditorsGroup.length; i++ ) {
                        if(this.tempFirstLevelAuditorsGroup[i].jobNumber === item.jobNumber) {
                            this.tempFirstLevelAuditorsGroup.splice(i, 1);
                        }
                    }
                    for(let j = 0; j < this.firstAudit.auditorList.length; j++ ) {
                        if(this.firstAudit.auditorList[j].jobNumber === item.jobNumber) {
                            this.firstAudit.auditorList[j].isSelected = false;
                        }
                    }
                },
                cancelSecondAudit(item) {
                    let _self = this;
                    for(let i = 0; i < this.tempSecondLevelAuditorsGroup.length; i++ ) {
                        if(this.tempSecondLevelAuditorsGroup[i].jobNumber === item.jobNumber) {
                            this.tempSecondLevelAuditorsGroup.splice(i, 1);
                        }
                    }
                    for(let j = 0; j < this.secondAudit.auditorList.length; j++ ) {
                        if(this.secondAudit.auditorList[j].jobNumber === item.jobNumber) {
                            this.secondAudit.auditorList[j].isSelected = false;
                        }
                    }
                }
            },
            filters: {
                auditorFilter(arr) {
                    let str = arr.join('，');
                    return str;
                }
            },
            watch: {
                'editForm.firstLevelAuditorsGroup'(arr) {
                    let _self = this;
                    for(let i = 0; i < arr.length; i++) {
                        if(arr[i].isBoss) {
                            _self.firstLeveAuditHasBoss = true;
                            _self.editForm.bosses.splice(0, _self.editForm.bosses.length);
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
                                _self.editForm.bosses.splice(0, _self.editForm.bosses.length);
                                return;
                            }
                        }
                        _self.secondLeveAuditHasBoss = false;
                    }
                }
            }
        })
    }

    that.init = (getDataUrl, getEditDataUrl, saveEditDataUrl, examineUrl, handleStartUsingUrl, searchEmployeeUrl, getEmployeeUrl)=> {
        _this.init(getDataUrl, getEditDataUrl, saveEditDataUrl, examineUrl, handleStartUsingUrl, searchEmployeeUrl, getEmployeeUrl);
    }
    return that;
}
