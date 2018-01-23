'use strict';

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
	mounted: function mounted() {
		var _self = this;
		axios.post('/emailInfo/data_get').then(function (req) {
			if (req.data.status) {
				var jdata = JSON.parse(req.data.message);
				_self.formData.serverAddress = jdata.serverAddress;
				_self.formData.using = jdata.using;
				_self.formData.port = jdata.port;
				_self.formData.postmanAddress = jdata.postmanAddress;
				_self.formData.emailAccount = jdata.emailAccount;
				_self.formData.password = jdata.password;
				_self.formData.nickname = jdata.nickname;
			}
		});
	},

	methods: {
		save: function save() {
			var _this = this;

			var _self = this;
			axios.post('/emailInfo/data_save').then(function (req) {
				if (req.data.status) {
					_this.$message({
						type: 'success',
						message: req.data.message
					});
				} else {
					_this.$message({
						type: 'error',
						message: req.data.message
					});
				}
			}).catch(function (err) {
				_this.$message({
					type: 'error',
					message: err
				});
			});
		},
		switchChange: function switchChange(val) {
			console.log(11);
			this.formData.using = val;
		}
	}
});