'use strict';

new Vue({
	el: '#app',
	data: {
		table: null,
		uploadDialog: {
			visible: false,
			fileList: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }, { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }]
		},
		timingDialog: {
			visible: false
		}
	},
	mounted: function mounted() {
		var _self = this;
		axios.get('/FBackup/get_table_data').then(function (data) {
			_self.table = JSON.parse(data.data.message);
		}).catch(function (err) {
			console.log('err:', err);
		});
	},

	methods: {
		start: function start() {
			var _this = this;

			var _self = this;
			this.$confirm('为保证备份数据的完整性，请确保帐套里的其他用户已经退出系统。确认执行备份？', '开始备份', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(function () {
				axios.get('/FBackup/backup').then(function (data) {
					if (data.data.status) {
						_self.$message({
							type: 'success',
							message: data.data.message
						});
						done();
					} else {
						done(false);
					}
				});
			}).catch(function () {
				_this.$message({
					type: 'info',
					message: '已取消'
				});
			});
		},
		upload: function upload() {
			this.uploadDialog.visible = true;
		},
		handleSuccess: function handleSuccess(res, file, fileList) {
			var _self = this;
			if (res.status) {
				_self.$message.success(res.message);
				_self.uploadDialog.fileList.splice(0, _self.uploadDialog.fileList.length);
				_self.uploadDialog.visible = false;
			} else {
				_self.$message.error(res.message);
			}
		},
		submitUpload: function submitUpload() {
			this.$refs.upload.submit();
		},
		recover: function recover() {
			//
		},
		download: function download() {
			//
		},
		deleteData: function deleteData() {
			//
		},
		timing: function timing() {
			this.timingDialog.visible = true;
			axios.get('/FBackup/getTiming').then(function (data) {
				console.log('get data', data.data);
			});
		},
		submitTiming: function submitTiming() {
			var _this2 = this;

			var _self = this;
			var obj = {};
			obj.checked = _self.timingDialog.checked;
			obj.time = _self.timingDialog.time;
			axios.post('/FBackup/setTiming', obj).then(function (data) {
				if (data.data.status) {
					_this2.$message({
						type: 'success',
						message: data.data.message
					});
					_this2.timingDialog.visible = false;
				}
			}).catch(function (err) {
				_this2.$message.error(err);
			});
		},

		rowClick: rowClick
	},
	filters: {
		parseDate: function parseDate(date) {
			var oDate = new Date(date * 1000);
			month = oDate.getMonth() + 1;
			day = oDate.getDate();
			year = oDate.getFullYear();
			if (day.length < 10) {
				day = '0' + day;
			}
			if (month.length < 10) {
				month = '0' + month;
			}
			return year + '-' + month + '-' + day;
		},
		parseSize: function parseSize(size) {
			return size / 1024 + 'KB';
		}
	}
});