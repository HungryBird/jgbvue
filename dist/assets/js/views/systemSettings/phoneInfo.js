new Vue({
	el: '#app',
	data: {
		formData: {
			messageNumber: 0,
			address: '',
			account: '',
			passKey: ''
		}
	},
	mounted() {
		let _self = this;
		axios.post('/phoneInfo/data_get_data').then((req)=> {
			if(req.data.status) {
				let jdata = JSON.parse(req.data.message)
				_self.formData.messageNumber = jdata.messageNumber;
				_self.formData.address = jdata.address;
				_self.formData.account = jdata.account;
				_self.formData.passKey = jdata.passKey;
			}
		})
	},
	methods: {
		save() {
			let _self = this;
			this.$confirm('确认保存设置？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				before: function(action, instance, done) {
					done(action);
				}
			}).then((action)=> {
				if(action == 'confirm') {
					axios.post('/phoneInfo/data_save').then((req)=> {
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
				}
			}).catch(()=> {
				this.$message({
					type: 'info',
					message: '已取消'
				})
			})
		}
	}
})