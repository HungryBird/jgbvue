/**
 * Created by Segotep on 2018/1/25.
 */

JGBVue = {
    module: {}
};

JGBVue.module.printTemplate = ()=> {
    let _this = {}
    ,that = {};

    _this.init = ()=> {
        new Vue({
            el: '#app',
            data: {
                /**
                 * [data 获取的数据]
                 * @type {[type]}
                 */
                data: [],
                dialogLoadVisible: false,
                dialogAddVisible: false,
                /**
                 * [form 要提交的数据]
                 * @type {Object}
                 */
                form: {
                    templateType: '',
                    fileList: [],
                    name: '',
                    describe: '',
                    coding: '',
                    usingDefaultTemplate: false
                },
                upload: {
                    status: false,
                    message: ''
                },
                selectedRows: []
            },
            mounted() {
                axios.get('/printTemplate/data_get').then((req)=> {
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
                load() {
                    this.dialogLoadVisible = true;
                },
                saveLoad() {
                    let _self = this;
                    axios.post('/printTemplate/data_load_save', this.form).then((data)=> {
                        this.$refs.upload.submit();
                        if(data.data.status) {
                            _self.dialogLoadVisible = false;
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
                remove() {
                    let _self = this;
                    this.$confirm('确定删除?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        beforeClose: function(action, instance, done) {
                            done(action);
                        }
                    }).then((action) => {
                        if(action == 'confirm') {
                            axios.post('/printTemplate/data_delete', _self.selectedRows).then(function(req) {
                                if(req.data.status) {
                                    //替换selectedRows的数据
                                    _self.$message({
                                        type: 'success',
                                        message: req.data.message
                                    });
                                };
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
                    //
                },
                handleCurrentChange() {
                    //
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
                    this.$refs.printtable.toggleRowSelection(row);
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
                }
            },
            filters: {
                usingStatus(val) {
                    return val ? '是' : '否';
                }
            }
        });
    }

    that.init = ()=> {
        _this.init();
    }

    return that;
}