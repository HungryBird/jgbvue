JGBVue = {
	module: {}
};

JGBVue.module.commodityInfo = ()=> {
	const _this = {}
	,that = {};

	_this.init = (searchUrl, quickQueryUrl, auxiliaryAttributesClassifyUrl, repoUrl, startUsingUrl, deleteUrl, examineUrl, saveAddUrl, getEditUrl, saveEditUrl, uploadUrl, getExportFormUrl, toggleCommonUseUrl, getImageUrl, quickGenerateUrl, addAuxiliaryAttributesClassifyUrl)=> {
		that.vm = new Vue({
			el: '#app',
			data() {
				return {
					table: [],
					tempTable: [],
					search: {
						input: ''
					},
					detailsInfo: {},
					isShowForbiddenCommodity: false,
					activeIndex: -1,
					queryType: [],
					category:[],
					level: [],
					sale: [],
					companyList: [],
					commodityInfo: [],
					selectedRows: [],
					pageSize: 20,
					currentPage: 1,
					isUnfold: false,
					examinCurRow: null,
					addVisible: true,
					editVisible: false,
					loadingSaveAdd: false,
					loadingDetailInfo: false,
					formRules: {
						number: [
							{required: true, message: '请输入客户编号'}
						],
						name: [
							{required: true, message: '请输入客户名称'}
						]
					},
					auxiliaryAttributesClassify: [], //添加-点击属性分类-父属性
					auxiliaryAttributesClassifyChildren: [], //添加-点击属性分类-子属性
					initQuickGenerateTable: [],
					addForm: {
						number: '',
						name: '',
						commodityCategory: '',
						barCode: '',
						specifications: '',
						primaryRepo: '',
						commodityBrand: '',
						unitOfMeasurement: '',
						multiple: '',
						retailPrice: '',
						tradePrice: '',
						lowestPrince: '',
						highestPrince: '',
						discountRate1: '',
						discountRate2: '',
						discountRate3: '',
						expectPurchasePrice: '',
						remark: '',
						upload: [],
						inventoryWarning: false,
						branchWarehouseWarning: false,
						repo: [],
						setCommodityAuxiliaryAttributes: false,
						auxiliaryAttributesClassify: [],
						quickGenerateTable: {
							header: [],
							data: [
								{
									indexNum: 1,
									editFlag: false,
								}
							]
						},
						batchExpirationDateManagement: false,
						serialNumberManagement: false,
						initSet: false,
						initSetTable: [
							{
								index: 1,
								editFlag: false,
								shelfLife: null
							},
							{
								index: 2,
								editFlag: false,
								shelfLife: null
							}
						]
					},
					addSelectedAxiliaryAttributesClassify: [],
					addFormBasicData: {
						commodityCategory: [],
						primaryRepo: [],
						unitOfMeasurement: [],
					},
					editForm: {
						number: '',
						name: '',
						commodityCategory: '',
						barCode: '',
						specifications: '',
						primaryRepo: '',
						commodityBrand: '',
						unitOfMeasurement: '',
						multiple: '',
						retailPrice: '',
						tradePrice: '',
						minPrince: '',
						maxPrince: '',
						discountRate1: '',
						discountRate2: '',
						discountRate3: '',
						expectPurchasePrice: '',
						remark: '',
						upload: [],
						inventoryWarning: false,
						setCommodityAuxiliaryAttributes: false,
						batchExpirationDateManagement: false,
						serialNumberManagement: false,
						initSet: false,
						initSetTable: [
							{
								index: 1
							},
							{
								index: 2
							}
						]
					},
					importVisible: false,
					exportVisible: false,
					uploadUrl: uploadUrl,
					getFileInfo: null,
					uploadInfo: {
						newNumber: 0,
						updateNumber: 0,
						errNumber: 0,
						errRecord: []
					},
					exportForm: [],
					showSlideshow: false,
					slideshowArr: [],
					currentImgWidth: 0,
					currentImgHeight: 0,
					currentImgIndex: 0,
					currentImgSrc: '',
					uploadDialogVisible: false,
					repo: [],
					auxiliaryAttributesClassify: [],
					quickGenerateOption: [],
					add_initSetTable_header: [],
					loading: false,
					addEnterSerialNumberVisible: true,
					addBatchSetWrap: false,
					addEnterSerialNumberForm: {
						startNumber: '001',
						increment: 1,
						number: 1,
						table: []
					}
				}
			},
			mounted() {
				this.searchData();
				this.getQuickQuery();
				this.getRepo();
				this.addQuickGenerate();
				this.getAuxiliaryAttributesClassify();
			},
			methods: {
				searchData(val) {
					let _self = this;
					axios.get(searchUrl, val).then((res)=> {
						if(res.data.status) {
							let jdata = JSON.parse(res.data.data);
							this.tempTable = jdata;
							this.tempTable.forEach((item)=> {
								if(!_self.isShowForbiddenCommodity) {
									if(item.status) {
										_self.table.push(item);
									}
								}else{
									_self.table.push(item);
								}
							});
						}
					}).catch((err)=> {
						console.log('axios err: ', err);
					})
				},
				getQuickQuery() {
					axios.get(quickQueryUrl).then((res)=> {
						if(res.data.status) {
							this.queryType = JSON.parse(res.data.data);
						}
					})
				},
				getRepo() {
					axios.get(repoUrl).then((res)=> {
						if(res.data.status) {
							this.repo = JSON.parse(res.data.data).concat();
							this.addForm.repo = this.repo.concat();
							this.editForm.repo = this.repo.concat();
						}
					})
				},
				getAuxiliaryAttributesClassify() {
					axios.get(auxiliaryAttributesClassifyUrl).then((res)=> {
						if(res.data.status) {
							this.auxiliaryAttributesClassify = JSON.parse(res.data.data).concat();
						}
					})
				},
				rowClick(row, event, column) {
					let _self = this;
					this.$refs['table'].toggleRowSelection(row);
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
				},
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
							this.commodityInfo = jdata;
							this.isUnfold = true;
							this.loadingDetailInfo = false;
						}
					});
				},
				toggleInfo() {
					this.$refs['table'].clearSelection();
					this.selectedRows = [];
					this.isUnfold = false;
				},
				handleEdit(index, row) {
					this.$refs['table'].clearSelection();
					this.selectedRows = [];
					axios.post(getEditUrl, row).then((res)=> {
						if(res.data.status) {
							this.editForm = JSON.parse(res.data.data);
							this.editVisible = true;
						}
					})
				},
				handleDelete() {
					let _self = this;
                    this.selectedRows.splice(0, _self.selectedRows.length);
                    this.$refs.table.clearSelection();
                    this.remove();
				},
				remove() {
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
                            axios.post(deleteUrl, this.selectedRows).then((res)=> {
                                if(res.data.status) {
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
				changeQueryType(item, index) {
					if(this.activeIndex === index) return;
					let _self = this;
					this.activeIndex = index;
					axios.get(searchUrl, item.value).then((res)=> {
						if(res.data.status) {
							let jdata = JSON.parse(res.data.data);
							this.table.splice(0, _self.table.length);
							this.tempTable.splice(0, _self.tempTable.length);
							jdata.forEach((item)=> {
								_self.tempTable.push(item);
							});
							this.tempTable.forEach((item)=> {
								if(!_self.isShowForbiddenCommodity) {
									if(item.status) {
										_self.table.push(item);
									}
								}else{
									_self.table.push(item);
								}
							});
							this.$message({
								type: 'success',
								message: 'success'
							})
						}
					})
				},
				handleSizeChange() {
					//当前页面size改变时
				},
				handleCurrentChange() {
					//翻页时
				},
				handleStatus(index, row) {
					this.selectedRows = [];
					this.$refs['table'].clearSelection();
					this.forbidden();
				},
				forbidden() {
					let _self = this
					,arr = [];
					this.selectedRows.forEach((item, index)=> {
						for(let i = 0; i < _self.tempTable.length; i++ ) {
							if(item.clientNumber === _self.tempTable[i].clientNumber) {
								_self.tempTable[i].status = false;
							}
						}
					});
					this.table.splice(0, _self.table.length);
					this.tempTable.forEach((item)=> {
						if(!_self.isShowForbiddenCommodity) {
							if(item.status) {
								_self.table.push(item);
							}
						}else{
							_self.table.push(item);
						}
					})
					this.selectedRows = [];
				},
				startUsing() {
					let _self = this
					,arr = [];
					axios.post(startUsingUrl, this.selectedRows).then((res)=> {
						if(res.data.status) {
							this.selectedRows.forEach((item, index)=> {
								for(let i = 0; i < _self.tempTable.length; i++ ) {
									if(item.clientNumber === _self.tempTable[i].clientNumber) {
										_self.tempTable[i].status = true;
									}
								}
							});
						}
					})
				},
				toggleForbiddenCommdity() {
					let _self = this;
					this.table.splice(0, _self.table.length);
					this.tempTable.forEach((item)=> {
						if(this.isShowForbiddenCommodity) {
							_self.table.push(item);
						}else{
							if(item.status) {
								_self.table.push(item);
							}
						}
					})
				},
				rowStatusClassName({row, rowIndex}) {
					if(!row.status) {
						return 'forbidden-row';
					}
				},
				addRowClick(row, event, column) {
					this.addForm.table.forEach((item)=> {
						item.editFlag = false;
					})
					for(let i = 0; i < this.addForm.table.length; i++ ) {
						if(row === this.addForm.table[i]) {
							this.addForm.table[i].editFlag = true;
						}
					}
				},
				addQuickGenerateRowClick(row) {
					this.addForm.quickGenerateTable.data.forEach((item)=> {
						item.editFlag = false;
					})
					for(let i = 0; i < this.addForm.quickGenerateTable.data.length; i++ ) {
						if(row === this.addForm.quickGenerateTable.data[i]) {
							this.addForm.quickGenerateTable.data[i].editFlag = true;
						}
					}
				},
				addRowClickInitSetTable(row, event, column) {
					this.addForm.initSetTable.forEach((item)=> {
						item.editFlag = false;
					})
					for(let i = 0; i < this.addForm.initSetTable.length; i++ ) {
						if(row === this.addForm.initSetTable[i]) {
							this.addForm.initSetTable[i].editFlag = true;
						}
					}
				},
				editRowClick(row, event, column) {
					this.editForm.table.forEach((item)=> {
						item.editFlag = false;
					})
					for(let i = 0; i < this.editForm.table.length; i++ ) {
						if(row === this.editForm.table[i]) {
							this.editForm.table[i].editFlag = true;
						}
					}
				},
				addFormTableAdd() {
					let index = this.addForm.table[this.addForm.table.length - 1].index + 1;
					let initFormRow = {
						index: 0,
						editFlag: false,
						linkman: '',
						job: '',
						tel: '',
						phone: '',
						QQOrWechat: '',
						linkAddress: '',
						primaryContact: ''
					}
					initFormRow.index = index;
					this.addForm.table.push(initFormRow)
				},
				editFormTableAdd() {
					let index = this.editForm.table[this.editForm.table.length - 1].index + 1;
					let initFormRow = {
						index: 0,
						editFlag: false,
						linkman: '',
						job: '',
						tel: '',
						phone: '',
						QQOrWechat: '',
						linkAddress: '',
						primaryContact: ''
					}
					initFormRow.index = index;
					this.editForm.table.push(initFormRow)
				},
				addFormTableDelete(row) {
					for(let i = 0; i < this.addForm.table.length; i++ ) {
						if(row === this.addForm.table[i]) {
							this.addForm.table.splice(this.addForm.table[i], 1);
						}
					}
				},
				editFormTableDelete(row) {
					for(let i = 0; i < this.editForm.table.length; i++ ) {
						if(row === this.editForm.table[i]) {
							this.editForm.table.splice(this.editForm.table[i], 1);
						}
					}
				},
				saveSetRoleMember() {
					let arr = []
					,_self = this;
					this.checkedRoleMember.forEach(item=> {
						arr.push(item.uid)
					});
					this.addForm.assistants = [];
					arr.forEach((item)=> {
						_self.addForm.assistants.push(item);
					});
				},
				saveAdd(formName) {
					this.$refs[formName].validate((valid)=> {
						if(valid) {
							axios.post(saveAddUrl, this.addForm).then((res)=> {
								if(res.data.status) {
									this.$refs[formName].resetFields();
									this.addDialogVisiable = false;
									this.$message({
										type: 'success',
										message: res.data.message
									})
									this.addVisible = false;
								}
							})
						}else{
							return false;
						}
					})
				},
				saveEdit(formName) {
					this.$refs[formName].validate((valid)=> {
						if(valid) {
							axios.post(saveEditUrl, this.editForm).then((res)=> {
								if(res.data.status) {
									this.$refs[formName].resetFields();
									this.editDialogVisiable = false;
									this.$message({
										type: 'success',
										message: res.data.message
									})
									this.editVisible = false;
								}
							})
						}else{
							return false;
						}
					})
				},
				closeAdd() {
					//
				},
				closeEdit() {
					//
				},
				addCloseTag(tag) {
					//
				},
				editCloseTag(tag) {
					//
				},
				getFile($event) {
					this.getFileInfo = $event.target.files[0];
				},
				uploadFild() {
					axios.post(uploadUrl, this.getFileInfo).then((res)=> {
						if(res.data.status) {
							this.uploadInfo = JSON.parse(res.data.data);
						}
					}).catch((err)=> {
						console.log(err);
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
				toggleCommonUse(row) {
					this.selectedRows = [];
					this.$refs['table'].clearSelection();
					axios.post(toggleCommonUseUrl, row).then((res)=> {
						if(res.data.status) {
							for(let i = 0; i < this.table.length; i++ ) {
								if(row === this.table[i]) {
									this.table[i].isCommonUse = !this.table[i].isCommonUse;
								}
							}
							this.$message({
								type: 'success',
								message: res.data.message
							})
						}
					})
				},
				viewImage(item, row) {
					this.selectedRows = [];
					this.$refs['table'].clearSelection();
					this.openSlideshow(item);
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
				handleRemove(file, fileList) {
					console.log('handleRemove file: ', file);
					console.log('handleRemove file:', fileList);
				},
				lowestInventoryHeader(createElement, { column }) {
					return createElement(
						'div',
						{class: 'jgb-popover-wrap'},
						[
							createElement('span', [column.label]),
							createElement('el-button', {
									attrs: { 
										type: 'default',
										size: 'small'
									},
									on: { click: this.showLowestInventoryPopover }
								}, ['批量']
							)
						]
					);
				},
				highestInventoryHeader(createElement, { column }) {
					return createElement(
						'div',
						{class: 'jgb-popover-wrap'},
						[
							createElement('span', [column.label]),
							createElement('el-button', {
									attrs: { 
										type: 'default',
										size: 'small'
									},
									on: { click: this.showHighestInventoryPopover }
								}, ['批量']
							)
						]
					);
				},
				showLowestInventoryPopover(e) {
					let _self = this;
					this.$prompt(' ', '请输入最低库存量', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
			        }).then(({ value }) => {
						this.addForm.repo.forEach((item)=> {
							item.lowestInventory = value;
						})
			        }).catch(() => {
						this.$message({
							type: 'info',
							message: '取消输入'
						});       
			        });
				},
				showHighestInventoryPopover(e) {
					this.$prompt('请输入邮箱', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
			        }).then(({ value }) => {
						this.addForm.repo.forEach((item)=> {
							item.highestInventory = value;
						})
			        }).catch(() => {
						this.$message({
							type: 'info',
							message: '取消输入'
						});       
			        });
			    },
			    addRowClick(row) {
			    	this.addForm.repo.forEach((item)=> {
						item.editFlag = false;
					})
					for(let i = 0; i < this.addForm.repo.length; i++ ) {
						if(row === this.addForm.repo[i]) {
							this.addForm.repo[i].editFlag = true;
						}
					}
			    },
			    /**
			     * 点击属性分类
			     * @param {[type]} arr [description]
			     */
			    addChangeAuxiliaryAttributesClassify(arr) {
			    	let _self = this;
			    	this.addSelectedAxiliaryAttributesClassify = [];
			    	this.addForm.quickGenerateTable.header = [];
			    	arr.forEach((item)=> {
			    		for(let i = 0; i < _self.auxiliaryAttributesClassify.length; i++ ) {
			    			if(item === _self.auxiliaryAttributesClassify[i].value) {
			    				let obj = {};
			    				let hObj = {};
			    				obj.parentName = _self.auxiliaryAttributesClassify[i].label;
			    				obj.children = _self.auxiliaryAttributesClassify[i].chilren;
			    				_self.addSelectedAxiliaryAttributesClassify.push(obj);
			    				hObj.label = _self.auxiliaryAttributesClassify[i].label;
			    				hObj.prop = _self.auxiliaryAttributesClassify[i].value;
			    				_self.addForm.quickGenerateTable.header.splice(0, 0, hObj);
			    			}
			    		}
			    	})
			    },
			    /**
			     * 点击属性分类子属性
			     * @param {[type]} arr [description]
			     */
			    addChangeAuxiliaryAttributesClassifyChildren(arr) {
			    	let _self = this;
			    	arr.forEach((item)=> {

			    	})
			    	console.log('quickGenerateTable.data: ', this.addForm.quickGenerateTable)
			    },
			    /**
			     * 点击新增属性分类按钮
			     */
			    addAuxiliaryAttributesClassify() {
			    	let _self = this;
					this.$prompt('名称', '新增分类', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
			        }).then(({ value }) => {
						axios.post(addAuxiliaryAttributesClassifyUrl, value).then((res)=> {
							if(res.data.status) {
								let obj = {};
								obj.label = value;
								this.auxiliaryAttributesClassify.push(obj);
							}
						})
			        }).catch(() => {
						this.$message({
							type: 'info',
							message: '取消输入'
						});       
			        });
			    },
			    addQuickGenerate() {
			    	if(this.auxiliaryAttributesClassifyChildren.length !== 0) {
			    		axios.post(quickGenerateUrl, this.auxiliaryAttributesClassifyChildren).then((res)=> {
			    			if(res.data.status) {
			    				this.addForm.quickGenerateTable.data = JSON.parse(res.data.data);
			    			}
			    		})
			    	}
			    },
			    addQuickGenerateTable_add_btn() {
			    	let index = this.addForm.quickGenerateTable.data[this.addForm.quickGenerateTable.data.length - 1].index + 1;
					let initFormRow = {
						index: 0,
						editFlag: false
					}
					initFormRow.index = index;
					this.addForm.quickGenerateTable.data.push(initFormRow);
			    },
			    addQuickGenerateTable_delete_btn(row) {
			    	for(let i = 0; i < this.addForm.quickGenerateTable.data.length; i++ ) {
						if(row === this.addForm.quickGenerateTable.data[i]) {
							this.addForm.quickGenerateTable.data.splice(i, 1);
						}
					}
			    },
			    addQuickGenerateUploadPic(e) {
			    	console.log('e: ', e);
			    },
			    addQuickGenerateHeader(createElement, { column }) {
			    	return createElement(
						'span',
						{'class': 'required'},
						[column.label]
					);
			    },
			    requiredHeader(createElement, { column }) {
			    	return createElement(
						'span',
						{'class': 'required'},
						[column.label]
					);
			    },
			    addQuickGenerateTableProp() {
			    	let _self = this;
					this.$prompt('名称', '新增分类', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
			        }).then(({ value }) => {
						axios.post(addAuxiliaryAttributesClassifyUrl, value).then((res)=> {
							if(res.data.status) {
								let obj = {};
								obj.label = value;
								this.auxiliaryAttributesClassify.push(obj);
							}
						})
			        }).catch(() => {
						this.$message({
							type: 'info',
							message: '取消输入'
						});       
			        });
			    },
			    addNewAttribute(row, prop) {
		    		let _self = this;
					this.$prompt('名称', '新增分类', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
			        }).then(({ value }) => {
						for(let i = 0; i < this.auxiliaryAttributesClassify.length; i++ ) {
							if(this.auxiliaryAttributesClassify[i].value === prop) {
								let obj = {};
								obj.parent = prop;
								obj.label = value;
								obj.value = value;
								axios.post(addAuxiliaryAttributesClassifyUrl, obj).then((res)=> {
									if(res.data.status) {
										this.auxiliaryAttributesClassify[i].chilren.push(obj);
									}else{
										this.$message.error(res.data.err);
										return;
									}
								})
								return;
							}
						}
			        }).catch(() => {
						this.$message({
							type: 'info',
							message: '取消输入'
						});       
			        });
		    	},
		    	selectQuickGenerateOption(prop) {
		    		/**
		    		 * prop传入的是父属性的value
		    		 * auxiliaryAttributesClassify包含父属性和子属性
		    		 * auxiliaryAttributesClassifyChildren被选中的子属性
		    		 * 
		    		 * @type {[type]}
		    		 */
		    		let _self = this;
		    		this.quickGenerateOption = [];
		    		/**
		    		 * 查询prop是否等于auxiliaryAttributesClassify.value
		    		 * 查询child是否存在查询prop是否等于auxiliaryAttributesClassify.children内
		    		 * 如果存在传入obj
		    		 * @param  {[type]} let i             [description]
		    		 * @return {[type]}     [description]
		    		 */
	    			for(let i = 0; i < _self.auxiliaryAttributesClassify.length; i++ ) {
	    				if(prop === _self.auxiliaryAttributesClassify[i].value) {
	    					this.auxiliaryAttributesClassifyChildren.forEach((child)=> {
	    						for(let j = 0; j < _self.auxiliaryAttributesClassify[i].chilren.length; j++ ) {
	    							if(child === _self.auxiliaryAttributesClassify[i].chilren[j].value) {
	    								let obj = {};
	    								obj.label = _self.auxiliaryAttributesClassify[i].chilren[j].label;
	    								obj.value = _self.auxiliaryAttributesClassify[i].chilren[j].value;
	    								_self.quickGenerateOption.push(obj);
	    							}
	    						}
	    					})
	    				}
	    			}
		    	},
		    	handleInitSetAdd() {
		    		let index = this.addForm.initSetTable[this.addForm.initSetTable.length - 1].index + 1;
					let initFormRow = {
						index: 0,
						editFlag: false,
						shelfLife: null
					}
					initFormRow.index = index;
					this.addForm.initSetTable.push(initFormRow);
		    	},
		    	handleInitSetDelete(index, row) {
		    		for(let i = 0; i < this.addForm.initSetTable.length; i++ ) {
						if(row === this.addForm.initSetTable[i]) {

							this.addForm.initSetTable.splice(i, 1);
						}
					}
		    	},
		    	addChangeShelfLife() {
		    		let _self = this;
    				this.addForm.initSetTable.forEach((item)=> {
		    			item.shelfLife = _self.addForm.shelfLife;
		    		});
		    		for(let i = 0; i < this.addForm.initSetTable.length; i++) {
		    			let formatDate = new Date((this.addForm.initSetTable[i].productionDate || 0) + Number.parseInt(this.addForm.initSetTable[i].shelfLife + 1)*24*60*60*1000 || 0);
    					this.addForm.initSetTable[i].validUntil = this.formatDate(formatDate);
	    			}
		    	},
		    	toggleBatchExpirationDateManagement(val) {
		    		let _self = this;
		    		this.add_initSetTable_header = [];
		    		if(val) {
		    			let arr = [
		    				{
		    					label: '批次',
		    					prop: 'batch',
		    					type: 'input'
		    				},
		    				{
		    					label: '生产日期',
		    					prop: 'productionDate',
		    					type: 'date'
		    				},
		    				{
		    					label: '保质期（天）',
		    					prop: 'shelfLife',
		    					type: 'text'
		    				},
		    				{
		    					label: '有效期至',
		    					prop: 'validUntil',
		    					type: 'text'
		    				}
		    			]
		    			arr.forEach((item)=> {
		    				_self.add_initSetTable_header.push(item);
		    			})
		    		}
		    	},
		    	addFormInitSetTablePickDate(val, row, prop) {
		    		let _self = this;

	    			let ms = new Date(val).getTime() + (Number.parseInt(_self.addForm.shelfLife)*24*60*60*1000 || 0);
	    			let formatValue = new Date(ms);
	    			for(let i = 0; i < this.addForm.initSetTable.length; i++) {
	    				if(this.addForm.initSetTable[i] === row) {
	    					this.addForm.initSetTable[i].validUntil = this.formatDate(formatValue);
	    				}
	    			}
		    	},
		    	formatDate(val) {
		    		return val.getFullYear() + '-' + `${val.getMonth() + 1 < 10 ? '0' + (val.getMonth() + 1) : (val.getMonth() + 1)}` + '-' +  `${val.getDate() < 10 ? '0' + val.getDate() : val.getDate()}`;
		    	},
		    	addFormInitialNumberChange(val, row) {
		    		if(isNaN(Number(val))) return;
		    		for(let i = 0; i < this.addForm.initSetTable.length; i++) {
	    				if(this.addForm.initSetTable[i] === row) {
	    					if(!isNaN(this.addForm.initSetTable[i].unitCost)) {
	    						this.addForm.initSetTable[i].atFirstTotalPrice = this.addForm.initSetTable[i].unitCost*val;
	    					}
	    				}
	    			}
		    	},
		    	addFormUnitCostChange(val, row) {
		    		if(isNaN(Number(val))) return;
		    		for(let i = 0; i < this.addForm.initSetTable.length; i++) {
	    				if(this.addForm.initSetTable[i] === row) {
	    					if(!isNaN(this.addForm.initSetTable[i].initialNumber)) {
	    						this.addForm.initSetTable[i].atFirstTotalPrice = this.addForm.initSetTable[i].initialNumber*val;
	    					}
	    				}
	    			}
		    	},
		    	addQuickGenerateTable_add_btn() {
			    	let index = this.addForm.quickGenerateTable.data[this.addForm.quickGenerateTable.data.length - 1].index + 1;
					let initFormRow = {
						index: 0,
						editFlag: false
					}
					initFormRow.index = index;
					this.addForm.quickGenerateTable.data.push(initFormRow);
			    },
			    addQuickGenerateTable_delete_btn(row) {
			    	for(let i = 0; i < this.addForm.quickGenerateTable.data.length; i++ ) {
						if(row === this.addForm.quickGenerateTable.data[i]) {
							this.addForm.quickGenerateTable.data.splice(i, 1);
						}
					}
			    },
			    usingSerialNumberManagement(val) {
			    	for(let i = 0; i < this.addForm.initSetTable.length; i++ ) {
			    		if(this.addForm.initSetTable[i].initialNumber) {
			    			this.$message({
			    				type: 'error',
			    				message: '期初数量已设置，不可更改！可删除该数据之后切换'
			    			})
			    			this.addForm.serialNumberManagement = false;
			    			return;
			    		}
			    	}
			    },
			    openEnterSerialNumberDialog(row, prop) {
			    	//
			    },
			    addTabClick() {
			    	//
			    },
			    saveAddSerialNumber() {
			    	//
			    },
			    handleAddEnterSerialNumberAddRow() {
			    	//
			    },
			    handleAddEnterSerialNumberDeleteRow() {
			    	//
			    },
			    addBatchGenerateSerialNumber() {
			    	/**
			    	 * zeroLength 起始号0开头长度
			    	 * @param  {Boolean} isNaN(this.addEnterSerialNumberForm.startNumber) [description]
			    	 * @return {[type]}                                                   [description]
			    	 */
			    	//addEnterSerialNumberForm.table table数据
			    	//serialNumber 生成的序列号
			    	//remark 备注
			    	if(isNaN(this.addEnterSerialNumberForm.startNumber.trim())) {
			    		this.$message({
			    			type: 'error',
			    			message: '起始号非法！'
			    		})
			    		return;
			    	};
			    	let zeroLength = 0
			    	,strArr = this.addEnterSerialNumberForm.startNumber.trim().split('')
			    	,zeroStr = '';
			    	for(let i = 0, strLength = strArr.length; i < strLength; i++) {
			    		if(strArr[i] != 0) {
			    			break;
			    		}
			    		zeroLength++;
			    	}
			    	for(let k = 0; k < zeroLength; k++) {
			    		zeroStr += '0';
			    	}
			    	if(this.addEnterSerialNumberForm.number > 0) {
			    		/**
			    		 * 转换起始值为整数
			    		 * 转换递增值为整数
			    		 * @type {[type]}
			    		 */
			    		let initNumber = Number.parseInt(this.addEnterSerialNumberForm.startNumber)
			    		,increment = Number.parseInt(this.addEnterSerialNumberForm.increment)
			    		,incrementSerialNumber = initNumber;

			    		/**
			    		 * 遍历录入序列号录入个数
			    		 * 序列号字符串
			    		 * 空对象
			    		 */

			    		for(let j = 0; j < this.addEnterSerialNumberForm.number; j++ ) {
			    			let numberStr = ''
			    			,obj = {
			    				editFlag: false
			    			};

			    			if(this.addEnterSerialNumberForm.prefix) {
			    				obj.serialNumber = this.addEnterSerialNumberForm.prefix + zeroStr + initNumber + incrementSerialNumber;
			    			} else {
			    				obj.serialNumber = zeroStr + incrementSerialNumber;
			    			}
			    			/**
			    			 * 判断对象内序列号的值是否重复
			    			 * @param  {[type]} let o             [description]
			    			 * @return {[type]}     [description]
			    			 */
			    			for(let o = 0; o < this.addEnterSerialNumberForm.table.length; o++ ) {
			    				if(obj.serialNumber === this.addEnterSerialNumberForm.table[o].serialNumber) {
			    					obj.remark = '与第' + Number.parseInt(o + 1) + '行序列号重复';
			    					obj.isRepeat = true;
			    					break;
			    				}
			    			}

			    			this.addEnterSerialNumberForm.table.push(obj);
			    			incrementSerialNumber += increment;
			    		}
			    	}
			    },
			    addCodyGenerateSerialNumber() {
			    	//
			    },
			    addEnterSerialNumberFormRowClick(row) {
			    	this.addEnterSerialNumberForm.table.forEach((item)=> {
						item.editFlag = false;
					})
					for(let i = 0; i < this.addEnterSerialNumberForm.table.length; i++ ) {
						if(row === this.addEnterSerialNumberForm.table[i]) {
							this.addEnterSerialNumberForm.table[i].editFlag = true;
						}
					}
			    }
			},
			watch: {
				//
			},
			filters: {
				formatDate(value) {
					if(!value) return;
					let formatValue = new Date(value);
					return formatValue.getFullYear() + '-' + `${formatValue.getMonth() + 1 < 10 ? '0' + (formatValue.getMonth() + 1) : (formatValue.getMonth() + 1)}` + '-' +  `${formatValue.getDate() < 10 ? '0' + formatValue.getDate() : formatValue.getDate()}`;
				},
				doubleDecimals(value) {
					if(isNaN(value)) return;
					let val = Math.round(parseFloat(value)*100)/100;
					let xsd = val.toString().split(".");
					if(xsd.length == 1){
					val = val.toString() + ".00";
						return val;
					}
					if(xsd.length > 1){
						if(xsd[1].length < 2){
							val = val.toString() + "0";
						}
						return val;
					}
				}
			}
		})
	}

	that.init = (searchUrl, quickQueryUrl, auxiliaryAttributesClassifyUrl, repoUrl, startUsingUrl, deleteUrl, examineUrl, saveAddUrl, getEditUrl, saveEditUrl, uploadUrl, getExportFormUrl, toggleCommonUseUrl, getImageUrl, quickGenerateUrl, addAuxiliaryAttributesClassifyUrl)=> {
		_this.init(searchUrl, quickQueryUrl, auxiliaryAttributesClassifyUrl, repoUrl, startUsingUrl, deleteUrl, examineUrl, saveAddUrl, getEditUrl, saveEditUrl, uploadUrl, getExportFormUrl, toggleCommonUseUrl, getImageUrl, quickGenerateUrl, addAuxiliaryAttributesClassifyUrl);
	}

	return that;
}