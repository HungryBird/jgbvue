/**
 * created by lanw 2018-04-24
 * 交付单
 */
JGBVue = {
  module: {}
}

JGBVue.module.deliveryList = () => {
  let _this = {}, that = {}
  _this.init = (
    deliveryListGetUrl, //获取维修报告数据
    deliveryOrderUrl, //交付工单接口
    reportInvalidUrl, //作废
    dataExportRequestUrl, //导出申请地址
    uploadReportUrl, //上传维修报告扫描件
    deliveryAddDataGetUrl, //获取新增交付单的信息 接收方、交付方等
    submitAddDeliveryFormUrl //提交申新增交付单信息接口
  ) => {
    that.vm = new Vue({
      el: '#app',
      data: function () {
        //验证整数
        let validateInt = (rule, value, callback) => {
          let reg = /^[1-9]*\d*|0$/g
          value = value.toString()
          if (value != value.match(reg)) {
            callback(new Error('请输入正确数字'));
          }
          else {
            callback()
          };
        }
        return {
          orderList: [], //维修报告列表
          selectedRows: "", //选中行

          showDelivery: false, //查看维修报告 窗
          deliveryFormTitle: '', //窗标题
          deliveryDetailsUrl:"", //查看维修报告页面的路径

          showDeliveryButton: false, //是否显示交付按钮

          showExport: false, //导出 窗
          exportChecked: [], //导出选中项 *所有可选项与tableHeader关联
          isLoadingExportRequest: false, //是否正在请求导出数据状态
          tableHeader: [ //导出选项
            {prop: "index", label: "序号"},
            {prop: "title", label: "标题"},
            {prop: "delivery_id", label: "单据编号"},
            {prop: "date", label: "交付日期"},
            {prop: "delivery", label: "交付方"},
            {prop: "receive", label: "接收方"},
            {prop: "content", label: "交付内容"},
            {prop: "remark", label: "备注"},
          ],

          uploadReportUrl: uploadReportUrl, //上传扫描件路径

          showAddDeliveryForm: false, //新增交付单
          loadingAddDeliveryForm: false, //正在提交交付单
          loadingAddDeliveryFormData: false, //获取新增交付单数据
          deliveryFormTitle: '', //新增交付单标题
          addDeliveryForm: { //新增交付单表单数据
            title: "",
            delivery_id: "",
            date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`,
            quality: "30",
            delivery: "",
            receive: "",
            delivery_list: [
              { name: "", unit: "", count: "", remark: "" },
            ],
            remark: ""
          },
          addDeliveryFormDefault: { //新增交付单表单默认数据
            title: "",
            delivery_id: "",
            date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`,
            quality: "30",
            delivery: "",
            receive: "",
            delivery_list: [
              { name: "", unit: "", count: "", remark: "" },
            ],
            remark: ""
          },
          addDeliveryFormRules: {
            title: { required: true, message: '请填写标题', trigger: 'blur' },
            date: { required: true, message: '请选择交付时间', trigger: 'blur' },
            delivery_id: { required: true, message: '请填写单据编号', trigger: 'blur' },
            delivery: { required: true, message: '请填写交付方', trigger: 'blur' },
            receive: { required: true, message: '请填写接收方', trigger: 'blur' },
            quality: { validator: validateInt, trigger: 'blur,change' },
          },
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
         * 确认交付
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
            // this.getDeliveryData()
          }).catch()
        },
        /**
         * 新增、修改交付单
         * @param {Object} row 交付单id 为空时新增
         */
        btnAdd: function(row) {
          let report_id = row ? row.report_id : ''
          this.deliveryFormTitle = row ? '修改交付单' : '新增交付单'
          this.showAddDeliveryForm = true
          this.addDeliveryForm = this.$deepCopy(this.addDeliveryFormDefault)
          this.getAddDeliveryForm(report_id)
        },
        //作废
        btnInvalid: function() {
          const h = this.$createElement
          this.$msgbox({
            title: '提示',
            message: h('p', null, `确认作废选中的数据吗？`),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true
                instance.confirmButtonText = '作废中...'
                let arr = []
                this.selectedRows.forEach(item=> {
                  arr.push(item.delivery_id)
                })
                axios.post(reportInvalidUrl, {
                  data: arr
                }).then(res=> {
                  if(res.data.status) {
                    this.$message({
                      type: 'success',
                      message: res.data.message
                    })
                    this.getDeliveryData()
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
            // this.getDeliveryData()
          }).catch()
        },
        /**
         * 查看
         * @param {Object} row 行数据
         * @param {Number} index 行
         */
        btnView: function(row, index) {
          this.showDelivery = true
          this.deliveryDetailsUrl = `./printDeliveryInfo.html?menu_id=printDeliveryInfo&&order_id=${this.c_orderId}&&delivery_id=${row.delivery_id}&&show_print_button=0`
        },
        /**
         * 打印
         */
        btnPrint: function() {
          //调用父级框架打开标签页
          this.$selectTab(
            'printDeliveryInfo', 
            '打印交付单', 
            './views/deliveryManagement/printDeliveryInfo.html', 
            `order_id=${this.c_orderId}&&delivery_id=${this.selectedRows[0].delivery_id}&&show_print_button=1`)
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
         * 新增交付单 - 增加行
         */
        btnAddDeliveryFormAddOneRow: function() {
          this.addDeliveryForm.delivery_list.push({ 
            name: "", unit: "", count: "", remark: "" 
          })
        },
        /**
         * 新增交付单 - 删除
         * @param {Number} index 行数
         */
        btnAddDeliveryFormDelOneRow: function(index) {
          this.addDeliveryForm.delivery_list.splice(index, 1)
        },
        /**
         * 新增交付单 - 关闭
         */
        closeAddDeliveryForm: function() {
          this.showAddDeliveryForm = false
        },
        /**
         * 获取新增、修改交付单 的数据
         * @param {String, Number} id 单据编号
         */
        getAddDeliveryForm: function(id) {
          this.loadingAddDeliveryFormData = true
          this.$refs.addDeliveryForm && this.$refs.addDeliveryForm.resetFields()
          let data = { order_id: this.c_orderId }
          if(id) {
            data.report_id = id
          }
          axios.post(deliveryAddDataGetUrl, data).then(res=> {
            if(res.data.status) {
              Object.assign(this.addDeliveryForm, JSON.parse(res.data.data))
            }
            else {
              this.$message({
                type: error,
                message: res.data.message,
                center: true
              })
            };
            this.loadingAddDeliveryFormData = false
          }).catch(err=> {
            console.error(err)
            this.$message({
              type: error,
              message: err,
              center: true
            })
            this.loadingAddDeliveryFormData = false
          })
        },
        /**
         * 获取交付单数据列表
         */
        getDeliveryData: function() {
          axios.post(deliveryListGetUrl, {
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
         * 新增、修改交付单 - 提交
         */
        saveAddDeliveryForm: function() {
          this.$refs.addDeliveryForm.validate((valid) => {
            if (valid) {
              this.loadingAddDeliveryForm = true
              //处理交付内容空数据 凭据：名称
              let arr = []
              this.addDeliveryForm.delivery_list.forEach(item=> {
                item.name && arr.push(item)
              })
              this.addDeliveryForm.delivery_list = arr.concat()
              // console.log(this.addDeliveryForm.delivery_list)
              axios.post(submitAddDeliveryFormUrl, {
                data: this.addDeliveryForm
              }).then(res=> {
                this.$message({
                  type: res.data.status ? 'success': 'error',
                  message: res.data.message,
                  center: true
                })
                this.loadingAddDeliveryForm = false
                this.showAddDeliveryForm = res.data.status ? false: true
              }).catch(err=> {
                console.error(err)
                this.$message({
                  type: 'error',
                  message: err,
                  center: true
                })
                this.loadingAddDeliveryForm = true
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
      },
      created: function () {
        this.getDeliveryData()
      }
    })
  }
  that.init = (
    deliveryListGetUrl,
    deliveryOrderUrl, 
    reportInvalidUrl,
    dataExportRequestUrl,
    uploadReportUrl,
    deliveryAddDataGetUrl,
    submitAddDeliveryFormUrl
  ) => {
    _this.init(
      deliveryListGetUrl,
      deliveryOrderUrl, 
      reportInvalidUrl,
      dataExportRequestUrl,
      uploadReportUrl,
      deliveryAddDataGetUrl,
      submitAddDeliveryFormUrl
    )
  }
  return that
}

