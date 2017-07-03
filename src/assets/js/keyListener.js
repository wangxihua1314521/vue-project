/**
 * 利用一个vue实例监听键盘事件，并作为全局的监听者，需要键盘的vue组件可以自行
 * import后监听keypress事件
 * 如： keyListener.$on('keypress', (e) => {
 *                 点击操作，一定要先判断当前组件是否在激活状态
 *           })
 */
import Vue from 'vue'
const keyListener = new Vue({
  created () {
    let callback = (e) => {
      e = e || window.event
      this.$emit('keypress', e)
    }
    document.removeEventListener('keyup', callback, false)
    document.addEventListener('keyup', callback, false)
  }
})
export default keyListener
