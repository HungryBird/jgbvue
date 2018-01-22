new Vue({
	el: '#app',
	data: {
		formData: {
			serverAddress: '',
			using: false,
			port: 0,
			postmanAddress: '',
			emailAccount: '',
			password: '',
			nickname: ''
		}
	},
	mounted() {
		let _self = this;
		axios.post('/emailInfo/data_get').then((req)=> {
			if(req.data.status) {
				let jdata = JSON.parse(req.data.message)
				_self.formData.serverAddress = jdata.serverAddress;
				_self.formData.using = jdata.using;
				_self.formData.port = jdata.port;
				_self.formData.postmanAddress = jdata.postmanAddress;
				_self.formData.emailAccount = jdata.emailAccount;
				_self.formData.password = jdata.password;
				_self.formData.nickname = jdata.nickname;
			}
		})
	},
	methods: {
		save() {
			let _self = this;
			axios.post('/emailInfo/data_save').then((req)=> {
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
		},
		switchChange(val) {
			this.formData.using = val;
		}
	}
})