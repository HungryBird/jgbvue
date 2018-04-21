/**
 * created by lanw 2018-04-21
 * 维修报告与成本
 */
JGBVue = {
  module: {}
}

JGBVue.module.maintenanceOrder = () => {
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
    diagnosisDataGetUrl, //获取诊断人员数据
    userDataGetUrl, //获取当前用户信息
    orderDiagnosisGetUrl, //获取工单故障诊断数据
    accessoriesListGetUrl, //查询配件信息
    submitDiagnosisUrl //故障诊断单暂存、提交诊断结果接口
  ) => {
    that.vm = new Vue({
      el: '#app',
      data: function () {
        let validateCost = (rule, value, callback) => {
          let reg = /^[1-9]\d*(\.\d{1,2})?|0\.\d{1,2}|0$/g
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
            checkedStatus: [], //工单状态
            sort: { //默认按工单日期排序
              prop: "date",
              order: "descending"
            },
          },
          formTimeRangeDefault: ['00:00:00', '23:59:59'], //表单 默认起止时间
          formBusinessList: [], //表单 业务人员组
          formMaintenanceList: [], //表单 维修人员组
          formDiagnosisList: [], //诊断人员组
          formAccessoriesList: [], //配件组
          formOrderStatus: [ //工单状态 *value会关联html显示按钮组的判断条件,v-if需同步修改
            { label: '待维修', value: 6 },
            { label: '维修中', value: 7 },
            { label: '完成维修', value: 8 },
          ],
          formStatusCheckAll: true, //绑定工单状态全选

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

          showDiagnosis:false, //故障诊断 窗
          diagnosisData: {//故障诊断数据
            order_id: "", //工单id
            date: "", //诊断日期 *自动填入当前时间
            diagnosis: {}, //诊断人员 *默认填入当前用户
            result: "", //故障原因
            measures: "", //维修措施
            rengong: "", //人工维修费用
            peijian: [], //配件费
            peisong: "", //配送费
            anzhuang: "", //安装费
            qita: "", //其他费用
            heji: "", //合计
          }, 
          diagnosisRules: { //故障诊断表单规则
            date: { required: true, message: '请填写诊断时间', trigger: 'blur' },
            diagnosis: { required: true, message: '请选择诊断人员', trigger: 'blur' },
            result: { required: true, message: '请填写故障原因', trigger: 'blur' },
            measures: { required: true, message: '请填写维修措施', trigger: 'blur' },
            rengong: { validator: validateCost, trigger: 'blur' },
            peisong: { validator: validateCost, trigger: 'blur' },
            anzhuang: { validator: validateCost, trigger: 'blur' },
            qita: { validator: validateCost, trigger: 'blur' },
          },
          loadingTempStorage: false, //正在提交诊断结果

          userData: {}, //用户信息 用于填入诊断人员默认项
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
        //打印列表
        btnPrintList: function() {
          let filter = this.$deepCopy(this.selectForm)
          //调用父级框架打开标签页
          //传参filter: 列表数据筛选条件 edit by lanw 2018-4-21
          //传参url: 列表获取数据接口
          //传参mid: 故障诊断菜单id
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
            console.log(err)
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
            console.log(err)
            this.$message({
              type: 'error',
              message: err,
              center: true
            })
            this.loadingColumnSettingComplete = false
          })
        },
        //故障诊断 @param {row 行数, index 行数}
        btnDiagnosis: function(row, index) {
          this.showDiagnosis = true
          this.getDiagnosisData(row.order_id)
          this.getDiagnosisList()
          this.getAccessoriesList()
        },
        /**
         * 故障诊断 - 暂存、提交诊断结果
         * @param {String} type 提交类型 temp暂存 submit提交
         */
        btnTempStorage: function(type) {
          //处理没有配件id的配件列
          let arr = []
          this.diagnosisData.peijian.forEach(item=> {
            item.data.commodityNumber && arr.push(item)
          })
          this.diagnosisData.peijian = arr.concat()
          //处理提交时间
          if(type == 'submit') {
            this.diagnosisData.date = this.$timeStampFormat(
              new Date().getTime/1000, 
              'yyyy-mm-dd hh:mm:ss')
          }
          this.loadingTempStorage = true
          axios.post(submitDiagnosisUrl, {
            data: this.diagnosisData,
            type: type
          }).then(res=> {
            if(res.data.status) {
              this.$message({
                type: 'success',
                message: res.data.message,
                center: true
              })
              //在此处理是否关闭故障诊断窗口
            }
            else {
              this.$message({
                type: 'error',
                message: res.data.message,
                center: true
              })
            };
            this.loadingTempStorage = false
          }).catch(err=> {
            console.log(err)
            this.$message({
              type: 'error',
              message: err,
              center: true
            })
            this.loadingTempStorage = false
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
        //获取诊断人员数据
        getDiagnosisList:function(query) {
          axios.post(diagnosisDataGetUrl, {
            query: query || ''
          }).then(res=> {
            if(res.data.status) {
              this.formDiagnosisList = JSON.parse(res.data.data)
              // console.log('DiagnosisList', this.formDiagnosisList)
            }
            else {
              this.$message({
                type: 'error',
                message: res.data.message,
                center: true
              })
            };
          }).catch(err=> {
            console.log(err)
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
            console.log(err)
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
            }
            else {
              this.$message({
                type: 'error',
                message: res.data.message, 
                center: true
              })
            };
          }).catch(err=> {
            console.log(err)
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
            console.log(err)
            this.$message({
              type: 'error', 
              message: err,
              center: true
            })
            this.isLoadingDetails = false
          })
        },
        //获取工单诊断数据
        getDiagnosisData: function(id) {
          this.loadingDiagnosis = true
          axios.post(orderDiagnosisGetUrl, {
            order_id: id
          }).then(res=> {
            if(res.data.status) {
              this.diagnosisData = this.$deepCopy(JSON.parse(res.data.data))
              //诊断时间为提交结果时间，当前只显示打开页面的时间, 表单提交时更改诊断时间为提交时间戳
              this.diagnosisData.date = this.$timeStampFormat(
                Math.round(new Date().getTime()/1000),
                'yyyy-mm-dd hh:mm'
              )
              //未选择诊断人员默认选中自己
              if(!this.diagnosisData.diagnosis.number) {
                this.diagnosisData.diagnosis = {
                  label: this.userData.name,
                  value: this.userData.jobNumber
                }
              };
              //为每一个配件对象添加一个小计属性
              if(this.diagnosisData.peijian.length) {
                this.diagnosisData.peijian.forEach(item=> {
                  item.subTotal = item.data.price * item.count
                })
              }
              else {
                this.addOneDiagnosis()
              };
              //添加合计属性 并计算
              this.diagnosisData.heji = 0
              this.sumDiagnosisData()
            }
            else {
              this.$message({
                type: 'error', 
                message: res.data.message,
                center: true
              })
            };
            this.loadingDiagnosis = false
          }).catch(err=> {
            console.log(err)
            this.$message({
              type: 'error', 
              message: err,
              center: true
            })
            this.loadingDiagnosis = false
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
            console.log(err)
            this.$message({
              type: 'error',
              message: err,
              center: true
            })
          })
        },
        /**
         * 工单状态 全选
         * @param {Boolean} val 全选的状态
         */
        handleFormCheckAllChange: function(val) {
          this.selectForm.checkedStatus = val ? this.formOrderStatus.concat() : []
          this.getWorkOrderData()
        },
        /**
         * 工单状态 单选
         * @param {Array} value 选中的{label, value}
         */
        handleFormCheckStatusChange: function(value) { 
          let checkedCount = value.length;
          this.formStatusCheckAll = checkedCount === this.formOrderStatus.length;
          this.getWorkOrderData()
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
      },
      watch: {
        //人工费变更 重新计算合计
        'diagnosisData.rengong': function() {
          this.sumDiagnosisData()
        },
        //配送费变更 重新计算合计
        'diagnosisData.peisong': function() {
          this.sumDiagnosisData()
        },
        //安装费变更 重新计算合计
        'diagnosisData.anzhuang': function() {
          this.sumDiagnosisData()
        },
        //其他费用变更 重新计算合计
        'diagnosisData.qita': function() {
          this.sumDiagnosisData()
        },
      },
      created: function () {
        //工单状态默认全选
        this.selectForm.checkedStatus = this.formOrderStatus.concat()
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
    diagnosisDataGetUrl,
    userDataGetUrl,
    orderDiagnosisGetUrl,
    accessoriesListGetUrl,
    submitDiagnosisUrl
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
      diagnosisDataGetUrl,
      userDataGetUrl,
      orderDiagnosisGetUrl,
      accessoriesListGetUrl,
      submitDiagnosisUrl
    )
  }
  return that
}

