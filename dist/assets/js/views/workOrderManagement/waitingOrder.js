/**
 * created by lanw 2018-04-10
 * 未接工单
 */
JGBVue = {
  module: {}
}

JGBVue.module.waitingOrder = () => {
  let _this = {}, that = {}
  _this.init = (
    businessDataGetUrl, //获取业务人员数据
    clientDataGetUrl, //获取客户数据
    workOrderDataGetUrl,//获取工单数据
    orderReceiveUrl, //领取工单
    orderBackUrl, //退回工单
    orderWithdrawUrl, //撤回工单
    orderInvalidUrl, //工单作废
    orderDetailsGetUrl, //获取工单详情
    orderAddInitGetUrl,//新增工单初始化数据 获取工单编号 报修方式 紧急程度 委派维修
    equipmentCodeGetUrl,//设备唯一码 远程搜索接口
    equimentInfoGetUrl, //通过唯一码查询设备信息接口
    repairPersonListGetUrl, //获取委派维修人员接口
  ) => {
    that.vm = new Vue({
      el: '#app',
      data: function () {
        return {
          selectForm: { //表单
            dateRange: [], //日期范围
            businessCurrent: '',//业务人员
            keyword: '', //查询关键词
            checkedStatus: [], //工单状态
            sort: { //默认按工单日期排序
              prop: "date",
              order: "descending"
            },
          },
          formTimeRangeDefault: ['00:00:00', '23:59:59'], //表单 默认起止时间
          formBusinessList: [], //表单 业务人员组
          formClientList: [], //表单 客户数据
          formEquitmentCodeList: [], //表单 设备唯一码
          formRepairPersonList: [], //表单 维修人员
          formOrderStatus: [ //工单状态 *value会关联html显示按钮组的判断条件,v-if需同步修改
            { label: '委派', value: 0 },
            { label: '待接', value: 1 },
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

          showAddOrder: false, //新增工单弹窗
          orderAddForm: { //新增工单数据
            date: '', //日期 时间戳
            client: '', //客户
            business: '', //业务人员
            orderId: '', //工单编号
            onlyCode: '', //唯一码
            equipmentName: '', //设备名称
            equipmentBrand: '', //设备品牌
            equipmentSource: '', //设备来源
            repaired: '', //报修方式
            equipmentPic: [], //设备图片
            level: '',//紧急程度
            assigned: '', //委派维修
            person: '', //委派维修人员
            describe: '', //问题描述
            remark: '', //备注
          },  
          orderDefaultForm: { //默认工单的空数据
            date: '', //日期 时间戳
            client: '', //客户
            business: '', //业务人员
            orderId: '', //工单编号
            onlyCode: '', //唯一码
            equipmentName: '', //设备名称
            equipmentBrand: '', //设备品牌
            equipmentSource: '', //设备来源
            repaired: '', //报修方式
            equipmentPic: [], //设备图片
            level: '',//紧急程度
            assigned: '', //委派维修
            person: '', //委派维修人员
            describe: '', //问题描述
            remark: '', //备注
          },  
          orderFormRuls: { //工单规则
            date: { required: true, message: '请选择日期', trigger: 'blur' },
            client: { required: true, message: '请选择客户', trigger: 'blur' },
            business: { required: true, message: '请选择业务人员', trigger: 'blur' },
            orderId: { required: true, message: '工单编号生成失败', trigger: 'blur' },
            onlyCode: { required: true, message: '请输入唯一码', trigger: 'blur' },
            level: { required: true, message: '请选择紧急程度', trigger: 'blur' },
            describe: { required: true, message: '请填写问题描述', trigger: 'blur' },
          },
          orderAddInitData: {}, //新增工单初始化数据
          loadingOrderAdd: false, //初始化工单数据状态
        }
      },
      methods: {
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
        //领取 @param （row行数据, index行数）
        btnReceive: function(row, index) {
          axios.post(orderReceiveUrl, {
            orderId: row.order_id
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
        //退回 @param （row行数据, index行数）
        btnBack: function(row, index) {
          axios.post(orderBackUrl, {
            orderId: row.order_id
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
        //撤回 @param （row行数据, index行数）
        btnWithdraw: function(row, index) {
          axios.post(orderWithdrawUrl, {
            orderId: row.order_id
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
        //查看图片 @param {Array} imgList 图片数组
        btnImage: function(imgList) {
          //图片查看组件
          console.log(imgList)
        },
        //新增
        btnAdd: function() {
          this.showAddOrder = true
          this.getClientData()
          this.getOrderAddInit()
          this.getRepairPersonList()
          this.getBusinessData()
        },
        //下载文件
        btnDownLoad: function(src) {
          window.open(src); 
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
        //获取客户人员数据
        getClientData: function(query) {
          axios.post(clientDataGetUrl, {
            query: query || ''
          }).then(res=> {
            if(res.data.status) {
              this.formClientList = JSON.parse(res.data.data).table.concat()
            }
            else {
              this.$message({
                type:'error', 
                message: res.data.message, 
                center: true
              })
            };
          }).catch(err=> {
            this.$message({
              type:'error', 
              message: err, 
              center: true
            })
          })
        },
        //获取新增工单初始化数据
        getOrderAddInit: function() {
          this.loadingOrderAdd = true
          axios.post(orderAddInitGetUrl).then(res=> {
            if(res.data.status) {
              this.orderAddInitData = JSON.parse(res.data.data)
              this.orderAddForm.orderId = this.orderAddInitData.order_id
            }
            else {
              this.$message({
                type: 'error',
                message: res.data.message,
                center: true
              })
            };
            this.loadingOrderAdd = false
          }).catch(err=> {
            this.$message({
              type: 'error',
              message: err,
              center: true
            })
            this.loadingOrderAdd = false
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
              if(!this.tableHeader.length) {
                this.tableHeader = _data.header.concat()
              }
            }
            else {
              this.$message({
                type: 'error',
                message:res.data.message, 
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
            this.$message({
              type: 'error', 
              message: err,
              center: true
            })
            this.isLoadingDetails = false
          })
        },
        //获取设备唯一码
        getEquitmentCode: function(query) {
          axios.post(equipmentCodeGetUrl, {
            query: query || ''
          }).then(res=> {
            if(res.data.status) {
              this.formEquitmentCodeList = JSON.parse(res.data.data)
            }
            else {
              this.$message({
                type: 'error',
                message:res.data.message, 
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
        //通过设备唯一码获取设备信息
        getEquitmentInfo: function(query) {
          axios.post(equimentInfoGetUrl, {
            query: query || ''
          }).then(res=> {
            if(res.data.status) {
              let _data = JSON.parse(res.data.data)
              //写入设备对应数据
              this.orderAddForm.equipmentName = _data.equipmentName
              this.orderAddForm.equipmentBrand = _data.equipmentBrand
              this.orderAddForm.equipmentSource = _data.equipmentSource
              this.orderAddForm.equipmentPic = _data.equipmentPic.concat()
            }
            else {
              this.$message({
                type: 'error',
                message:res.data.message, 
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
        getRepairPersonList: function(query) {
          axios.post(repairPersonListGetUrl, {
            query: query || ''
          }).then(res=> {
            if(res.data.status) {
              this.formRepairPersonList = JSON.parse(res.data.data)
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
         * 选择客户 输入时搜索
         * @param {String} query 输入值
         */
        remoteClient: function(query) {
          this.getClientData(query)
        },
        //选择业务人员 输入时搜索
        remoteBusiness: function(query) {
          this.getBusinessData(query)
        },
        //唯一码 输入时搜索
        remoteEquitementCode: function(query) {
          this.getEquitmentCode(query)
        },
        //维修人员 输入时搜索
        remoteRepairPerson: function(query) {
          this.getRepairPersonList(query)
        },
      },
      watch: {
        'orderAddForm.onlyCode': function(n, o) {
          this.getEquitmentInfo(n)
        },
      },
      created: function () {
        //工单状态默认全选
        this.selectForm.checkedStatus = this.formOrderStatus.concat()
        //获取工单数据
        this.getWorkOrderData()
        this.getBusinessData()
      }
    })
  }
  that.init = (
    businessDataGetUrl,
    clientDataGetUrl,
    workOrderDataGetUrl,
    orderReceiveUrl,
    orderBackUrl,
    orderWithdrawUrl,
    orderInvalidUrl,
    orderDetailsGetUrl,
    orderAddInitGetUrl,
    equipmentCodeGetUrl,
    equimentInfoGetUrl,
    repairPersonListGetUrl
  ) => {
    _this.init(
      businessDataGetUrl,
      clientDataGetUrl,
      workOrderDataGetUrl,
      orderReceiveUrl,
      orderBackUrl,
      orderWithdrawUrl,
      orderInvalidUrl,
      orderDetailsGetUrl,
      orderAddInitGetUrl,
      equipmentCodeGetUrl,
      equimentInfoGetUrl,
      repairPersonListGetUrl)
  }
  return that
}

