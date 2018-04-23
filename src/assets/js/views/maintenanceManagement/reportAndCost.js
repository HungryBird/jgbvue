/**
 * created by lanw 2018-04-21
 * 维修报告与成本
 */
JGBVue = {
  module: {}
}

JGBVue.module.reportAndCost = () => {
  let _this = {}, that = {}
  _this.init = (
    businessDataGetUrl, //获取业务人员数据
    maintenanceDataGetUrl,//获取维修人员数据
    workOrderDataGetUrl,//获取工单数据
    orderInvalidUrl, //工单作废
    orderDetailsGetUrl, //获取工单详情
    dataExportRequestUrl, //导出申请地址
    printListUrl, //打印列表接口
    columnSettingUrl, //获取表头 列设置
    defaultColumnSettingUrl, //获取表头 列设置默认数据
    userDataGetUrl, //获取当前用户信息
    accessoriesListGetUrl, //查询配件信息
    deliveryOrderUrl, //交付工单接口
    reportDataCheckExistUrl, //工单是否已有维修报告
    costDataCheckExistUrl, //工单是否已有最终成本
    editMaintenanceReportUrl, //暂存、确认新增维修报告
    submitFinalCostUrl //提交最终成本
  ) => {
    that.vm = new Vue({
      el: '#app',
      data: function () {
        let validateCost = (rule, value, callback) => {
          let reg = /^[1-9]\d*(\.\d{1,2})?|0\.\d{1,2}|0$/g
          value = value.toString()
          if (value != value.match(reg)) {
            callback(new Error('请输入正确的金额'));
          } 
          else {
            if (value < 0) {
              callback(new Error('金额必须大于等于0'));
            } else {
              callback();
            };
          };
        }
        return {
          selectForm: { //表单
            dateRange: [], //日期范围
            businessCurrent: '',//业务人员
            maintenanceCurrent: '', //维修人员
            keyword: '', //查询关键词
            checkedStatus: [8], //工单状态
            sort: { //默认按工单日期排序
              prop: "date",
              order: "descending"
            },
          },
          formTimeRangeDefault: ['00:00:00', '23:59:59'], //表单 默认起止时间
          formBusinessList: [], //表单 业务人员组
          formMaintenanceList: [], //表单 维修人员组
          formAccessoriesList: [], //配件组
          formOrderStatus: [ //工单状态 *value会关联html显示按钮组的判断条件,v-if需同步修改
            { label: '完成维修', value: 8 },
          ],
          // formStatusCheckAll: true, //绑定工单状态全选

          orderList: [], //工单数据
          orderPage: { //工单分页
            page_current: 0,
            page_size: 10,
            page_total: 0,
          }, 
          tableHeader: [], //表头

          selectedRows: [], //表格选中行

          showOrderDetails: false, //工单详情
          isLoadingDetails: false, //工单详情加载
          detailsTabActive: 'baseInfo', //详情页标签 选中项
          detailsData: {}, //详情页数据

          showPictures: false, //查看图片 窗
          pictureList: [], //图片列表

          showExport: false, //导出 窗
          exportChecked: [], //导出选中项 *所有可选项与tableHeader关联
          isLoadingExportRequest: false, //是否正在请求导出数据状态

          showColumnSetting: false, //列设置 窗
          loadingColumnSettingComplete: false, //正在写入新的列设置
          loadingColumnSettingReset: false, //正在恢复默认的列设置

          userData: {}, //用户信息 用于填入诊断人员默认项
          currentOrder: "", //打开测试、送修、换人修窗口时对应的工单号

          showReportAddForm: false, //新增维修报告
          reportAddForm: {},  //新增维修报告表单数据
          defaultReportAddForm: { //新增维修报告默认空数据
            title: "",
            order_id: "",
            date: "",

            order_date: "",
            client_name: "",
            maintenance_company: "",
            equipment_name: "",
            equipment_category: "",
            equipment_brand: "",
            equipment_source: "",
            equipment_method: "",
            level: "",
            maintenance_person: "",
            maintenance_phone: "",
            order_fin: "",
            
            fault_info: "",
            fault_reason: "",
            maintenance_way: "",
            maintenance_fin: "",

            rengong: "",
            anzhuang: "",
            peijian: "",
            peisong: "",
            qita: "",

            remark: "",

            opinion: "",
            sign: "",
            sign_date: "",
          }, 
          reportAddFormRules: { //新增维修报告表单验证规则
            title: { required: true, message: '请填写报告标题', trigger: 'blur' },
            date: { required: true, message: '请选择编写日期', trigger: 'blur' },
            order_id: { required: true, message: '请填写工单编号', trigger: 'blur' },
            order_date: { required: true, message: '请选择工单日期', trigger: 'blur' },
            client_name: { required: true, message: '请选择客户', trigger: 'blur' },
            maintenance_company: { required: true, message: '请选择维修公司', trigger: 'blur' },
            equipment_name: { required: true, message: '请选择设备', trigger: 'blur' },
            level: { required: true, message: '请选择紧急程度', trigger: 'blur' },
            maintenance_person: { required: true, message: '请选择维修人员', trigger: 'blur' },
            order_fin: { required: true, message: '请选择完成时间', trigger: 'blur' },
            rengong: { validator: validateCost, trigger: 'blur,change' },
            peijian: { validator: validateCost, trigger: 'blur,change' },
            peisong: { validator: validateCost, trigger: 'blur,change' },
            anzhuang: { validator: validateCost, trigger: 'blur,change' },
            qita: { validator: validateCost, trigger: 'blur,change' },
          },
          loadingReportTempStorage: false, //正在写入数据

          showFinalCost: false, //最终成本 窗
          finalCostForm: {}, //最终成本表单数据
          finalCostFormRules: { //最终成本验证规则
            anzhuang: { validator: validateCost, trigger: 'blur,change' },
            peisong: { validator: validateCost, trigger: 'blur,change' },
            qita: { validator: validateCost, trigger: 'blur,change' },
          },
          validateCost: validateCost, //公用金额验证规则
          loadingFinalCostSure: false, //正在提交最终报告
        }
      },
      computed: {
        c_menuId: function() {
          return this.$getQuery(window.location.search).menu_id
        },
      },
      methods: {
        //新增一列配件
        addOneDiagnosis: function() {
          this.diagnosisData.peijian.push({
            count: 0,
            data: {
              commodityName: "",
              specifications: "",
              commodityNumber: "",
              price: "0"
            },
            subTotal: 0
          })
        },
        //新增
        btnAdd: function() {
          //调用父级框架打开工单录入标签页
          this.$selectTab('addOrder', '工单录入', './views/workOrderManagement/addOrder.html')
        },
        //导出
        btnExport: function() {
          this.showExport = true
        },
        //导出 - 导出
        btnExportSave: function() {
          this.isLoadingExportRequest = true
          axios.post(dataExportRequestUrl, {
            export_checked: this.exportChecked
          }).then(res=> {
            if(res.data.status) {
              //调用下载
              this.showExport = false
            }
            else {
              this.$message({
                type: 'error',
                message: res.data.message,
                center: true
              })
            };
            this.isLoadingExportRequest = false
          }).catch(err=> {
            this.$message({
              type: 'error',
              message: err,
              center: true
            })
            this.isLoadingExportRequest = false
          })
        },
        //导出 - 关闭
        btnExportClose: function() {
          this.showExport = false
        },
        //作废
        btnInvalid: function() {
          let arr = []
          this.selectedRows.forEach(order=> {
            arr.push(order.order_id)
          })
          axios.post(orderInvalidUrl, {
            orderId: arr
          }).then(res=> {
            if(res.data.status) {
              this.$message({
                type: 'success',
                message: res.data.message
              })
              this.getWorkOrderData()
            }
            else {
              this.$message({
                type: 'error',
                message: res.data.message, 
                center: true
              })
            };
          }).catch(err=> {
            this.$message({
              type: 'error',
              message: err, 
              center: true
            })
          })
        },
        //查看 @param （row行数据, index行数）
        btnView: function(row, index) {
          //工单详情
          this.showOrderDetails = true
          this.getOrderDetails(row.order_id)
        },
        /**
         * 交付
         * @param {Object} row 行数据
         * @param {Number} index 行数
         */
        btnDelivery: function(row, index) {
          const h = this.$createElement
          this.$msgbox({
            title: '提示',
            message: h('p', null, `确认交付工单：${row.order_id}吗？`),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true
                instance.confirmButtonText = '交付中...'
                axios.post(deliveryOrderUrl, {
                  order_id: row.order_id
                }).then(res=> {
                  this.$message({
                    type: res.data.status ? 'success' : 'error',
                    message: res.data.message,
                    center: true
                  })
                  instance.confirmButtonLoading = false
                  done()
                }).catch(err=> {
                  console.error(err)
                  this.$message({
                    type: 'error',
                    message: err,
                    center: true
                  })
                  instance.confirmButtonLoading = false
                  done()
                })
              } else {
                done()
              }
            }
          }).then(() => {
            //如需更新工单信息请在此
            // this.getWorkOrderData()
          }).catch()
        },
        /**
         * 维修报告
         * @param {Object} row 行数据
         * @param {Number} index 行数
         */
        btnReport: function(row, index) {
          if(row.hasReport) { 
            //调用父级框架打开标签页
            this.$selectTab(
              'maintenanceReport', 
              '维修报告信息', 
              './views/maintenanceManagement/maintenanceReport.html', 
              `order_id=${row.order_id}`)
            }
            else {
              //打开新增维修报告弹窗
              this.showReportAddForm = true
              this.reportAddForm = this.$deepCopy(this.defaultReportAddForm)
              this.reportAddForm = this.$deepCopy(row.reportInfo)
              this.sumReportAddFormCost()
            };
        },
        /**
         * 新增维修报告 - 暂存、确认
         * @param {String} type temp暂存 submit确认
         */
        btnReportTempStorage: function(type) {
          this.$refs.reportAddForm.validate((valid) => {
            if (valid || type == 'temp') {
              this.loadingReportTempStorage = true
              axios.post(editMaintenanceReportUrl, {
                data: this.reportAddForm,
                type: type
              }).then(res=> {
                if(res.data.status) {
                  this.$message({
                    type: 'success',
                    message: res.data.message,
                    center: true
                  })
                  //在此处理是否关闭窗口
                  this.showReportAddForm = false
                  this.$refs.reportAddForm.resetFields()
                }
                else {
                  this.$message({
                    type: 'error',
                    message: res.data.message,
                    center: true
                  })
                };
                this.loadingReportTempStorage = false
              }).catch(err=> {
                console.error(err)
                this.$message({
                  type: 'error',
                  message: err,
                  center: true
                })
                this.loadingReportTempStorage = false
              })
            } 
            else {
              console.log('error submit!!');
              return false;
            };
          })
        },
        /**
         * 最终成本
         * @param {Object} row 行数据
         * @param {Number} index 行数
         */
        btnFinalCost: function(row, index) {
          this.showFinalCost = true
          this.$refs.finalCostForm && this.$refs.finalCostForm.resetFields()
          this.finalCostForm = this.$deepCopy(row.costInfo)
          // console.log(row.costInfo)
          //为每一条配件信息添加 小计属性
          this.finalCostForm.peijian.forEach(item=> {
            item.subTotal = Number(item.count) * Number(item.data.price)
          })
          //为最终成本表单添加合计属性
          this.sumFinalCost()
        },
        //最终成本 - 确定
        btnFinalCostSubmit: function() {
          this.$refs.finalCostForm.validate((valid) => {
            if (valid) {
              this.loadingFinalCostSure = true
              axios.post(submitFinalCostUrl, {
                data: this.finalCostForm
              }).then(res=> {
                if(res.data.status) {
                  this.$message({
                    type: 'success',
                    message: res.data.message,
                    center: true
                  })
                  //在此处理是否关闭窗口
                  this.showFinalCost = false
                  this.$refs.finalCostForm.resetFields()
                }
                else {
                  this.$message({
                    type: 'error',
                    message: res.data.message,
                    center: true
                  })
                };
                this.loadingFinalCostSure = false
              }).catch(err=> {
                console.error(err)
                this.$message({
                  type: 'error',
                  message: err,
                  center: true
                })
                this.loadingFinalCostSure = false
              })
            } 
            else {
              console.log('error submit!!');
              return false;
            };
          })
        },
        //打印列表
        btnPrintList: function() {
          let filter = this.$deepCopy(this.selectForm)
          //调用父级框架打开标签页
          //传参filter: 列表数据筛选条件 edit by lanw 2018-4-21
          //传参url: 列表获取数据接口
          //传参mid: 菜单id
          //传参hurl：获取表头数据的接口
          this.$selectTab(
            'printOrderList', 
            '打印工单列表', 
            './views/workOrderManagement/printOrderList.html', 
            `filter=${encodeURI(JSON.stringify(filter))}&&url=${printListUrl}&&mid=${this.c_menuId}&&hurl=${defaultColumnSettingUrl}`)
        },
        //打印工单
        btnPrint: function() {
          //调用父级框架打开标签页
          this.$selectTab(
            'printOrder', 
            '打印工单', 
            './views/workOrderManagement/printOrder.html', 
            `order_id=${this.selectedRows[0].order_id}`)
        },
        //列设置
        btnColumnSetting: function() {
          this.showColumnSetting = true
        },
        //列设置-恢复默认设置
        btnColumnSettingReset: function() {
          this.loadingColumnSettingReset = true
          axios.post(defaultColumnSettingUrl).then(res=> {
            if(res.data.status) {
              let header = JSON.parse(res.data.data)[this.c_menuId]
              this.tableHeader= []
              this.$nextTick(function() {
                for(let i = 0; i < header.length; i++) {
                  this.tableHeader.push(header[i])
                }
              })
            }
            else {
              this.$message({
                type: 'error',
                message: res.data.message,
                center: true
              })
            };
            this.loadingColumnSettingReset = false
          }).catch(err=> {
            console.error(err)
            this.$message({
              type: 'error',
              message: err,
              center: true
            })
            this.loadingColumnSettingReset = false
          })
        },
        //列设置-完成
        btnColumnSettingComplete: function() {
          this.loadingColumnSettingComplete = true
          axios.post(columnSettingUrl, {
            menu_id: this.c_menuId,
            list: this.tableHeader
          }).then(res=> {
            if(res.data.status) {
              this.$message({
                type: 'success',
                message: res.data.message,
                center: true
              })
            }
            else {
              this.$message({
                type: 'error',
                message: res.data.message,
                center: true
              })
            };
            this.loadingColumnSettingComplete = false
          }).catch(err=> {
            console.error(err)
            this.$message({
              type: 'error',
              message: err,
              center: true
            })
            this.loadingColumnSettingComplete = false
          })
        },
        /**
         * 调用查看图片控件
         * @param {Object, Array} data Object{图片数组, 序号} Array图片数组
         */
        callPictures: function(data) {
          data.length
            ? this.openPictureDialog(data)
            : this.openPictureDialog(data.pics, data.index)
        },
        /**
         * 下载文件
         * @param {String} data 文件地址
         */
        callDownload: function(data) {
          window.open(data)
        },
        //关闭详情页
        closeDetails: function() {
          this.showOrderDetails = false
        },
        //获取业务人员数据
        getBusinessData: function(query) {
          axios.post(businessDataGetUrl, {
            query: query || ''
          }).then(res=> {
            if(res.data.status) {
              this.formBusinessList = JSON.parse(res.data.data)
            }
            else {
              this.$message({
                type: 'error',
                message: res.data.message,
                center: true
              })
            };
          }).catch(err=> {
            this.$message({
              type: 'error',
              message: err,
              center: true
            })
          })
        },
        //获取维修人员数据
        getMaintenanceData: function(query) {
          axios.post(maintenanceDataGetUrl, {
            query: query || ''
          }).then(res=> {
            if(res.data.status) {
              this.formMaintenanceList = JSON.parse(res.data.data)
            }
            else {
              this.$message({
                type: 'error',
                message: res.data.message,
                center: true
              })
            };
          }).catch(err=> {
            this.$message({
              type: 'error',
              message: err,
              center: true
            })
          })
        },
        //获取表头数据
        getTableHeader: function() {
          axios.post(columnSettingUrl, {
            menu_id: this.c_menuId
          }).then(res=> {
            if(res.data.status) {
              this.tableHeader = JSON.parse(res.data.data)[this.c_menuId]
              // 正常接口请使用下句
              // this.tableHeader = JSON.parse(res.data.data)
            }
            else {
              this.$message({
                type: 'error', 
                message: res.data.message,
                center: true
              })
            }
          }).catch(err=> {
            this.$message({
              type: 'error', 
              message: err,
              center: true
            })
          })
        },
        //获取用户数据
        getUserData: function() {
          axios.post(userDataGetUrl).then(res=> {
            if(res.data.status) {
              this.userData = this.$deepCopy(JSON.parse(res.data.data)[1])
              // console.log('user:', this.userData)
            }
            else {
              this.$message({
                type: 'error', 
                message: res.data.message,
                center: true
              })
            };
          }).catch(err=> {
            console.error(err)
            this.$message({
              type: 'error', 
              message: err,
              center: true
            })
          })
        },
        //获取工单数据
        getWorkOrderData: function() {
          axios.post(workOrderDataGetUrl, {
            filter: this.selectForm,
            page_current: this.orderPage.page_current+1
          }).then(res=> {
            if(res.data.status) {
              let _data = JSON.parse(res.data.data)
              this.selectedRows = [] //清空选中行
              this.orderList = _data.data
              this.orderPage = this.$deepCopy(_data.page) //真实数据使用
              //为每一条数据写入检测是否存在维修报告、最终成本属性、维修报告数据、最终成本数据
              for(let i = 0; i < this.orderList.length; i++) {
                let item = this.orderList[i]
                this.setDataExist(item.order_id, i, 'report', reportDataCheckExistUrl)
                this.setDataExist(item.order_id, i, 'cost', costDataCheckExistUrl)
              }
            }
            else {
              this.$message({
                type: 'error',
                message: res.data.message, 
                center: true
              })
            };
          }).catch(err=> {
            console.error(err)
            this.$message({
              type: 'error',
              message: err, 
              center: true
            })
          })
        },
        //获取工单详情 @param {String} id 工单id
        getOrderDetails: function(id) {
          this.isLoadingDetails = true
          axios.post(orderDetailsGetUrl, {
            order_id: id
          }).then(res=> {
            if(res.data.status) {
              this.detailsData = this.$deepCopy(JSON.parse(res.data.data))
            }
            else {
              this.$message({
                type: 'error', 
                message: res.data.message,
                center: true
              })
            };
            this.isLoadingDetails = false
          }).catch(err=> {
            console.error(err)
            this.$message({
              type: 'error', 
              message: err,
              center: true
            })
            this.isLoadingDetails = false
          })
        },
        /**
         * 查询配件信息
         * @param {String} query 查询关键字
         */
        getAccessoriesList: function(query) {
          axios.post(accessoriesListGetUrl, {
            keyword: query || ''
          }).then(res=> {
            if(res.data.status) {
              this.formAccessoriesList = JSON.parse(res.data.data)
              // console.log('配件:', this.formAccessoriesList)
            }
            else {
              this.$message({
                type: 'error',
                message: res.data.message,
                center: true
              })
            };
          }).catch(err=> {
            console.error(err)
            this.$message({
              type: 'error',
              message: err,
              center: true
            })
          })
        },
        /**
         * 工单排序
         * @param {Object} obj { column行属性, prop, order排序方式}
         */
        handleOrderSort: function(obj) {
          // console.log(obj.column, obj.prop, obj.order)
          this.selectForm.sort = {
            prop: obj.prop,
            order: obj.order
          }
          this.getWorkOrderData()
        },
        //工单 分页
        handleOrderCurrentChange: function(val) {
          this.getWorkOrderData()
        },
        //工单 选择项发生变化时触发  val 选中的row数据
        handleOrderSelectionChange: function(val) {
          this.selectedRows = val.concat()
        },
        /**
         * 配件变更 根据配件id写入其他对应数据
         * @param {Number} index 配件序号
         */
        handleDiagnosisChange: function(index) {
          let target = this.diagnosisData.peijian[index].data
          let id = target.commodityNumber
          //从配件列表formAccessoriesList查找id对应的数据
          this.formAccessoriesList.forEach(item=> {
            if(item.commodityNumber == id) {
              target.commodityName = item.commodityName
              target.specifications = item.specifications
              target.price = item.price
              return;
            }
          })

          this.handleDiagnosisCountChange(index)
        },
        /**
         * 配件及其数量变更 重新计算配件价格 更新合计
         * @param {Number} index 触发事件的输入框序号
         */
        handleDiagnosisCountChange: function(index) {
          let target = this.diagnosisData.peijian[index]
          if(!target) return;
          this.$nextTick(function() {
            //向上取整用户输入的浮点数 保持配件数量为整数
            target.count = Math.ceil(target.count)
            target.subTotal = target.data.price * target.count
            this.sumDiagnosisData()
          })
        },
        /**
         * 打开图片查看窗 切换到指定图片序号
         * @param {Array} list 图片数据
         * @param {Number} index 图片位于list中的序号
         */
        openPictureDialog: function(list, index) {
          index = index || 0
          this.pictureList = list.concat()
          this.showPictures = true
          let timer = setInterval(()=> {
            this.$refs.equipmentPic.setActiveItem(index);
            clearInterval(timer)
          })
        },
        /**
         * 选择业务人员 输入时搜索
         * @param {String} query 输入值
         */
        remoteBusiness: function(query) {
          this.getBusinessData(query)
        },
        /**
         * 选择配件 输入时搜索
         * @param {String} query 输入值
         */
        remoteAccessories: function(query) {
          this.getAccessoriesList(query)
        },
        /**
         * 选择维修人员 输入时搜索
         * @param {String} query 输入值
         */
        remoteMaintenance: function(query) {
          this.getMaintenance(query)
        },
        /**
         * 删除一行配件信息
         * @param {Number} index 行数
         */
        removeOneDiagnosis: function(index) {
          this.diagnosisData.peijian.splice(index, 1)
          this.sumDiagnosisData()
        },
        //查询
        search: function() {
          if(!this.selectForm.keyword.length) {
            this.$message({
              type:'error',
              message: '请输入查询关键词'
            })
            return;
          }
          this.getWorkOrderData()
        },
        /**
         * 设置数据指定项是否存在
         * @param {String, Number} id 工单id
         * @param {String} url 检测接口
         * @param {Number} index 数据序号
         * @param {String} type 类型 report维修报告 cost最终成本
         */
        setDataExist: function(id, index, type, url) {
          axios.post(url, {
            order_id: id
          }).then(res=> {
            if(res.data.status) { 
              // console.log(`axios: ${JSON.parse(res.data.data).status}`)
              // res.data.data.status 随机true false 刷不出交付按钮 多刷几次
              let _data = JSON.parse(res.data.data)
              switch(type) {
                case 'report':
                  this.orderList[index].hasReport = _data.status
                  this.orderList[index].reportInfo = JSON.parse(_data.data)
                  break
                case 'cost':
                  this.orderList[index].hasCost = _data.status
                  this.orderList[index].costInfo = JSON.parse(_data.data)
                  break
              }
            }
            else {
              this.$message({
                type: 'error',
                message: res.data.message,
                center: true
              })
            };
          }).catch(err=> {
            console.error(err)
            this.$message({
              type: 'error',
              message: err,
              center: true
            })
          })
        },
        /**
         * 合计-成本估算
         * 费用中任意一项不匹配金额规则 不计入合计中
         */
        sumDiagnosisData: function() {
          let getCost = (value) => {
            let reg = /^[1-9]\d*(\.\d{1,2})?|0\.\d{1,2}|0$/g
            return value == value.match(reg)
                    ? Number(value)
                    : 0
          }
          let subTotal = 0
          this.diagnosisData.peijian.forEach(item=> {
            subTotal += item.subTotal
          })
          this.diagnosisData.heji = getCost(this.diagnosisData.rengong) +
                                    getCost(this.diagnosisData.peisong) +
                                    getCost(this.diagnosisData.anzhuang) +
                                    getCost(this.diagnosisData.qita) +
                                    subTotal;
        },
        /**
         * 合计-新增维修报告
         * 费用中任意一项不匹配金额规则 不计入合计中
         */
        sumReportAddFormCost: function() {
          let getCost = (value) => {
            let reg = /^[1-9]\d*(\.\d{1,2})?|0\.\d{1,2}|0$/g
            return value == value.match(reg)
                    ? Number(value)
                    : 0
          }
          this.reportAddForm.total_price
            = getCost(this.reportAddForm.rengong)
            + getCost(this.reportAddForm.peijian)
            + getCost(this.reportAddForm.peisong)
            + getCost(this.reportAddForm.anzhuang)
            + getCost(this.reportAddForm.qita)
        },
        /**
         * 合计-最终成本
         * 费用中任意一项不匹配金额规则 不计入合计中
         */
        sumFinalCost: function() {
          let getCost = (value) => {
            let reg = /^[1-9]\d*(\.\d{1,2})?|0\.\d{1,2}|0$/g
            return value == value.match(reg)
                    ? Number(value)
                    : 0
          }
          let subTotal = 0
          this.finalCostForm.peijian.forEach(item=> {
            subTotal += item.subTotal
          })
          this.finalCostForm.rengong.forEach(item=> {
            subTotal += Number(item.price)
          })
          this.finalCostForm.total_price 
            = getCost(this.finalCostForm.peisong) 
            + getCost(this.finalCostForm.anzhuang)
            + getCost(this.finalCostForm.qita)
            + subTotal;
          this.finalCostForm.cn_price = 'abc'
        },
      },
      watch: {
        'reportAddForm.rengong': function() {
          this.sumReportAddFormCost()
        },
        'reportAddForm.peijian': function() {
          this.sumReportAddFormCost()
        },
        'reportAddForm.peisong': function() {
          this.sumReportAddFormCost()
        },
        'reportAddForm.anzhuang': function() {
          this.sumReportAddFormCost()
        },
        'reportAddForm.qita': function() {
          this.sumReportAddFormCost()
        },
        //最终成本 -合计
        finalCostForm: {
          deep: true,
          handler: function() {
            this.sumFinalCost()
          }
        },
      },
      created: function () {
        //获取工单数据
        this.getTableHeader()
        this.getWorkOrderData()
        this.getBusinessData()
        this.getMaintenanceData()
        this.getUserData()
      }
    })
  }
  that.init = (
    businessDataGetUrl,
    maintenanceDataGetUrl,
    workOrderDataGetUrl,
    orderInvalidUrl,
    orderDetailsGetUrl,
    dataExportRequestUrl,
    printListUrl,
    columnSettingUrl, 
    defaultColumnSettingUrl,
    userDataGetUrl,
    accessoriesListGetUrl,
    deliveryOrderUrl,
    reportDataCheckExistUrl,
    costDataCheckExistUrl,
    editMaintenanceReportUrl,
    submitFinalCostUrl
  ) => {
    _this.init(
      businessDataGetUrl,
      maintenanceDataGetUrl,
      workOrderDataGetUrl,
      orderInvalidUrl,
      orderDetailsGetUrl,
      dataExportRequestUrl,
      printListUrl,
      columnSettingUrl,
      defaultColumnSettingUrl,
      userDataGetUrl,
      accessoriesListGetUrl,
      deliveryOrderUrl,
      reportDataCheckExistUrl,
      costDataCheckExistUrl,
      editMaintenanceReportUrl,
      submitFinalCostUrl
    )
  }
  return that
}

