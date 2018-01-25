/**
 * Created by Segotep on 2018/1/25.
 */
new Vue({
    el: '#app',
    data: {
        data: null
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
        objectSpanMethod() {
            let _self = this;
            if(columnIndex == 3) {
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