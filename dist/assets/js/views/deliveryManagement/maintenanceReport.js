/**
 * created by lanw 2018-04-22
 * 维修报告信息
 */
JGBVue = {
  module: {}
}

JGBVue.module.maintenanceReport = () => {
  let _this = {}, that = {}
  _this.init = (
    maintenanceReportGetUrl, //获取维修报告数据
    deliveryOrderUrl, //交付工单接口
    reportDataCheckExistUrl, //工单是否已有维修报告
    editMaintenanceReportUrl, //暂存、确认新增维修报告
    reportInvalidUrl, //作废
    dataExportRequestUrl, //导出申请地址
    uploadReportUrl //上传维修报告扫描件
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
          orderList: [], //维修报告列表
          selectedRows: "", //选中行

          showReport: false, //查看维修报告 窗
          reportTitle: '', //窗标题
          reportDetailsUrl:"", //查看维修报告页面的路径

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

          showDeliveryButton: false, //是否显示交付按钮

          showExport: false, //导出 窗
          exportChecked: [], //导出选中项 *所有可选项与tableHeader关联
          isLoadingExportRequest: false, //是否正在请求导出数据状态
          tableHeader: [ //导出选项
            {prop: "index", label: "序号"},
            {prop: "title", label: "标题"},
            {prop: "order_id", label: "工单编号"},
            {prop: "date", label: "报告日期"},
            {prop: "clientName", label: "客户名称"},
            {prop: "equipmentName", label: "设备名称"},
            {prop: "file", label: "报告扫描件"},
            {prop: "status", label: "状态"},
          ],

          uploadReportUrl: uploadReportUrl, //上传报告扫描件路径
        }
      },
      computed: {
        c_menuId: function() {
          return this.$getQuery(window.location.search).menu_id
        },
        c_orderId: function() {
          return this.$getQuery(window.location.search).order_id
        },
      },
      methods: {
        /**
         * 交付
         */
        btnDelivery: function() {
          const h = this.$createElement
          this.$msgbox({
            title: '提示',
            message: h('p', null, `确认交付工单：${this.c_orderId}吗？`),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true
                instance.confirmButtonText = '交付中...'
                axios.post(deliveryOrderUrl, {
                  order_id: this.c_orderId
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
            // this.getReportData()
          }).catch()
        },
        /**
         * 新增
         * @param {String} title 弹窗标题
         */
        btnAdd: function(title) {
          this.reportTitle = title
          this.showReportAddForm = true
          this.reportAddForm = this.$deepCopy(this.defaultReportAddForm)
          this.getAddReportData()
          this.sumReportAddFormCost()
        },
        //作废
        btnInvalid: function() {
          const h = this.$createElement
          this.$msgbox({
            title: '提示',
            message: h('p', null, `确认作废该条数据吗？`),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true
                instance.confirmButtonText = '作废中...'
                axios.post(reportInvalidUrl, {
                  report_id: this.selectedRows[0].report_id
                }).then(res=> {
                  if(res.data.status) {
                    this.$message({
                      type: 'success',
                      message: res.data.message
                    })
                    this.getReportData()
                  }
                  else {
                    this.$message({
                      type: 'error',
                      message: res.data.message, 
                      center: true
                    })
                  };
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
              } 
              else {
                done()
              };
            }
          }).then(() => {
            //如需更新工单信息请在此
            // this.getReportData()
          }).catch()
        },
        /**
         * 查看
         * @param {Object} row 行数据
         * @param {Number} index 行
         */
        btnView: function(row, index) {
          this.showReport = true
          this.reportDetailsUrl = `./maintenanceReportDetails.html?menu_id=maintenanceReportDetails&&report_id=${row.report_id}`
        },
        /**
         * 打印
         */
        btnPrint: function() {
          //调用父级框架打开标签页
          this.$selectTab(
            'printMaintenanceReport', 
            '打印维修报告', 
            './views/maintenanceManagement/printMaintenanceReport.html', 
            `order_id=${this.selectedRows[0].order_id}&&report_id=${this.selectedRows[0].report_id}`)
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
         * 获取维修报告数据列表
         */
        getReportData: function() {
          axios.post(maintenanceReportGetUrl, {
            order_id: this.c_orderId
          }).then(res=> {
            if(res.data.status) {
              let _data = JSON.parse(res.data.data)
              this.orderList = _data.data
              this.showDeliveryButton = _data.delivery
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
         * 新增、修改维修报告
         */
        getAddReportData: function() {
          axios.post(reportDataCheckExistUrl, {
            order_id: this.c_orderId
          }).then(res=> {
            if(res.data.status) { 
              let _data = JSON.parse(res.data.data)
              this.reportAddForm = this.$deepCopy(JSON.parse(_data.data))
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
        //工单 选择项发生变化时触发  val 选中的row数据
        handleOrderSelectionChange: function(val) {
          this.selectedRows = val.concat()
        },
        /**
         * 上传扫描件 - 成功
         * @param {Object} response
         * @param {} file 上传的文件
         * @param {Array} fileList 多个文件上传时的所有上传文件列表
         */
        handleUploadReportSuccess: function(response, file, fileList) {
          console.log(response)
        },
        /**
         * 上传扫描件 - 失败
         * @param {Object} response
         * @param {} file 上传的文件
         * @param {Array} fileList 多个文件上传时的所有上传文件列表
         */
        handleUploadReportError: function(response, file, fileList) {
          console.log(response)
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
      },
      created: function () {
        this.getReportData()
      }
    })
  }
  that.init = (
    maintenanceReportGetUrl,
    deliveryOrderUrl, 
    reportDataCheckExistUrl, 
    editMaintenanceReportUrl,
    reportInvalidUrl,
    dataExportRequestUrl,
    uploadReportUrl
  ) => {
    _this.init(
      maintenanceReportGetUrl,
      deliveryOrderUrl, 
      reportDataCheckExistUrl, 
      editMaintenanceReportUrl,
      reportInvalidUrl,
      dataExportRequestUrl,
      uploadReportUrl
    )
  }
  return that
}

