import Vue from 'vue'
/**
 * 拖曳指令
 * 可以传入参数，通过v-drag:param的方式传参
 */
Vue.directive('drag', (el, binding) => {
  let oDiv = el
  let anoEl = null
  let param = binding.value
  let scaleOffset = 0
  if (param) {
    anoEl = param.additionalEle ? param.additionalEle.$el : null
    scaleOffset = param.scaleOffset || 0
  }
  oDiv.onmousedown = (ev) => {
    let disX = ev.clientX - oDiv.offsetLeft
    let disY = ev.clientY - oDiv.offsetTop
    document.onmousemove = (ev) => {
      let l = ev.clientX - disX
      let t = ev.clientY - disY
      requestAnimationFrame(function () {
        oDiv.style.transition = 'none'
        oDiv.style.left = l + 'px'
        oDiv.style.top = t + 'px'
      })
      if (anoEl !== null && anoEl.style) {
        requestAnimationFrame(function () {
          anoEl.style.transition = 'none'
          anoEl.style.top = (t + scaleOffset) + 'px'
        })
      }
    }
    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
    }
  }
})
/**
 * 默认聚焦
 */
Vue.directive('focus', {
    // 当绑定元素插入到 DOM 中。
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
