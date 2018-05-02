JGBVue = {
	module: {}
};

JGBVue.module.commodityInfo = ()=> {
	const _this = {}
	,that = {};

	_this.init = (getIdUrl, searchUrl, quickQueryUrl, duodanweiUrl, auxiliaryAttributesClassifyUrl, repoUrl, startUsingUrl, deleteUrl, examineUrl, saveAddUrl, getEditUrl, saveEditUrl, uploadUrl, getExportFormUrl, toggleCommonUseUrl, getImageUrl, quickGenerateUrl, addAuxiliaryAttributesClassifyUrl, defaultColumnSettingUrl, columnSettingCompleteUrl, addCheckNumberIsRepeatUrl)=> {
		that.vm = new Vue({
			el: '#app',
			data() {
				return {
					table: {
						header: [],
						data: []
					},
					tempTable: [],
					search: {
						input: ''
					},
					multipleOption: [],
					multipleTotalOption: [],
					addMultiplePreferredOutOption: [],
					addMultiplePreferredEnterOption: [],
					editMultiplePreferredOutOption: [],
					editMultiplePreferredEnterOption: [],
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
					addVisible: false,
					editVisible: false,
					loadingSaveAdd: false,
					loadingDetailInfo: false,
					formRules: {
						number: [
							{required: true, message: '请输入客户编号'}
						],
						name: [
							{required: true, message: '请输入客户名称'}
						],
						jibendanwei: [
							{required: true, message: '请输入基本单位'}
						]
					},
					auxiliaryAttributesClassify: [], //添加-点击属性分类-父属性
					auxiliaryAttributesClassifyChildren: [], //添加-点击属性分类-子属性
					initQuickGenerateTable: [],
					addForm: {
						number: null,
						name: '',
						commodityCategory: '',
						barCode: '',
						specifications: '',
						primaryRepo: '',
						commodityBrand: '',
						unitOfMeasurement: '',
						multiple: '',
						multipleTable: [],
						retailPrice: '',
						tradePrice: '',
						lowestPrince: '',
						highestPrince: '',
						discountRate1: '',
						discountRate2: '',
						discountRate3: '',
						expectPurchasePrice: '',
						multipleTotalOption: [],
						multiplePreferredOutOption: [],
						multiplePreferredEnterOption: [],
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
						],
						enterSerialNumberTable: []
					},
					editForm: {
						number: null,
						name: '',
						commodityCategory: '',
						barCode: '',
						specifications: '',
						primaryRepo: '',
						commodityBrand: '',
						unitOfMeasurement: '',
						multiple: '',
						multipleTable: [],
						retailPrice: '',
						tradePrice: '',
						lowestPrince: '',
						highestPrince: '',
						discountRate1: '',
						discountRate2: '',
						discountRate3: '',
						expectPurchasePrice: '',
						multipleTotalOption: [],
						multiplePreferredOutOption: [],
						multiplePreferredEnterOption: [],
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
						],
						enterSerialNumberTable: []
					},
					addSelectedAxiliaryAttributesClassify: [],
					editSelectedAxiliaryAttributesClassify: [],
					addFormBasicData: {
						commodityCategory: [],
						primaryRepo: [],
						unitOfMeasurement: [],
					},
					editFormBasicData: {
						commodityCategory: [],
						primaryRepo: [],
						unitOfMeasurement: [],
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
					edit_initSetTable_header: [],
					loading: false,
					addEnterSerialNumberVisible: false,
					addBatchSetWrap: false,
					addEnterSerialNumberForm: {
						startNumber: '001',
						increment: 1,
						number: 1,
						table: [
							{
								index: 1,
								editFlag: false
							},
							{
								index: 2,
								editFlag: false
							}
						]
					},
					editEnterSerialNumberVisible: false,
					editBatchSetWrap: false,
					editEnterSerialNumberForm: {
						startNumber: '001',
						increment: 1,
						number: 1,
						table: [
							{
								index: 1,
								editFlag: false
							},
							{
								index: 2,
								editFlag: false
							}
						]
					},
					showColumnSetting: false,
					addNewMultipleDialogVisible: false,
					newUnit: {
						jibendanwei: '',
						fudanwei: []
					}
				}
			},
			mounted() {
				this.searchData();
				this.getQuickQuery();
				this.getRepo();
				this.getAuxiliaryAttributesClassify();
				this.getMultiple();
				this.getId();
			},
			methods: {
				getId() {
					axios.get(getIdUrl).then((res)=> {
						if(res.data.status) {
							this.addForm.number = res.data.data;
						}
					})
				},
				searchData(val) {
					let _self = this;
					axios.get(searchUrl, val).then((res)=> {
						if(res.data.status) {
							let jdata = JSON.parse(res.data.data);
							this.table.header = [];
							this.table.data = [];
							this.table.header = jdata.header.concat();
							this.tempTable = jdata.data.concat();
							this.tempTable.forEach((item)=> {
								if(!_self.isShowForbiddenEquipment) {
									if(item.status) {
										_self.table.data.push(item);
									}
								}else{
									_self.table.push(item);
								}
							});
						}
					}).catch((err)=> {
						console.log('axios err: ', err);
					});
				},
				getMultiple() {
					axios.get(duodanweiUrl).then((res)=> {
						let _self = this;
						if(res.data.status) {
							let jdata = JSON.parse(res.data.data);
							this.multipleOption = jdata.concat();
							jdata.forEach((item)=> {
								let obj = {}
								,label = ''
								,value = ''
								,labelArr = []
								,beishuArr = [];
								labelArr.push(item.jibendanwei);
								beishuArr.push(1);
								item.fudanwei.forEach((fdw)=> {
									labelArr.push(fdw.value);
									beishuArr.push(fdw.beishu);
								})
								obj.label = labelArr.join(',') + '(' +beishuArr.join(',') + ')';
								obj.value = item.jibendanwei;
								_self.multipleTotalOption.push(obj);
							})
						}
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
                    this.$refs.table.data.clearSelection();
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
							this.table.data.splice(0, _self.table.data.length);
							this.tempTable.splice(0, _self.tempTable.length);
							jdata.forEach((item)=> {
								_self.tempTable.push(item);
							});
							this.tempTable.forEach((item)=> {
								if(!_self.isShowForbiddenCommodity) {
									if(item.status) {
										_self.table.data.push(item);
									}
								}else{
									_self.table.data.push(item);
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
					axios.post(startUsingUrl, row).then((res)=> {
						this.loadingDetailInfo = true;
						if(res.data.status) {
							this.$message({
								type: 'success',
								message: res.data.message
							})
							this.loadingDetailInfo = false;
							this.forbidden();
						}
					}).catch((err)=> {
						console.log('err: ', err);
					})
					console.log('this.selectedRows: ', this.selectedRows)
				},
				forbidden() {
					let _self = this
					,arr = [];
					this.selectedRows.forEach((item, index)=> {
						for(let i = 0; i < _self.tempTable.length; i++ ) {
							if(item.commodityNumber === _self.tempTable[i].commodityNumber) {
								_self.tempTable[i].status = false;
							}
						}
					});
					this.table.data.splice(0, _self.table.data.length);
					this.tempTable.forEach((item)=> {
						if(!_self.isShowForbiddenCommodity) {
							if(item.status) {
								_self.table.data.push(item);
							}
						}else{
							_self.table.data.push(item);
						}
					})
					if(!this.isShowForbiddenCommodity) {
						this.selectedRows = [];
					}
				},
				startUsing() {
					let _self = this
					,arr = [];
					axios.post(startUsingUrl, this.selectedRows).then((res)=> {
						if(res.data.status) {
							this.selectedRows.forEach((item, index)=> {
								for(let i = 0; i < _self.tempTable.length; i++ ) {
									if(item.commodityNumber === _self.tempTable[i].commodityNumber) {
										_self.tempTable[i].status = true;
									}
								}
							});
						}
					})
				},
				toggleForbiddenCommdity() {
					let _self = this;
					this.table.data.splice(0, _self.table.data.length);
					this.tempTable.forEach((item)=> {
						if(this.isShowForbiddenCommodity) {
							_self.table.data.push(item);
						}else{
							if(item.status) {
								_self.table.data.push(item);
							}
						}
					})
				},
				rowStatusClassName({row, rowIndex}) {
					if(!row.status) {
						return 'forbidden-row';
					}
				},
				addQuickGenerateRowClick(row) {
					this.$toggleRowEditable(this.addForm.quickGenerateTable.data, row);
				},
				editQuickGenerateRowClick(row) {
					this.$toggleRowEditable(this.editForm.quickGenerateTable.data, row);
				},
				addRowClickInitSetTable(row, event, column) {
					this.$toggleRowEditable(this.addForm.initSetTable, row);
				},
				addFormTableAdd() {
					this.$addRow(this.addForm.table)
				},
				editFormTableAdd() {
					this.$addRow(this.editForm.table)
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
							for(let i = 0; i < this.table.data.length; i++ ) {
								if(row === this.table.data[i]) {
									this.table.data[i].isCommonUse = !this.table.data[i].isCommonUse;
									this.$message({
										type: 'success',
										message: res.data.message
									})
									return;
								}
							}
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
				addLowestInventoryHeader(createElement, { column }) {
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
									on: { click: this.addShowLowestInventoryPopover }
								}, ['批量']
							)
						]
					);
				},
				addHighestInventoryHeader(createElement, { column }) {
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
									on: { click: this.addShowHighestInventoryPopover }
								}, ['批量']
							)
						]
					);
				},
				editLowestInventoryHeader(createElement, { column }) {
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
									on: { click: this.editShowLowestInventoryPopover }
								}, ['批量']
							)
						]
					);
				},
				editHighestInventoryHeader(createElement, { column }) {
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
									on: { click: this.editShowHighestInventoryPopover }
								}, ['批量']
							)
						]
					);
				},
				addShowLowestInventoryPopover(e) {
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
				addShowHighestInventoryPopover(e) {
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
			    editShowLowestInventoryPopover(e) {
					let _self = this;
					this.$prompt(' ', '请输入最低库存量', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
			        }).then(({ value }) => {
						this.editForm.repo.forEach((item)=> {
							item.lowestInventory = value;
						})
			        }).catch(() => {
						this.$message({
							type: 'info',
							message: '取消输入'
						});       
			        });
				},
				editShowHighestInventoryPopover(e) {
					this.$prompt('请输入邮箱', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
			        }).then(({ value }) => {
						this.editForm.repo.forEach((item)=> {
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
					this.$toggleRowEditable(this.addForm.repo, row);
			    },
			    editRowClick(row) {
					this.$toggleRowEditable(this.editForm.repo, row);
			    },
			    /**
			     * 点击辅助属性分类
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
			    editChangeAuxiliaryAttributesClassify(arr) {
			    	let _self = this;
			    	this.editSelectedAxiliaryAttributesClassify = [];
			    	this.editForm.quickGenerateTable.header = [];
			    	arr.forEach((item)=> {
			    		for(let i = 0; i < _self.auxiliaryAttributesClassify.length; i++ ) {
			    			if(item === _self.auxiliaryAttributesClassify[i].value) {
			    				let obj = {};
			    				let hObj = {};
			    				obj.parentName = _self.auxiliaryAttributesClassify[i].label;
			    				obj.children = _self.auxiliaryAttributesClassify[i].chilren;
			    				_self.editSelectedAxiliaryAttributesClassify.push(obj);
			    				hObj.label = _self.auxiliaryAttributesClassify[i].label;
			    				hObj.prop = _self.auxiliaryAttributesClassify[i].value;
			    				_self.editForm.quickGenerateTable.header.splice(0, 0, hObj);
			    			}
			    		}
			    	})
			    },
			    /**
			     * 点击属性分类子属性
			     * @param {[type]} arr [description]
			     */
			    addChangeAuxiliaryAttributesClassifyChildren(arr) {
			    	//
			    },
			    editChangeAuxiliaryAttributesClassifyChildren(arr) {
			    	//
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
			    quickGenerate(formName) {
			    	for(let i = 0; i < this.addSelectedAxiliaryAttributesClassify.length; i++ ) {
			    		console.log('addSelectedAxiliaryAttributesClassify: ', this.addSelectedAxiliaryAttributesClassify[i].children);

			    	}
			    	/*this.$message({
		    			type: 'warning',
		    			message: '请选择至少选择一个属性'
		    		})*/
			    },
			    quickGenerateTable_add_btn(formName) {
			    	let index = this[formName].quickGenerateTable.data[this[formName].quickGenerateTable.data.length - 1].index + 1;
					let initFormRow = {
						index: 0,
						editFlag: false
					}
					initFormRow.index = index;
					this[formName].quickGenerateTable.data.push(initFormRow);
			    },
			    quickGenerateTable_delete_btn(row, formName) {
			    	if(this.addForm.quickGenerateTable.data.length === 1) {
			    		this.$message({
			    			type: 'warning',
			    			message: '请至少保留一行'
			    		})
			    		return;
			    	}
			    	for(let i = 0; i < this.addForm.quickGenerateTable.data.length; i++ ) {
						if(row === this.addForm.quickGenerateTable.data[i]) {
							this.addForm.quickGenerateTable.data.splice(i, 1);
						}
					}
			    },
			    quickGenerateUploadPic(event, data, row) {
			    	for(let i = 0; i < data.length; i++ ) {
			    		if(data[i] === row) {
			    			data[i].upload = event.target.files[0];
			    		}
			    	}
			    },
			    quickGenerateHeader(createElement, { column }) {
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
	    					for(let j = 0; j < _self.auxiliaryAttributesClassify[i].chilren.length; j++ ) {
    							if(_self.auxiliaryAttributesClassify[i].chilren[j].checked) {
    								let obj = {};
    								obj.label = _self.auxiliaryAttributesClassify[i].chilren[j].label;
    								obj.value = _self.auxiliaryAttributesClassify[i].chilren[j].value;
    								_self.quickGenerateOption.push(obj);
    							}
    						}
	    				}
	    			}
		    	},
		    	handleAddInitSetAdd() {
					let obj = {
						shelfLife: null
					}
					this.$addRow(this.addForm.initSetTable, obj);
		    	},
		    	handleAddInitSetDelete(index, row) {
					let _self = this;
					this.$deleteRow(this.addForm.initSetTable, row, _self);
		    	},
		    	handleEditInitSetAdd() {
					let obj = {
						shelfLife: null
					}
					this.$addRow(this.editForm.initSetTable, obj);
		    	},
		    	handleEditInitSetDelete(index, row) {
					let _self = this;
					this.$deleteRow(this.editForm.initSetTable, row, _self);
		    	},
		    	addToggleBatchExpirationDateManagement(val) {
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
		    	editToggleBatchExpirationDateManagement(val) {
		    		let _self = this;
		    		this.edit_initSetTable_header = [];
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
		    				_self.edit_initSetTable_header.push(item);
		    			})
		    		}
		    	},
		    	/**
		    	 * 选择生产日期
		    	 * @param {[type]} val  [description]
		    	 * @param {[type]} row  [description]
		    	 * @param {[type]} prop [description]
		    	 */
		    	addFormInitSetTablePickDate(val, row, prop) {
		    		let _self = this
	    			,ms = new Date(val).getTime() + (Number.parseInt(_self.addForm.shelfLife)*24*60*60*1000 || 0)
	    			,formatValue = new Date(ms);

	    			for(let i = 0; i < this.addForm.initSetTable.length; i++) {
	    				if(this.addForm.initSetTable[i] === row) {
	    					this.addForm.initSetTable[i].validUntil = this.formatDate(formatValue);
	    				}
	    			}
		    	},
		    	editFormInitSetTablePickDate(val, row, prop) {
		    		let _self = this
	    			,ms = new Date(val).getTime() + (Number.parseInt(_self.editForm.shelfLife)*24*60*60*1000 || 0)
	    			,formatValue = new Date(ms);
	    			
	    			for(let i = 0; i < this.editForm.initSetTable.length; i++) {
	    				if(this.editForm.initSetTable[i] === row) {
	    					this.editForm.initSetTable[i].validUntil = this.formatDate(formatValue);
	    				}
	    			}
		    	},
		    	/**
		    	 * 输入保质期天数
		    	 */
		    	addChangeShelfLife() {
		    		let _self = this;

    				this.addForm.initSetTable.forEach((item)=> {
		    			item.shelfLife = _self.addForm.shelfLife;
		    		});

		    		for(let i = 0; i < this.addForm.initSetTable.length; i++) {
		    			let productionDate = new Date(this.addForm.initSetTable[i].productionDate).getTime() || 0
		    			,shelfLife = Number.parseInt(this.addForm.initSetTable[i].shelfLife)*24*60*60*1000 || 0
		    			,formatDate = productionDate + shelfLife;
    					this.addForm.initSetTable[i].validUntil = this.formatDate(new Date(formatDate));
	    			}
		    	},
		    	editChangeShelfLife() {
		    		let _self = this;
    				this.editForm.initSetTable.forEach((item)=> {
		    			item.shelfLife = _self.editForm.shelfLife;
		    		});
		    		for(let i = 0; i < this.editForm.initSetTable.length; i++) {
		    			let productionDate = new Date(this.editForm.initSetTable[i].productionDate).getTime() || 0
		    			,shelfLife = Number.parseInt(this.editForm.initSetTable[i].shelfLife)*24*60*60*1000 || 0
		    			,formatDate = productionDate + shelfLife;
    					this.editForm.initSetTable[i].validUntil = this.formatDate(new Date(formatDate));
	    			}
		    	},
		    	formatDate(val) {
		    		console.log('val: ', val);
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
		    	editFormInitialNumberChange(val, row) {
		    		if(isNaN(Number(val))) return;
		    		for(let i = 0; i < this.editForm.initSetTable.length; i++) {
	    				if(this.editForm.initSetTable[i] === row) {
	    					if(!isNaN(this.editForm.initSetTable[i].unitCost)) {
	    						this.editForm.initSetTable[i].atFirstTotalPrice = this.editForm.initSetTable[i].unitCost*val;
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
		    	editFormUnitCostChange(val, row) {
		    		if(isNaN(Number(val))) return;
		    		for(let i = 0; i < this.editForm.initSetTable.length; i++) {
	    				if(this.editForm.initSetTable[i] === row) {
	    					if(!isNaN(this.editForm.initSetTable[i].initialNumber)) {
	    						this.editForm.initSetTable[i].atFirstTotalPrice = this.editForm.initSetTable[i].initialNumber*val;
	    					}
	    				}
	    			}
		    	},
			    addUsingSerialNumberManagement(val) {
			    	if(this.addForm.enterSerialNumberTable.length !== 0) {
			    		this.$message({
		    				type: 'error',
		    				message: '期初数量已设置，不可更改！可删除该数据之后切换'
		    			})
		    			this.addForm.serialNumberManagement = true;
		    			return;
			    	}
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
			    editUsingSerialNumberManagement(val) {
			    	if(this.editForm.enterSerialNumberTable.length !== 0) {
			    		this.$message({
		    				type: 'error',
		    				message: '期初数量已设置，不可更改！可删除该数据之后切换'
		    			})
		    			this.editForm.serialNumberManagement = true;
		    			return;
			    	}
			    	for(let i = 0; i < this.editForm.initSetTable.length; i++ ) {
			    		if(this.editForm.initSetTable[i].initialNumber) {
			    			this.$message({
			    				type: 'error',
			    				message: '期初数量已设置，不可更改！可删除该数据之后切换'
			    			})
			    			this.editForm.serialNumberManagement = false;
			    			return;
			    		}
			    	}
			    },
			    saveAddSerialNumber() {
			    	let serialNumberLen = 0;
			    	for(let i = 0; i < this.addEnterSerialNumberForm.table.length; i++) {
			    		if(this.addEnterSerialNumberForm.table[i].isRepeat) {
			    			return;
			    		}
			    	}
			    	for(let i = 0; i < this.addEnterSerialNumberForm.table.length; i++) {
			    		if(this.addEnterSerialNumberForm.table[i].serialNumber) {
			    			serialNumberLen++;
			    		}
			    	}
			    	if(serialNumberLen > 0) {
			    		this.addEnterSerialNumberForm.table.forEach((item)=> {
			    			if(item.serialNumber&&!item.isRepeat) {
			    				this.addForm.enterSerialNumberTable.push(item);
			    			}
			    		});
			    		this.addEnterSerialNumberVisible = false;
			    	}else{
			    		this.$message({
				    		type: 'warning',
				    		message: '请输入序列号'
				    	})	
			    	}
			    },
			    saveEditSerialNumber() {
			    	let serialNumberLen = 0;
			    	for(let i = 0; i < this.editEnterSerialNumberForm.table.length; i++) {
			    		if(this.editEnterSerialNumberForm.table[i].isRepeat) {
			    			return;
			    		}
			    	}
			    	for(let i = 0; i < this.editEnterSerialNumberForm.table.length; i++) {
			    		if(this.editEnterSerialNumberForm.table[i].serialNumber) {
			    			serialNumberLen++;
			    		}
			    	}
			    	if(serialNumberLen > 0) {
			    		this.editEnterSerialNumberForm.table.forEach((item)=> {
			    			if(item.serialNumber&&!item.isRepeat) {
			    				this.editForm.enterSerialNumberTable.push(item);
			    			}
			    		});
			    		this.editEnterSerialNumberVisible = false;
			    	}else{
			    		this.$message({
				    		type: 'warning',
				    		message: '请输入序列号'
				    	})	
			    	}

			    },
			    addEnterSerialNumberInputBlur(row, serialNumber, index) {
			    	for(let i = 0; i < this.addEnterSerialNumberForm.table.length; i++ ) {
			    		if(this.addEnterSerialNumberForm.table[i].index === index){
			    			continue;
			    		}else if(this.addEnterSerialNumberForm.table[i].serialNumber === serialNumber) {
			    			this.addEnterSerialNumberForm.table[index-1].isRepeat = true;
			    			this.addEnterSerialNumberForm.table[index-1].remark = '与第' + Number.parseInt(i + 1) + '行序列号重复';
			    			return;
			    		}
			    	}
			    	this.addEnterSerialNumberForm.table[index-1].isRepeat = false;
			    	this.addEnterSerialNumberForm.table[index-1].remark = null;
			    },
			    editEnterSerialNumberInputBlur(row, serialNumber, index) {
			    	for(let i = 0; i < this.editEnterSerialNumberForm.table.length; i++ ) {
			    		if(this.editEnterSerialNumberForm.table[i].index === index){
			    			continue;
			    		}else if(this.editEnterSerialNumberForm.table[i].serialNumber === serialNumber) {
			    			this.editEnterSerialNumberForm.table[index-1].isRepeat = true;
			    			this.editEnterSerialNumberForm.table[index-1].remark = '与第' + Number.parseInt(i + 1) + '行序列号重复';
			    			return;
			    		}
			    	}
			    	this.editEnterSerialNumberForm.table[index-1].isRepeat = false;
			    	this.editEnterSerialNumberForm.table[index-1].remark = null;
			    },
			    handleAddEnterSerialNumberAddRow() {
					this.$addRow(this.addEnterSerialNumberForm.table);
			    },
			    handleAddEnterSerialNumberDeleteRow(row) {
					let _self = this;
					this.$deleteRow(this.addEnterSerialNumberForm.table, row, _self);
			    },
			    handleEditEnterSerialNumberAddRow() {
					this.$addRow(this.editEnterSerialNumberForm.table);
			    },
			    handleEditEnterSerialNumberDeleteRow(row) {
					let _self = this;
					this.$deleteRow(this.editEnterSerialNumberForm.table, row, _self);
			    },
			    addBatchGenerateSerialNumber() {
			    	let _self = this;
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
			    				index: 0,
			    				editFlag: false
			    			};

			    			if(this.addEnterSerialNumberForm.prefix) {
			    				obj.serialNumber = this.addEnterSerialNumberForm.prefix + zeroStr + initNumber + incrementSerialNumber;
			    			} else {
			    				obj.serialNumber = zeroStr + incrementSerialNumber;
			    			}

			    			obj.index = this.addEnterSerialNumberForm.table[this.addEnterSerialNumberForm.table.length - 1]['index'] + 1;
			    			/**
			    			 * 判断对象内序列号的值是否重复
			    			 * @param  {[type]} let o             [description]
			    			 * @return {[type]}     [description]
			    			 */
			    			Object.assign(obj, this.$checkSerialNumberIsRepeat(this.addEnterSerialNumberForm.table, obj));


			    			for(let m = this.addEnterSerialNumberForm.table.length - 1; m >= 0; m--) {
			    				if(this.addEnterSerialNumberForm.table[m].serialNumber) {
			    					continue;
			    				}else{
			    					this.addEnterSerialNumberForm.table.splice(m, 1);
			    				}
			    			}
			    			this.addEnterSerialNumberForm.table.push(obj);
			    			incrementSerialNumber += increment;
			    		}
			    	}
			    },
			    editBatchGenerateSerialNumber() {
			    	let _self = this;
			    	/**
			    	 * zeroLength 起始号0开头长度
			    	 * @param  {Boolean} isNaN(this.addEnterSerialNumberForm.startNumber) [description]
			    	 * @return {[type]}                                                   [description]
			    	 */
			    	//addEnterSerialNumberForm.table table数据
			    	//serialNumber 生成的序列号
			    	//remark 备注
			    	if(isNaN(this.editEnterSerialNumberForm.startNumber.trim())) {
			    		this.$message({
			    			type: 'error',
			    			message: '起始号非法！'
			    		})
			    		return;
			    	};
			    	let zeroLength = 0
			    	,strArr = this.editEnterSerialNumberForm.startNumber.trim().split('')
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
			    	if(this.editEnterSerialNumberForm.number > 0) {
			    		/**
			    		 * 转换起始值为整数
			    		 * 转换递增值为整数
			    		 * @type {[type]}
			    		 */
			    		let initNumber = Number.parseInt(this.editEnterSerialNumberForm.startNumber)
			    		,increment = Number.parseInt(this.editEnterSerialNumberForm.increment)
			    		,incrementSerialNumber = initNumber;

			    		/**
			    		 * 遍历录入序列号录入个数
			    		 * 序列号字符串
			    		 * 空对象
			    		 */

			    		for(let j = 0; j < this.editEnterSerialNumberForm.number; j++ ) {
			    			let numberStr = ''
			    			,obj = {
			    				index: 0,
			    				editFlag: false
			    			};

			    			if(this.editEnterSerialNumberForm.prefix) {
			    				obj.serialNumber = this.editEnterSerialNumberForm.prefix + zeroStr + initNumber + incrementSerialNumber;
			    			} else {
			    				obj.serialNumber = zeroStr + incrementSerialNumber;
			    			}

			    			obj.index = this.editEnterSerialNumberForm.table[this.editEnterSerialNumberForm.table.length - 1]['index'] + 1;
			    			/**
			    			 * 判断对象内序列号的值是否重复
			    			 * @param  {[type]} let o             [description]
			    			 * @return {[type]}     [description]
			    			 */
			    			Object.assign(obj, this.$checkSerialNumberIsRepeat(this.editEnterSerialNumberForm.table, obj));


			    			for(let m = this.editEnterSerialNumberForm.table.length - 1; m >= 0; m--) {
			    				if(this.editEnterSerialNumberForm.table[m].serialNumber) {
			    					continue;
			    				}else{
			    					this.editEnterSerialNumberForm.table.splice(m, 1);
			    				}
			    			}
			    			this.editEnterSerialNumberForm.table.push(obj);
			    			incrementSerialNumber += increment;
			    		}
			    	}
			    },
			    addCodyGenerateSerialNumber() {
			    	let obj = {};
			    	obj.serialNumber = this.addEnterSerialNumberForm.copy;
			    	Object.assign(obj, this.$checkSerialNumberIsRepeat(this.addEnterSerialNumberForm.table, obj));
			    	obj.index = this.addEnterSerialNumberForm.table[this.addEnterSerialNumberForm.table.length - 1]['index'] + 1;
			    	this.addEnterSerialNumberForm.table.push(obj);
			    },
			    editCodyGenerateSerialNumber() {
			    	let obj = {};
			    	obj.serialNumber = this.editEnterSerialNumberForm.copy;
			    	Object.assign(obj, this.$checkSerialNumberIsRepeat(this.editEnterSerialNumberForm.table, obj));
			    	obj.index = this.editEnterSerialNumberForm.table[this.editEnterSerialNumberForm.table.length - 1]['index'] + 1;
			    	this.editEnterSerialNumberForm.table.push(obj);
			    },
			    addEnterSerialNumberFormRowClick(row) {
					this.$toggleRowEditable(this.addEnterSerialNumberForm.table, row);
			    },
			    editEnterSerialNumberFormRowClick(row) {
					this.$toggleRowEditable(this.editEnterSerialNumberForm.table, row);
			    },
			    addCheckAttributesNumber(val) {
			    	//检查属性编号
			    	if(!val) {
			    		this.$message({
			    			type: 'warning',
			    			message: '请输入编号!'
			    		})
			    	}
			    	/*axios.post().then((res)=> {
			    		
			    	})*/
			    },
			    btnColumnSettingReset() {
					axios.post(defaultColumnSettingUrl).then(res=> {
						if(res.data.status) {
							this.table.header= [];
							this.table.header = JSON.parse(res.data.data)
							this.$message({
								type: 'success',
								message: res.data.message
							})
							this.showColumnSetting = false;
						} else {
							this.$message({
								type: 'error',
								message: res.data.status,
								center: true
							})
						};
					}).catch((err)=> {
						console.log(err)
						this.$message({
							type: 'error',
							message: err,
							center: true
						})
					})
				},
				btnColumnSettingComplete() {
					axios.post(columnSettingCompleteUrl, this.table.header).then(res=> {
						if(res.data.status) {
							this.$message({
								type: 'success',
								message: res.data.message
							});
							this.showColumnSetting = false;
						} else {
							this.$message({
								type: 'error',
								message: res.data.status,
								center: true
							})
						};
					}).catch((err)=> {
						console.log(err)
						this.$message({
							type: 'error',
							message: err,
							center: true
						})
					})
				},
				addChangeMultipleTotalSelect(val) {
					let _self = this
					,obj = {}
					,tableObj = {
						editFlag: false
					}
					,index = 1;
					this.addForm.multiplePreferredOutOption = null;
					this.addForm.multiplePreferredEnterOption = null;
					this.addMultiplePreferredOutOption = [];
					this.addMultiplePreferredEnterOption = [];

					obj.label = val;
					obj.value = val;
					_self.addMultiplePreferredOutOption.push(obj);
					_self.addMultiplePreferredEnterOption.push(obj);

					this.addForm.multipleTable = [];

					tableObj.unitName = '基本单位';
					tableObj.unitOfMeasurement = val;

					this.addForm.multipleTable.push(tableObj);
					for (var i = this.multipleOption.length - 1; i >= 0; i--) {
						if(this.multipleOption[i].jibendanwei === val) {
							this.multipleOption[i].fudanwei.forEach((item)=> {
								let obj1 = {}
								,tableObj1 = {
									editFlag: false
								};

								obj1.label = item.value;
								obj1.value = item.value;
								_self.addMultiplePreferredOutOption.push(obj1);
								_self.addMultiplePreferredEnterOption.push(obj1);

								tableObj1.unitName = '副单位' + index;
								tableObj1.unitOfMeasurement = item.value;
								index++;

								_self.addForm.multipleTable.push(tableObj1);
							})
						}
					}
				},
				editChangeMultipleTotalSelect(val) {
					let _self = this
					,obj = {}
					,tableObj = {
						editFlag: false
					}
					,index = 1;
					this.editForm.multiplePreferredOutOption = null;
					this.editForm.multiplePreferredEnterOption = null;
					this.editMultiplePreferredOutOption = [];
					this.editMultiplePreferredEnterOption = [];

					obj.label = val;
					obj.value = val;
					_self.editMultiplePreferredOutOption.push(obj);
					_self.editMultiplePreferredEnterOption.push(obj);

					this.editForm.multipleTable = [];

					tableObj.unitName = '基本单位';
					tableObj.unitOfMeasurement = val;

					this.editForm.multipleTable.push(tableObj);
					for (var i = this.multipleOption.length - 1; i >= 0; i--) {
						if(this.multipleOption[i].jibendanwei === val) {
							this.multipleOption[i].fudanwei.forEach((item)=> {
								let obj1 = {}
								,tableObj1 = {
									editFlag: false
								};

								obj1.label = item.value;
								obj1.value = item.value;
								_self.editMultiplePreferredOutOption.push(obj1);
								_self.editMultiplePreferredEnterOption.push(obj1);

								tableObj1.unitName = '副单位' + index;
								tableObj1.unitOfMeasurement = item.value;
								index++;

								_self.editForm.multipleTable.push(tableObj1);
							})
						}
					}
				},
				addMultipleTableRowClick(row) {
					this.$toggleRowEditable(this.addForm.multipleTable, row);
				},
				editMultipleTableRowClick(row) {
					this.$toggleRowEditable(this.editForm.multipleTable, row);
				},
				saveMultiple(formName) {
					let _self = this;
					this.$refs[formName].validate((valid)=> {
						if(valid) {
							for (var i = 0; i < this.newUnit.fudanwei.length; i++) {
								if(this.newUnit.fudanwei[i].value === undefined ||this.newUnit.fudanwei[i].beishu === undefined) {
									this.$message({
										type: 'warning',
										message: '副单位的值不能为空且倍数不能小于0'
									})
									return false;
								}
							}
							this.multipleOption.push(this.newUnit)
							this.multipleTotalOption = [];
							this.multipleOption.forEach((item)=> {
								let obj = {}
								,label = ''
								,value = ''
								,labelArr = []
								,beishuArr = [];
								labelArr.push(item.jibendanwei);
								beishuArr.push(1);
								item.fudanwei.forEach((fdw)=> {
									labelArr.push(fdw.value);
									beishuArr.push(fdw.beishu);
								})
								obj.label = labelArr.join(',') + '(' +beishuArr.join(',') + ')';
								obj.value = item.jibendanwei;
								_self.multipleTotalOption.push(obj);
							})
							this.addNewMultipleDialogVisible = false;
						}else{
							return false;
						}
					})
				},
				removeFdw(fdw) {
					for (var i = 0; i < this.newUnit.fudanwei.length; i++) {
						if(this.newUnit.fudanwei[i] === fdw) {
							this.newUnit.fudanwei.splice(i, 1);
						}
					}
				},
				addFwd() {
					let obj = {};
					this.newUnit.fudanwei.push(obj);
				},
				addCheckNumberIsRepeat() {
					axios.post(addCheckNumberIsRepeatUrl, this.addForm.number).then((res)=> {
						if(!res.data.status) {
							this.$message({
								type: 'error',
								message: '商品编号重复！'
							})
							this.addForm.number = null;
						}
					})
				},
				editCheckNumberIsRepeat() {
					axios.post(addCheckNumberIsRepeatUrl, this.editForm.number).then((res)=> {
						if(!res.data.status) {
							this.$message({
								type: 'error',
								message: '商品编号重复！'
							})
							this.editForm.number = null;
						}
					})
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

	that.init = (getIdUrl, searchUrl, quickQueryUrl, duodanweiUrl, auxiliaryAttributesClassifyUrl, repoUrl, startUsingUrl, deleteUrl, examineUrl, saveAddUrl, getEditUrl, saveEditUrl, uploadUrl, getExportFormUrl, toggleCommonUseUrl, getImageUrl, quickGenerateUrl, addAuxiliaryAttributesClassifyUrl, defaultColumnSettingUrl, columnSettingCompleteUrl, addCheckNumberIsRepeatUrl)=> {
		_this.init(getIdUrl, searchUrl, quickQueryUrl, duodanweiUrl, auxiliaryAttributesClassifyUrl, repoUrl, startUsingUrl, deleteUrl, examineUrl, saveAddUrl, getEditUrl, saveEditUrl, uploadUrl, getExportFormUrl, toggleCommonUseUrl, getImageUrl, quickGenerateUrl, addAuxiliaryAttributesClassifyUrl, defaultColumnSettingUrl, columnSettingCompleteUrl, addCheckNumberIsRepeatUrl);
	}

	return that;
}