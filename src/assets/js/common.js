/**
 * 对象深拷贝
 * @param {*} obj 
 * created by lanw 2018-4-2
 */
let deepCopy = function(obj) {
  if(typeof obj != 'object'){
    return obj;
  }
  let _obj = {}
  for(key in obj) {
    _obj[key] = deepCopy(obj[key])
  }
  return _obj
}
Vue.prototype.$deepCopy = deepCopy
