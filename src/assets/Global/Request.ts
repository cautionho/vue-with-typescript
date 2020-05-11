import router from '../../router/index';
import Cookie from './Cookie'
import UI from './UI';
import Log from '../Config/Log'

import PInterface from '../Interface/Public';
import Interface from '../Interface/Request';

const md5 = require('md5');

namespace Request {
	export class Request {
		Headers(arg: Interface.RPost, user: PInterface.User = JSON.parse(Cookie.Get('frler_user')) as Object): Interface.RHeader {
			const Sign: Interface.RSign = new Interface.RSign(user.UserId, arg.Data, user.Token),
				Header: Interface.RHeader = arg.Route ? new Interface.RHeaderRoute(Sign.userid, arg.Route) : new Interface.RHeader(Sign.userid);

			if (!arg.Form) {
				Header['Content-Type'] = 'application/json';
				Header['timestamp'] = Sign.timestamp;
				Header['nonce'] = Sign.nonce;
				Header['signature'] = md5((`${Sign.token}${Sign.userid}${Sign.timestamp}${Sign.nonce}${Sign.conditions}`).toLowerCase());
			}
			return Header
		}
		// 验证登录
		ValidateUser(arg: Interface.Api): boolean {
			const User: PInterface.User = JSON.parse(Cookie.Get('frler_user')) as Object;
			if (arg.Login) {
				if (User.UserId) {
					/*待录入*/
					if (User.Status === 1 && (router as any).history.current.name !== 'ModifyFile') {
						const obj:any = {
							name: 'ModifyFile',
							query: { IsCreate: true }
						}
						router.replace(obj);
						UI.Tips.Floating('info', '请按照要求录入员工档案');
						return false;
					}
					/*待核实*/
					// if (User.Status === 2 && (router as any).history.current.name !== 'ModifyFile') {
					// 	const obj:any = {
					// 		name: 'ModifyFile',
					// 		query: { IsCreate: false }
					// 	}
					// 	router.replace(obj);
					// 	UI.Tips.Floating('info', '当前员工档案状态为待核实，无法进入系统。请按照行政人员的要求修改员工档案');
					// 	return false;
					// }
					/*已离职*/
					if (User.Status === 5) {
						Cookie.Del('frler_user');
						router.replace('/');
						UI.Tips.Floating('error', '抱歉，已离职员工禁止使用系统');
						return false
					}
					return true
				} else {
					if ((router as any).history.current.name !== 'Login') {
						router.replace('/');
						UI.Tips.Floating('warning', '请重新登录');
					}
					return false;
				}
			} else {
				return true
			}
		}
		Get(Url: string): void {
      // const User: PInterface.User = JSON.parse(Cookie.Get('frler_user')) as Object,
      //   Header = this.Headers(new Interface.RPost(), User),
      //   Options = { method: 'get', mode: 'cors', headers: Header as any }
      // fetch(Url, Options).then((Res: any)=> {
      //   console.log(Res)
      // })
    }
		Post(arg: Interface.RPost): void {
			if (this.ValidateUser(arg.Api)) {
				const User: PInterface.User = JSON.parse(Cookie.Get('frler_user')) as Object,
					Header = this.Headers(arg, User),
					Options = { method: 'post', headers: Header as any, body: arg.Form ? arg.Data : JSON.stringify(arg.Data) }
				// 状态值为200，才真正视为成功，其余状态值抛出
				fetch(`${arg.Server}${arg.Api.Address}`, Options).then((res: any) => {
					if (res.status == 200) { return res.json() } else {
						const error = new Error(res.statusText)
						throw error
					}
				}).then((data: PInterface.Res) => {
					arg.Callback(data)
				}).catch((error: any) => {
					// 失败
					if (error.name != 'TypeError') {
						const err: PInterface.Res = { IsSuccess: false, Msg: error }
						arg.Callback(err)
					} else {
						// 关闭遮罩层
						UI.Tips.Floating('error', error)
						UI.Loading.Hide();
					}
				})
			}
		}
		Error(arg: PInterface.Res, callback ? : Function): void {
			const User: PInterface.User = JSON.parse(Cookie.Get('frler_user')) as Object;
			if (arg.ApiStatusCode) {
				switch (arg.ApiStatusCode) {
					case 401: //权限
						UI.Tips.Floating('error', arg.Msg);
						break;
					case 407: //刷新
						UI.Tips.Floating('error', '请校准当前电脑的系统时间');
						break;
					case 500: //提示异常
						UI.Tips.Modal({
							Type: 'error',
							Content: `服务器异常，请重试。${arg.Msg}`,
							Enter: false
						});
						break;
					case 403: //退出登录
					case 406: //退出登录
						UI.Tips.Modal({
							Type: 'error',
							Content: arg.Msg,
							Enter: false
						});
						//调用登出 清除cookie
						Log.Out();
						break;
					default:
						break;
				}
			} else {
				const n = (router as any).history.current.name;
				// 设置发货报错使用自定义弹窗提示
				if (n === 'SetSend' || n === 'ByTortSetSend') {
          setTimeout(()=>{
            UI.Tips.CustomModal({
              Type: 'error',
              Content: arg.Msg,
              Enter: false,
              Callback: callback
            })
          },300)
				} else {
          setTimeout(()=>{
            UI.Tips.Modal({
              Type: 'error',
              Content: arg.Msg,
              Enter: true,
              Callback: callback
            })
          },300)
				}
			}
		}

	}
}

export default new Request.Request()
