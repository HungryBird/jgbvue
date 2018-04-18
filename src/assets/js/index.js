JGBVue = {
  module: {}
}

JGBVue.module.index = ()=> {
  let _this = {}
  ,that = {};

  _this.init = (
    isShowGuidanceUrl,
    menuListGetUrl
  )=> {
    /**
     * edit by lanw 2018-4-17
     * 重构功能菜单
     */
    that.vm = new Vue({
      el: '#app',
      data: {
        user: {
          name: '赵某',
          portrait: './assets/img/index/portrait.png',
          teamName: '我的团队001',
          navItems: [{
            code: 'nav_001',
            cls: 'fa fa-home'
          }],
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
      //add by lanw 2018-4-17 for重构功能菜单
      created: function() {
        this.getMenuList()
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
        //add by lanw 2018-4-17 for重构功能菜单
        //获取功能菜单
        getMenuList: function() {
          axios.post(menuListGetUrl).then(res=> {
            if(res.data.status) {
              this.user.navItems = this.user.navItems.concat(JSON.parse(res.data.data))
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
        selectTab: function(tabId, tabName, tabUrl) {
          _self = this;
          for (let i = 0; i < _self.tabs.length; i++) {
            if (_self.tabs[i].name == 'tab' + tabId) {
              _self.activeTab = 'tab' + tabId;
              sessionStorage.activeTab = _self.activeTab;
              this.dropdownIsActive = false;
              //规定参数以外的传参当做query处理
                _self.tabs[i].link = `${tabUrl}?menu_id=${tabId}${arguments[3] ? '&&'+arguments[3] : ''}`
              return;
            }
          }
          let obj = {};
          obj.name = 'tab' + tabId;
          obj.label = tabName;
          obj.link = `${tabUrl}?menu_id=${tabId}${arguments[3] ? '&&'+arguments[3] : ''}`
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
        tabs: {
          //edit by lanw 2018-4-16 修改为深度监听模式 
          handler: function(arr) { 
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
          },
          deep: true
        },
      }
    })
  }

  that.init = (
    isShowGuidanceUrl,
    menuListGetUrl
  )=> {
    _this.init(
      isShowGuidanceUrl,
      menuListGetUrl
    );
  }

  return that;
}