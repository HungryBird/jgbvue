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
				date: '2016-08-10',
				user: '007AAA',
				name: '赵某',
				IPAddress: '222.216.18.129',
				sysFunction: '某功能',
				operationType: '登陆',
				executeResult: '成功',
				executeResultDescribe: '登陆成功'
			},
			{
				date: '2016-08-11',
				user: '007AAB',
				name: '李某',
				IPAddress: '222.216.18.130',
				sysFunction: '某功能',
				operationType: '登陆',
				executeResult: '成功',
				executeResultDescribe: '登陆成功'
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

	}
})