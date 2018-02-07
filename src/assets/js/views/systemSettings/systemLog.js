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
					value: 'login',
					label: '登陆'
				},
				{
					value: 'visit',
					label: '访问'
				},
				{
					value: 'operation',
					label: '操作'
				},
				{
					value: 'error',
					label: '异常'
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
		/**
		 * 搜索的值
		 * 日期
		 * 输入值
		 * @type {Object}
		 */
		searchForm: {
			dateValue: '',
			searchValue: '',
		},
		logTable: [],
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
		changeDate(val) {
			/**
			 * val == option.value
			 */
			if(val == 'all') {
				axios.post('/systemLog/data_get_all', val).then((data)=> {
					if(data.data.status) {
						let jdata = JSON.parse(data.data.message);
						this.logTable = jdata;
					}else{
						this.$message({
							type: 'error',
							message: data.data.message
						})
					}
				})
			}else{
				axios.post('/systemLog/data_get_other', val).then((data)=> {
					if(data.data.status) {
						let jdata = JSON.parse(data.data.message);
						this.logTable = jdata;
					}else{
						this.$message({
							type: 'error',
							message: data.data.message
						})
					}
				})
			}
		},
		curSelect(item) {
			this.selectClear.curSelectValue;
		},
		handleSizeChange() {
			//pass
		},
		handleCurrentChange() {
			//pass
		},
		search() {
			axios.post('/systemLog/data_search', this.searchForm).then((data)=> {
				if(data.data.status) {
					let jdata = JSON.parse(data.data.message);
					this.logTable = jdata;
				}else{
					this.$message({
						type: 'error',
						message: data.data.message
					})
				}
			})
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
		executeResultFilter(val) {
			if(val === 'success') {
				return '成功'
			}else if(val === 'false') {
				return '失败'
			}
		}
	}
})