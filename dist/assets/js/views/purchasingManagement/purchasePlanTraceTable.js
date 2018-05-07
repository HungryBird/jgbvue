JGBVue = {
	module: {}
};

JGBVue.module.purchasePlanTraceTable = ()=> {
	let _this = {}
	,that = {};

	_this.init = (searchUrl, defaultColumnSettingUrl, columnSettingCompleteUrl, dataExportRequestUrl)=> {
		that.vm = new Vue({
			el: '#app',
			data() {
				return {
					headerForm: {	//头部搜索表单
						date: [],
						expecDate: '',
						storageStatus: [],
						more: false,
						supplier: '',
						commodity: '',
						orderNumber: '',
						supplierCategory: ''
					},
					time: {
						start: '',
						end: ''
					},	//显示时间
					headerOption: {  //头部下拉选择
						supplier: [],
						commodity: [],
						orderNumber: [],
						supplierCategory: []
					},
					formRules: {},  //验证规则
					storageStatus: [  //头部多选
						{
							value: "all",
							label: "全部"
						},
						{
							value: "unstorage",
							label: "未入库"
						},
						{
							value: "Part",
							label: "部分入库"
						},
						{
							value: "allStorage",
							label: "全部入库"
						}
					],
					table: {  //表单数据
						header: [],
						data: []
					},
					showColumnSetting: false,  //列设置显示
					showExport: false, //导出显示
					exportChecked: [], //导出选中项 *所有可选项与tableHeader关联
					isLoadingExportRequest: false,
					pageSize: 20,
					currentPage: 1,
				}
			},
			mounted() {
				this.getTime();
				this.getOption();
				this.search();
			},
			methods: {
				search() {
					axios.post(searchUrl, this.headerForm).then((res)=> {
						if(res.data.status) {
							this.time.start = this.headerForm.date[0];
							this.time.end = this.headerForm.date[1];
							let jdata = JSON.parse(res.data.data);
							this.table.header = jdata.header;
							this.table.data = jdata.data;
						}
					})
				},
				getOption() {
					//
				},
				getTime() {
					let date = new Date()
					,curMonth = date.getMonth() + 1
					,firstDate = date.getFullYear() + '-' + (curMonth > 10 ? curMonth : '0' + curMonth) + '-01'
					,curDate = this.$timeStampFormat(date.getTime()/1000);
					this.headerForm.date.push(firstDate, curDate);
				},
				btnColumnSettingReset() {
					axios.post(defaultColumnSettingUrl).then(res=> {
						if(res.data.status) {
							this.table.header= [];
							this.table.header = JSON.parse(res.data.data)
							this.$message({
								type: 'success',
								message: res.data.message
							})
							this.showColumnSetting = false;
						} else {
							this.$message({
								type: 'error',
								message: res.data.status,
								center: true
							})
						};
					}).catch((err)=> {
						console.log(err)
						this.$message({
							type: 'error',
							message: err,
							center: true
						})
					})
				},
				btnColumnSettingComplete() {
					axios.post(columnSettingCompleteUrl, this.table.header).then(res=> {
						if(res.data.status) {
							this.$message({
								type: 'success',
								message: res.data.message
							});
							this.showColumnSetting = false;
						} else {
							this.$message({
								type: 'error',
								message: res.data.status,
								center: true
							})
						};
					}).catch((err)=> {
						console.log(err)
						this.$message({
							type: 'error',
							message: err,
							center: true
						})
					})
				},
				btnExportSave() {
					this.isLoadingExportRequest = true
					axios.post(dataExportRequestUrl, {
						export_checked: this.exportChecked
					}).then(res=> {
						if(res.data.status) {
							//调用下载
							this.showExport = false
						} else {
							this.$message({
								type: 'error',
								message: res.data.message,
								center: true
							})
						};
						this.isLoadingExportRequest = false
					}).catch((err)=> {
						this.$message({
							type: 'error',
							message: err,
							center: true
						})
						this.isLoadingExportRequest = false
					})
				},
				btnExportClose() {
					this.showExport = false;
				},
				btnPrintList() {
					this.$selectTab(
			            'printPurchasePlanTraceTable', 
			            '打印采购计划单跟踪表', 
			            './views/purchasingManagement/printPurchasePlanTraceTable.html', 
			            //`order_id=${}`
		            )
				},
				handleSizeChange() {
					//当前页面size改变时
				},
				handleCurrentChange() {
					//翻页时
				},
			},
			filters: {
				dateChinese: function(val) {
					let arr = val.split('-')
					return `${arr[0]}年${Number(arr[1])}月${Number(arr[2])}日`
				},
				fiterStatus(val) {
					if(val === -1) {
						return '未入库'
					} else if(val === 0) {
						return '部分入库'
					} else {
						return '全部入库'
					}
				}
			}
		})
	}

	that.init = (searchUrl, defaultColumnSettingUrl, columnSettingCompleteUrl, dataExportRequestUrl)=> {
		_this.init(searchUrl, defaultColumnSettingUrl, columnSettingCompleteUrl, dataExportRequestUrl);
	}

	return that;
};