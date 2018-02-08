JGBVue = {
	module: {}
};

JGBVue.module.systemLog = ()=> {
	const _this = {}
	,that = {};

	_this.init = (dataGetAllUrl, dataDeteleUrl, dataGetOtherUrl, dataGetSearchUrl, dataGetCurrentUrl, dataGetSize, dataExportUrl)=> {
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
				exportForm: [],
				exportLogDialog: {
					checked: true,
					visible: false
				}
			},
			mounted: function() {
				this.selectClear.curSelectValue = this.selectClear.options[0].value;
				axios.get(dataGetAllUrl).then((data)=> {
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
					axios.post(dataDeteleUrl).then(function(req) {
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
						axios.post(dataGetAllUrl, val).then((data)=> {
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
						axios.post(dataGetOtherUrl, val).then((data)=> {
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
				handleSizeChange(size) {
					axios.post(dataGetSize, size).then((data)=> {
						if(data.data.status) {
							let jdata = JSON.parse(data.data.message);
							this.logTable = jdata;
						}else{
							console.log('err:', data.data.message);
						}
					})
				},
				handleCurrentChange(number) {
					axios.post(dataGetCurrentUrl, number).then((data)=> {
						if(data.data.status) {
							let jdata = JSON.parse(data.data.message);
							this.logTable = jdata;
						}else{
							console.log('err:', data.data.message);
						}
					})
				},
				search() {
					axios.post(dataGetSearchUrl, this.searchForm).then((data)=> {
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
				},
				exportLog() {
					let _self = this;
					if(this.exportForm.length === 0) {
						this.$message({
							type: 'error',
							message: '请至少选择一个要导出的类型'
						});
						return;
					}
					axios.post(dataExportUrl, this.exportForm).then((data)=> {
						if(data.data.status) {
							_self.exportLogDialog.visible = false;
						}else{
							console.log('err: ', data.data.message);
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
		});
	}

	that.init = (dataGetAllUrl, dataDeteleUrl, dataGetOtherUrl, dataGetSearchUrl, dataGetCurrentUrl, dataGetSize, dataExportUrl)=> {
		_this.init(dataGetAllUrl, dataDeteleUrl, dataGetOtherUrl, dataGetSearchUrl, dataGetCurrentUrl, dataGetSize, dataExportUrl);
	}
	return that;
}