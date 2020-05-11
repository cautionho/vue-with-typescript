import Vue from 'vue';
const VueCookie = require('vue-cookie');

class Cookie {
	Domin: string = ""
	Get(k: string): string { const C = VueCookie.get(k); return C === null ? "{}" : C }
	Set < T > (k: string, v: T): void {
		const curDate = new Date(),
			expiresDate = new Date(new Date(`${curDate.toDateString()} 00:00:00`).valueOf() + 86400000 - 1);
		VueCookie.set(k, v, {
			expires: expiresDate.toUTCString(),
			domain: this.Domin
		});
	}
	Del(k: string): void {
		VueCookie.delete(k, { domain: this.Domin });
	}
}

export default new Cookie()
