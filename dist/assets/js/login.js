JGBVue = {
	module: {}
};

JGBVue.module.login = ()=> {
	let _this = {}
	,that = {};

	that.score = 0;

	_this.init = ()=> {
		that.a = 1;
		that.vm = new Vue({
			el: '#app',
			data: {
				logo: './assets/img/common/logo.png',
				backPic: './assets/img/login/bg_1.jpg',
				vcodeImg: './assets/img/login/yzm.jpg',
				ruleForm: {
					user: '',
					pass: '',
					vcode: ''
				},
				rules: {
					user: [
						{ required: true, message: '请填写用户名！', trigger: 'blur' }
					],
					pass: [
						{ required: true, message: '请填写密码！', trigger: 'blur' }
					],
					vcode: [
						{ required: true, message: '请填写验证码！', trigger: 'blur' }
					]
				}
			},
			methods: {
				alertAdminPhone() {
					this.$alert('手机号码： xxx-xxxx-xxxx', '请联系管理员', {
						confirmButtonText: '确定'
					});
				},
				tabInput(ev) {
					if(ev.keyCode === 9) {
						//
					}
				},
				login() {
					var _self = this;
					this.$refs.ruleForm.validate((valid) => {
						if (!valid) return;
						/**
						 * axios发送数据
						 * @param  {[type]} '/user/login'  [模拟接口]
						 * @param  {[type]} _self.ruleForm [发送的数据]
						 * @param  {[type]} (req,          res           [req回调数据]
						 * @return {[type]}                [description]
						 */
						axios.post('/user/login', _self.ruleForm).then((req)=> {
							if(req.data.status) {
								location.assign('./index.html');
							}else{
								_self.$message({
									type: 'error',
									message: req.data.message
								})
							}
						})
					})
				},
				test() {
					console.log('test');
				}
			}
		});
	}

	that.init = ()=> {
		_this.init();
		console.log('js_that', that);
	}

	return that;
}