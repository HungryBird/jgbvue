/**
 * created by lanw 2018-05-02
 * 提交维修配件出库
 */
JGBVue = {
  module: {}
}

JGBVue.module.accessoriesOut = () => {
  let _this = {}, that = {}
  _this.init = (
    accessoriesListGetUrl, //查询配件信息
    accessoriesOutDataGetUrl, //获取配件出库信息 属性 批次 仓库 数量
    saveAccessoriesOutUrl //提交配件出库信息
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
        //验证序列号不为空
        let validateSN = (rule, value, callback) => {
          if (value.length == 0) {
            callback(new Error('请选择序列号'));
          }
          else {
            callback()
          };
        }
        return {
          loadingForm: false, //正在获取表单数据
          formAccessoriesList: [], //配件组
          validateInt: validateInt, //验证整数
          validateSN: validateSN, //验证序列号

          accessoriesOutForm: { //配件出库表单
            peijian: [
              {
                data: {
                  commodityNumber: '' //配件编号
                },
                count: 1,  //数量
                attribute: '', //属性
                bacth: '', //批次
                warehouse: '', //仓库
                SN: [], //序列号
                exist_SN: '',
              }
            ],
          },
          loadingSaveAccessoriesOut: false, //正在提交维修配件出库

          showSN: false, //商品序列号 窗
          currentRow: '', //打开窗口的行数据
          currentSNList: [],
          currentSN: [],
          currentSNListDefault: [],
          selectOn: false, //启用扫码枪
          selectSN: '', //扫码关键字
          timer: '', //优化序列号搜索 定时器
        }
      },
      computed: {
        c_menuId: function() {
          return this.$getQuery(window.location.search).menu_id
        },
        c_orderId: function() {
          return this.$getQuery(window.location.search).order_id
        },
        PARENT: function() {
          if(window.parent.maintenanceOrderFn) return window.parent.maintenanceOrderFn.vm
          if(window.parent.workOrderManagement) return window.parent.workOrderManagement.vm
        },
      },
      methods: {
        /**
         * 增加一行配件信息
         */
        addOneAccessories: function() {
          this.accessoriesOutForm.peijian.push({
            data: {
              commodityNumber: '' //配件编号
            },
            count: 1,  //数量
            attribute: '', //属性
            bacth: '', //批次
            warehouse: '', //仓库
            SN: [], //序列号
            exist_SN: '',
          })
        },
        /**
         * 复制全部序列号 *只复制筛选结果
         */
        addAllSN: function() {
          this.currentSNList.forEach(item=> {
            this.addSN(item)
          })
        },
        /**
         * 添加序列号 已存在则不添加
         * @param {String, Number} item 序列号
         */
        addSN: function(item) {
          if(this.currentSN.indexOf(item) == -1) {
            this.currentSN.push(item)
          }
        },
        /**
         * 选择商品序列号
         * @param {Number} index 行数
         */
        btnChooseSN: function(index) {
          this.currentRow = index
          this.currentSN = this.accessoriesOutForm.peijian[index].SN.concat()
          this.currentSNList = this.accessoriesOutForm.peijian[index].SN_list.concat()
          this.currentSNListDefault = this.currentSNList.concat()
          this.showSN = true
          // console.log(index)
        },
        /**
         * 提交维修配件 - 取消
         * 调用父级变量控制弹窗关闭
         */
        closeAccessoriesOut: function() {
          this.PARENT.showAccessoriesOut = false
        },
        /**
         * 商品序列号 - 取消
         */
        closeChooseSN: function() {
          this.showSN = false
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
         * 配件选择变更时 获取数量、属性、批次、仓库
         * @param {Number} index 配件所在表格行数
         */
        handleAccessoriesChange: function(index) {
          //清空表单验证提示
          this.$refs.accessoriesOutForm.clearValidate()

          this.loadingForm = true
          axios.post(accessoriesOutDataGetUrl, {
            accessories_id: this.accessoriesOutForm.peijian[index].data.commodityNumber
          }).then(res=> {
            if(res.data.status) {
              let _data = JSON.parse(res.data.data)
              // console.log(_data)
              this.accessoriesOutForm.peijian[index].attribute_list = _data.attribute_list
              this.accessoriesOutForm.peijian[index].bacth_list = _data.bacth_list
              this.accessoriesOutForm.peijian[index].warehouse_list = _data.warehouse_list
              this.accessoriesOutForm.peijian[index].exist_SN = _data.exist_SN
              this.accessoriesOutForm.peijian[index].SN_list = _data.SN_list
            }
            else {
              this.$message({
                type: 'error',
                message: res.data.message,
                center: true
              })
            };
            this.loadingForm = false
          }).catch(err=> {
            console.error(err)
            this.$message({
              type: 'error',
              message: err,
              center: true
            })
            this.loadingForm = false
          })
        },
        /**
         * 选择配件 输入时搜索
         * @param {String} query 输入值
         */
        remoteAccessories: function(query) {
          this.getAccessoriesList(query)
        },
        /**
         * 商品序列号 扫码、输入搜索
         * @param {String, Number} query 输入值
         */
        remoteSN: function(query) {
          query = query.toString()
          let arr = []
          this.currentSNListDefault.forEach(item=> {
            if(item.match(query)) {
              arr.push(item)
            }
          })
          this.currentSNList = arr.concat()
        },
        /**
         * 删除一行配件信息
         * @param {Number} index 删除行
         */
        removeOneAccessories: function(index) {
          this.accessoriesOutForm.peijian.splice(index, 1)
        },
        /**
         * 删除序列号
         * @param {Number} index 行数
         */
        removeSN: function(index) {
          this.currentSN.splice(index, 1)
        },
        /**
         * 提交维修配件出库 - 提交
         */
        saveAccessoriesOut: function() {
          this.$refs.accessoriesOutForm.validate((valid) => {
            if (valid) {
              let parent = this.PARENT
              this.loadingSaveAccessoriesOut = true
              axios.post(saveAccessoriesOutUrl, this.accessoriesOutForm).then(res=> {
                parent.$message({
                  type: res.data.status ? 'success': 'error',
                  message: res.data.message,
                  center: true
                })
                this.loadingSaveAccessoriesOut = false
                parent.showAccessoriesOut = res.data.status ? false : true
              }).catch(err=> {
                console.error(err)
                parent.$message({
                  type: 'error',
                  message: err,
                  center: true
                })
                this.loadingSaveAccessoriesOut = false
              })
            } else {
              console.log('提交维修配件出库error submit!!');
              return false;
            }
          });
        },
        /**
         * 商品序列号 - 确定
         */
        saveChooseSN: function() {
          this.accessoriesOutForm.peijian[this.currentRow].SN = this.currentSN.concat()
          this.showSN = false
        },
      },
      watch: {
        /**
         * 扫码枪、输入序列号查询
         * @param {String, Number} n 新数据
         * @param {String, Number} o 旧数据
         */
        selectSN: function(n, o) {
          clearTimeout(this.timer)
          this.timer = setTimeout(()=> {
              this.remoteSN(n)
              return;
          }, 200)
        },
        /**
         * 禁用、启用扫码枪
         * @param {String, Number} n 新数据
         * @param {String, Number} o 旧数据
         */
        selectOn: function(n, o) {
          if(!n) {
            this.selectSN = ''
          }
        }
      },
      created: function() {
        this.getAccessoriesList()
        this.accessoriesOutForm.order_id = this.c_orderId
      },
    })
  }
  that.init = (
    accessoriesListGetUrl, //查询配件信息
    accessoriesOutDataGetUrl, //获取配件出库信息 属性 批次 仓库 数量
    saveAccessoriesOutUrl
  ) => {
    _this.init(
      accessoriesListGetUrl, //查询配件信息
      accessoriesOutDataGetUrl, //获取配件出库信息 属性 批次 仓库 数量
      saveAccessoriesOutUrl
    )
  }
  return that
}

