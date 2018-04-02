new Vue({
	el: '#app',
	data: {
		data: null
	},
	mounted() {
		axios.get('/settlementNAntiSettlement/data_get').then((req)=> {
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
		settlement() {
			//
		},
		antiSettlement() {
			//
		},
		objectSpanMethod({ row, column, rowIndex, columnIndex }) {
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
		},
		changeDate(val) {
			console.log('changeDate', val);
		},
		handleSizeChange() {
			//
		},
		handleCurrentChange() {
			//
		}
	},
	filters: {
		filterDate(val) {
			let oDate = new Date(val*1000)
			,month = oDate.getMonth() + 1
			,day = oDate.getDate()
			,year = oDate.getFullYear();

			if(day.length < 10) {
				day = '0' + day;
			}
			if(month.length < 10) {
				month = '0' + month;
			}
			return year + '-' + month + '-' + day;
		},
		filterDate_time(val) {
			let oDate = new Date(val*1000)
			,month = oDate.getMonth() + 1
			,day = oDate.getDate()
			,year = oDate.getFullYear()
			,hour = oDate.getHours()
			,minute = oDate.getMinutes()
			,second = oDate.getSeconds();
			
			if(day < 10) {
				day = '0' + day;
			}
			if(month < 10) {
				month = '0' + month;
			}
			if(hour < 10) {
				hour = '0' + hour;
			}
			if(minute < 10) {
				minute = '0' + minute;
			}
			if(second < 10) {
				second = '0' + second;
			}
			return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
		}
	}
})