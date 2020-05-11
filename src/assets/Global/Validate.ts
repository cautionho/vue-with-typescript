import Pattern from '../Config/Pattern'
namespace Validate {
	// 手机号码
	export class Mobile extends Pattern implements StringValidator {
		Valid(S: string) {
			return this.Mobile.test(S);
		}
		constructor() {
			super()
		}
	}
	// 邮箱
	export class Email extends Pattern implements StringValidator {
		Valid(S: string) {
			return this.Email.test(S) && !this.Chinese.test(S);
		}
		constructor() {
			super()
		}
	}
	// 货架号
	export class LocationCode extends Pattern implements StringValidator {
		Valid(S: string) {
			return this.LocationCode.test(S);
		}
		constructor() {
			super()
		}
	}
	// 整数
	export class Int extends Pattern implements NumberValidator {
		Valid(S: number | string) {
			return this.Int.test(S.toString());
		}
		constructor() {
			super()
		}
  }
  // 正整数（包括0）
  export class PositiveInt extends Pattern implements NumberValidator {
    Valid(S: number | string){
      return this.PositiveInt.test(S.toString())
    }
    constructor(){
      super()
    }
  }
  // Excel文档
	export class Xls implements FileValidator {
		Valid (F: any) {
      let Type = F.type.toLowerCase(),
      ExcelType = ['application/vnd.ms-excel']
    return ExcelType.some((Item) => {
      return Type === Item
    })
		}
	}
	// word文档
	export class Doc implements FileValidator {
		Valid < T > (F: T) {
			return true
		}
	}
	// 图片
	export class Img implements FileValidator {
		Valid < T > (F: T) {
			return true
		}
	}
	// 压缩包
	export class Compress implements FileValidator {
		Valid < T > (F: T) {
			return true
		}
	}
}

namespace Validate {
	export interface StringValidator {
		Valid(s: string): boolean;
	}
	export interface NumberValidator {
		Valid(s: number): boolean;
	}
	export interface FileValidator {
		Valid < T > (f: T): boolean;
	}
}

export default Validate
