import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import components from './components'
import ElementUI,{Message} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/styles/base.css'
import '@/assets/styles/common.css'

Vue.config.productionTip = false
Vue.use(components)
Vue.use(ElementUI)
Vue.prototype.$message = Message

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
