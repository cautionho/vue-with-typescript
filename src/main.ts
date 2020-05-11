import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import ViewUI from 'view-design';
import Global from "./assets/Global/Global";
import Config from "./assets/Config/Config";
import VueClipboard from 'vue-clipboard2';
import './assets/Theme/Index.less';

Vue.config.productionTip = false;
VueClipboard.config.autoSetContainer = true;

Vue.use(VueClipboard);
Vue.use(Global);
Vue.use(Config);
Vue.use(ViewUI, {
	transfer: true,
	capture: false,
	modal: {
    maskClosable: false
	}
});

const requireComponent = require.context('./views', true, /[\w-]+\.vue$/),
  UIComponent = require.context('./components/UI', true, /[\w-]+\.vue$/);

// requireComponent.keys().forEach((fileName) => {
//   const componentConfig = requireComponent(fileName)
// 	if (componentConfig) {
// 		Vue.component(componentConfig.default.options.name, componentConfig.default)
// 	}
// })

UIComponent.keys().forEach((fileName) => {
  const componentConfig = UIComponent(fileName)
	if (componentConfig) {
		Vue.component(componentConfig.default.options.name, componentConfig.default)
	}
})

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount('#app');
