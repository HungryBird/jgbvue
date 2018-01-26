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
        dialogFormVisible: false,
        /**
         * [form 要提交的数据]
         * @type {Object}
         */
        form: {
            selectSysModule: '',
            selectProcessLevel: '',
            firstLevelAuditorsGroup: [],
            secondLevelAuditorsGroup: [],
            auditWay: '',
            multiplayerAuditMethod: []
        }
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
            this.form.selectSysModule = this.data.sysModuleOptions[0].label;
            this.form.selectProcessLevel = this.data.processLevelOptions[0].label;
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
            //
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
        }
    }
})