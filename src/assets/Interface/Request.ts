import PInterface from './Public'

namespace Interface {
	export class Api {
		Address: string
		Login: boolean | undefined
	}

	export class RPost {
		Server: string
		Api: Interface.Api
		Data: any
		Callback(a: PInterface.Res): void {}
		Form ? : boolean
		Route ? : string
	}

	export class RGet {}

	export class RSign {
		userid: number | string
		timestamp: number
		nonce: number
		conditions: any
		token: string

		constructor(userid: number | string = '', conditions: any = '', token: string = '') {
			const Time: Date = new Date();
			this.timestamp = Time.valueOf();
			this.nonce = Math.floor(Math.random() * Time.getMilliseconds());
			this.userid = userid;
			this.conditions = JSON.stringify(conditions);
			this.token = token;
		}
	}

	export class RHeader {
		"Content-Type" ? : string
		userid: number | string = ''
		timestamp ? : number
		nonce ? : number
		signature ? : string

		constructor(userid: number | string = '') {
			this.userid = userid;
		}
	}

	export class RHeaderRoute extends RHeader {
		routetb ? : string
		constructor(userid: number | string = '', route: string = '') {
			super()
			this.routetb = route;
		}
	}
}

export default Interface
