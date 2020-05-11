<template>
	<Row :class="`Login-Page ${LoginTheme}`">
		<Col class="Login-Container" :style="{'margin-top': `${ContainerH}px`}">
		<Row class="Login-Container-Items">
			<!-- 日常场景布局 -->
			<section class="Login-Container-Box" v-if="LoginTheme === 'Login-Default'">
				<Col span="12" class="Login-Form">
				<section class="Logo-Box">
					<img src="/img/logo-primary.png" class="Logo">
				</section>
				<Form onsubmit="return false" ref="LoginMsg" :model="LoginMsg" :rules="LoginRules">
					<FormItem prop="Email">
						<Input type="text" size="large" ref="Email" v-model.trim="LoginMsg.Email" placeholder="请输入账号" autofocus @on-enter="Validate">
						</Input>
					</FormItem>
					<FormItem prop="Password">
						<Input type="password" size="large" v-model="LoginMsg.Password" placeholder="请输入密码" @on-enter="Validate"></Input>
					</FormItem>
					<FormItem class="P-TA-C">
						<Button type="primary" class="Btn-Login P-MR-10" @click="Validate">登录</Button>
						<Button class="P-ML-10 Btn-Login">重置</Button>
					</FormItem>
				</Form>
				</Col>
			</section>
			<!-- 关于节日的场景布局 -->
			<section v-else :class="LoginTheme">
				<!-- 容器 -->
				<div class="Login-Festival">
					<!-- 表单 -->
					<Form class="Login-Festival-Form" ref="LoginMsg" :model="LoginMsg" :rules="LoginRules">
						<section class="P-TA-C">
							<img :src="LoginLogo" width="170">
						</section>
						<FormItem prop="Email">
							<Label>账号</Label>
							<Input v-model.trim="LoginMsg.Email" placeholder="请输入账号" @on-enter="Validate"></Input>
						</FormItem>
						<FormItem prop="Password">
							<Label>密码</Label>
							<Input type="password" v-model.trim="LoginMsg.Password" placeholder="请输入密码" @on-enter="Validate"></Input>
						</FormItem>
						<FormItem class="Login-Btn-Box">
							<Button class="Btn-Login" @click="Validate">登录</Button>
							<Button class="Btn-Login">重置</Button>
						</FormItem>
					</Form>
				</div>
			</section>
		</Row>
		</Col>
		<footer class="Footer">
			<p>Copyright © {{Year}} 弗睿网络科技（广州）有限公司 All Right Reserved <a href="http://beian.miit.gov.cn" target="_blank">粤ICP备14023567号</a></p>
		</footer>
	</Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Interface from '../assets/Interface/Admin';
import PInterface from '../assets/Interface/Public';

@Component
export default class Login extends Vue {
	/*钩子start*/
	private mounted() {
		this.IsLogin();
	}
	/*钩子end*/

	/*methods start*/
	private IsLogin(): void {
    this.$UI.Loading.Hide();
		const User: PInterface.User = JSON.parse(this.$Cookie.Get('frler_user'));
		if (User.UserId) {
			// this.$router.replace('Index');
			this.$router.replace('Control');
		} else {
			// this.CalcFestival();
			this.GetTheme();
			(this.$refs.Email as any).focus();
		}
	}

	private GetTheme(): void {
		this.$set(this, 'LoginTheme', this.GetLunar() || this.GetFestival());
	}

