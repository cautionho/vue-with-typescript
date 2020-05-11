import ViewUI from 'view-design';
interface TModal {
	Type: string
	Time ? : number
	Content: string
	Callback ? : Function
	Enter: boolean
}

const UI: any = {
	WinResize(): number {
		let winHeight: number = 0,
			winWidth: number = 0;
		if (window.innerWidth)
			winWidth = window.innerWidth;
		else if ((document.body) && (document.body.clientWidth))
			winWidth = document.body.clientWidth;
		// 获取窗口高度
		if (window.innerHeight)
			winHeight = window.innerHeight;
		else if ((document.body) && (document.body.clientHeight))
			winHeight = document.body.clientHeight;
		// 通过深入 Document 内部对 body 进行检测，获取窗口大小
		if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
			winHeight = document.documentElement.clientHeight;
			winWidth = document.documentElement.clientWidth;
		}
		return winHeight;
	}
}

UI['Render'] = {
	Date(D: string, T ? : boolean): string {
    if(!D){ return '-' }
    
		const CurDate: any = new Date(D.replace(/\//g, '-').replace(/\s/g, 'T')),
			CurYear: number = CurDate.getFullYear();
		let Res = "-"
		if ([1900, 1, 1901].includes(CurYear)) {
			return Res;
		} else {
			if (T) {
				Res = D.replace('T', ' ')
			} else {
				Res = D.split('T')[0]
			}
		}
		return Res;
	},
	NewDate(d: string, t ? : boolean): string {
		if (d === "") {	return "-"; }
		const CurDate: any = new Date(d),
			CurYear: string = JSON.stringify(CurDate.getFullYear()),
			CurMonth: string = (`${CurDate.getMonth()+1}`).padStart(2, '0'),
			CurDay: string = (`${CurDate.getDate()}`).padStart(2, '0')

		let CurHour: string = '00',
			CurMin: string = '00',
			CurSec: string = '00'

		if (t) {
			CurHour = `${CurDate.getHours()}`.padStart(2, '0')
			CurMin = `${CurDate.getMinutes()}`.padStart(2, '0')
			CurSec = `${CurDate.getSeconds()}`.padStart(2, '0')
		}

		return `${CurYear}-${CurMonth}-${CurDay}T${CurHour}:${CurMin}:${CurSec}`
	}
}

UI['Tips'] = {
	Callback: null,
	// 浮层
	Floating(t: string, m: string): void {
		(ViewUI as any).Message[t]({
			content: m,
			background: true,
			duration: 3
		})
	},
	EnterModal(e: Event): void {
		if ((e as any).target.tagName !== 'BODY') {
			return;
		}
		if ((e as any).keyCode == 13) {
			(ViewUI as any).Modal.remove();
			window.removeEventListener("keyup", UI.Tips.EnterModal);
			if (UI.Tips.Callback) {
				UI.Tips.Callback(true);
			}
		}
	},
	RmEnterEvt(): void {
		window.removeEventListener("keyup", UI.Tips.EnterModal);
	},
	// 弹窗
	Modal(opt: TModal): void {
		(document.activeElement as any).blur();
		if (opt.Enter) {
			this.Callback = opt.Callback;
			window.addEventListener('keyup', this.EnterModal, false);
		}
		const Options: any = {
			title: opt.Type === 'confirm' ? '确认' : '提示',
			content: opt.Content,
			closable: false,
			onOk: () => {
				UI.Tips.RmEnterEvt()
				if (opt.Callback) {
					opt.Callback(true);
				}
			},
			onCancel: () => {
				UI.Tips.RmEnterEvt()
				if (opt.Callback) {
					opt.Callback(false);
				}
			}
		};
		(ViewUI as any).Modal[opt.Type](Options)
	},
	// 自定义窗口
	CustomModal(opt: TModal): void {
		(document.activeElement as any).blur();
		if (opt.Enter) {
			this.Callback = opt.Callback;
			window.addEventListener('keyup', this.EnterModal, false);
		}
		const Options = {
			title: opt.Type === 'confirm' ? '确认' : '提示',
			width: 600,
			render: (h: any): any => {
				return h('div', { class: `P-Modal-${opt.Type}` }, [
					h('p', {
						class: 'P-Modal-Txt'
					}, opt.Content)
				])
			},
			onOk: () => {
				UI.Tips.RmEnterEvt()
				if (opt.Callback) {
					opt.Callback(true);
				}
			},
			onCancel: () => {
				UI.Tips.RmEnterEvt()
				if (opt.Callback) {
					opt.Callback(false);
				}
			}
		};
		(ViewUI as any).Modal[opt.Type](Options);
		(document as any).querySelector(`.P-Modal-${opt.Type}`).parentNode.parentNode.parentNode.parentNode.classList.add(`P-Modal-${opt.Type}-Content`);
	}
}

UI['Loading'] = {
	Show(): void {
		(ViewUI as any).Spin.show()
	},
	Hide(): void {
		(ViewUI as any).Spin.hide()
	}
}

export default {
	FullHeight: () => UI.WinResize(), // 获取视窗高度
	Loading: UI.Loading,
	Render: UI.Render,
	Tips: UI.Tips
}
