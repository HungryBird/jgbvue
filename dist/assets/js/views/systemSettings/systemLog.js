new Vue({
	el: '#app',
	data: {
		selectLook: {
			optionVal: {
				label: '全部日志',
				value: 'all'
			},
			options: [
				{
					value: 'all',
					label: '全部日志'
				},
				{
					value: '3months',
					label: '近3个月'
				},
				{
					value: '1month',
					label: '近1个月'
				},
				{
					value: '7days',
					label: '近7天'
				},
				{
					value: 'today',
					label: '今天'
				}
			]
		},
		selectClear: {
			optionVal: {
				label: '近7天',
				value: '7days'
			},
			options: [
				{
					value: '7days',
					label: '近7天'
				},
				{
					value: '1month',
					label: '近1个月'
				},
				{
					value: '3months',
					label: '近3个月'
				}
			],
			curSelectValue: ''
		},
		dateValue: '',
		searchValue: '',
		logTable: [
			{
				date: '',
				user: '',
				name: '',
				IPAddress: '',
				sysFunction: '',
				operationType: '',
				executeResult: '',
				executeResultDescribe: ''
			},
			{
				date: '',
				user: '',
				name: '',
				IPAddress: '',
				sysFunction: '',
				operationType: '',
				executeResult: '',
				executeResultDescribe: ''
			}
		],
		selectedArr: [],
		deleteLogDialog: {
			checked: true,
			visible: false
		},
		currentPage: 1,

	},
	mounted: function() {
		this.selectClear.curSelectValue = this.selectClear.options[0].value;
		axios.get('/systemLog/data_get_all').then((data)=> {
			if(data.data.status) {
				let jdata = JSON.parse(data.data.message);
				this.logTable = jdata;
			}else{
				console.log('data get err: ', err);
			}

		}).catch((err)=> {
			console.log('get systemLog_data_all error: ', err);
		})
	},
	methods: {
		deleteLog() {
			this.deleteLogDialog.visible = true;
		},
		signOut() {
			//pass
		},
		onSubmit() {
			var _self = this;
			axios.post('/systemLog/data_delete').then(function(req) {
				if(req.data.status) {
					_self.$message({
						message: req.data.message,
						type: 'success'
					})
				}else{
					_self.$message({
						message: req.data.message,
						type: 'error'
					})
				}
			})
			if(_self.deleteLogDialog.checked) {
				_self.deleteLogDialog.visible = false;
			}
		},
		curSelect(item) {
			this.selectClear.curSelectValue
			console.log('item', item);
		},
		handleSizeChange() {
			//pass
		},
		handleCurrentChange() {
			//pass
		},
		search() {
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
		}
	}
})