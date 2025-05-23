import { createApp } from 'vue'
import App from './app.vue'
import router from './router'
import './assets/main.scss'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)
app.use(router)
app.use(createPinia().use(piniaPluginPersistedstate))
app.use(ElementPlus)
app.mount('#app') 