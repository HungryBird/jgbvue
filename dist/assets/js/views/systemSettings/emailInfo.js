JGBVue = {
	module: {}
};

JGBVue.module.emailInfo = ()=> {
	let _this = {}
	,that = {};

	_this.init = (dataGetUrl, dataSaveUrl)=> {
		new Vue({
			el: '#app',
			data: {
				formData: {
					STMPServer: '',
					usingSSL: false,
					SMTPPort: 0,
					postmanAddress: '',
					emailAccount: '',
					emailPassword: '',
					nickname: '',
					usingSysDefaultMethod: false
				},
				rules: {
					STMPServer: [
						{required: true, message: 'SMTP服务器不能为空'}
					],
					SMTPPort: [
						{required: true, message: 'SMTPPort不能为空'}
					],
					postmanAddress: [
						{required: true, message: '发件人地址不能为空'}
					],
					emailAccount: [
						{required: true, message: '邮箱账号不能为空'}
					],
					emailPassword: [
						{required: true, message: '邮箱密码不能为空'}
					],
					nickname: [
						{required: true, message: '发件人昵称不能为空'}
					]
				}
			},
			mounted() {
				let _self = this;
				axios.post(dataGetUrl).then((req)=> {
					if(req.data.status) {
						let jdata = JSON.parse(req.data.message)
						_self.formData = jdata;
					}
				})
			},
			methods: {
				save() {
					let _self = this;
					this.$refs.emailForm.validate((validate)=> {
						if(!validate) return;
						axios.post(dataSaveUrl).then((req)=> {
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
				},
				switchChange(val) {
					this.formData.usingSSL = val;
				}
			}
		});
	}

	that.init = (dataGetUrl, dataSaveUrl)=> {
		_this.init(dataGetUrl, dataSaveUrl);
	}

	return that;
}