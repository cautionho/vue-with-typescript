import router from '../../router/index';
import Interface from '../Interface/Admin';
import PInterface from '../Interface/Public';
import Cookie from '../Global/Cookie';
import Api from './Api';
import Server from './Server';
import Request from '../Global/Request';
import UI from '../Global/UI';

class Log {
	In(arg: Interface.Login): void {
		// 1-验证用户状态 2-存储cookie
		UI.Loading.Show();
		Request.Post({
			Server: Server.Admin,
			Api: {
				Address: Api.Login,
				Login: false
			},
			Data: arg,
			Callback(res: PInterface.Res): void {
				UI.Loading.Hide();
				if (res.IsSuccess) {
					const User: PInterface.User = res.Data.Data;
					if (User.Status === 5) {
						UI.Tips.Floating('error', '抱歉，已离职员工禁止进入系统');
						return;
					}
					Cookie.Set('frler_user', JSON.stringify(res.Data.Data));
					if (User.Status === 1) {
						console.log(1)
						let obj:any = {
							name: 'ModifyFile',
							query: { IsCreate: true, IsChange: arg.Password === "abc123456" ? true : false }
						}
						router.replace(obj);
						
					} else if (User.Status === 2) {
						let obj:any = {
							name: 'ModifyFile',
							query: { IsCreate: false }
						}
						router.replace(obj);
					} else {
						router.replace('Index');
					}
				} else {
					Request.Error(res);
				}
			}
		})
	}
	Out(): void {
		UI.Loading.Show();
		Request.Post({
			Server: Server.Admin,
			Api: {
				Address: Api.Logout,
				Login: false
			},
			Data: "",
			Callback(res: PInterface.Res): void {
				UI.Loading.Hide();
				Cookie.Del('frler_user');
				router.replace('/');
			}
		})
	}
}

export default new Log();
