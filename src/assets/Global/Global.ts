import Utils from './Utils'
import Request from './Request'
import Validate from './Validate'
import UI from './UI'
import Cookie from './Cookie'

export default {
	install(Vue: any, options: any) {
		Vue.prototype['$Utils'] = Utils
		Vue.prototype['$Request'] = Request
		Vue.prototype['$Validate'] = Validate
		Vue.prototype['$UI'] = UI
		// Vue.prototype['$Pattern'] = new Pattern()
		Vue.prototype['$Cookie'] = Cookie
	}
};
