/**
 * [JGBVue description]
 * @type {Object}
 */
JGBVue = {
	module: {}
};

JGBVue.module.phoneInfo = ()=> {
	let _this = {}
	,that = {};

	_this.init = (getDataUrl, saveDataUrl)=> {
		new Vue({
			el: '#app',
			data: {
				formData: {
					messageNumber: 0,
					address: '',
					account: '',
					passKey: '',
					usingSysDefaultMethod: false
				},
				rules: {
					address: [
						{ required: true, message: '短信API地址不能为空' }
					],
					account: [
						{ required: true, message: '平台登陆账户不能为空' }
					],
					平台通讯密匙: [
						{ required: true, message: '平台通讯密匙不能为空' }
					]
				}
			},
			mounted() {
				let _self = this;
				axios.post(getDataUrl).then((req)=> {
					if(req.data.status) {
						let jdata = JSON.parse(req.data.message)
						_self.formData = jdata;
					}
				})
			},
			methods: {
				save() {
					this.$refs.PIForm.validate((validate)=> {
						if(!validate) return;
						axios.post(saveDataUrl).then((req)=> {
							if(req.data.status) {
								this.$message({
									type: 'success',
									message: req.data.message
								})
							}else{
								this.$message({
									type: 'error',
									message: req.data.message
								})
							}
						}).catch((err)=> {
							this.$message({
								type: 'error',
								message: err
							})
						});
					})
				}
			}
		});
	}

	that.init = (getDataUrl, saveDataUrl)=> {
		_this.init(getDataUrl, saveDataUrl);
	}

	return that;
}