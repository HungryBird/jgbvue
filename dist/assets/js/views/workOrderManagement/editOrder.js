/**
 * created by lanw 2018-04-15
 * 未接工单
 */
JGBVue = {
  module: {}
}

JGBVue.module.editOrder = () => {
  let _this = {}, that = {}
  _this.init = (
    businessDataGetUrl, //获取业务人员数据
    clientDataGetUrl, //获取客户数据
    orderEditInitGetUrl,//修改工单初始化数据 获取工单详情 报修方式 紧急程度 委派维修
    equipmentCodeGetUrl,//设备唯一码 远程搜索接口
    equimentInfoGetUrl, //通过唯一码查询设备信息接口
    repairPersonListGetUrl, //获取委派维修人员接口
    orderSaveUrl, //保存修改工单
    orderExportRequestUrl //请求导出数据接口
  ) => {
    that.vm = new Vue({
      el: '#app',
      data: function () {
        return {
          formBusinessList: [], //表单 业务人员组
          formClientList: [], //表单 客户数据
          formEquitmentCodeList: [], //表单 设备唯一码
          formRepairPersonList: [], //表单 维修人员

          orderEditForm: { //工单数据
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
            level: '',//紧急程度 * 紧急程度value在修改时效时会用到，修改请同步
            assigned: '', //委派维修
            person: '', //委派维修人员
            aging: '',
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
          orderEditInitData: {}, //修改工单初始化数据
          loadingOrderAdd: false, //初始化工单数据状态
          showOtherButton: false, //打印 导出 按钮

          showPictures: false, //查看图片 窗
          pictureList: [], //图片列表
        }
      },
      computed: {
        c_orderId: function() {
          return this.$getQuery(window.location.search).order_id
        },
      },
      methods: {
        //保存
        btnAdd: function() {
          this.$refs.orderEditForm.validate((valid) => {
            if (valid) {
              axios.post(orderSaveUrl, this.orderEditForm).then(res=> {
                if(res.data.status) {
                  this.$message({
                    type: 'success',
                    message: res.data.message,
                    center: true
                  })
                  this.showOtherButton = true
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
            }
            else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        //导出
        btnExport: function() {
          axios.post(orderExportRequestUrl, {
            order_id: this.orderEditForm.orderId
          }).then().catch()
        },
        //打印
        btnPrint: function() {
          //调用父级框架打开工单录入标签页
          this.$selectTab(
            'printOrder', 
            '打印工单', 
            'workOrderManagement', 
            `?order_id=${this.orderEditForm.orderId}`)
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
        //获取工单初始化数据
        getOrderEditInit: function() {
          this.loadingOrderAdd = true
          axios.post(orderEditInitGetUrl, {
            order_id: this.c_orderId
          }).then(res=> {
            if(res.data.status) {
              let _data = JSON.parse(res.data.data)
              let orderData = _data.order_data
              //写入工单下拉数据
              this.orderEditInitData = {
                repaired: _data.repaired,
                level: _data.level,
                assigned: _data.assigned
              }
              //写入工单数据
              this.orderEditForm = {
                date: new Date(orderData.date * 1000), //工单日期
                client: orderData.client, //客户
                business: orderData.business, //业务人员
                orderId: orderData.orderId, //工单编号
                onlyCode: orderData.onlyCode, //唯一码
                equipmentName: orderData.equipmentName, //设备名称
                equipmentBrand: orderData.equipmentBrand, //设备品牌
                equipmentSource: orderData.equipmentSource, //设备来源
                repaired: orderData.repaired, //报修方式
                equipmentPic: orderData.equipmentPic.concat(), //设备图片
                level: orderData.level,//紧急程度 * 紧急程度value在修改时效时会用到，修改请同步
                assigned: orderData.assigned, //委派维修
                person: orderData.person, //委派维修人员
                aging: orderData.aging, //时效
                describe: orderData.describe, //问题描述
                remark: orderData.remark, //备注
              }
            }
            else {
              this.$message({
                type: 'error',
                message: res.data.message,
                center: true
              })
            };
            this.loadingOrderAdd = false
          }).catch(err=> {console.log(err)
            this.$message({
              type: 'error',
              message: err,
              center: true
            })
            this.loadingOrderAdd = false
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
              this.orderEditForm.equipmentName = _data.equipmentName
              this.orderEditForm.equipmentBrand = _data.equipmentBrand
              this.orderEditForm.equipmentSource = _data.equipmentSource
              this.orderEditForm.equipmentPic = _data.equipmentPic.concat()
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
         * 打开图片查看窗 切换到指定图片序号
         * @param {Array} list 图片数据
         * @param {Number} index 图片位于list中的序号
         */
        openPictureDialog: function(list, index) {
          this.pictureList = list.concat()
          this.showPictures = true
          let timer = setInterval(()=> {
            this.$refs.equipmentPic.setActiveItem(index);
            clearInterval(timer)
          })
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
        //填写唯一码时 校验是否选中客户
        varifyClientExist: function(e) {
          if(this.orderEditForm.client.clientNumber == undefined) {
            // this.$refs.onlyCode.handleBlur()
            console.log(this.$refs.onlyCode)
            e.preventDefault()
          }
        },
      },
      watch: {
        'orderEditForm.onlyCode': function(n, o) {
          this.getEquitmentInfo(n)
        },
        //根据紧急程度修改默认的时效
        'orderEditForm.level': function(n, o) {
          if(n == 1) {  //非常紧急
            this.orderEditForm.aging = '1:0:0'
          }
          else {
            this.orderEditForm.aging = '23:59:59'
          }
        },
        //window.location.search改变，重新获取工单数据
        c_orderId: function() {
          this.getOrderEditInit()
        },
        //客户变动 设备数据清空
        'orderEditForm.client': function() {
          this.orderEditForm.equipmentName = ''   //设备名称
          this.orderEditForm.equipmentBrand = '' //设备品牌
          this.orderEditForm.equipmentSource = '' //设备来源
          this.orderEditForm.equipmentPic = [] //设备图片
        },
      },
      created: function () {
        //获取工单初始化数据
        this.getOrderEditInit()
        this.getClientData()
        this.getRepairPersonList()
        this.getBusinessData()
      },
    })
  }
  that.init = (
    businessDataGetUrl, //获取业务人员数据
    clientDataGetUrl, //获取客户数据
    orderEditInitGetUrl,//新增工单初始化数据 获取工单编号 报修方式 紧急程度 委派维修
    equipmentCodeGetUrl,//设备唯一码 远程搜索接口
    equimentInfoGetUrl, //通过唯一码查询设备信息接口
    repairPersonListGetUrl, //获取委派维修人员接口
    orderSaveUrl, //保存工单
    orderExportRequestUrl //请求导出数据接口
  ) => {
    _this.init(
      businessDataGetUrl, //获取业务人员数据
      clientDataGetUrl, //获取客户数据
      orderEditInitGetUrl,//新增工单初始化数据 获取工单编号 报修方式 紧急程度 委派维修
      equipmentCodeGetUrl,//设备唯一码 远程搜索接口
      equimentInfoGetUrl, //通过唯一码查询设备信息接口
      repairPersonListGetUrl, //获取委派维修人员接口
      orderSaveUrl, //保存工单
      orderExportRequestUrl //请求导出数据接口
    )
  }
  return that
}

