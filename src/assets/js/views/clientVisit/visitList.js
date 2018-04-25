/**
 * created by lanw 2018-04-25
 * 客户回访信息
 */
JGBVue = {
  module: {}
}

JGBVue.module.visitList = () => {
  let _this = {}, that = {}
  _this.init = (
    businessDataGetUrl, //获取业务人员数据
    visitListGetUrl, //获取客户回访数据
    reportInvalidUrl, //作废
    dataExportRequestUrl, //导出申请地址
    submitAddVisitFormUrl, //提交新增、修改客户回访信息接口
    clientContactDataGetUrl, //获取受访客户人员数据
    userDataGetUrl //获取当前用户信息
  ) => {
    that.vm = new Vue({
      el: '#app',
      data: function () {
        return {
          orderList: [], //客户回访列表
          selectedRows: "", //选中行
          formBusinessList: [], //表单 业务人员组
          formClientContactList: [], //客户联系人员组

          userData: {}, //获取当前用户信息

          showExport: false, //导出 窗
          exportChecked: [], //导出选中项 *所有可选项与tableHeader关联
          isLoadingExportRequest: false, //是否正在请求导出数据状态
          tableHeader: [ //导出选项
            {prop: "index", label: "序号"},
            {prop: "visit_date", label: "回访日期"},
            {prop: "visit_person_name", label: "回访人员"},
            {prop: "client_contact_name", label: "受访人员"},
            {prop: "visit_method_name", label: "回访方式"},
            {prop: "visit_reason", label: "回访事由"},
            {prop: "visit_result", label: "回访结果"},
            {prop: "next_date", label: "下次回访时间"},
            {prop: "remind_method_name", label: "提醒方式"},
            {prop: "remark", label: "备注"},
          ],

          showVisitInfo: false, //查看回访信息 窗
          visitInfo: {}, //当前查看的回访信息

          showAddVisitRecord: false, //新增回访记录
          visitFormTitle: "", //新增回访记录标题
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
        c_orderId: function() {
          return this.$getQuery(window.location.search).order_id
        },
      },
      methods: {
        /**
         * 新增、修改回访记录
         * @param {Object} row 回访记录列数据 row.visit_id为空时新增
         */
        btnAdd: function(row) {
          this.visitFormTitle = row.visit_id ? '修改回访记录' : '新增回访记录'

          this.getClientContactData(row.client_id)
          this.showAddVisitRecord = true
          this.$refs.addVisitRecord && this.$refs.addVisitRecord.resetFields()
          this.addVisitRecordForm = this.$deepCopy(this.addVisitRecordFormDefault)
          if(row.visit_id) {
            //修改 回访记录列数据写入表单
            Object.assign(this.addVisitRecordForm, row)
          }
          else {
            //新增 回访人员默认选自己
            this.addVisitRecordForm.visit_person = this.userData.value
          }
          this.addVisitRecordForm.order_id = this.c_orderId
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
                    this.getVisitData()
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
            // this.getVisitData()
          }).catch()
        },
        /**
         * 查看
         * @param {Object} row 行数据
         * @param {Number} index 行
         */
        btnView: function(row, index) {
          this.showVisitInfo = true
          this.visitInfo = {};
          Object.assign(this.visitInfo, row)
        },
        /**
         * 打印列表
         */
        btnPrint: function() {
          //调用父级框架打开标签页
          this.$selectTab(
            'printVisitList', 
            '打印客户回访列表', 
            './views/clientVisit/printVisitList.html', 
            `order_id=${this.c_orderId}&&url=${visitListGetUrl}`)
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
         * 新增回访记录 - 关闭
         */
        closeAddVisitRecord: function() {
          this.showAddVisitRecord = false
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
         * 获取客户回访信息数据列表
         */
        getVisitData: function() {
          axios.post(visitListGetUrl, {
            order_id: this.c_orderId
          }).then(res=> {
            if(res.data.status) {
              this.orderList = JSON.parse(res.data.data)
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
         * 选择业务人员 输入时搜索
         * @param {String} query 输入值
         */
        remoteBusiness: function(query) {
          this.getBusinessData(query)
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
      },
      created: function () {
        this.getVisitData()
        this.getBusinessData()
        this.getUserData()
      }
    })
  }
  that.init = (
    businessDataGetUrl,
    visitListGetUrl,
    reportInvalidUrl,
    dataExportRequestUrl,
    submitAddVisitFormUrl,
    clientContactDataGetUrl,
    userDataGetUrl
  ) => {
    _this.init(
      businessDataGetUrl,
      visitListGetUrl,
      reportInvalidUrl,
      dataExportRequestUrl,
      submitAddVisitFormUrl,
      clientContactDataGetUrl,
      userDataGetUrl
    )
  }
  return that
}

