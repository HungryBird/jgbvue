JGBVue = {
	module: {}
};

JGBVue.module.maintenanceContract = ()=> {
	let _this = {}
	,that = {}
	,E1
	,E2
	,addEditor
	,examineEditor
	,initCurRow = {
		title: '',
		number: '',
		partAName: '',
		partBName: '',
		partAAddress: '',
		partBAddress: '',
		partALinkman: '',
		partBLinkman: '',
		partATel: '',
		partAFax: '',
		partBTel: '',
		partBFax: '',
		editorContent: '',
		filePic: ''
	}

	_this.init = (searchUrl, giveOutUrl, getExportFormUrl, btnUrl, getTagsUrl, saveAddUrl, getContractInfoUrl, examineUrl, getImageUrl)=> {
		that.vm = new Vue({
			el: '#app',
			data() {
				return {
					table: [],
					addDialogVisible: false,
					order_id: '',
					exportVisible: false,
					selectedRows: [],
					loadingDetailInfo: false,
					currentPage: 1,
					pageSize: 20,
					exportForm: [],
					examinCurRow: null,
					templateVisible: false,
					addForm: {
						fileList: []
					},
					contractInfo: [],
					formRules: {
						name: [
							{required: true, message: '请输入名称'}
						],
						title: [
							{required: true, message: '请输入标题'}
						],
						clientName: [
							{required: true, message: '请输入客户名称'}
						],
						equipmentName: [
							{required: true, message: '请输入设备名称'}
						],
						personnel: [
							{required: true, message: '请输入报价人'}
						],
						number: [
							{required: true, message: '请输入合同编号'}
						]
					},
					otherTags: [],
					isUnfold: false,
					examinCurRow: null,
					showSlideshow: false,
					slideshowArr: [],
					currentImgWidth: 0,
					currentImgHeight: 0,
					currentImgIndex: 0,
					currentImgSrc: '',
					curRow: {
						title: '',
						number: '',
						partAName: '',
						partBName: '',
						partAAddress: '',
						partBAddress: '',
						partALinkman: '',
						partBLinkman: '',
						partATel: '',
						partAFax: '',
						partBTel: '',
						partBFax: '',
						editorContent: '',
						filePic: ''
					}
				}
			},
			mounted() {
				let info = JSON.parse(this.$getQuery(window.location.search).info);
				this.order_id = info.order_id;
				this.search();
				this.getTags();
				this.getContractInfo();
			},
			methods: {
				handleExamine(index, row) {
					let _self = this;
					if(this.examinCurRow === row) {
						if(this.isUnfold) {
							this.isUnfold = false;
						}else{
							this.toggleInfo();
							this.isUnfold = true;
						}
						return;
					}
					this.examinCurRow = row;
					this.$refs['table'].clearSelection();
					this.loadingDetailInfo = true;
					axios.post(examineUrl, row).then((res)=> {
						if(res.data.status) {
							let jdata = JSON.parse(res.data.data);
							this.isUnfold = true;
							this.loadingDetailInfo = false;
							Object.assign(this.curRow, initCurRow);
							this.curRow = jdata;
							if(E2 != null) return;
							E2 = window.wangEditor;
							examineEditor = new E2('#examineEditor');
							examineEditor.create();
							examineEditor.$textElem.attr('contenteditable', false);
							examineEditor.txt.html(jdata.editorContent);
						}
					}).catch((err)=> {
						console.log(err)
					});
				},
				toggleInfo() {
					this.$refs['table'].clearSelection();
					this.selectedRows = [];
					this.isUnfold = false;
				},
				addContract() {
					this.addDialogVisible = true;
					setTimeout(function() {
						if(E1 != null) return;
						E1 = window.wangEditor;
						addEditor = new E1('#addEditor');
						addEditor.create();	
					}, 0)						
				},
				handleUploadReportSuccess: function(response, file, fileList) {
					console.log(response)
				},
				handleUploadReportError: function(response, file, fileList) {
					console.log(response)
				},
				getContractInfo() {
					axios.get(getContractInfoUrl).then((res)=> {
						if(res.data.status) {
							this.addForm = JSON.parse(res.data.data);
							this.addDialogVisible = false;
						}
					})
				},
				createEditor() {
					E1 = window.wangEditor;
					addEditor = new E1('#addEditor');
					addEditor.create();
				},
				addCreateTags(item) {
					let _self = this;
					addEditor.cmd.do('insertHTML', '<span>' + item.label + '</span>')
				},
				search() {
					axios.post(searchUrl, this.order_id).then((res)=> {
						if(res.data.status) {
							this.table = JSON.parse(res.data.data);
						}
					})
				},
				getTags() {
					axios.get(getTagsUrl).then((res)=> {
						if(res.data.status) {
							this.otherTags = JSON.parse(res.data.data);
						}
					})
				},
				exportCilck() {
					if(this.exportForm.length === 0) {
						axios.get(getExportFormUrl).then((res)=> {
							if(res.data.status) {
								this.exportForm = JSON.parse(res.data.data);
							}
						})
					}
					this.exportVisible = true;
				},
				giveOut() {
					let _self = this;
					this.$confirm('确定作废?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        beforeClose: function(action, instance, done) {
                            done(action);
                        }
                    }).then((action)=> {
                        if(action == 'confirm') {
                            axios.post(giveOutUrl, this.selectedRows).then((res)=> {
                                if(res.data.status) {
                                	this.selectedRows.forEach((item)=> {
                                		for (let i = _self.table.length - 1; i >= 0; i--) {
                                			if(_self.table[i] === item) {
                                				_self.table[i].status = -1;
                                			}
                                		}
                                	})
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
                    }).catch(() => {
                       this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
				},
				rowClick(row, event, column) {
					this.$rowClick('table', row, this.selectedRows, this)
				},
				selectAll(selection) {
                    this.selectedRows = this.$selectAll(selection, this.selectedRows)
				},
				selectItem(selection, row) {
                    this.selectedRows = this.$selectItem(selection, row, this.selectedRows);
				},
				handleSizeChange() {
					//
				},
				handleCurrentChange() {
					//
				},
				rowStatusClassName({row, rowIndex}) {
					if(row.status === -1) {
						return 'scrap-row';
					}
				},
				btnPass(row) {
					this.$refs.table.clearSelection();
					this.selectedRows = [];
					this.loadingDetailInfo = true;
					axios.post(btnUrl, row).then((res)=> {
						if(res.data.status) {
							for(let i = 0; i < this.table.length; i++ ) {
								if(row === this.table[i]) {
									this.table[i].status = 1
								}
							}
							this.loadingDetailInfo = false;
							this.$message({
								type: 'success',
								message: res.data.message
							})
						}
					})
				},
				btnRefuse(row) {
					let _self = this;
					this.$refs.table.clearSelection();
					this.selectedRows = [];
					_self.$prompt('不通过原因?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					}).then(({ value })=> {
						axios.post(btnUrl, { row: row, value: value }).then((res)=> {
							if(res.data.status) {
								for(let i = 0; i < this.table.length; i++ ) {
									if(row === this.table[i]) {
										this.table[i].status = 2
									}
								}
								_self.$message({
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
					}).catch(() => {
						_self.$message({
							type: 'info',
							message: '已取消'
						});
					});
				},
				zancunAdd(formName) {
					this.$refs[formName].validate((valid)=> {
						if(valid) {
							axios.post(saveAddUrl, this.addForm).then((res)=> {
								if(res.data.status) {
									this.$refs[formName].resetFields();
									this.$message({
										type: 'success',
										message: res.data.message
									})
									this.addCheckedAssistantsMember = [];
									this.addVisible = false;
								}
							})
						}else{
							return false;
						}
					})
				},
				saveAdd(formName) {
					this.$refs[formName].validate((valid)=> {
						if(valid) {
							axios.post(saveAddUrl, this.addForm).then((res)=> {
								if(res.data.status) {
									this.$refs[formName].resetFields();
									this.$message({
										type: 'success',
										message: res.data.message
									})
									this.addCheckedAssistantsMember = [];
									this.addVisible = false;
								}
							})
						}else{
							return false;
						}
					})
				},
				viewImage(item, row) {
					this.selectedRows = [];
					this.$refs['table'].clearSelection();
					this.openSlideshow(item);
				},
				viewFile() {
					this.slideshowArr = [];
					this.currentImgIndex = 0;
					this.slideshowArr.push(this.curRow.filePic);
					this.currentImgSrc = this.slideshowArr[0].src;
					this.currentImgWidth = this.slideshowArr[0].width;
					this.currentImgHeight = this.slideshowArr[0].height;
					this.showSlideshow = true;
				},
				openSlideshow(item) {
					let _self = this;
					axios.post(getImageUrl, item).then((res)=> {
						if(res.data.status) {
							this.slideshowArr = [];
							this.currentImgIndex = 0;
							res.data.data.forEach((item)=> {
								_self.slideshowArr.push(item);
							});
							this.currentImgSrc = this.slideshowArr[0].src;
							this.currentImgWidth = this.slideshowArr[0].width;
							this.currentImgHeight = this.slideshowArr[0].height;
							this.showSlideshow = true;
						}
					});
				},
				nextImg() {
					if(this.currentImgIndex === this.slideshowArr.length - 1) {
						this.currentImgIndex = 0;
					}else{
						this.currentImgIndex++;
					}
					this.currentImgSrc = this.slideshowArr[this.currentImgIndex].src;
					this.currentImgWidth = this.slideshowArr[this.currentImgIndex].width;
					this.currentImgHeight = this.slideshowArr[this.currentImgIndex].height;
				},
				prevImg() {
					if(this.currentImgIndex === 0) {
						this.currentImgIndex = this.slideshowArr.length - 1;
					}else{
						this.currentImgIndex--;
					}
					this.currentImgSrc = this.slideshowArr[this.currentImgIndex].src;
					this.currentImgWidth = this.slideshowArr[this.currentImgIndex].width;
					this.currentImgHeight = this.slideshowArr[this.currentImgIndex].height;
				},
			},
			watch: {
				//
			},
			computed: {
				//
			},
			filters: {
				statusFilter(val) {
					if(val === 0) {
						return '待审核'
					}else if(val === 1) {
						return '审核通过'
					}else if(val === 2){
						return '审核不通过'
					}else{
						return '作废'
					}
				}
			}
		})
	}

	that.init = (searchUrl, giveOutUrl, getExportFormUrl, btnUrl, getTagsUrl, saveAddUrl, getContractInfoUrl, examineUrl, getImageUrl)=> {
		_this.init(searchUrl, giveOutUrl, getExportFormUrl, btnUrl, getTagsUrl, saveAddUrl, getContractInfoUrl, examineUrl, getImageUrl);
	}

	return that;
}