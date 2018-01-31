/**
 * Created by Segotep on 2018/1/25.
 */
new Vue({
    el: '#app',
    data: {
        /**
         * [data 获取的数据]
         * @type {[type]}
         */
        data: null,
        dialogFormVisible: true,
        /**
         * [form 要提交的数据]
         * @type {Object}
         */
        form: {
            selectSysModule: '',
            checked: false,
            firstLevelAuditorsGroup: [],
            secondLevelAuditorsGroup: [],
            bosses: [],
            auditWay: '',
            multiplayerAuditMethod: []
        },
        levelSelected: '',
        selectProcessLevel: null,
        bossesSelected: true,
        selectedRows: [],
        dialogEditVisible: false
    },
    mounted() {
        axios.get('/auditProcess/data_get').then((req)=> {
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
            this.dialogFormVisible = true;
        },
        saveAdd() {
            let _self = this;
            axios.post('/auditProcess/data_save', this.form).then((data)=> {
                console.log('data', data.data);
                if(data.data.status) {
                    _self.dialogFormVisible = false;
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
        },
        edit() {
            let _self = this;
            /*axios.post('/auditProcess/data_edit', this.selectedRows).then((data)=> {
                if(data.data.status) {
                    _self.
                }
            })*/
            console.log('data', this.selectedRows);
        },
        remove() {
            //
        },
        handleSizeChange() {
            //
        },
        handleCurrentChange() {
            //
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            let _self = this;
            if(columnIndex == 6) {
                return {
                    rowspan: _self.data.table.length,
                    colspan: 1
                }
            }
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
        changeModule() {
            this.form.checked = false;
        },
        changeLevel(val) {
            console.log('val', val);
            this.selectProcessLevel = val;
            this.form.firstLevelAuditorsGroup.splice(0, this.form.firstLevelAuditorsGroup.length);
            this.form.secondLevelAuditorsGroup.splice(0, this.form.secondLevelAuditorsGroup.length);
        }
    },
    filters: {
        auditorFilter(arr) {
            let str = arr.join('，');
            return str;
        }
    },
    watch: {
        'form.firstLevelAuditorsGroup'(arr) {
            let _self = this;
            let isKeeping = true;
            console.log('this.selectProcessLevel', this.selectProcessLevel);
            if(this.selectProcessLevel === 2) {
                if(_self.form.secondLevelAuditorsGroup != 0) {
                    for(let i = 0; i < _self.form.secondLevelAuditorsGroup; i++) {
                        if(_self.form.secondLevelAuditorsGroup[i] > 1000) {
                            _self.bossesSelected = true;
                            isKeeping = false;
                            return;
                        }
                    }
                }
                if(arr.length != 0 && isKeeping) {
                    for(let j = 0; j < arr.length; j++) {
                        if(arr[j] > 1000) {
                            _self.bossesSelected = true;
                            return;
                        }
                    }
                    _self.bossesSelected = false;
                }
            }
            if(this.selectProcessLevel === 1) {
                if(arr.length != 0) {
                    for(let j = 0; j < arr.length; j++) {
                        if(arr[j] > 1000) {
                            _self.bossesSelected = true;
                            return;
                        }
                    }
                    _self.bossesSelected = false;
                }
            }
        },
        'form.secondLevelAuditorsGroup'(arr) {
            let _self = this;
            if(arr.length != 0) {
                if(_self.form.firstLevelAuditorsGroup != 0) {
                    for(let i = 0; i < arr.length; i++) {
                        if(arr[i] > 1000) {
                            _self.bossesSelected = true;
                            return;
                        }
                    }
                    _self.bossesSelected = false;
                }
            }
        }
    }
})