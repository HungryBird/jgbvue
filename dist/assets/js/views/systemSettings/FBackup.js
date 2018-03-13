JGBVue = {
	module: {}
};

JGBVue.module.FBackup = ()=> {
	let _this = {}
	,that = {};

	_this.init = (dataGetUrl, backupUrl, getTimeUrl, setTimeUrl, recoverUrl, downloadUrl, deteleUrl)=> {
		new Vue({
			el: '#app',
			data: {
				table: [],
				uploadDialog: {
					visible: false,
					fileList: [
						{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
						{name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
					]
				},
				timingDialog: {
					visible: false
				},
				selectedRows: [],
				timing: {}
			},
			mounted() {
				const _self = this;
				axios.get(dataGetUrl).then((data)=> {
					_self.table = JSON.parse(data.data.message);
				}).catch((err)=> {
					console.log('err:', err);
				})
			},
			methods: {
				start() {
					let _self = this;
					this.$confirm('为保证备份数据的完整性，请确保帐套里的其他用户已经退出系统。确认执行备份？', '开始备份', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						axios.get(backupUrl).then((data)=> {
							if(data.data.status) {
								_self.$message({
									type: 'success',
									message: data.data.message
								});
								done()
							}else{
								done(false)
							}
						})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消'
						});
					});
				},
				upload() {
					this.uploadDialog.visible = true;
				},
				handleSuccess(res, file, fileList) {
					let _self = this;
					if(res.status) {
						_self.$message.success(res.message);
						_self.uploadDialog.fileList.splice(0, _self.uploadDialog.fileList.length);
						_self.uploadDialog.visible = false;
					}else{
						_self.$message.error(res.message);
					}
				},
				submitUpload() {
					this.$refs.upload.submit();
				},
				recover() {
					axios.post(recoverUrl, this.selectedRows).then((data)=> {
						if(data.data.status) {
							this.$message({
								type: 'success',
								message: data.data.message
							})
						}
					}).catch((err)=> {
						console.log('err: ', err);
					})
				},
				download() {
					axios.post(downloadUrl, this.selectedRows).then((data)=> {
						if(data.data.status) {
							//
						}
					}).catch((err)=> {
						console.log('err: ', err);
					})
				},
				deleteData() {
					axios.post(deteleUrl, this.selectedRows).then((data)=> {
						if(data.data.status) {
							this.$message({
								type: 'success',
								message: data.data.message
							})
						}
					}).catch((err)=> {
						console.log('err: ', err);
					})
				},
				setTiming() {
					axios.get(getTimeUrl).then((data)=> {
						let jdata = JSON.parse(data.data.message);
						this.timing = jdata;
					});
					this.timingDialog.visible = true;
				},
				submitTiming() {
					let _self = this;
					let obj = {};
					obj.checked = _self.timingDialog.checked;
					obj.time = _self.timingDialog.time;
					axios.post(setTimeUrl, obj).then((data)=> {
						if(data.data.status) {
							this.$message({
								type: 'success',
								message: data.data.message
							})
							this.timingDialog.visible = false;
						}
					}).catch((err)=> {
						this.$message.error(err);
					})
				},
				rowClick(row) {
					let _self = this;
					this.$refs.BFtable.toggleRowSelection(row);
					if(_self.selectedRows.indexOf(row) == -1) {
						_self.selectedRows.push(row)
					}else{
						_self.selectedRows.splice(_self.selectedRows.indexOf(row), 1);
					}
				},
				selectAll(selection) {
					let _self = this;
					if(selection.length == 0) {
						_self.selectedRows.splice(0, _self.selectedRows.length);
					}else{
						_self.selectedRows.splice(0, _self.selectedRows.length);
						selection.forEach((item)=> {
							_self.selectedRows.push(item);
						})
					}
				},
				selectItem(selection, row) {
					let _self = this;
					this.selectedRows.splice(0, _self.selectedRows.length);
					for(let i = 0; i < selection.length; i++) {
						_self.selectedRows.push(selection[i]);
					}
				}
			},
			filters: {
				parseDate(date) {
					let oDate = new Date(date*1000);
					month = oDate.getMonth() + 1;
					day = oDate.getDate();
					year = oDate.getFullYear();
					if(day < 10) {
						day = '0' + day;
					}
					if(month < 10) {
						month = '0' + month;
					}
					return year + '-' + month + '-' + day;
				},
				parseSize(size) {
					return size/1024 + 'KB';
				}
			}
		});
	}

	that.init = (dataGetUrl, backupUrl, getTimeUrl, setTimeUrl, recoverUrl, downloadUrl, deteleUrl)=> {
		_this.init(dataGetUrl, backupUrl, getTimeUrl, setTimeUrl, recoverUrl, downloadUrl, deteleUrl);
	}

	return that;
}