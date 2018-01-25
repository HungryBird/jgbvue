/**
 * Created by Segotep on 2018/1/25.
 */
new Vue({
    el: '#app',
    data: {
        data: null,
        dialogFormVisible: {
            visible: true
        },
        form: {
            selectProcessLevel: '',
            firstLevelAuditors: ['王某', '李某'],
            firstLevelAuditorsGroup: [],
            secondLevelAuditors: ['赵某'],
            secondLevelAuditorsGroup: [],
            auditWay: '',
            type: []
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
            //
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