	// 农历节
	private GetLunar(): string {
		let cYear, cMonth, cDay, nDate,
			madd = new Array(12),
			CalendarData = new Array(0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95);
		madd[0] = 0;
		madd[1] = 31;
		madd[2] = 59;
		madd[3] = 90;
		madd[4] = 120;
		madd[5] = 151;
		madd[6] = 181;
		madd[7] = 212;
		madd[8] = 243;
		madd[9] = 273;
		madd[10] = 304;
		madd[11] = 334;

		function GetBit(m: number, n: number): number {
			return (m >> n) & 1;
		}

		nDate = (arguments.length != 3) ? new Date() : new Date(arguments[0], arguments[1], arguments[2]);
		var total, m, n, k;
		var isEnd = false;
		var tmp = nDate.getFullYear();
		if (tmp < 1900) {
			tmp += 1900;
		}
		total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + madd[nDate.getMonth()] + nDate.getDate() - 38;

		if (nDate.getFullYear() % 4 == 0 && nDate.getMonth() > 1) {
			total++;
		}
		for (m = 0;; m++) {
			k = (CalendarData[m] < 0xfff) ? 11 : 12;
			for (n = k; n >= 0; n--) {
				if (total <= 29 + GetBit(CalendarData[m], n)) {
					isEnd = true;
					break;
				}
				total = total - 29 - GetBit(CalendarData[m], n);
			}
			if (isEnd) break;
		}
		cYear = 1921 + m;
		cMonth = k - n + 1;
		cDay = total;
		if (k == 12) {
			if (cMonth == Math.floor(CalendarData[m] / 0x10000) + 1) {
				cMonth = 1 - cMonth;
			}
			if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
				cMonth--;
			}
		}
		if ((cMonth === 12 && cDay > 23) || (cMonth === 1 && cDay < 15)) {
			// 春节
			return 'Login-Spring';
		}
		if (cMonth === 1 && cDay === 15) {
			// 元宵
			this.$set(this, 'LoginLogo', '/img/logo-primary.png')
			return 'Login-Lantern';
		}
		if (cMonth === 5 && (cDay > 2 && cDay < 6)) {
			// 端午节
			return 'Login-Dragon';
		}
		if (cMonth === 7 && cDay === 7) {
			// 七夕节
			return 'Login-Chinese-Valentine';
		}
		if (cMonth === 8 && (cDay > 12 && cDay < 16)) {
			// 中秋节
			return 'Login-Mid-Autumn';
		}
		if (cMonth === 9 && cDay === 9) {
			// 重阳节
			// this.isMarginTop = false;
			return 'Login-Double-Nine';
		}
		return '';
	}

	// 新历节
	private GetFestival(): string {
		const Dates = (arguments.length != 3) ? new Date() : new Date(arguments[0], arguments[1], arguments[2]);
		// n开头为新历，o开头为旧历
		const Month = Dates.getMonth() + 1,
			Day = Dates.getDate(),
			Weekday = Dates.getDay();
		switch (Month) {
			case 1:
				if (Day === 1) {
					return 'Login-Newyear'; // 元旦
				}
				if (Day > 4 && Day < 8) {
					return 'Login-Xiaohan'; // 小寒
				}
				if (Day > 19 && Day < 22) {
					return 'Login-Dahan'; // 大寒
				}
				return 'Login-Default'
			case 2:
				if (Day > 2 && Day < 6) {
					return 'Login-Lichun'; // 立春
				}
				if (Day === 14) {
					this.$set(this, 'LoginLogo', '/img/logo-primary.png')
					return 'Login-Valentine'; // 西方情人节
				}
				if (Day > 17 && Day < 21) {
					return 'Login-Yushui'; // 雨水
				}
				return 'Login-Default'
			case 3:
				if (Day > 4 && Day < 7) {
					return 'Login-Jingzhe'; //惊蛰
				}
				if (Day === 7) {
					this.$set(this, 'LoginLogo', '/img/logo-primary.png')
					return 'Login-Girl'; // 女生节
				}
				if (Day === 8) {
					return 'Login-Lady' // 妇女节
				}
				if (Day === 14) {
          this.$set(this, 'LoginLogo', '/img/logo-primary.png')
          this.$set(this, 'ContainerH', 0)
					return 'Login-White-Valentine'; //白色情人节
				}
				if (Day > 19 && Day < 23) {
					return 'Login-Chunfen'; // 春分
				}
				return 'Login-Default'
			case 4:
				if (Day > 2 && Day < 6) {
					this.$set(this, 'LoginLogo', '/img/logo-primary.png')
					return 'Login-Qingming'; //清明
				}
				if (Day > 18 && Day < 22) {
					return 'Login-Guyu'; //谷雨
				}
				if (Day > 28) {
					return 'Login-Labor'; // 劳动节
				}
				return 'Login-Default'
			case 5:
				if (Day < 4) {
					return 'Login-Labor'; //劳动节
				}
				if (Day === 4) {
					return 'Login-Youth'; //青年节
				}
				if (Weekday === 0 && Day > 7 && Day < 15) {
					return 'Login-Mother'; // 母亲节
				}
				if (Day > 4 && Day < 8) {
					return 'Login-Lixia'; // 立夏
				}
				if (Day > 19 && Day < 23) {
					this.$set(this, 'LoginLogo', '/img/logo-primary.png')
					return 'Login-Grain-Full'; //小满
				}
				return 'Login-Default'
			case 6:
				if (Day === 1) {
					return 'Login-Default'; //儿童节
				}
				if (Day > 4 && Day < 8) {
					return 'Login-MangZhong'; //芒种
				}
				if (Weekday === 0 && Day > 14 && Day < 22) {
					return 'Login-Father'; // 父亲节
				}
				if (Day > 20 && Day < 23) {
					return 'Login-Summer'; // 夏至
				}
				return 'Login-Default'
			case 7:
				if (Day > 5 && Day < 9) {
					return 'Login-Xiaoshu'; // 小暑
				}
				if (Day > 21 && Day < 25) {
					return 'Login-Dashu'; // 大暑
				}
				return 'Login-Default'
			case 8:
				if (Day > 6 && Day < 10) {
					return 'Login-Liqiu'; // 立秋
				}
				if (Day > 21 && Day < 25) {
					return 'Login-Chushu'; // 处暑
				}
				return 'Login-Default'
			case 9:
				if (Day > 6 && Day < 10) {
					this.$set(this, 'LoginLogo', '/img/logo-primary.png')
					return 'Login-Bailu'; // 白露
				}
				if (Day > 21 && Day < 25) {
					return 'Login-Qiufen'; // 秋分
				}
				if (Day > 28) {
					return 'Login-National'; //国庆
				}
				return 'Login-Default'
			case 10:
				if (Day < 8) {
					return 'Login-National'; //国庆
				}
				if (Day > 7 && Day < 10) {
					return 'Login-Hanlu'; //寒露
				}
				if (Day === 23) {
					this.$set(this, 'LoginLogo', '/img/logo-primary.png')
					return 'Login-Shuangjiang'; //霜降
				}
				if (Day === 24) {
					return 'Login-Programmer'; //程序员节
				}
				if (Day === 31) {
					return 'Login-Helloween'; //万圣节
				}
				return 'Login-Default'
			case 11:
				if (Day === 1) {
					return 'Login-Helloween'; //万圣节
				}
				if (Day > 6 && Day < 9) {
					return 'Login-Lidong'; //立冬
				}
				if (Day > 21 && Day < 24) {
					this.$set(this, 'LoginLogo', '/img/logo-primary.png')
					return 'Login-Xiaoxue'; //小雪
				}
				return 'Login-Default'
			case 12:
				if (Day > 5 && Day < 9) {
					this.$set(this, 'LoginLogo', '/img/logo-primary.png')
					return 'Login-Daxue'; // 大雪
				}
				if (Day > 20 && Day < 24) {
					return 'Login-Dongzhi'; //冬至
				}
				if (Day === 24) {
					this.$set(this, 'LoginLogo', '/img/logo-primary.png')
					return 'Login-Christmas-Eve'; //平安夜
				}
				if (Day === 25) {
					this.$set(this, 'LoginLogo', '/img/logo-primary.png')
					return 'Login-Christmas'; //圣诞节
				}
				if (Day > 30) {
					return 'Login-Newyear'; //元旦
				}
				return 'Login-Default'
			default:
				return 'Login-Default'
		}
	}

	private Validate(): void {
		(this.$refs.LoginMsg as any).validate((valid: boolean): void => {
			if (valid) {
				this.Login();
			}
		});
	}

	private Login(): void {
		this.$Log.In(this.LoginMsg)
	}
	/*methods end*/

	/*data start*/
	private LoginTheme: string = 'Login-Default'
	private LoginLogo: string = '/img/furui.png'
	private IsLabel: boolean = false

	private ContainerH: number = (this.$UI.FullHeight - 680) / 2
	private Year: string | number = new Date().getFullYear()
	private LoginMsg: Interface.Login = { Email: '', Password: '' }
	private LoginRules: any = { Email: [{ required: true, message: '请输入账号', trigger: 'blur' }], Password: [{ required: true, message: '请输入密码', trigger: 'blur' }] }
	/*data end*/
}

</script>
<style lang="less" scoped>
@import '../assets/Theme/Login.less';

.Footer {
	position: fixed;
	bottom: 10px;
	width: 100%;

	&>p {
		width: 100%;
		text-align: center;
		color: #666;
	}
}

</style>
