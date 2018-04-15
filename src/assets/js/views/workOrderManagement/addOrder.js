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
    orderAddInitGetUrl,//新增工单初始化数据 获取工单编号 报修方式 紧急程度 委派维修
    equipmentCodeGetUrl,//设备唯一码 远程搜索接口
    equimentInfoGetUrl, //通过唯一码查询设备信息接口
    repairPersonListGetUrl, //获取委派维修人员接口
    orderSaveUrl //保存新增工单
  ) => {
    that.vm = new Vue({
      el: '#app',
      data: function () {
        return {
          formBusinessList: [], //表单 业务人员组
          formClientList: [], //表单 客户数据
          formEquitmentCodeList: [], //表单 设备唯一码
          formRepairPersonList: [], //表单 维修人员

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
            level: '',//紧急程度 * 紧急程度value在修改时效时会用到，修改请同步
            assigned: '', //委派维修
            person: '', //委派维修人员
            aging: '23:59:59',
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
          showOtherButton: false, //打印 导出 按钮

          showPictures: false, //查看图片 窗
          pictureList: [], //图片列表
        }
      },
      methods: {
        //保存
        btnAdd: function() {
          this.$refs.orderAddForm.validate((valid) => {
            if (valid) {
              axios.post(orderSaveUrl, this.orderAddForm).then(res=> {
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
        //重置
        btnReset: function() {
          this.$refs.orderAddForm.resetFields();
          this.getOrderAddInit()
        },
        //新增 *只改变order_id, 保留用户选择的数据
        btnNew: function() {
          this.getOrderAddInit()
          this.showOtherButton = false
        },
        //导出
        btnExport: function() {},
        //打印
        btnPrint: function() {},
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
          if(this.orderAddForm.client.clientNumber == undefined) {
            // this.$refs.onlyCode.handleBlur()
            console.log(this.$refs.onlyCode)
            e.preventDefault()
          }
        },
      },
      watch: {
        'orderAddForm.onlyCode': function(n, o) {
          this.getEquitmentInfo(n)
        },
        //根据紧急程度修改默认的时效
        'orderAddForm.level': function(n, o) {
          if(n.value == 1) {  //非常紧急
            this.orderAddForm.aging = '1:0:0'
          }
          else {
            this.orderAddForm.aging = '23:59:59'
          }
        },
      },
      created: function () {
        //获取新增工单初始化数据
        this.getOrderAddInit()
        this.getClientData()
        this.getRepairPersonList()
        this.getBusinessData()
      },
    })
  }
  that.init = (
    businessDataGetUrl, //获取业务人员数据
    clientDataGetUrl, //获取客户数据
    orderAddInitGetUrl,//新增工单初始化数据 获取工单编号 报修方式 紧急程度 委派维修
    equipmentCodeGetUrl,//设备唯一码 远程搜索接口
    equimentInfoGetUrl, //通过唯一码查询设备信息接口
    repairPersonListGetUrl, //获取委派维修人员接口
    orderSaveUrl //保存新增工单
  ) => {
    _this.init(
      businessDataGetUrl, //获取业务人员数据
      clientDataGetUrl, //获取客户数据
      orderAddInitGetUrl,//新增工单初始化数据 获取工单编号 报修方式 紧急程度 委派维修
      equipmentCodeGetUrl,//设备唯一码 远程搜索接口
      equimentInfoGetUrl, //通过唯一码查询设备信息接口
      repairPersonListGetUrl, //获取委派维修人员接口
      orderSaveUrl //保存新增工单
    )
  }
  return that
}

