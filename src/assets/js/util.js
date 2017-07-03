/*
 * 接口中不允许有number类型
 * 将所有属性转换成string 类型
 */
function paramToString (data) {
  if (typeof data === 'object') {
    for (let i in data) {
      if (typeof data[i] === 'object') {
        paramToString(data[i])
      } else {
        data[i] += ''
      }
    }
  }
  return data
}

/*
 * 将数组转换成逗号分隔字符串
 * @param arr 要转换的数组
 * @param str 初始字符串，可选参数
 * @param key arr如果是list-map格式，需要传map中的字段名
 */
function arrToString (arr, str, key) {
  if (!arr || arr.length === 0) {
    return ''
  }
  var s = str ? str + ',' : ''
  if (key) {
    for (let item of arr) {
      s += (item[key] + ',')
    }
  } else {
    for (let item of arr) {
      s += (item + ',')
    }
  }
  return s.substring(0, s.length - 1)
}
/**
 * 获取文件小写后缀
 */
const getFileExtension = function (filename) {
  let tempArr = filename.split('.')
  let extension
  if (tempArr.length === 1 || (tempArr[0] === '' && tempArr.length === 2)) {
    extension = ''
  } else {
    extension = tempArr.pop().toLowerCase() // 获取文件扩展名并最小化
  }
  return extension
}
/**
 * 二进制码转blob，主要用于canvas提取出来的base64格式的图片
 */
const base64ToBlob = function (ndata, fileType) {
  let text = window.atob(ndata.split(',')[1])
  let buffer = new Uint8Array(text.length)
  for (let i = 0; i < text.length; i++) {
    buffer[i] = text.charCodeAt(i)
  }
  return getBlob([buffer], fileType)
}
/**
 * 获取Blob对象
 * 参数是ArrayBuffer,可以由base64ToBlob方法调用，或者传入FileReader取到的结果
 */
const getBlob = function (buffer, format) {
  try {
    return new Blob(buffer, {
      type: format
    })
  } catch (e) {
    console.log('走catch')
    var bb = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder)()
    buffer.forEach(function (buf) {
      bb.append(buf)
    })
    return bb.getBlob(format)
  }
}

/**
 * 生成一个uuid
 */
const getUUID = () => {
  let d = new Date().getTime()
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}
/*
 * 获取没有参数的url部分,七牛下载连接中url位域名+key是固定的的,后面参数是变动的
 * 通过参数以前的部分可判断是否为相同文件
 */
function getQiniuUrl (str) {
  return str.substring(0, str.indexOf('?'))
}
/*
 * 将数组中的指定字段拼接成逗号间隔字符串
 * mark参数可设置成其他符号
 */
function comtactFlag (array, paramName, mark) {
  if (!array || !paramName) return ''
  var str = ''
  var flag = ','
  if (mark) flag = mark
  for (var i = 0; i < array.length; i++) {
    if (array[i][paramName]) {
      str += array[i][paramName] + flag
    }
  }
  str = str.substr(0, str.length - 1)
  return str
}

export {
  paramToString,
  arrToString,
  getQiniuUrl,
  getFileExtension,
  base64ToBlob,
  getUUID,
  comtactFlag
}
