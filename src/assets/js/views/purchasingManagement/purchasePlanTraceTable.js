JGBVue = {
	module: {}
};

JGBVue.module.purchasePlanTraceTable = ()=> {
	let _this = {}
	,that = {};

	_this.init = (searchUrl)=> {
		that.vm = new Vue({
			el: '#app',
			data() {
				return {
					headerForm: {	//头部搜索表单
						date: '',
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
				}
			},
			mounted() {
				this.search();
				this.getTime();
			},
			methods: {
				search() {
					console.log(this.headerForm)
					axios.get(searchUrl, this.headerForm).then((res)=> {
						/*if(res.data.status) {

						}*/
					})
				},
				getTime() {
					let date = new Date();
					nowDate = date.getFullYear() + '-' + ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1))+ '-' + (date.getDate() > 9 ? date.getDate() : '0' + date.getDate());
					console.log(nowDate)
					this.headerForm.date = ['2008-12-27', '2099-11-21']
				},
				btnColumnSettingReset() {
					//
				},
				btnColumnSettingComplete() {
					//
				},
				test(val) {
					console.log('val: ', val)
				}
			},
			filters: {
				dateChinese: function(val) {
					let arr = val.split('-')
					return `${arr[0]}年${Number(arr[1])}月${Number(arr[2])}日`
				},
			}
		})
	}

	that.init = (searchUrl)=> {
		_this.init(searchUrl);
	}

	return that;
};