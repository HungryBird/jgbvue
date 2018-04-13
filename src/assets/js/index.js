JGBVue = {
  module: {}
}

JGBVue.module.index = ()=> {
  let _this = {}
  ,that = {};

  _this.init = (isShowGuidanceUrl)=> {
    window.JGBVue.module.vParent = new Vue({
      el: '#app',
      data: {
        user: {
          name: '赵某',
          portrait: './assets/img/index/portrait.png',
          teamName: '我的团队001',
          navItems: [{
            id: 'nav_001',
            cls: 'fa fa-home'
          }, {
            id: 'nav_002',
            cls: 'fa fa-list-ul',
            name: '系统设置',
            menuItems: [{
              /*title: '',*/
              parentFolder: 'systemSettings',
              items: [{
                id: 'systemParameter',
                name: '系统参数'
              }, {
                id: 'phoneInfo',
                name: '手机信息'
              }, {
                id: 'auditProcess',
                name: '审核流程'
              }, {
                id: 'systemLog',
                name: '系统日志'
              }, {
                id: 'printTemplate',
                name: '套打模板'
              }, {
                id: 'recountCost',
                name: '重算成本'
              }, {
                id: 'addedServer',
                name: '增值服务'
              }]
            }, {
              /*title: '采购报表',*/
              parentFolder: 'systemSettings',
              items: [{
                id: 'messageInSite',
                name: '站内信息'
              }, {
                id: 'emailInfo',
                name: '邮件信息'
              }, {
                id: 'administrativeRegion',
                name: '行政区域'
              }, {
                id: 'FBackup',
                name: '备份与恢复'
              }, {
                id: 'settlementNAntiSettlement',
                name: '结账/反结账'
              }, {
                id: 'reinitialize',
                name: '重新初始化'
              }]
            }]
          }, {
            id: 'nav_003',
            cls: 'fa fa-group',
            name: '基础资料',
            menuItems: [
              {
                parentFolder: 'baseData',
                items: [{
                  id: 'menuManagement',
                  name: '功能菜单管理'
                }, {
                  id: 'dataDictionary',
                  name: '数据字典'
                }]
              },
              {
                title: '公司组织',
                parentFolder: 'companyOrganization',
                items: [{
                  id: 'companyManagement',
                  name: '公司管理'
                }, {
                  id: 'departmentManagement',
                  name: '部门管理'
                }, {
                  id: 'xsdj003',
                  name: '职位管理'
                }, {
                  id: 'roleManagement',
                  name: '角色管理'
                }, {
                  id: 'userManagement',
                  name: '用户管理'
                }]
              },
              {
                title: '客户管理',
                parentFolder: 'clientManagement',
                items: [
                  {
                    id: 'clientInfo',
                    name: '客户信息'
                  },
                  {
                    id: 'xsbb002',
                    name: '销售明细表'
                  },
                  {
                    id: 'xsbb003',
                    name: '销售汇总表(按商品)'
                  },
                  {
                    id: 'xsbb004',
                    name: '销售汇总表(按客户)'
                  },
                  {
                    id: 'xsbb005',
                    name: '销售汇总表(按销售人员)'
                  }
                ]
              },
              {
                title: '商品管理',
                parentFolder: 'commodityManagement',
                items: [
                  {
                    id: 'commodityInfo',
                    name: '商品信息'
                  },
                  {
                    id: 'commodityCategory',
                    name: '商品类别'
                  },
                  {
                    id: 'commodityBrand',
                    name: '商品品牌'
                  },
                  {
                    id: 'commodityManagementAuxiliaryAttributes',
                    name: '辅助属性'
                  }
                ]
              }
            ]
          }, {
            id: 'nav_004',
            cls: 'fa fa-group',
            name: '售后',
            menuItems: [
            {
              parentFolder: 'afterSale',
              items: [{
                id: '201804061000',
                name: '客户回访'
              }, {
                id: '201804061001',
                name: '统计报表'
              }]
            },
            {
              title: '设备管理',
              parentFolder: 'equipmentManagement',
              items: [{
                id: 'equipmentCategory',
                name: '设备类别'
              }, {
                id: 'equipmentBrand',
                name: '设备品牌'
              }, {
                id: 'auxiliaryAttributes',
                name: '辅助属性'
              }]
            },
            {
              // title: '工单管理',
              parentFolder: 'workOrderManagement',
              items: [{
                  id: 'orderManagement',
                  name: '工单管理'
                },
                {
                  id: 'waitingOrder',
                  name: '未接工单'
                },
                {
                  id: 'addOrder',
                  name: '工单录入'
                },
                {
                  id: 'faultDiagnosis',
                  name: '故障诊断'
                },
                {
                  id: 'offerAndContract',
                  name: '报价与合同'
                }
              ]
            },
            {
              title: '维修管理',
              parentFolder: '201804090948',
              items: [
                {
                  id: '201804090949',
                  name: '维修'
                },
                {
                  id: '201804090950',
                  name: '维修报告与成本'
                }
              ]
            },
            {
              title: '交付与回访',
              parentFolder: '201804090954',
              items: [
                {
                  id: '201804090955',
                  name: '交付单'
                },
                {
                  id: '201804090956',
                  name: '快递单'
                }
              ]
            }
            ]
          }]
        },
        action1: [{
          id: 'ac10001',
          backgroundPosition: '0 -501px',
          activeBakgroundPosition: '0 -521px',
          label: '写日报'
        }, {
          id: 'ac10002',
          backgroundPosition: '-20px -501px',
          activeBakgroundPosition: '-20px -521px',
          label: '安排任务'
        }, {
          id: 'ac10003',
          backgroundPosition: '-140px -501px',
          activeBakgroundPosition: '-140px -521px',
          label: '安排日程'
        }, {
          id: 'ac10004',
          backgroundPosition: '-60px -501px',
          activeBakgroundPosition: '-60px -521px',
          label: '上传文件'
        }, {
          id: 'ac10005',
          backgroundPosition: '-100px -501px',
          activeBakgroundPosition: '-100px -521px',
          label: '提交申请'
        }, {
          id: 'ac10006',
          backgroundPosition: '-40px -501px',
          activeBakgroundPosition: '-40px -521px',
          label: '添加项目'
        }],
        action2: [{
          id: 'ac20001',
          backgroundPosition: '-80px -501px',
          activeBakgroundPosition: '-80px -521px',
          label: '新建客户'
        }, {
          id: 'ac20002',
          backgroundPosition: '-120px -501px',
          activeBakgroundPosition: '-120px -521px',
          label: '新建联系人'
        }, {
          id: 'ac20003',
          backgroundPosition: '-220px -501px',
          activeBakgroundPosition: '-220px -521px',
          label: '客户联系记录'
        }],
        helps: [{
          id: 'h001',
          name: '官方QQ群',
          backgroundPosition: '0 -1099px'
        }, {
          id: 'h002',
          name: '帮助中心',
          backgroundPosition: '-28px -1099px'
        }, {
          id: 'h003',
          name: '意见反馈',
          backgroundPosition: '-56px -1099px'
        }, {
          id: 'h004',
          name: '产品反馈',
          backgroundPosition: '-84px -1099px'
        }, {
          id: 'h005',
          name: '系统更新动态',
          backgroundPosition: '-112px -1099px'
        }, ],
        dropdownIsActive: false,
        activeTab: 'guidance',
        tabs: [
          {
            name: 'home',
            label: '工作台'
          },
          {
            name: 'guidance',
            label: '新手导航',
            link: './guidance.html'
          }
        ],
        locking: {
          isHidden: true,
          diameter: 0,
          borderWidth: 0
        }
      },
      mounted() {
        let _self = this;
        let widthSquare = Math.pow(document.body.clientWidth, 2);
        let heightSquare = Math.pow(document.body.clientHeight, 2);
        let diameter = Math.ceil(Math.pow(widthSquare + heightSquare, 1 / 2));
        this.locking.diameter = diameter;
        let tabContent = document.getElementsByClassName('el-tabs__content')[0];
        tabContent.style.height = document.body.clientHeight - 91 + 'px';

        if(sessionStorage.tabs) {
          let arr = JSON.parse(sessionStorage.tabs);
          _self.tabs.splice(0, _self.tabs.length);
          arr.forEach((item)=> {
            _self.tabs.push(item);
          });
          _self.activeTab = sessionStorage.activeTab;
        };

        axios.get(isShowGuidanceUrl).then((data)=> {
          let jdata = JSON.parse(data.data.message)
          if(data.data.status) {
            if(jdata.neverShow) {
              for(let i = 0; i < _self.tabs.length; i++) {
                if(_self.tabs[i].name == 'guidance') {
                  _self.tabs.splice(i, 1);
                  return;
                }
              }
            }
          }
        })
      },
      methods: {
        selectTab: function(tabId, tabName, parentFolder) {
          _self = this;
          for (let i = 0; i < _self.tabs.length; i++) {
            if (_self.tabs[i].name == 'tab' + tabId) {
              _self.activeTab = 'tab' + tabId;
              sessionStorage.activeTab = _self.activeTab;
              this.dropdownIsActive = false;
              return;
            }
          }
          let obj = {};
          obj.name = 'tab' + tabId;
          obj.label = tabName;
          obj.link = './views/' + parentFolder + '/' + tabId + '.html';
          this.tabs.push(obj);
          this.activeTab = obj.name;
          sessionStorage.activeTab = obj.name;
          this.dropdownIsActive = false;
        },
        clickTab: function(tab) {
          sessionStorage.activeTab = tab.name;
        },
        removeTab: function(tabName) {
          let _self = this;
          for (let i = 0; i < _self.tabs.length; i++) {
            if (_self.tabs[i].name == tabName) {
              _self.tabs.splice(i, 1);
              _self.activeTab = _self.tabs[i - 1].name;
              return;
            }
          }
        },
        lockScreen: function() {
          let _self = this;
          this.locking.isHidden = false;
          setTimeout(function() {
            _self.locking.borderWidth = _self.locking.diameter / 2;
            setTimeout(function() {
              window.location.href = './locking.html';
            }, 1014);
          }, 14)
        }
      },
      watch: {
        tabs(arr) {
          if(arr.length === 1) {
            this.activeTab = 'home';
            return;
          }
          if(sessionStorage.tabs) {
            let arrObj2 = JSON.parse(sessionStorage.tabs);
            arrObj2.splice(0, arrObj2.length);
            arr.forEach((item)=> {
              arrObj2.push(item);
            })
            sessionStorage.tabs = JSON.stringify(arrObj2);
            sessionStorage.activeTab = this.activeTab;
          }else{
            let arrObj = [];
            arr.forEach((item)=> {
              arrObj.push(item);
            })
            sessionStorage.tabs = JSON.stringify(arrObj);
            sessionStorage.activeTab = this.activeTab;
          }
        }
      }
    })
  }

  that.init = (isShowGuidanceUrl)=> {
    _this.init(isShowGuidanceUrl);
  }

  return that;
}