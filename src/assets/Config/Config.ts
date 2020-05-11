import Resource from './Resource'
import Api from './Api'
import Server from './Server'
import Mail from './Mail'
import Log from './Log'
import Enums from './Enum'
import Pattern from './Pattern'

export default {
	install(Vue: any, options: any) {
		Vue.prototype['$Resource'] = new Resource();
		Vue.prototype['$Api'] = Api;
		Vue.prototype['$Server'] = Server;
		Vue.prototype['$Log'] = Log;
		Vue.prototype['$Enums'] = Enums;
		Vue.prototype['$Pattern'] = new Pattern()
		Vue.prototype['$Mail'] = new Mail(); // 可自行指定打印面单
	}
};
