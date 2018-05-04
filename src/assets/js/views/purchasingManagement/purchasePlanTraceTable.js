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
					time: '',	//显示时间
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
				//this.search();
			},
			methods: {
				search() {
					axios.get(searchUrl, this.headerForm).then((res)=> {
						if(res.data.status) {

						}
					})
				},
				btnColumnSettingReset() {
					//
				},
				btnColumnSettingComplete() {
					//
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