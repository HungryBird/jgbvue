/**
 * created by lanw 2018-04-24
 * 快递单
 */
JGBVue = {
  module: {}
}

JGBVue.module.courierList = () => {
  let _this = {}, that = {}
  _this.init = (
    courierListGetUrl, //获取快递单数据
    reportInvalidUrl, //作废
    dataExportRequestUrl, //导出申请地址
    deliveryAddDataGetUrl, //获取新增交付单的信息 接收方、交付方等
    submitAddDeliveryFormUrl, //提交申新增交付单信息接口
    submitAddCourierFormUrl, //提交快递单数据
    courierCompanyDataGetUrl, //获取快递公司列表
    courierInfoGetUrl, //获取物流信息
    signCourierUrl //签收
  ) => {
    that.vm = new Vue({
      el: '#app',
      data: function () {
        //验证金额 只允许两位小数 正数 零
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
        //验证手机号
        let validatePhone = (rule, value, callback) => {
          let reg = /^1[3|4|5|7|8][0-9]\d{4,8}$/g
          if(!value) {
            callback(new Error('请输入联系人手机号'));
          }
          else if (value != value.match(reg)) {
            callback(new Error('请输入正确的手机号'));
          }
          else {
            callback()
          };
        }
        return {
          orderList: [], //维修报告列表
          selectedRows: "", //选中行
          formCourierCompanyList: [], //快递公司组

          showDelivery: false, //查看维修报告 窗
          deliveryFormTitle: '', //窗标题
          deliveryDetailsUrl:"", //查看维修报告页面的路径

          showDeliveryButton: false, //是否显示交付按钮

          showExport: false, //导出 窗
          exportChecked: [], //导出选中项 *所有可选项与tableHeader关联
          isLoadingExportRequest: false, //是否正在请求导出数据状态
          tableHeader: [ //导出选项
            {prop: "index", label: "序号"},
            {prop: "courier_company", label: "快递公司"},
            {prop: "courier_id", label: "快递单号"},
            {prop: "date", label: "预达时间"},
            {prop: "cost", label: "快递费用"},
            {prop: "person", label: "快递联系人"},
            {prop: "phone", label: "联系手机"},
            {prop: "remark", label: "备注"},
            {prop: "status", label: "状态"}
          ],

          showAddCourierForm: false, //新增快递单
          loadingAddCourierForm: false, //正在提交快递单
          loadingAddCourierFormData: false, //正在获取快递单数据
          courierFormTitle: "", //标题
          addCourierForm: {}, //快递单表单
          addCourierFormDefault: { //快递单表单默认数据
            courier_company: "",
            courier_company_name: "",
            courier_id: "",
            date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`,
            cost: "",
            person: "",
            phone: "",
            remark: ""
          },
          addCourierFormRules: { //快递单验证规则
            courier_company: { required: true, message: '请选择快递公司', trigger: 'blur,change' },
            courier_id: { required: true, message: '请填写快递单号', trigger: 'blur,change' },
            cost: { validator: validateCost, trigger: 'blur,change' },
            person: { required: true, message: '请填写快递联系人', trigger: 'blur,change' },
            phone: { validator: validatePhone, trigger: 'blur,change' },
          },

          showCourierInfo: false, //快递信息 窗
          loadingCourierInfo: false, //正在获取快递信息
          courierInfo: [], //快递信息
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
         * 新增、修改快递单
         * @param {Object} row 快递单数据 为空时新增
         */
        btnAdd: function(row) {
          this.courierFormTitle = row ? '修改快递单' : '新增快递单'

          this.getCourierCompanyList()
          this.showAddCourierForm = true
          this.$refs.addCourierForm && this.$refs.addCourierForm.resetFields()
          this.addCourierForm = this.$deepCopy(this.addCourierFormDefault)
          //修改快递单 从行数据获取 包含uid
          row && Object.assign(this.addCourierForm, row)
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
            this.getCourierData()
          }).catch()
        },
        /**
         * 查询物流信息
         * @param {Object} row 行数据
         * @param {Number} index 行
         */
        btnView: function(row, index) {
          this.showCourierInfo = true
          this.getCourierInfo(row.courier_id)
        },
        /**
         * 打印
         */
        btnPrint: function() {
          //调用打印快递单功能
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
         * 新增快递单 - 关闭
         */
        closeAddCourierForm: function() {
          this.showAddCourierForm = false
        },
        //获取快递单数据
        getCourierData: function() {
          axios.post(courierListGetUrl, {
            order_id: this.c_orderId
          }).then(res=> {
            if(res.data.status) {
              this.orderList = JSON.parse(res.data.data).data
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
        //获取快递公司数据
        getCourierCompanyList: function() {
          axios.post(courierCompanyDataGetUrl).then(res=> {
            if(res.data.status) {
              this.formCourierCompanyList = JSON.parse(res.data.data)
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
         * 获取物流信息
         * @param {String, Number} id 快递单号
         */
        getCourierInfo: function(id) {
          this.loadingCourierInfo = true
          axios.post(courierInfoGetUrl, {
            courier_id: id
          }).then(res=> {
            if(res.data.status) {
              this.courierInfo = JSON.parse(res.data.data)
            }
            else {
              this.$message({
                type: 'error',
                message: res.data.message,
                center: true
              })
            };
            this.loadingCourierInfo = false
          }).catch(err=> {
            console.error(err)
            this.$message({
              type: 'error',
              message: err,
              center: true
            })
            this.loadingCourierInfo = false
          })
        },
        //工单 选择项发生变化时触发  val 选中的row数据
        handleOrderSelectionChange: function(val) {
          this.selectedRows = val.concat()
        },
        /**
         * 新增快递单 - 提交
         */
        saveAddCourierForm: function() {
          this.$refs.addCourierForm.validate((valid) => {
            if (valid) {
              this.loadingAddCourierForm = true
              axios.post(submitAddCourierFormUrl, this.addCourierForm).then(res=> {
                this.$message({
                  type: res.data.status ? 'success': 'error',
                  message: res.data.message,
                  center: true
                })
                this.loadingAddCourierForm = false
                this.showAddCourierForm = res.data.status ? false: true
              }).catch(err=> {
                console.error(err)
                this.$message({
                  type: 'error',
                  message: err,
                  center: true
                })
                this.loadingAddCourierForm = true
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        /**
         * 签收
         * @param {String, Number} id 快递单号
         */
        signCourier: function(id) {
          axios.post(signCourierUrl, {
            uid: id
          }).then(res=> {
            this.$message({
              type: res.data.status ? 'success': 'error',
              message: res.data.message,
              center: true
            })
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
        this.getCourierData()
      }
    })
  }
  that.init = (
    courierListGetUrl,
    reportInvalidUrl,
    dataExportRequestUrl,
    deliveryAddDataGetUrl,
    submitAddDeliveryFormUrl,
    submitAddCourierFormUrl,
    courierCompanyDataGetUrl,
    courierInfoGetUrl,
    signCourierUrl
  ) => {
    _this.init(
      courierListGetUrl,
      reportInvalidUrl,
      dataExportRequestUrl,
      deliveryAddDataGetUrl,
      submitAddDeliveryFormUrl,
      submitAddCourierFormUrl,
      courierCompanyDataGetUrl,
      courierInfoGetUrl,
      signCourierUrl
    )
  }
  return that
}

