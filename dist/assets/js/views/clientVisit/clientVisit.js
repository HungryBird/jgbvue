/**
 * created by lanw 2018-04-25
 * 客户回访
 */
JGBVue = {
  module: {}
}

JGBVue.module.clientVisit = () => {
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
    visitListCheckExistUrl, //获取当前工单是否有回访记录数据
    clientContactDataGetUrl, //获取受访客户人员数据
    submitClientVisitRecordUrl //提交回访记录
  ) => {
    that.vm = new Vue({
      el: '#app',
      data: function () {
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
          formClientContactList: [], //客户联系人员组
          formOrderStatus: [ //工单状态 *value会关联html显示按钮组的判断条件,v-if需同步修改
            { label: '已交付', value: 11 },
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

          userData: {}, //用户信息 用于填入回访人员默认项

          showAddVisitRecord: false, //新增回访记录
          addVisitRecordForm: {}, //新增回访记录表单数据
          addVisitRecordFormDefault: {  //新增回访记录表单默认数据
            visit_date: "", //回访日期
            visit_person: "", //回访人员
            client_contact: "", //受访人员
            visit_method: "", //回访方式
            visit_reason: "", //回访事由
            visit_result: "", //回访结果
            remark: "", //备注
            next_date: "", //预期下次回访时间
            remind_on: false, //启用回访提醒
            remind_method: "msg", //提醒方式
          },
          addDeliveryFormRules: {
            visit_date: { required: true, message: '请选择回访日期', trigger: 'blur,change' },
            visit_person: { required: true, message: '请选择回访人员', trigger: 'blur,change' },
            client_contact: { required: true, message: '请选择受访人员', trigger: 'blur,change' },
            visit_reason: { required: true, message: '请填写回访事由', trigger: 'blur,change' },
          },
          loadingAddVisitRecordData: false, //正在加载回访记录 
          loadingAddVisitRecord: false, //正在提交回访记录
          pickerOptions_next: { //预计下次回访时间的可选择范围 默认只能选今天之后
            disabledDate: function(time) {
              return time.getTime() < (Date.now() - 8.64e7)
            },
          }, 
          pickerOptions_visit: { //回访日期的可选择范围 默认都可选
            disabledDate: function(time) {
              return false
            },
          }, 
        }
      },
      computed: {
        c_menuId: function() {
          return this.$getQuery(window.location.search).menu_id
        },
      },
      methods: {
        //新增
        btnAdd: function() {
          //调用父级框架打开工单录入标签页
          this.$selectTab('addOrder', '工单录入', './views/workOrderManagement/addOrder.html')
        },
        /**
         * 客户回访
         * @param {Object} row 行数据
         */
        btnClientVisit: function(row) {
          if(row.hasVisitList) {
            //跳页     
            this.$selectTab(
              'visitList', 
              '客户回访信息', 
              './views/clientVisit/visitList.html', 
              `order_id=${row.order_id}`)
          }
          else {
            //新增
            this.getClientContactData(row.customer_id)
            this.showAddVisitRecord = true
            this.$refs.addVisitRecord && this.$refs.addVisitRecord.resetFields()
            this.addVisitRecordForm = this.$deepCopy(this.addVisitRecordFormDefault)
            //回访人员默认选自己
            this.addVisitRecordForm.visit_person = this.userData.value
            this.addVisitRecordForm.order_id = row.order_id
          };
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
        /**
         * 新增回访记录 - 关闭
         */
        closeAddVisitRecord: function() {
          this.showAddVisitRecord = false
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
              //为每一条数据写入检测是否存在交付单 快递单
              for(let i = 0; i < this.orderList.length; i++) {
                let item = this.orderList[i]
                if(item.status_value == 11) {
                  this.setDataExist(item.order_id, i, 'visit', visitListCheckExistUrl)
                }
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
        /**
         * 获取客户联系人数据
         * @param {String, Number} clientId 客户id
         */
        getClientContactData: function(clientId) {
          this.loadingAddVisitRecordData = true
          axios.post(clientContactDataGetUrl, {
            client_id: clientId
          }).then(res=> {
            if(res.data.status) {
              this.formClientContactList = JSON.parse(res.data.data)
            }
            else {
              this.$message({
                type: 'error',
                message: res.data.message,
                center: true
              })
            };
            this.loadingAddVisitRecordData = false
          }).catch(err=> {
            console.error(err)
            this.$message({
              type: 'error',
              message: err,
              center: true
            })
            this.loadingAddVisitRecordData = false
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
         * 回访日期改变 同步修改预计下次回访时间的可选起始时间
         * @param {String} val 回访时间
         */
        handleVisitDateChange: function(val) {
          this.$nextTick(function() {
            if(val && new Date(val).getTime()> Date.now()) {
              this.pickerOptions_next.disabledDate = function(time) {
                return time.getTime() < new Date(val).getTime()
              }
            }
            else {
              this.pickerOptions_next.disabledDate = function(time) {
                return time.getTime() < (Date.now() - 8.64e7)
              }
            };
          })
        },
        /**
         * 预期下次回访时间改变 同步修改回访时间的可选截止时间
         * @param {String} val 回访时间
         */
        handleNextDateChange: function(val) {
          this.$nextTick(function() {
            if(val) {
              this.pickerOptions_visit.disabledDate = function(time) {
                return time.getTime() > new Date(val).getTime()
              }
            }
            else {
              this.pickerOptions_visit.disabledDate = function(time) {
                return false
              }
            };
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
         * 选择维修人员 输入时搜索
         * @param {String} query 输入值
         */
        remoteMaintenance: function(query) {
          this.getMaintenance(query)
        },
        /**
         * 新增回访记录 - 确定
         */
        saveAddVisitRecord: function() {
          this.$refs.addVisitRecord.validate((valid) => {
            if (valid) {
              this.loadingAddVisitRecord = true
              axios.post(submitClientVisitRecordUrl, this.addVisitRecordForm).then(res=> {
                this.$message({
                  type: res.data.status ? 'success': 'error',
                  message: res.data.message,
                  center: true
                })
                this.loadingAddVisitRecord = false
                this.showAddVisitRecord = res.data.status ? false: true
              }).catch(err=> {
                console.error(err)
                this.$message({
                  type: 'error',
                  message: err,
                  center: true
                })
                this.loadingAddVisitRecord = false
              })
            }
            else {
              console.log('error submit!!');
              return false;
            };
          })
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
         * @param {String} type 类型 visit 客户回访信息
         */
        setDataExist: function(id, index, type, url) {
          axios.post(url, {
            order_id: id
          }).then(res=> {
            if(res.data.status) { 
              // console.log(`axios: ${res.data.data}`)
              // res.data.data 随机true false 刷不出交付按钮 多刷几次
              switch(type) {
                case 'visit': 
                  this.orderList[index].hasVisitList = res.data.data
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
    userDataGetUrl,
    visitListCheckExistUrl,
    clientContactDataGetUrl,
    submitClientVisitRecordUrl
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
      visitListCheckExistUrl,
      clientContactDataGetUrl,
      submitClientVisitRecordUrl
    )
  }
  return that
}

