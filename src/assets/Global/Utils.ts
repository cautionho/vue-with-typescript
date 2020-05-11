import { Vue } from 'vue-property-decorator';
import Mixins from './Mixins';
import Resources from '../Config/Resource';
import PInterface from '../Interface/Public';
// import JSEncrypt from '../JsEncrypt/Jsencrypt';
const JSEncrypt = require('jsencrypt')
// declare let JSEncrypt: any;

namespace Utils {
	export class Utils {}
	export class Enum {
		GetEnumArr < T > (Arg: T): PInterface.KV[] {
			let Arr: PInterface.KV[] = [];
			for (let Item in Arg) {
				if (isNaN(Number(Item))) {
					Arr.push({Key: Item, Value: Number(Arg[Item])})
				}
			}
			return Arr;
		}
	}
	export class Array {}
	export class Powers {
		Valid(r: string): boolean {
			let flag: boolean = false;
			// for (let item in mutations.state.resourceData.Point) {
			// 	if (mutations.state.resourceData.Point[item].ElementId == r) {
			// 		flag = true;
			// 		break;
			// 	} else {
			// 		flag = false;
			// 		continue;
			// 	}
			// }
			return flag;
		}
		GetUserResource(arg: string[]): PInterface.Power {
			const Points: PInterface.Resource[] = (this as any).$Resource.Point,
        Res: any = {};
			arg.forEach((item, index) => {
				if (Points.filter(itm => itm.ElementId === item).length) {
					Res[item] = true;
				} else {
					Res[item] = false;
				}
      })
			return Res;
		}
	}
	export class Date {
		FormatDateToCn(d: string): string {
			return ''
		}
	}
	export class String {
    // RSA进行加密
    Encrypt(Str:string):string {
      let Encrypts = new JSEncrypt.JSEncrypt()
      Encrypts.setPublicKey(`-----BEGIN PUBLIC KEY-----
        MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC/kmQjlaCdPsQQ4ylW9OJp6YWr
        Ux6Xf8SdFya84ZFLcghjzFxGGIuGJ1k+zheZpIVI9sUFmzs7K7GbNHVu8lH3lHmV
        rkiuuq3AfOV2uZfFLdwUoc0ACXWGoOmUEvFdIykxCaSafBK7RsVmpfYmjlhPwziu
        QcItHSNZXf9zempLxwIDAQAB
        -----END PUBLIC KEY-----
      `)
      let rsaDatas = Encrypts.encrypt(Str)
      return rsaDatas
    }
  }
	export class Pagination {
		// 渲染分页
		FilterPagination < T > (pageNo: number, pageSize: number, array: T[]): T[] {
			const offset = (pageNo - 1) * pageSize
			return (offset + pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize)
		}
	}
	export class Label {
		// 计算一次打印多少张SKU标签
		ComputedSkuLabelAmount(Index: number, Amount: number, PageSize: number): number {
			return Index * PageSize > Amount ? Amount - ((Index - 1) * PageSize) : PageSize
		}

		// 画SKU标签
		DesignSkuLabel(LODOP: any, Barcode: string, ShowPrintCode: string, SkuName: string, LocationCode: string) {
			LODOP.NewPage()
			LODOP.ADD_PRINT_BARCODE("4.26mm", "10%", "80%", "13.15mm", "128Auto", Barcode);
			LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
			LODOP.ADD_PRINT_TEXT("19.82mm", "25.51mm", "32.54mm", "6.56mm", ShowPrintCode);
			LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
			LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
			LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
			LODOP.ADD_PRINT_TEXT("28.84mm", "1.59mm", "57.68mm", "9.79mm", SkuName);
			LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
			LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
			LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
			LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
			LODOP.ADD_PRINT_TEXT("19.82mm", "2.01mm", "23.5mm", "5.29mm", LocationCode);
			LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
			LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
		}
	}
}

Mixins.applyMixins(Utils.Utils, [Utils.Array, Utils.Powers, Utils.Date, Utils.String, Utils.Pagination, Utils.Enum, Utils.Label])

export default new Utils.Utils()
