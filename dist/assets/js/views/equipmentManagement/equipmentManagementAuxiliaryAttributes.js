JGBVue = {
	module: {}
};

JGBVue.module.equipmentManagementAuxiliaryAttributes = ()=> {
	const _this = {}
	,that = {};

	_this.init = (searchUrl, addClassifyUrl, getInfoUrl, saveEditUrl, deleteUrl, addClassifyAttributeUrl)=> {
		that.vm = new Vue({
			el: '#app',
			data() {
				return {
					data: [],
					searchValue: '',
					classifyVisible: false,
					title: '',
					tableData: [],
					tableHeader: [],
					loading: false
				}
			},
			mounted() {
				this.search();
			},
			methods: {
				search(val) {
					axios.get(searchUrl, val).then((res)=> {
						if(res.data.status) {
							this.data = JSON.parse(res.data.data).concat();
						}
					}).catch((err)=> {
						console.log('err: ', err);
					})
				},
				edit(d) {
					this.$prompt('名称', '编辑分类', {
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					}).then(({ value }) => {
						axios.post(saveEditUrl, value).then((res)=> {
							if(res.data.status) {
								for(let i = 0; i < this.data.length; i++ ) {
									if(this.data[i] === d) {
										this.data[i].label = value;
									}
								}
							}else{
								this.$message({
									type: 'error',
									message: '格式不正确'
								})
							}
						})
					}).catch(() => {
						//     
					});
				},
				remove(d) {
					let _self = this;
					this.$confirm('确定删除?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        beforeClose: function(action, instance, done) {
                            done(action);
                        }
                    }).then((action)=> {
                        if(action == 'confirm') {
                            axios.post(deleteUrl, d).then((res)=> {
                                if(res.data.status) {
                                	for(let i = 0; i < this.data.length; i++ ) {
										if(this.data[i] === d) {
											this.data.splice(i, 1);
											this.$message({
												type: 'success',
												message: '删除成功'
											})
											return;
										}
									}
                                }
                            }).catch(function(err) {
                                _self.$message({
                                    type: 'error',
                                    message: err
                                });
                            })
                        }
                    })
				},
				addClassify() {
					this.$prompt('名称', '新增分类', {
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					}).then(({ value }) => {
						axios.post(addClassifyUrl, value).then((res)=> {
							if(res.data.status) {
								this.data.push(res.data.data)
							}else{
								this.$message({
									type: 'error',
									message: '格式不正确'
								})
							}
						})
					}).catch(() => {
						//     
					});
				},
				clickItem(d) {
					axios.post(getInfoUrl, d).then((res)=> {
						if(res.data.status) {
							let jdata = JSON.parse(res.data.data);
							this.title = d.label;
							this.tableHeader = jdata.tableHeader.concat();
							this.tableData = jdata.tableData.concat();
							this.classifyVisible = true;
						}
					})
				},
				addClassifyAttribute() {
					this.$prompt('名称', '新增分类', {
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					}).then(({ value }) => {
						axios.post(addClassifyAttributeUrl, value).then((res)=> {
							if(res.data.status) {
								this.tableData.push({
									value: value
								})
							}else{
								this.$message({
									type: 'error',
									message: '格式不正确'
								})
							}
						})
					}).catch(() => {
						//     
					});
				},
				handleEdit(index, row) {
					this.$prompt('名称', '修改属性', {
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					}).then(({ value }) => {
						axios.post(addClassifyUrl, value).then((res)=> {
							if(res.data.status) {
								for(let i = 0; i < this.tableData.length; i++ ) {
									if(row === this.tableData[i]) {
										this.tableData[i].value = value;
									}
								}
							}else{
								this.$message({
									type: 'error',
									message: 'err!'
								})
							}
						})
					}).catch(() => {
						//     
					});
				},
				handleDelete(index, row) {
					let _self = this;
					this.$confirm('确定删除?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        beforeClose: function(action, instance, done) {
                            done(action);
                        }
                    }).then((action)=> {
                        if(action == 'confirm') {
                            axios.post(deleteUrl, row).then((res)=> {
                                if(res.data.status) {
                                	this.tableData.splice(index, 1);
                                    this.$message({
                                        type: 'success',
                                        message: res.data.message
                                    });
                                }
                            }).catch(function(err) {
                                _self.$message({
                                    type: 'error',
                                    message: res.data.message || err
                                });
                            })
                        }
                    })
				},
				saveEdit() {
					axios.post(saveEditUrl, this.tableData).then((res)=> {
						if(res.data.status) {
							this.classifyVisible = false;
							this.$message({
								type: 'success',
								message: res.data.message
							})
						}
					})
				}
			}
		})
	}

	that.init = (searchUrl,addClassifyUrl, getInfoUrl, saveEditUrl, deleteUrl, addClassifyAttributeUrl)=> {
		_this.init(searchUrl, addClassifyUrl, getInfoUrl, saveEditUrl, deleteUrl, addClassifyAttributeUrl);
	}

	return that;
}