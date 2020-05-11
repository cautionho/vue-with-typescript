import GetLodop from '@/assets/LODOP/LodopFuncs';
import Interface from "@/assets/Interface/Print";
import {File} from '@/assets/Config/Server'
let LODOP: any  //声明为全局变量

export const PmsPrint = function(Data: Interface.PmsPrintData[]){
  LODOP = GetLodop(); //声明为全局变量
  if (LODOP == undefined) {
    return;
  }
  for (let Item of Data) {
    LODOP.PRINT_INITA("0mm", "0mm", "100.01mm", "100.01mm", "");
    LODOP.SET_PRINT_PAGESIZE(0, '100mm', '100mm', "PMS渠道面单");
    LODOP.ADD_PRINT_TEXT("2.99mm", "0.79mm", "98.43mm", "9.79mm", "PMS面单  发货单" + Item.OrderCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 17);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("21.7mm", "2.99mm", "36.78mm", "5.29mm", Item.MethodCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
    LODOP.ADD_PRINT_TEXT("23.02mm", "68.26mm", "30.69mm", "5.29mm", Item.NncCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("31.75mm", "32.54mm", "26.46mm", "5.29mm", Item.PickCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_BARCODE("40.75mm", "8.73mm", "77.52mm", "21.7mm", "128Auto", Item.PmsCode);

    LODOP.PRINT();
  }
}

export const MailPrint = function(PrintData:Interface.PrintData[], Route?:string) {
  LODOP = GetLodop(); //声明为全局变量
  if (LODOP == undefined) {
    return;
  }
  for (let Itm of PrintData) {
    const MethodApiType = Itm.MethodApiType
    const MethodCode = Itm.MethodCode
    /* 打印图片标识
    APITYPE：
    1.dhl（2张） 100mm
    2.UBI（1张）UBI CN-CA service CPC  150mm
    8.荷兰邮政（1张或2张） 100mm
    11.Wish邮-加拿大特惠专线渠道 2张10*10  Wish邮-EPC渠道10*10 Wish邮-CNE-全球通平邮渠道10*10 Wish邮-CNE-全球通挂号渠道10*10 Wish邮-常规货品渠道-优质物流服务商测试常规货品渠道(10x10)渠道代码为:7001-1;  Wish邮-常规货品渠道-优质物流服务商测试常规货品渠道(10x15)渠道代码为:7001-1*0;  Wish邮-安速派经济,渠道代码5001-1 10*10; Wish邮-安速派标准,渠道代码5002-1 10*10;
    12.万邑通-优邑专线英国达（Yodel渠道）
    10.睿振行-皇家邮政（1张） 150mm 睿振行-德国专线（1张） 200mm 睿振行-皇家邮政平邮渠道2张(10*10) 皇家邮政Large Letter渠道(10*15) 睿振行-Yode专线(10*15)
    18.JOOM物流 150mm  云途物流 100mm Joom线上发货-中国邮政小包平邮渠道(NRM*China Post Online)(RGM*China Post Online)10*10
    19.飞特物流线下泰国小包平邮和泰国小包挂号渠道
    21.4PX开放平台面单
    22.云途全球专线平邮（特惠普货）、 云途全球专线挂号（特惠普货）
    23.昌辉物流美国专线FU
    24.Vova线上-UBI-中国至澳洲全程查件服务，格式为2张10*10的图片 Vova线上-CNE-全球通挂号渠道 渠道代码为153, Vova线上-CNE-全球通平邮渠道 渠道代码为154,VOVA线上-燕文-东莞集货物流渠道501,Vova线上-集运专线-商家自寄渠道, ,Vova线上-集运专线-万色揽收 544 Vova线上-燕文-专线追踪小包-普货渠道 346 10*10
    25.Mymall线上发货-GVS RM、NR、SRM渠道(10*15)
    26.FLS-UBI澳洲专线,渠道代码为FRAUSL(10*15), FLS-德购英国专线(FRGBSL), FLS-德购德国专线(FRDESL), 睿捷美国FC专线(FRUSFCSL), 睿捷美国PM专线(FRUSPMSL), 睿捷瑞典专线-DHL(FRSWEDSL), 睿捷瑞典专线-MTD(FRSWEMSL), 睿捷波兰专线(RJPLSL), 睿捷美东专线PM(RJUSMDPM), 睿捷美东专线FC(RJUSMDFC), 睿捷美西专线PM(RJUSMXPM), 睿捷美西专线FC(RJUSMXFC)
    27.Jumia线上发货渠道,渠道代码NG-JG-SekoGuangzhouSekoStation
    28.jumia 捷邮-英国专线(10*15) 捷邮-德国专线(10*20)
    29.万邑通LMA（尾程联盟） 万邑通LMA-美国专线渠道(10*15) 渠道代码为 OSF710014;万邑通LMA-美国专线美东渠道,渠道代码为OSF711003116*LMAUS022; 万邑通LMA-美国专线美西渠道,渠道代码为OSF711003113*LMAUS021; 万邑通LMA-PMWC(10*15),渠道代码:OSF711003119*LMAUS021; 万邑通LMA-PMKY(10*15),渠道代码:OSF711003122*LMAUS022； eDIS-SpeedPAK轻小件渠道(EL)
    30..Lazada线上物流Lazada LGS-FM40渠道代码为LGS-FM40(10*15)
    */
	 	let PrintImgFlag = [1, 2, 8, 25].includes(MethodApiType) || (MethodApiType == 11 && ['900-1', '36-1', '1155-0', '1154-1', '7001-1', '7001-1*0', '5001-1', '5002-1'].includes(MethodCode)) || [12, 18, 19, 20, 21, 23].includes(MethodApiType) || ( MethodApiType == 24 && ['153', '154', '249', '150', '501', '542', '544', '346'].includes(MethodCode)) || (MethodApiType == 25 && ['CLEVY_NR', 'CLEVY_SRM', 'CLEVY_RM'].includes(MethodCode)) || (MethodApiType == 10 && ['1822', '2201', '3041', '2581', '3401'].includes(MethodCode)) || (MethodApiType == 26 && ['FRAUSL', 'FRDESL', 'FRGBSL', 'FRUSFCSL', 'FRUSPMSL', 'FRSWEDSL', 'FRSWEMSL', 'RJPLSL', 'RJUSMDPM', 'RJUSMDFC', 'RJUSMXPM', 'RJUSMXFC'].includes(MethodCode)) || (MethodApiType == 28 && ['2221', '3461'].includes(MethodCode)) || (MethodApiType == 29 && ['OSF711003116*LMAUS022', 'OSF711003113*LMAUS021', 'OSF711003119*LMAUS021', 'OSF711003122*LMAUS022', 'EL'].includes(MethodCode)) || (MethodApiType == 30 && MethodCode == 'LGS-FM40')
		
	 if (PrintImgFlag) {
      let LabelUrl: string = Itm.LabelUrl
      // 是否为云途物流和Joom线上发货-中国邮政小包平邮渠道，与云途物流做区分，云途物流和Joom线上发货-中国邮政小包平邮渠道ApiType与Joom物流相同
      let IsCloudExpress = ['Yun Express*JMZXR', 'Yun Express*JMZXP', 'NRM*China Post Online', 'RGM*China Post Online'].includes(String(MethodCode))
			let IsJoom = MethodCode === 'RM*Joom Logistics' || MethodCode === 'SRM*Joom Logistics' || MethodCode === 'UM*Joom Logistics';

			let PrintHeight = [1, 8].includes(MethodApiType) || (MethodApiType == 11 && ['900-1', '36-1', '1155-0', '1154-1', '7001-1', '5001-1', '5002-1'].includes(MethodCode)) || (MethodApiType == 10 && MethodCode === '2581') || ([19, 20, 24].includes(MethodApiType) && ['153', '154', '249', '150', '501', '542', '544', '346'].includes(MethodCode)) || (MethodApiType == 25 && (['CLEVY_NR', 'CLEVY_SRM', 'CLEVY_RM', 'RM10*Joom Logistics', ].includes(MethodCode) || IsCloudExpress)) || (MethodApiType == 29 && MethodCode == 'EL') ? 
			'100' : ( [2, 12, 21, 23, 25].includes(MethodApiType) || ['RM*Joom Logistics', 'JMZXR*Joom Logistics', 'JMZXP*Joom Logistics', '1822'].includes(MethodCode) || ( MethodApiType == 10 && ['3041', '3401'].includes(MethodCode) ) || ( MethodApiType == 11 && MethodCode == '7001-1*0' ) || ( MethodApiType == 26 && ['FRAUSL', 'FRDESL', 'FRGBSL', 'FRUSFCSL', 'FRUSPMSL', 'RJPLSL', 'RJUSMDPM', 'RJUSMDFC', 'RJUSMXPM', 'RJUSMXFC'].includes(MethodCode) ) || IsJoom || (MethodApiType == 28 && MethodCode === '2221') || (MethodApiType == 29 && ['OSF711003116*LMAUS022', 'OSF711003113*LMAUS021', 'OSF711003119*LMAUS021', 'OSF711003122*LMAUS022'].includes(MethodCode)) || (MethodApiType == 30 && MethodCode == 'LGS-FM40') ) 
			? '150' : '200';

      const IsPdf: boolean = (LabelUrl.split('.').pop() as string).toLowerCase() === 'pdf';;
      if(!IsPdf && (Route === 'Pack')){
        window.location.href = `FRPrint:${LabelUrl}&${PrintHeight}`
      }else{
        const LabelUrls = LabelUrl.split(';')
        for(let Url of LabelUrls){
          MdPrint[IsPdf ? 'PrintPDF' : 'UBIandDHL'](`${File}/${Url}`, `${PrintHeight}mm`)
        }
      }
    }else{
      /***明细单价计算***/
    	let SumAmount = 0;		//总申报金额
    	let SumQuantity = 0;	//总明细数量
    	let Details = Itm.Item.length;
    	for(let I=0; I<Details; I++){
    		SumAmount += Itm.Item[I].Amount * parseInt(String(Itm.Item[I].Quantity));
    		SumQuantity += parseInt(String(Itm.Item[I].Quantity));
    	}
    	let Flag = SumAmount > 10 ? (10 / SumQuantity) : 0;

    	for(let J=0; J<Details; J++){
    		if(Flag>0){
    			if((Flag * Itm.Item[J].Quantity < 1) || (Itm.Item[J].Amount * parseInt(String(Itm.Item[J].Quantity)) < 1)){
    				Itm.Item[J].Amount = 1/parseInt(String(Itm.Item[J].Quantity))
    			}else{
    				Itm.Item[J].Amount = Flag
    			}
    		}else{
    			Itm.Item[J].Amount = (Itm.Item[J].Amount / parseInt(String(Itm.Item[J].Quantity)))
    		}
			}
			
			if (MethodApiType == 13) {
			  // 香港DHL
				MdPrint['DHLHongkong'](Itm)
				
			}else{
				switch(MethodCode){
					case 'E1*Y':
					case 'E1*N':
						//顺丰国际平邮小包(带电、不带电)
						let IsBattery = MethodCode == 'E1*Y' ? 'Y' : 'N';
						MdPrint['printSFMail'](Itm, IsBattery);
						break;
					case 'E2*Y':
					case 'E2*N':
						if(MethodApiType == 7){
							//顺丰国际挂号小包 (带电、不带电)
							let IsBattery = MethodCode == 'E2*Y' ? 'Y' : 'N'
							MdPrint['printSFRegistered'](Itm, IsBattery)
						}
						break;
					case 'THPHU':
					case 'THPHR':
						MdPrint['pritnGlobalCircuit_YT'](Itm, MethodCode=='THPHR' );
						break;
					default:
						if (MdPrint[MethodCode]) {
							MdPrint[MethodCode](Itm)
						}
						if (MdPrint[MethodCode + '_back']) {
							MdPrint[MethodCode + '_back'](Itm,MethodCode)
						}
						break;
				}
			}

	    // if (MethodCode == 'E1*Y' || MethodCode == 'E1*N') {
	    //   //顺丰国际平邮小包(带电、不带电)
	    //   let IsBattery = MethodCode == 'E1*Y' ? 'Y' : 'N'
	    //   MdPrint['printSFMail'](PrintData[Itm], IsBattery)
	    // } else if (MethodApiType == 7 && (MethodCode == 'E2*Y' || MethodCode == 'E2*N')) {
	    //   //顺丰国际挂号小包 (带电、不带电)
	    //   let IsBattery = MethodCode == 'E2*Y' ? 'Y' : 'N'
      //   MdPrint['printSFRegistered'](PrintData[Itm], IsBattery)
	    // } else if (MethodApiType == 13) {
	    //   // 香港DHL
	    //   MdPrint['DHLHongkong'](PrintData[Itm])
	    // } else if(MethodCode == 'THPHU' || MethodCode == 'THPHR'){
    	//   // 云途全球专线平邮（特惠普货）、 云途全球专线挂号（特惠普货）渠道
      //   MdPrint['pritnGlobalCircuit_YT'](PrintData[Itm], MethodCode=='THPHR' );
      // } else {
      //   if (MdPrint[MethodCode]) {
	    //     MdPrint[MethodCode](PrintData[Itm])
	    //   }
	    //   if (MdPrint[MethodCode + '_back']) {
	    //     MdPrint[MethodCode + '_back'](PrintData[Itm],MethodCode)
	    //   }
	    // }
	  }
  }
}
const MdPrint: any = {
  "printPDF": function(Url: string, Height: string){
    LODOP.PRINT_INITA("0mm", "0mm", "100mm", Height, "PDF");
    LODOP.SET_PRINT_PAGESIZE(1, "100mm", Height, "PDF");
    LODOP.ADD_PRINT_PDF(0, 0, "100mm", Height, Url);
    LODOP.SET_PRINT_STYLEA(0, "HtmWaitMilSecs", 300);
    LODOP.PRINT();
  },
	"NG-Clevy-Station": function(Data:Interface.PrintData){
		LODOP.PRINT_INITA("0mm", "0mm", "100.01mm", "100.01mm", "NG-Clevy-Station渠道");
    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "Jumia线上发货渠道");
    LODOP.ADD_PRINT_RECT("2.99mm", "2.99mm", "94.01mm", "94.01mm", 0, 1);

    LODOP.ADD_PRINT_TEXT("4.23mm","23.02mm","73.55mm","15.61mm","Provider: CLEVY");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
		LODOP.SET_PRINT_STYLEA(0,"Bold",1);
		LODOP.ADD_PRINT_TEXT("10.8mm","10.61mm","316.2mm","8.68mm","Package Type: ECONOMY POSTAL");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
		LODOP.SET_PRINT_STYLEA(0,"Bold",1);
		LODOP.ADD_PRINT_TEXT("17.38mm","16.3mm","282.47mm","9.23mm","Destination: NIGERIA");
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
		LODOP.SET_PRINT_STYLEA(0,"Bold",1);


    LODOP.ADD_PRINT_TEXT("26.46mm","5.56mm","26.46mm","5.29mm", "Parcel Number");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_TEXT("63.5mm","6.61mm","26.46mm","5.29mm", "Order Number");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_BARCODE("31.3mm","6.3mm","88mm","25mm", "128Auto", Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT("57.15mm","32.76mm","77.79mm","15.88mm", '*' + Data.TrackingNumber + '*');
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");

    LODOP.ADD_PRINT_BARCODE("67.73mm","6.3mm","65.93mm","18.81mm", "128Auto", Data.ThirdPartyCode);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT("87.08mm", "29.32mm", "77.79mm", "15.88mm", '*' + Data.ThirdPartyCode + '*');
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
//		LODOP.PRINT_DESIGN();
    LODOP.PRINT();
	},

  //Jumia线上发货渠道**杨定杰**
  "NG-JG-Seko-Guangzhou-Seko-Station": function(Data:Interface.PrintData) {
    this.printJumiaOnline(Data)
  },
  "EG-JG-EDFA3LY-China": function(Data:Interface.PrintData){
    this.printJumiaOnline(Data)
  },
  printJumiaOnline(Data:Interface.PrintData) {

    LODOP.PRINT_INITA("0mm", "0mm", "100.01mm", "100.01mm", "Jumia线上发货渠道");
    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "Jumia线上发货渠道");
    LODOP.ADD_PRINT_RECT("2.99mm", "2.99mm", "94.01mm", "94.01mm", 0, 1);

    LODOP.ADD_PRINT_TEXT("6.35mm", "29.63mm", "73.55mm", "15.61mm", Data.To.Country.CountryName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 16);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_TEXT("26.46mm", "5.56mm", "26.46mm", "5.29mm", "Parcel Number");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_TEXT("62.18mm", "6.35mm", "26.46mm", "5.29mm", "Order Number");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_BARCODE("32.62mm", "6.56mm", "88mm", "25mm", "128Auto", Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT("57.68mm", "9.21mm", "77.79mm", "15.88mm", '*' + Data.TrackingNumber + '*');
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");

    LODOP.ADD_PRINT_BARCODE("67.73mm", "6.3mm", "80.75mm", "18.81mm", "128Auto", Data.ThirdPartyCode);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT("87.84mm", "8.68mm", "77.79mm", "15.88mm", '*' + Data.ThirdPartyCode + '*');
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");

    LODOP.PRINT();
  },

  //KE-JG-SekoGuangzhouSekoStation渠道
  "KE-JG-Seko-Guangzhou-Seko-Station": function(Data:Interface.PrintData){
    function formatTime(value:number){
      return value < 10 ? "0"+value : value
    }
    const date = new Date();
    const dateStr = `${date.getFullYear()}-${formatTime(date.getMonth()+1)}-${formatTime(date.getDate())} ${formatTime(date.getHours())}:${formatTime(date.getMinutes())}:${formatTime(date.getSeconds())}`
    LODOP.PRINT_INITA("0mm","0mm","100.01mm","100.01mm","KE-JG-Seko-Guangzhou-Seko-Station");
    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "KE-JG-Seko-Guangzhou-Seko-Station");
    LODOP.ADD_PRINT_BARCODE("3.18mm","23.55mm","52.92mm","12.96mm","128Auto",Data.ThirdPartyCode);
    LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);
    LODOP.ADD_PRINT_TEXT("16.8mm","23.28mm","52.12mm","6.61mm",`*${Data.ThirdPartyCode}*`);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    LODOP.SET_PRINT_STYLEA(0,"Bold",1);
    LODOP.ADD_PRINT_TEXT("25.14mm","25.66mm","21.7mm","7.94mm","Kenya");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    LODOP.SET_PRINT_STYLEA(0,"Bold",1);
    LODOP.ADD_PRINT_TEXT("25.14mm","45.83mm","36.25mm","7.94mm",dateStr);
    LODOP.ADD_PRINT_TEXT("41.54mm","0.26mm","64.29mm","11.91mm","KE-JG-Seko-Guangzhou-Seko-Station");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    LODOP.ADD_PRINT_TEXT("41.54mm","68.26mm","30.43mm","11.91mm","KE-Adams-Fleet");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    LODOP.ADD_PRINT_TEXT("56.89mm","5mm","90.01mm","13.23mm",`${Data.To.BuyerFullName}，${Data.To.BuyerStreet1}，${Data.To.BuyerCity}`);
    LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    LODOP.ADD_PRINT_BARCODE("76.99mm","3.97mm","93.66mm","14.29mm","128Auto",Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);
    LODOP.ADD_PRINT_TEXT("92.34mm","3.44mm","90.22mm","6.61mm",`*${Data.TrackingNumber}*`);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    LODOP.SET_PRINT_STYLEA(0,"Bold",1);
    LODOP.ADD_PRINT_LINE("35.8mm","0mm","35.51mm","100.01mm",0,1);
    LODOP.ADD_PRINT_LINE("20.9mm","0.26mm","21.19mm","99.46mm",0,1);
    LODOP.ADD_PRINT_LINE("54.8mm","0mm","54.5mm","100.01mm",0,1);
    LODOP.ADD_PRINT_LINE("71.49mm","0mm","71.2mm","100.01mm",0,1);
    LODOP.ADD_PRINT_LINE("54.61mm","66.41mm","35.51mm","66.7mm",0,1);

    LODOP.PRINT();
    // LODOP.PRINT_DESIGN();
  },

  //Jumia线上GH-JG-SekoGuangzhouSekoStation **冯上胜**
  "GH-JG-SEKO-Guangzhou-SEKO-Station": function (Data:Interface.PrintData){
    LODOP.PRINT_INITA("0mm","0mm","100.01mm","100.01mm","Jumia线上GH-JG-SekoGuangzhouSekoStation");
    LODOP.SET_PRINT_PAGESIZE(1,1000,1000,"Jumia线上GH-JG-SekoGuangzhouSekoStation");
    LODOP.ADD_PRINT_RECT("6.85mm","1.01mm","98mm","43.44mm",0,1);
    LODOP.ADD_PRINT_TEXT("0.95mm","0.74mm","49mm","6.61mm","Jumia Global");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
    LODOP.ADD_PRINT_TEXT("0.95mm","49.48mm","49mm","6.61mm","GHANA-SEKO");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
    LODOP.SET_PRINT_STYLEA(0,"Bold",1);
    LODOP.ADD_PRINT_TEXT("3.49mm","1.27mm","98mm","3.89mm","Order Details");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    LODOP.ADD_PRINT_LINE("11.51mm","1.01mm","11.4mm","98.9mm",0,1);
    LODOP.ADD_PRINT_TEXT("7.67mm","0.79mm","32.81mm","3.7mm","Shipped date");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    LODOP.ADD_PRINT_LINE("7.41mm","33.6mm","11.09mm","33.71mm",0,1);
    LODOP.ADD_PRINT_TEXT("7.67mm","35.45mm","62.44mm","3.97mm", this.getPrintDate());
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    LODOP.ADD_PRINT_TEXT("12.17mm","2.12mm","96.84mm","4.23mm","Parcel Number");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
    LODOP.ADD_PRINT_BARCODE("15.88mm","2.65mm","92.6mm","7.41mm","128Auto",Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);
    LODOP.ADD_PRINT_TEXT("24.34mm","2.12mm","95.25mm","3.97mm",`*${Data.TrackingNumber}*`);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    LODOP.ADD_PRINT_BARCODE("37.57mm","2.12mm","94.19mm","7.67mm","128Auto",Data.ThirdPartyCode);
    LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);
    LODOP.ADD_PRINT_LINE("27.78mm","1.01mm","27.89mm","98.9mm",0,1);
    LODOP.ADD_PRINT_LINE("32.6mm","1.01mm","32.6mm","98.9mm",0,1);
    LODOP.ADD_PRINT_TEXT("28.58mm","1.85mm","25.14mm","3.97mm","First-mile hub");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    LODOP.ADD_PRINT_TEXT("29.1mm","26.72mm","71.7mm","3.97mm","GH-JG-SEKO-Guangzhou-SEKO-Station");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    LODOP.ADD_PRINT_LINE("32.6mm","26.19mm","27.49mm","26.3mm",0,1);
    LODOP.ADD_PRINT_TEXT("33.6mm","2.12mm","26.46mm","3.97mm","Order Number");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
    LODOP.ADD_PRINT_TEXT("46.04mm","2.12mm","95.78mm","3.97mm",`*${Data.ThirdPartyCode}*`);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    LODOP.ADD_PRINT_TEXT("51.06mm","1.06mm","98.43mm","5.29mm","Customer Details");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    LODOP.ADD_PRINT_TEXT("65.88mm","1.59mm","17.73mm","5.29mm","Address");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    LODOP.ADD_PRINT_RECT("54.5mm","1.06mm","98.16mm","25.93mm",0,1);
    LODOP.ADD_PRINT_LINE("79.14mm","19.05mm","55.32mm","19.16mm",0,1);
    LODOP.ADD_PRINT_TEXT("56.62mm","20.9mm","77.52mm","3.68mm",Data.To.BuyerFullName);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
    LODOP.ADD_PRINT_TEXT("60.59mm","20.9mm","76.99mm","3.68mm",Data.To.BuyerStreet1 +','+Data.To.BuyerStreet2);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
    LODOP.SET_PRINT_STYLEA(0,"LineSpacing","-1.06mm");
    LODOP.ADD_PRINT_TEXT("68.53mm","20.9mm","76.99mm","3.41mm",Data.To.BuyerCity);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
    LODOP.ADD_PRINT_TEXT("72.23mm","20.9mm","72.23mm","3.68mm",Data.To.BuyerState);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
    LODOP.ADD_PRINT_TEXT("76.2mm","20.9mm","71.17mm","3.68mm",Data.To.Country.CountryName);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
    LODOP.ADD_PRINT_TEXT("81.76mm","1.06mm","97.9mm","10.58mm","NB : For items shipped from overseas countries, returns are only accepted if the Itm is either wrong or defective");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
    LODOP.SET_PRINT_STYLEA(0,"LineSpacing","-1.06mm");
    LODOP.ADD_PRINT_TEXT("88.69mm","1.06mm","97.37mm","9.26mm","                                 : For items shipped from overseas countries, returns are only accepted if the Itm is either wrong or defective");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
    LODOP.SET_PRINT_STYLEA(0,"LineSpacing","-1.06mm");
    LODOP.ADD_PRINT_TEXT("88.64mm","0.79mm","29.1mm","3.7mm","Customer Service");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
    LODOP.SET_PRINT_STYLEA(0,"Bold",1);

    LODOP.PRINT();
  },

  //Vova线上-E邮宝渠道**杨定杰**
  "381": function(Data:Interface.PrintData) {
    if (Data.To.BuyerCountry == 'CA') { //加拿大流向
      this.ePacketOffCA(Data);
      this.ePacketOffCA_back(Data, '381');
    } else if (Data.To.BuyerCountry == 'FR') { //法国流向
      this.ePacketOffFR(Data);
      this.ePacketOffFR_back(Data, '381');
    } else if (Data.To.BuyerCountry == 'US') { //美国流向
      this.ePacketOffUS(Data);
      this.ePacketOffUS_back(Data, '381');
    } else { //其他国流向
      this.ePacketOffALL(Data);
      this.ePacketOffALL_back(Data, '381');
    }
  },

  //Vova线上-中国邮政平邮小包**杨定杰**
  "380": function(Data:Interface.PrintData) {
    this.printFSPostalMails(Data, '380')
  },

  //Vova线上-中国邮政挂号小包**杨定杰**
  "379": function(Data:Interface.PrintData) {
    // let flowOne = ['EE', 'BY', 'GE', 'MY', 'TH', 'SG'];
    // let flowTwo = ['DE', 'FR', 'NZ', 'CZ', 'PL', 'HR', 'SI', 'SK', 'NO', 'MA', 'AM'];
    

    // if (Data.To.BuyerCountry == 'AU') {
    //   this.EnhancePrint(Data); // 澳大利亚跟踪小包渠道面单1
    //   this.EnhancePrint_back(Data, '379'); // 澳大利亚跟踪小包渠道面单2
    //   return
    // }

    // if (flowOne.includes(Data.To.BuyerCountry)) {
    //   this.prime(Data, '379'); //爱沙尼亚、白俄罗斯、格鲁吉亚、马来西亚、泰国、新加坡向
    //   return
    // }

    // if (flowTwo.includes(Data.To.BuyerCountry)) {
    //   if (Data.To.BuyerCountry == 'NO') {
    //     this['002'](Data, '379'); // 挪威向 与佛山邮政挂号的面单 一致
    //   } else if (Data.To.BuyerCountry == 'MA' || Data.To.BuyerCountry == 'AM') {
    //     this.printAMOrMA(Data, '379')
    //   } else {
    //     // 捷克，斯洛文尼亚，斯洛伐克，波兰，克罗地亚向 || 法国向 || 德国向 || 新西兰向
    //     this.EnhancePrint(Data);
    //     this.EnhancePrint_back(Data, '379');
    //   }
    //   return
    // }
    // this.printFSPostRegistered(Data, '379'); //其他流向
    this["003"](Data, '379')
  },

  //Vova线上-4PX-泛欧平邮渠道**杨定杰**
  "209": function(Data:Interface.PrintData) {
    this.printVovaFPX(Data, "EU");
    this.printVovaFPX_back(Data);
  },
  printVovaFPX_back(Data:Interface.PrintData) {


    LODOP.PRINT_INITA("0mm", "0mm", "100.01mm", "100.01mm", "Vova线上-4PX-泛欧平邮渠道跟踪单");
    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "Vova线上-4PX-泛欧平邮渠道跟踪单");
    LODOP.ADD_PRINT_RECT("2.99mm", "2.99mm", "94.01mm", "94.01mm", 0, 1);
    LODOP.ADD_PRINT_LINE("14.05mm", "3.18mm", "14.05mm", "97.08mm", 0, 1);
    LODOP.ADD_PRINT_LINE("24.1mm", "2.91mm", "24.1mm", "96.81mm", 0, 1);
    LODOP.ADD_PRINT_LINE("37.6mm", "2.91mm", "37.6mm", "96.81mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("4.76mm", "5.29mm", "28.84mm", "10.58mm", "CUSTOMS DECLARATION");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);

    LODOP.ADD_PRINT_TEXT("4.5mm", "41.01mm", "41.8mm", "5.29mm", "May be opened officially");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("15.08mm", "5.29mm", "36.78mm", "5.29mm", "Postal administration");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("14.82mm", "50.27mm", "26.46mm", "5.29mm", "Important!");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT("19.58mm", "50.27mm", "54.77mm", "5.29mm", "See instructions on the back");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_RECT("25.93mm", "9.26mm", "2.99mm", "2.99mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("26.19mm", "14.02mm", "26.46mm", "5.29mm", "Gift");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_RECT("31.75mm", "9.26mm", "2.99mm", "2.99mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("32.01mm", "14.02mm", "26.46mm", "5.29mm", "Documents");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("25.93mm", "42.6mm", "47.89mm", "5.29mm", "Commercial sample");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_RECT("25.66mm", "37.84mm", "2.99mm", "2.99mm", 0, 1);
    LODOP.ADD_PRINT_RECT("31.49mm", "37.84mm", "2.99mm", "2.99mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("31.75mm", "42.6mm", "51.86mm", "5.29mm", "Other Tick one of more boxes");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("32.28mm", "38.36mm", "26.46mm", "5.29mm", "√");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("39.16mm", "4.76mm", "52.65mm", "10.58mm", "Quantity and detailed description of contents ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_LINE("47.92mm", "2.99mm", "47.92mm", "96.81mm", 0, 1);
    LODOP.ADD_PRINT_LINE("54.53mm", "2.99mm", "54.53mm", "96.81mm", 0, 1);
    LODOP.ADD_PRINT_LINE("69.79mm", "2.99mm", "69.79mm", "96.81mm", 0, 1);
    LODOP.ADD_PRINT_LINE("75.96mm", "2.91mm", "75.96mm", "96.81mm", 0, 1);
    LODOP.ADD_PRINT_LINE("75.41mm", "58.47mm", "37.04mm", "58.47mm", 0, 1);
    LODOP.ADD_PRINT_LINE("75.94mm", "77.79mm", "37.04mm", "77.79mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("39.42mm", "61.65mm", "14.55mm", "9.26mm", "Weight\r\n(In kg)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("39.42mm", "82.55mm", "14.55mm", "9.26mm", "Value\r\n(USD)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("49.48mm", "4.76mm", "26.46mm", "5.29mm", Data.Item[0].TitleEn + '*' + Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("50.54mm", "58.90mm", "17.99mm", "5.29mm", (Data.Item[0].Weight * Data.Item[0].Quantity / 1000).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("50.54mm", "78.05mm", "17.99mm", "5.29mm", Data.Item[0].Amount.toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("56.56mm", "4.76mm", "51.06mm", "14.55mm", "For commercial items only If known,HS tariffnumber and country of origin of goods ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("56.36mm", "62.18mm", "14.55mm", "9.26mm", " Total\r\nWeight\r\n(In kg)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("56.36mm", "82.55mm", "14.55mm", "9.26mm", " Total\r\nValue\r\n(USD)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("70.91mm", "4.76mm", "26.46mm", "5.29mm", "HK");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("71.7mm", "78.32mm", "17.99mm", "5.29mm", Data.Item[0].Amount.toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("71.7mm", "58.90mm", "17.99mm", "5.29mm", (Data.Item[0].Weight * Data.Item[0].Quantity / 1000).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("76.73mm", "4.23mm", "92.6mm", "17.99mm", "I,the undersigned,whose name and address are given on the itme, certify that particulars given in this declaration are correct and that this Itm dose not contain any dangerous article or artices prohibited by legislation or by postal or customs regulations Date and sender`s signature");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("93.13mm", "69.32mm", "26.46mm", "5.29mm", "Frankie");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);



    LODOP.PRINT();
  },

  //Vova线上-云途-加拿大专线**杨定杰**
  "335": function(Data:Interface.PrintData) {
    this.printCAU(Data, 'CA');
  },

  //Vova线上-4PX-联邮通瑞典专线**杨定杰**
  "214": function(Data:Interface.PrintData) {
    this.printVovaFPX(Data)
  },
  printVovaFPX(Data:Interface.PrintData, val?:string) {
    var isEU = val == "EU" ? true : false;
    var localData = {
      ToAddress: Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == '' ? '' : ',' + Data.To.BuyerStreet2) + "\n" + Data.To.BuyerCity + '  ' + (Data.To.BuyerState == '' ? '' : Data.To.BuyerState) + ',' + Data.To.BuyerZipCode,
      PrintDate: this.getSfNowDate()
    }

    LODOP.PRINT_INITA("0mm", "0mm", "100.01mm", "100.01mm", "Vova线上-4PX-联邮通瑞典专线");
    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "Vova线上-4PX-联邮通瑞典专线");
    LODOP.ADD_PRINT_RECT("2.99mm", "2.99mm", "94.01mm", "94.01mm", 0, 1);

    if (!isEU) {
      LODOP.ADD_PRINT_TEXT("7.14mm", "6.61mm", "38.36mm", "6.09mm", "POST Luxembourg");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT("11.11mm", "6.61mm", "38.36mm", "6.09mm", "Zl KRACKELSHAFF");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT("15.08mm", "6.61mm", "38.36mm", "6.09mm", "L-3290 BETTEMBOURG");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT("18.52mm", "6.61mm", "38.36mm", "6.09mm", "Luxembourg");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT("22.23mm", "6.61mm", "38.36mm", "6.09mm", "TN 0035280028004");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    } else {
      LODOP.ADD_PRINT_TEXT("7.14mm", "6.61mm", "38.36mm", "6.09mm", "PO Box 737,Southall,");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT("11.11mm", "6.61mm", "38.36mm", "6.09mm", "UB3 9RE,UK");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    }

    LODOP.ADD_PRINT_TEXT("21.17mm", "44.19mm", "63.5mm", "7.94mm", isEU ? "                 泛欧平邮" : "联邮通瑞典专线挂号");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_TEXT("12.44mm", "82.55mm", "26.46mm", "7.94mm", Data.To.Country.CountryCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 20);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_TEXT("30.16mm", "6.88mm", "82.29mm", "5.29mm", "TO: " + Data.To.BuyerFullName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("33.87mm", "6.88mm", "12.44mm", "5.29mm", "Tel: ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("33.87mm", "13.49mm", "26.46mm", "5.29mm", Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("37.04mm", "6.88mm", "82.29mm", "12.44mm", localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("48.95mm", "6.88mm", "80mm", "5.29mm", Data.To.Country.CountryName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_BARCODE("63.76mm", "10.05mm", "77.79mm", "13mm", "128Auto", Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT("60.33mm", "32.81mm", "77.79mm", "15.88mm", Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);

    LODOP.ADD_PRINT_RECT("77.26mm", "7.14mm", "83.34mm", "5.56mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("79.11mm", "7.67mm", "26.46mm", "5.29mm", "【202129214】");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("79.38mm", "30.69mm", "60.85mm", "5.29mm", "Ref No: " + Data.ThirdPartyCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    LODOP.ADD_PRINT_RECT("83.87mm", "7.14mm", "83.34mm", "5.56mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("85.73mm", "7.67mm", "83.61mm", "5.29mm", "CS: S8631 SD: S4257 (X110)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");

    LODOP.ADD_PRINT_TEXT("91.81mm", "7.14mm", "85.46mm", "5.29mm", Data.Item[0].TitleEn + '*' + Data.Item[0].Quantity + (Data.Item[1] == undefined ? '' : '/' + (Data.Item[1].TitleEn + '*' + Data.Item[1].Quantity)) + (Data.Item[2] == undefined ? '' : '/' + (Data.Item[2].TitleEn + '*' + Data.Item[2].Quantity)));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.PRINT();
  },

  //Vova线上-云途-中澳专线渠道**杨定杰**
  "303": function(Data:Interface.PrintData) {
    this.printCAU(Data);
  },
  printCAU(Data:Interface.PrintData, val?:string) {
    var isCA = (val == 'CA' ? true : false)
    var localData = {
      ToAddress: Data.To.BuyerFullName + "\n" + Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == '' ? '' : ',' + Data.To.BuyerStreet2) + "\n" + Data.To.BuyerCity + '  ' + (Data.To.BuyerState == '' ? '' : Data.To.BuyerState) + ',' + Data.To.BuyerZipCode + ' \n' + Data.To.Country.CountryName,
      PrintDate: this.getSfNowDate()
    }
    LODOP.PRINT_INITA("0mm", "0mm", "100.01mm", "100.01mm", "Vova线上-云途-中澳专线渠道");
    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "Vova线上-云途-中澳专线渠道");
    LODOP.ADD_PRINT_RECT("2.99mm", "2.99mm", "94.01mm", "94.01mm", 0, 1);

    LODOP.ADD_PRINT_LINE("15.08mm", "2.99mm", "15.08mm", "96.92mm", 0, 1);
    LODOP.ADD_PRINT_LINE("24.34mm", "2.99mm", "24.34mm", "97mm", 0, 1);
    LODOP.ADD_PRINT_LINE("39.95mm", "2.99mm", "39.95mm", "97.18mm", 0, 1);
    LODOP.ADD_PRINT_LINE("15.08mm", "26mm", "24.5mm", "26mm", 0, 1);
    LODOP.ADD_PRINT_LINE("68.53mm", "2.99mm", "68.53mm", "97.18mm", 0, 1);
    LODOP.ADD_PRINT_LINE("83.34mm", "2.99mm", "83.34mm", "96.92mm", 0, 1);
    LODOP.ADD_PRINT_LINE("89.96mm", "2.99mm", "89.96mm", "97.18mm", 0, 1);

    LODOP.ADD_PRINT_TEXT("5.29mm", "28mm", "66mm", "11.11mm", "渠道：" + (isCA ? '加拿大专线' : '中澳专线'));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 18);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("16.14mm", "10.5mm", "34.4mm", "10mm", '1/1');
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 18);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("16.14mm", "27mm", "75.41mm", "10mm", '国家：' + (isCA ? '加拿大(CA)' : '澳大利亚(AU)'));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 18);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_BARCODE("25.4mm", "30mm", "48.95mm", "10.32mm", "128Auto", Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT("36.51mm", "28mm", "68.26mm", "3.97mm", Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");

    LODOP.ADD_PRINT_TEXT("41.8mm", "7.41mm", "15.88mm", "5.82mm", "SHIP TO:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("42.07mm", "24.87mm", "61.12mm", "21.43mm", localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("64.03mm", "24.87mm", "62.44mm", "5.29mm", "Tel: " + Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");

    LODOP.ADD_PRINT_BARCODE("69.85mm", "13.49mm", "62.44mm", "10.32mm", "128Auto", Data.ThirdPartyCode);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT("80.43mm", "28.58mm", "68.26mm", "3.97mm", Data.ThirdPartyCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");

    LODOP.ADD_PRINT_TEXT("85.73mm", "37.31mm", "15.61mm", "5.29mm", "C03788");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    if (isCA) {
      LODOP.ADD_PRINT_TEXT("85.73mm", "52mm", "50mm", "5.29mm", localData.PrintDate);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    }
    LODOP.ADD_PRINT_TEXT("93mm", "4.5mm", "38.36mm", "5.29mm", "*1/");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");


    LODOP.PRINT();
  },

  //Vova线上-云途-中美专线（特惠）**杨定杰**
  "302": function(Data:Interface.PrintData) {
    this.printCA(Data);
  },
  printCA(Data:Interface.PrintData) {
    var localData = {
      ToAddress: Data.To.BuyerFullName + "\n" + Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == '' ? '' : ',' + Data.To.BuyerStreet2) + "," + Data.To.BuyerZipCode + ',' + Data.To.BuyerCity + (Data.To.BuyerState == '' ? '' : (',' + Data.To.BuyerState)) + ',' + Data.To.BuyerCountry + '\n' + Data.To.BuyerZipCode + ',' + (Data.To.BuyerState == '' ? '' : Data.To.BuyerState) + '\n' + Data.To.BuyerCity + '\n' + Data.To.BuyerPhone,
      PrintDate: this.getSfNowDate()
    }
    var define = ((Number(Data.To.BuyerZipCode.slice(0, 1)) >= 0) || (Number(Data.To.BuyerZipCode.slice(0, 1)) <= 3)) ? 'JFK' : 'LAX';
    LODOP.PRINT_INITA("0mm", "0mm", "100.01mm", "100.01mm", "Vova线上-云途-中美专线（特惠）");
    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "Vova线上-云途-中美专线（特惠）");
    LODOP.ADD_PRINT_RECT("2.99mm", "2.99mm", "94.01mm", "94.01mm", 0, 1);

    LODOP.PRINT_INITA("0mm", "0mm", "100.01mm", "100.01mm", "Vova线上-云途-中美专线（特惠）");
    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "Vova线上-云途-中美专线（特惠）");
    LODOP.ADD_PRINT_RECT("2.99mm", "2.99mm", "94.01mm", "94.01mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("6.61mm", "72.76mm", "26.46mm", "5.29mm", define);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_TEXT("14.55mm", "44.98mm", "26.46mm", "5.29mm", "USZXR");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_TEXT("41.8mm", "4.5mm", "90mm", "27.78mm", localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");

    LODOP.ADD_PRINT_BARCODE("25.4mm", "25mm", "64mm", "10.32mm", "128Auto", Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT("36.51mm", "33mm", "68.26mm", "3.97mm", Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");

    LODOP.ADD_PRINT_BARCODE("69.85mm", "13.49mm", "62.44mm", "10.32mm", "128Auto", Data.ThirdPartyCode);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT("80.43mm", "28.58mm", "68.26mm", "3.97mm", Data.ThirdPartyCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");

    LODOP.ADD_PRINT_TEXT("85.46mm", "3.7mm", "26.46mm", "5.29mm", "*1/*1/");


    LODOP.PRINT();
  },

  //Vova线上-云途-中欧专线挂号渠道**杨定杰**
  "301": function(Data:Interface.PrintData) {
    this.printCE(Data);
  },
  printCE: function(Data:Interface.PrintData) {
    var localData = {
      ToAddress: Data.To.BuyerFullName + "\n" + Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == '' ? '' : ',' + Data.To.BuyerStreet2) + "\n" + Data.To.BuyerCity + '  ' + (Data.To.BuyerState == '' ? '' : Data.To.BuyerState) + ',' + Data.To.BuyerZipCode + ' \n' + Data.To.Country.CountryName,
      PrintDate: this.getSfNowDate()
    }

    LODOP.PRINT_INITA("0mm", "0mm", "100.01mm", "100.01mm", "Vova线上-云途-中欧专线挂号渠道");
    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "Vova线上-云途-中欧专线挂号渠道");
    LODOP.ADD_PRINT_RECT("2.99mm", "2.99mm", "94.01mm", "94.01mm", 0, 1);

    LODOP.ADD_PRINT_LINE("15.08mm", "2.99mm", "15.08mm", "96.92mm", 0, 1);
    LODOP.ADD_PRINT_LINE("24.34mm", "2.99mm", "24.61mm", "69.66mm", 0, 1);
    LODOP.ADD_PRINT_LINE("39.95mm", "2.99mm", "39.95mm", "97.18mm", 0, 1);
    LODOP.ADD_PRINT_LINE("15.08mm", "70.72mm", "39.95mm", "70.72mm", 0, 1);
    LODOP.ADD_PRINT_LINE("68.53mm", "2.99mm", "68.53mm", "97.18mm", 0, 1);
    LODOP.ADD_PRINT_LINE("83.34mm", "2.99mm", "83.34mm", "96.92mm", 0, 1);
    LODOP.ADD_PRINT_LINE("89.96mm", "2.99mm", "89.96mm", "97.18mm", 0, 1);

    LODOP.ADD_PRINT_TEXT("5.29mm", "38.1mm", "34.4mm", "11.11mm", "EUDDP");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 20);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("16.14mm", "34.4mm", "34.4mm", "10mm", Data.To.Country.CountryCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 20);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("13.49mm", "76.2mm", "17.73mm", "19.58mm", "R");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 59);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_BARCODE("25.4mm", "12.7mm", "48.95mm", "10.32mm", "128Auto", Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT("36.51mm", "20.37mm", "68.26mm", "3.97mm", Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");

    LODOP.ADD_PRINT_TEXT("41.8mm", "7.41mm", "15.88mm", "5.82mm", "SHIP TO:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("42.07mm", "24.87mm", "61.12mm", "21.43mm", localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("64.03mm", "15.61mm", "62.44mm", "5.29mm", "Tel: " + Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");

    LODOP.ADD_PRINT_BARCODE("69.85mm", "13.49mm", "62.44mm", "10.32mm", "128Auto", Data.ThirdPartyCode);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT("80.43mm", "28.58mm", "68.26mm", "3.97mm", Data.ThirdPartyCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");

    LODOP.ADD_PRINT_TEXT("85.73mm", "37.31mm", "15.61mm", "5.29mm", "C03788");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("85.73mm", "56.09mm", "38.36mm", "5.29mm", localData.PrintDate);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("90.49mm", "4.5mm", "38.36mm", "5.29mm", "*1/");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");


    LODOP.PRINT();
  },
  //Vova线上-4PX-联邮通挂号TR48标准服务**杨定杰**
  "205": function(Data:Interface.PrintData) {
    this.FU(Data, 'vova');
  },
  //Wish邮-云途加拿大专线渠道**杨定杰**
  '1514-1': function(Data:Interface.PrintData) {
    this.printCannada(Data, 1);
  },
  //Wish邮-云途加拿大专线线下渠道**杨定杰**
  'CAZXR': function(Data:Interface.PrintData) {
    this.printCannada(Data, 2);
  },
  printCannada: function(Data:Interface.PrintData, val: number) {
    var localData = {
      ToAddress: Data.To.BuyerFullName + "\n" + Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == '' ? '' : ',' + Data.To.BuyerStreet2) + "\n" + Data.To.BuyerCity + '  ' + (Data.To.BuyerState == '' ? '' : Data.To.BuyerState) + ',' + Data.To.BuyerZipCode + ' \n' + Data.To.Country.CountryName,
      PrintDate: this.getSfNowDate()
    }
    LODOP.PRINT_INITA("0mm", "0mm", "100.01mm", "100.01mm", "Wish邮-云途加拿大专线渠道");
    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "Wish邮-云途加拿大专线渠道");
    LODOP.ADD_PRINT_RECT("2.99mm", "2.99mm", "94.01mm", "94.01mm", 0, 1);

    LODOP.ADD_PRINT_LINE("12.44mm", "2.99mm", "12.44mm", "96.92mm", 0, 1);

    LODOP.ADD_PRINT_TEXT("5.56mm", "29mm", "46.83mm", "6.61mm", "渠道 ：加拿大专线");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_TEXT("90.75mm", "5.03mm", "26.46mm", "5.29mm", "*1 /");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");

    LODOP.ADD_PRINT_LINE("22.2mm", "2.73mm", "22.2mm", "96.63mm", 0, 1);
    LODOP.ADD_PRINT_LINE("22.2mm", "31.75mm", "11.91mm", "31.75mm", 0, 1);

    LODOP.ADD_PRINT_TEXT("15.08mm", "12.44mm", "16.67mm", "5.29mm", "1/1");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 16);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_TEXT("14.55mm", "39.95mm", "56.62mm", "5.29mm", "国家 ：加拿大(CA)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 16);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_LINE("38mm", "2.46mm", "38mm", "96.99mm", 0, 1);
    LODOP.ADD_PRINT_BARCODE("23.02mm", "27.25mm", "47.36mm", "10.58mm", "128Auto", val == 1 ? Data.TrackingNumber : Data.ThirdPartyCode);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT("34.48mm", "35.69mm", "60.59mm", "6.35mm", val == 1 ? Data.TrackingNumber : Data.ThirdPartyCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");

    LODOP.ADD_PRINT_TEXT("39.16mm", "8.2mm", "18.79mm", "5.82mm", "SHIP TO:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_TEXT("39.16mm", "25.14mm", "59.27mm", "18.79mm", localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    LODOP.ADD_PRINT_LINE("66.65mm", "2.46mm", "66.65mm", "96.99mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("63.24mm", "17.2mm", "73.55mm", "5.29mm", "Tel:  " + Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_LINE("81.2mm", "2.99mm", "81.2mm", "96.99mm", 0, 1);
    LODOP.ADD_PRINT_BARCODE("67.47mm", "12.7mm", "58.47mm", "10.58mm", "128Auto", val == 2 ? Data.OrderCode.toUpperCase() : Data.ThirdPartyCode);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT("78.6mm", "21.43mm", "60mm", "6.35mm", val == 2 ? Data.OrderCode.toUpperCase() : Data.ThirdPartyCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");

    LODOP.ADD_PRINT_LINE("89.67mm", "2.99mm", "89.67mm", "96.99mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("84.4mm", "31.75mm", "16.93mm", "5.29mm", val == 1 ? "C26666" : "C03788");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_TEXT("84.14mm", "53.71mm", "46.3mm", "5.29mm", localData.PrintDate);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.PRINT();


  },
  //Wish邮-云途中欧专线挂号  **杨定杰**
  '1538-1': function(Data:Interface.PrintData) {
    this.printWishCloud(Data, 1);
  },
  //Wish邮-云途中欧专线平邮  **杨定杰**
  '1546-0': function(Data:Interface.PrintData) {
    this.printWishCloud(Data, 2);
  },
  printWishCloud: function(Data:Interface.PrintData, type:number) {
    var localData = {
      ToAddress: Data.To.BuyerFullName + "\n" + Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == '' ? '' : ',' + Data.To.BuyerStreet2) + "\n" + Data.To.BuyerCity + '  ' + (Data.To.BuyerState == '' ? '' : Data.To.BuyerState) + ',' + Data.To.BuyerZipCode + ' \n' + Data.To.Country.CountryName.toUpperCase(),
      PrintDate: this.getSfNowDate(),
    }
    LODOP.PRINT_INITA("0mm", "0mm", "100.01mm", "100.01mm", "Wish邮-云途中欧专线挂号渠道");
    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "Wish邮-云途中欧专线挂号渠道");
    LODOP.ADD_PRINT_RECT("2.99mm", "2.99mm", "94.01mm", "94.01mm", 0, 1);

    LODOP.ADD_PRINT_LINE("12.44mm", "2.91mm", "12.44mm", "96.92mm", 0, 1);
    LODOP.ADD_PRINT_LINE("41.01mm", "2.91mm", "41.01mm", "96.92mm", 0, 1);
    LODOP.ADD_PRINT_LINE("41.01mm", "74.61mm", "12.17mm", "74.61mm", 0, 1);
    LODOP.ADD_PRINT_LINE("23.81mm", "3.44mm", "23.81mm", "74.43mm", 0, 1);
    LODOP.ADD_PRINT_LINE("82.81mm", "2.91mm", "82.81mm", "96.92mm", 0, 1);
    LODOP.ADD_PRINT_LINE("89.69mm", "2.91mm", "89.69mm", "96.92mm", 0, 1);
    LODOP.ADD_PRINT_LINE("67.44mm", "3.18mm", "67.44mm", "97.08mm", 0, 1);

    LODOP.ADD_PRINT_TEXT("3.44mm", "38.1mm", "40.48mm", "9.26mm", type == 1 ? "EUDDP" : "EUDDPG");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 22);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("15.35mm", "79.11mm", "16.14mm", "25.4mm", type == 1 ? "R" : "P");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 55);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("12.44mm", "33.87mm", "28.05mm", "9.26mm", Data.To.Country.CountryCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 30);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_BARCODE("25.14mm", "10.32mm", "53.98mm", "10.55mm", "128Auto", Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT("36.59mm", "22.46mm", "47.63mm", "6.35mm", Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");

    LODOP.ADD_PRINT_TEXT("41.8mm", "5.82mm", "17.46mm", "5.29mm", "SHIP TO:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("41.8mm", "22.75mm", "71.7mm", "18.52mm", localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("63.5mm", "14.82mm", "71.7mm", "5.29mm", "Tel: " + Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_BARCODE("68.79mm", "7.14mm", "53.98mm", "10.35mm", "128Auto", Data.ThirdPartyCode);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT("79.72mm", "25.11mm", "70mm", "5.29mm", Data.ThirdPartyCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");

    LODOP.ADD_PRINT_TEXT("85.2mm", "28.84mm", "66.94mm", "5.29mm", "C26666           " + localData.PrintDate);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("90.75mm", "5.03mm", "26.46mm", "5.29mm", "*1 /");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");

    LODOP.PRINT();
  },
  //Wish邮-联邮通挂号TR48标准服务 **杨定杰**
  '1122-1': function(Data:Interface.PrintData) {
    this.FU(Data);
  },
  //Wish邮-E邮宝渠道 **杨定杰**
  '11-1': function(Data:Interface.PrintData) {
    if (Data.To.BuyerCountry == 'CA') { //加拿大流向
      this.ePacketOffCA(Data);
      this.ePacketOffCA_back(Data, '11-1');
    } else if (Data.To.BuyerCountry == 'FR') { //法国流向
      this.ePacketOffFR(Data);
      this.ePacketOffFR_back(Data, '11-1');
    } else if (Data.To.BuyerCountry == 'US') { //美国流向
      this.ePacketOffUS(Data);
      this.ePacketOffUS_back(Data, '11-1');
    } else { //其他国流向
      this.ePacketOffALL(Data);
      this.ePacketOffALL_back(Data, '11-1');
    }
  },
  // 佛山线下E邮宝 **冯上胜**
  'FSEPACKET': function(Data:Interface.PrintData) {
    if (Data.To.BuyerCountry == 'CA') { //加拿大流向
      this.ePacketOffCA(Data);
      this.ePacketOffCA_back(Data, 'FSEPACKET');
    } else if (Data.To.BuyerCountry == 'FR') { //法国流向
      this.ePacketOffFR(Data);
      this.ePacketOffFR_back(Data, 'FSEPACKET');
    } else if (Data.To.BuyerCountry == 'US') { //美国流向
      this.ePacketOffUS(Data);
      this.ePacketOffUS_back(Data, 'FSEPACKET');
    } else { //其他国流向
      this.ePacketOffALL(Data);
      this.ePacketOffALL_back(Data, 'FSEPACKET');
    }
  },
  // 广州线下E邮宝
  '4621': function(Data:Interface.PrintData) {
    if (Data.To.BuyerCountry == 'CA') { //加拿大流向
      this.ePacketOffCA(Data);
      this.ePacketOffCA_back(Data, '4621');
    } else if (Data.To.BuyerCountry == 'FR') { //法国流向
      this.ePacketOffFR(Data);
      this.ePacketOffFR_back(Data, '4621');
    } else if (Data.To.BuyerCountry == 'US') { //美国流向
      this.ePacketOffUS(Data);
      this.ePacketOffUS_back(Data, '4621');
    } else { //其他国流向
      this.ePacketOffALL(Data);
      this.ePacketOffALL_back(Data, '4621');
    }
  },
  //云途线下物流俄罗斯小包平邮渠道**杨定杰**
  'RUXBA': function(Data:Interface.PrintData) {
    this.printCloudExpressRussia(Data);
  },
  printCloudExpressRussia: function(Data:Interface.PrintData) {
    var localData = {
      ToAddress: (Data.To.BuyerStreet2 == '' ? '' : ',' + Data.To.BuyerStreet2) + Data.To.BuyerStreet1 + "\n" + Data.To.BuyerCity + '  ' + (Data.To.BuyerState == '' ? '' : Data.To.BuyerState) + ' ' + Data.To.Country.CountryName.toUpperCase(),
      FromAddress: (Data.From.Street2 == "" ? '' : Data.From.Street2 + ',') + Data.From.Street1 + "\n" + Data.From.City + " " + Data.From.SateOrProvince + ',' + "\n" + Data.From.Country.CountryName.toUpperCase(),
      PrintDate: this.getPrintDate(),
      totalQty: 0,
      totalWeight: 0,
      totalValue: 0
    }
    localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 1)
    localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 1)
    localData.totalValue = this.printTotalData(Data.Item, 'Amount', 1)

    LODOP.PRINT_INITA("0mm", "0mm", "100.01mm", "100.01mm", "俄罗斯小包平邮渠道");
    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "俄罗斯小包平邮渠道");
    LODOP.ADD_PRINT_RECT("2.99mm", "2.99mm", "94.01mm", "94.01mm", 0, 1);
    LODOP.ADD_PRINT_LINE("29.9mm", "2.91mm", "29.9mm", "96.92mm", 0, 1);
    LODOP.ADD_PRINT_LINE("47.36mm", "26.19mm", "2.65mm", "26.19mm", 0, 1);
    LODOP.ADD_PRINT_LINE("15.08mm", "3.18mm", "15.08mm", "26.27mm", 0, 1);
    LODOP.ADD_PRINT_LINE("47.36mm", "2.91mm", "47.36mm", "96.81mm", 0, 1);
    LODOP.ADD_PRINT_LINE("52.12mm", "3.18mm", "52.12mm", "97.08mm", 0, 1);
    LODOP.ADD_PRINT_LINE("64.03mm", "3.18mm", "64.03mm", "97.08mm", 0, 1);
    LODOP.ADD_PRINT_LINE("71.7mm", "2.91mm", "71.7mm", "96.81mm", 0, 1);
    LODOP.ADD_PRINT_LINE("71.38mm", "49.21mm", "47.04mm", "49.21mm", 0, 1);
    LODOP.ADD_PRINT_LINE("71.38mm", "73.03mm", "47.04mm", "73.03mm", 0, 1);

    LODOP.ADD_PRINT_TEXT("7.94mm", "5.29mm", "23.81mm", "5.29mm", "Small Packet");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("16.14mm", "4.23mm", "20.37mm", "11.11mm", "FROM:\r\nABKHAZIAN\r\nMail Box No." + (((Data.LogisticsExt != "") && (Data.LogisticsExt != "undefinded") && (Data.LogisticsExt != "null")) == true ? JSON.parse(Data.LogisticsExt).BoxNumber : ''));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    //收件人信息
    LODOP.ADD_PRINT_TEXT("3.7mm", "26.99mm", "52.39mm", "24.61mm", "SHIP To:" + Data.To.BuyerFullName + "\r\nAdds:" + localData.ToAddress + "\r\nTEL:" + Data.To.BuyerPhone + "\r\nZIP:" + Data.To.BuyerZipCode + "\r\n\r\nRUSSIAN FEDERATION");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("24.08mm", "55.3mm", "17.2mm", "5.29mm", Data.To.BuyerCountry);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 16);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_TEXT("37.57mm", "5.82mm", "23.81mm", "5.29mm", "UNTRACKED"); //UNTRACKED+跟踪号及条码
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_BARCODE("32.01mm", "41.54mm", "56.89mm", "10.32mm", "128Auto", Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT("43.92mm", "55.83mm", "68.26mm", "3.97mm", Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");

    LODOP.ADD_PRINT_TEXT("48.68mm", "8.73mm", "36.51mm", "5.29mm", "Description of Contents"); //申报信息：包括：重量、价值、 品名
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("48.42mm", "59mm", "7.41mm", "5.29mm", "Kg");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("48.95mm", "78.32mm", "19.58mm", "5.29mm", "Val(US$)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("53.45mm", "4.23mm", "26.46mm", "5.29mm", Data.Item[0].TitleEn + " X " + Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("65.09mm", "4.23mm", "31.75mm", "5.29mm", "Tatal Gross Weight(kg)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("53.45mm", "50.54mm", "12.44mm", "5.29mm", (Data.Item[0].Weight * Data.Item[0].Quantity / 1000).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("65.35mm", "50.54mm", "12.44mm", "5.29mm", (localData.totalWeight / 1000).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("53.45mm", "74.08mm", "12.17mm", "5.29mm", (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("65.35mm", "74.08mm", "12.17mm", "5.29mm", localData.totalValue.toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT("72.76mm", "4.23mm", "88.64mm", "12.17mm", "I certify that the particulars given in this declaration are correct and this Itm does not contain any dangerous articles prohibited by legislation or by postal or customers regulations.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("83.34mm", "4.23mm", "41.8mm", "9mm", "Return to:ABKHAZIAN\r\nSender’s signiture &Data Signed:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("85.73mm", "78.32mm", "10.85mm", "5.29mm", "CN22");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("90.75mm", "7.14mm", "26.46mm", "5.29mm", "*1 / " + Data.To.OrderCode); //配货信息，订单号
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("89.96mm", "66.41mm", "14.55mm", "5.29mm", "C03788"); //客户代码
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.PRINT();
  },

  //Wish邮-中邮挂号广州仓渠道面单**杨定杰**
  "1*2": function(Data:Interface.PrintData) {
    this["003"](Data, 3)
  },

  //Wish邮中邮挂号佛山仓 **杨定杰**
  //澳大利亚跟踪小包渠道面单 || 捷克，斯洛文尼亚，斯洛伐克，波兰，克罗地亚向|| 法国向|| 德国向 || 新西兰向
  '1*25': function(Data:Interface.PrintData, type: any) {
    this["003"](Data, 1)
  },
  //Wish邮中邮挂号上海仓 **杨定杰**
  '1*1': function(Data:Interface.PrintData) {
    this["003"](Data, 2)
  },
  
  printWishPostFS: function(Data:Interface.PrintData, type:number) {
    let isFS = '';
    let distance = '';
    if (type == 1) {
      isFS = '佛山'
      distance = '佛山市邮政局函件集邮局'
    } else if (type == 2) {
      isFS = '上海'
      distance = '上海邮政物流公司wish上海仓'
    } else {
      isFS = '广州'
      distance = '广州小包大宗收寄处理中心'
    }
    var localData = {
      ToAddress: (Data.To.BuyerStreet2 == '' ? '' : ',' + Data.To.BuyerStreet2) + Data.To.BuyerStreet1 + "\n" + Data.To.BuyerCity + '  ' + (Data.To.BuyerState == '' ? '' : Data.To.BuyerState + '\n') + '\n' + Data.To.Country.CountryName.toUpperCase(),
      FromAddress: (Data.From.Street2 == "" ? '' : Data.From.Street2 + ',') + Data.From.Street1 + "\n" + Data.From.City + " " + Data.From.SateOrProvince + ',' + "\n" + Data.From.Country.CountryName.toUpperCase(),
      PrintDate: this.getPrintDate(),
      totalQty: 0,
      totalWeight: 0,
      totalValue: 0
    }
    localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 1)
    localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 1)
    localData.totalValue = this.printTotalData(Data.Item, 'Amount', 1)

    LODOP.PRINT_INITA("0mm", "0mm", "100.01mm", "100.01mm", "Wish邮挂号" + isFS + "仓");
    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "Wish邮挂号" + isFS + "仓");
    LODOP.ADD_PRINT_LINE("21.96mm", "3.18mm", "21.96mm", "97.18mm", 0, 1);
    LODOP.ADD_PRINT_LINE("28.84mm", "3.18mm", "28.84mm", "97.18mm", 0, 1);
    LODOP.ADD_PRINT_LINE("63.24mm", "3.18mm", "63.24mm", "96.65mm", 0, 1);
    LODOP.ADD_PRINT_LINE("63.24mm", "30.69mm", "42.89mm", "30.69mm", 0, 1);
    LODOP.ADD_PRINT_LINE("43.13mm", "3.18mm", "43.13mm", "97.18mm", 0, 1);
    LODOP.ADD_PRINT_LINE("28.84mm", "77.82mm", "42.86mm", "77.82mm", 0, 1);
    LODOP.ADD_PRINT_LINE("70.91mm", "3.18mm", "70.91mm", "97.18mm", 0, 1);
    LODOP.ADD_PRINT_RECT("2.99mm", "2.99mm", "94.01mm", "94.01mm", 0, 1);

    LODOP.ADD_PRINT_IMAGE(29, "3.7mm", "24.47mm", "8.12mm", "<img src='/static/images/中国邮政logo.png' width='88' height='26px'/>"); //头部
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    if (Data.To.BuyerCountry == 'CZ' || Data.To.BuyerCountry == 'SI' || Data.To.BuyerCountry == 'SK' || Data.To.BuyerCountry == 'PL' || Data.To.BuyerCountry == 'HR') { //捷克，斯洛文尼亚，斯洛伐克，波兰，克罗地亚向
      LODOP.ADD_PRINT_TEXT("10.58mm", "29.3mm", "18.52mm", "5.29mm", "VPG POST");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    } else if (Data.To.BuyerCountry == 'FR') { //法国流向
      LODOP.ADD_PRINT_TEXT("8.73mm", "44.36mm", "27.78mm", "10.58mm", "     国际小包面单\r\nTRACKED PACKET");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_IMAGE('6.61mm', '29.1mm', 57, 39, "<img src='/static/images/LA Poste.png' width='47px' height='30px'/>");
      LODOP.ADD_PRINT_IMAGE('73.29mm', '8.73mm', 34, 35, "<img src='/static/images/lightning1.png' width='32' height='35px'/>");
      LODOP.ADD_PRINT_HTM('73.29mm', '82.18mm', 45, 37, "<img src='/static/images/无需签收图示.png' width='43' height='35px'/>");
      LODOP.ADD_PRINT_TEXT("74.61mm", "25.93mm", "42.07mm", "5.29mm", "À FLASHER EN DISTRIBUTION");
      LODOP.ADD_PRINT_BARCODE("82.29mm", "26.19mm", "42.07mm", "10.58mm", "128Auto", Data.TrackingNumber); //跟踪号及条码
    } else if (Data.To.BuyerCountry == 'DE') { //德国流向
      LODOP.ADD_PRINT_IMAGE(31, 104, 80, 28, "<img src='/static/images/Deutsche Post.png' width='70px' height='21px'/>");
    } else if (Data.To.BuyerCountry == 'NZ') { //新西兰流向
      LODOP.ADD_PRINT_IMAGE(31, "26.99mm", 80, 28, "<img src='/static/images/New_Zealand_Post_logo.png' width='70px' height='21px'/>");
      LODOP.ADD_PRINT_TEXT("9.76mm", "84.14mm", "16.67mm", "6.35mm", "Economy");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    } else if (Data.To.BuyerCountry == 'AU') { //澳大利亚流向
      LODOP.ADD_PRINT_IMAGE('7.41mm', '29.1mm', 80, 28, "<img src='/static/images/Australia Post.png' width='78px' height='21px'/>");
      LODOP.ADD_PRINT_TEXT("7.67mm", "53.79mm", "27.78mm", "10.58mm", "         跟踪小包\r\nTRACKED PACKET");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_BARCODE("75.41mm", "28.84mm", "45.51mm", "15.88mm", "128Auto", Data.TrackingNumber); //跟踪号及条码
    }
    if (Data.To.BuyerCountry != 'AU') {
      LODOP.ADD_PRINT_IMAGE("8.47mm", "69.32mm", "15.08mm", "5.85mm", "<img src='/static/images/WishPost-logo-large.jpg'  width='55px' height='40px'>");
      LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    }
    if (Data.To.BuyerCountry != 'NZ') {
      LODOP.ADD_PRINT_IMAGE("3.44mm", "85.46mm", "8.73mm", "17.73mm", "<img src='/static/images/PrimeExpres-logo.jpg' width='90' height='48px'/>");
      LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    }

    LODOP.ADD_PRINT_TEXT("23.55mm", "3.44mm", "44.98mm", "5.29mm", "协议客户：" + isFS + "收寄点"); //寄件人
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");

    LODOP.ADD_PRINT_TEXT("29.63mm", "5.82mm", "14.02mm", "6.88mm", "FROM:"); //寄件人信息
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("29.63mm", "19.31mm", "63.76mm", "12.7mm", localData.FromAddress + ',' + Data.From.ZipCode + '\n' + Data.From.Phone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT("33.87mm", "79.9mm", "20.64mm", "5.29mm", Data.To.BuyerZipCode); //收件人编码
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);

    LODOP.ADD_PRINT_TEXT("47.36mm", "11.38mm", "16.93mm", "14.55mm", "A:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 33);

    LODOP.ADD_PRINT_TEXT("44.85mm", "32.01mm", "60mm", "20mm", Data.To.BuyerFullName + '\n' + Data.To.BuyerZipCode + ', ' + localData.ToAddress + '  ' + Data.To.Country.CountryNameCn + '  ' + this.getRegisterAreaCode(Data.To.BuyerCountry)) //收件人信息
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    LODOP.ADD_PRINT_TEXT("65.62mm", "3.44mm", "86.52mm", "5.29mm", "退件地址: " + distance); //固定值
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    if (Data.To.BuyerCountry != 'FR' && Data.To.BuyerCountry != 'AU') {
      LODOP.ADD_PRINT_TEXT("7.67mm", "45.88mm", "27.78mm", "10.58mm", "         跟踪小包\r\nTRACKED PACKET");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_BARCODE("75.41mm", "28.84mm", "45.51mm", "15.88mm", "128Auto", Data.TrackingNumber); //跟踪号及条码
    }

    LODOP.PRINT();
  },
  //澳大利亚向 || 捷克，斯洛文尼亚，斯洛伐克，波兰，克罗地亚向|| 法国向|| 德国向 || 新西兰向跟踪单
  printWishPostFS_back: function(Data:Interface.PrintData, type: number) {
    let isFS = '';
    if (type == 1) {
      isFS = '佛山'
    } else if (type == 2) {
      isFS = '上海'
    } else {
      isFS = '广州'
    }
    var localData = {
      totalWeight: 0,
      totalValue: 0
    }
    var countryCode = this.getChinaPostLM(Data.To.Country.CountryCode);
    countryCode = countryCode.substring(0, 2) + ' ' + countryCode.substring(2);
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-wish邮挂号" + isFS + "仓报关单");

    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-wish邮挂号" + isFS + "仓报关单");

    LODOP.ADD_PRINT_RECT("2.12mm", "1.85mm", "95.99mm", "95.01mm", 0, 1);
    LODOP.ADD_PRINT_LINE("26.19mm", "2.12mm", "26.19mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("19.31mm", "2.91mm", "54.35mm", "6.14mm", "报关签条 （CUSTOMS DECLARTION）");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("7.67mm", "33.6mm", "31.75mm", "7.41mm", "SMALL PACKET");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_LINE("40.45mm", "37.57mm", "26.46mm", "37.57mm", 0, 1);
    LODOP.ADD_PRINT_LINE("15.61mm", "2.12mm", "15.61mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("5.56mm", "2.65mm", "23.81mm", "13.23mm", "航空\r\nBY AIR");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);

    if (Data.To.BuyerCountry == 'CZ' || Data.To.BuyerCountry == 'SI' || Data.To.BuyerCountry == 'SK' || Data.To.BuyerCountry == 'PL' || Data.To.BuyerCountry == 'HR') {
      LODOP.ADD_PRINT_TEXT("7.94mm", "69.06mm", "26.99mm", "7.14mm", "VPG POST");
    } else { // 除 捷克，斯洛文尼亚，斯洛伐克，波兰，克罗地亚向 的其他向
      LODOP.ADD_PRINT_TEXT("7.94mm", "69.06mm", "26.99mm", "7.14mm", countryCode);
    }
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 3);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_TEXT(67, 212, 62, 38, "邮2113\r\nCN22");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(69, 279, 93, 38, "可以经行开拆\r\nMay be opened");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(106, 6, 150, 71, "邮件种类\r\nCategory of Itm\r\n请在适当的内容前划“√”");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(111, 154, 21, 20, "√");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_LINE("40.48mm", "46.3mm", "26.19mm", "46.3mm", 0, 1);
    LODOP.ADD_PRINT_TEXT(102, 180, 49, 35, "礼品\r\nGift");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(130, 175, 63, 36, "文件\r\nDocuments");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_LINE("33.87mm", "37.57mm", "33.87mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("40.22mm", "72.76mm", "26.19mm", "72.76mm", 0, 1);
    LODOP.ADD_PRINT_LINE("77.52mm", "63.5mm", "26.19mm", "63.5mm", 0, 1);
    LODOP.ADD_PRINT_TEXT(102, 279, 95, 35, "商品货样\r\nCommercial sample");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(130, 299, 63, 36, "其他\r\nOther");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(159, 5, 238, 36, "内容详细名称和数量\r\nQuantities and detailed description of contents");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(159, 237, 95, 31, "重量（千克）\r\nWeight（Kg）");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(159, 330, 43, 31, "价值\r\nValue");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_LINE("77.79mm", "85.2mm", "40.22mm", "85.2mm", 0, 1);
    LODOP.ADD_PRINT_LINE("50.27mm", "1.85mm", "50.27mm", "98.16mm", 0, 1);
    LODOP.ADD_PRINT_LINE("55.83mm", "2.12mm", "55.83mm", "97.9mm", 0, 1);
    //sku信息 一行
    LODOP.ADD_PRINT_TEXT(198, 10, 230, 23, Data.Item[0].TitleEn + " " + Data.Item[0].Title + " * " + Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(198, 248, 70, 23, Number((Data.Item[0].Weight / 1000).toFixed(3)) * Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(198, 325, 50, 23, (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 1)
    localData.totalValue = this.printTotalData(Data.Item, 'Amount', 1)
    // 两行
    if (Data.Item.length > 1) {
      LODOP.ADD_PRINT_TEXT(219, 10, 230, 22, Data.Item[1].TitleEn + " " + Data.Item[1].Title + " * " + Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(219, 248, 70, 22, Number((Data.Item[1].Weight / 1000).toFixed(3)) * Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_TEXT(219, 325, 50, 22, (Data.Item[1].Amount * Data.Item[1].Quantity).toFixed(2));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 2)
      localData.totalValue = this.printTotalData(Data.Item, 'Amount', 2)
      LODOP.ADD_PRINT_LINE(230, 7, 230, 370, 0, 1);
    }

    LODOP.ADD_PRINT_TEXT(236, 10, 230, 47, "协调系统税则号列和货物原产国（只对商品邮件填写）\r\nHS trariff number and country of origin of\r\ngoods (For commercial items only)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(236, 240, 80, 47, "总重量\r\nTotal Weight\r\n(Kg)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(236, 319, 60, 47, "总价值\r\nTotal\r\nValue");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_LINE("77.79mm", "2.12mm", "77.79mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_TEXT(283, 102, 100, 21, "China");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(283, 248, 70, 21, (localData.totalWeight / 1000));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(283, 325, 50, 21, localData.totalValue.toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_LINE("73.82mm", "2.12mm", "73.82mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("40.22mm", "2.12mm", "40.22mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_TEXT(303, 11, 362, 67, "我保证上述申报准确无误，本函件内未装寄法律或邮政和海关规章禁止寄递的任何危险物品\r\nI, the undersigned, certify that the particulars given in this declaration are correct and this Itm does not contain any dangerous articles prohibited by legislation or by postal or customers regulations.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(355, 11, 182, 25, "寄件人签字 Sender's signature：");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_LINE("96.31mm", "47.63mm", "96.31mm", "74.08mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("93.13mm", "46.57mm", "34.4mm", "6.09mm", Data.From.SendUserName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_RECT("90.22mm", "75.67mm", "21.56mm", "5.34mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("91.81mm", "76.2mm", "24.34mm", "7.14mm", "已验视 CN22");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.PRINT();
  },
  //爱沙尼亚，白俄罗斯，格鲁吉亚，马来西亚，泰国，新加坡
  printWishPostES: function(Data:Interface.PrintData, type:number) {
    let isFS = '';
    if (type == 1) {
      isFS = '佛山市邮政局函件集邮局'
    } else if (type == 2) {
      isFS = '上海市邮政局函件集邮局'
    } else {
      isFS = '广州小包大宗收寄处理中心'
    }
    var localData = {
      ToAddress: (Data.To.BuyerStreet2 == '' ? '' : ',' + Data.To.BuyerStreet2) + Data.To.BuyerStreet1 + "\n" + Data.To.BuyerCity + '  ' + (Data.To.BuyerState == '' ? '' : Data.To.BuyerState + '\n') + Data.To.Country.CountryName.toUpperCase(),
      FromAddress: (Data.From.Street2 == "" ? '' : Data.From.Street2 + ',') + Data.From.Street1 + "\n" + Data.From.City + " " + Data.From.SateOrProvince,
      PrintDate: this.getPrintDate(),
      totalQty: 0,
      totalWeight: 0,
      totalValue: 0
    }

    LODOP.PRINT_INITA("0mm", "0mm", "100.01mm", "100.01mm", "Wish邮挂号" + isFS + "仓");
    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "Wish邮挂号" + isFS + "仓");
    LODOP.ADD_PRINT_RECT("2.99mm", "2.99mm", "94.01mm", "94.01mm", 0, 1);
    LODOP.ADD_PRINT_IMAGE(18, 14, "24.47mm", "8.12mm", "<img src='/static/images/中国邮政logo.png' width='88' height='26px'/>");
    LODOP.ADD_PRINT_TEXT("7.14mm", "38.1mm", "29.9mm", "9.79mm", "Prime Tracked Mail\r\n        BY AIR");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_LINE("16.17mm", "38.63mm", "16.17mm", "96.84mm", 0, 1);
    LODOP.ADD_PRINT_LINE("16.4mm", "38.63mm", "50.51mm", "38.63mm", 0, 1);
    LODOP.ADD_PRINT_LINE("2.91mm", "83.37mm", "16.4mm", "83.37mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("9mm", "71.97mm", "10.85mm", "5.29mm", this.getChinaPostLM(Data.To.Country.CountryCode));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_IMAGE("4.5mm", "84.67mm", "9mm", "13mm", "<img src='/static/images/postTrackedPacket-logo.jpg' width='28px' height='37px'/>");
    LODOP.ADD_PRINT_LINE("47.51mm", "3.44mm", "47.51mm", "96.55mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("16.93mm", "4.76mm", "30.96mm", "19.84mm", "From: " + Data.From.SendUserName + '\r\n' + localData.FromAddress + '\r\n' + 'Phone: ' + Data.From.Phone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("17.2mm", "39.95mm", "48.95mm", "27.78mm", "SHIP TO: " + Data.To.BuyerFullName + '\r' + localData.ToAddress + '\r' + Data.To.BuyerZipCode + '\r' + Data.To.Country.CountryName.toUpperCase() + '\r' + 'Phone: ' + Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_LINE("2.65mm", "65.53mm", "16.14mm", "65.53mm", 0, 1);
    LODOP.ADD_PRINT_LINE("34.02mm", "3.44mm", "34.02mm", "38.66mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("40mm", "63mm", "26.46mm", "5.29mm", Data.To.Country.CountryNameCn);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_LINE("40.63mm", "3.18mm", "40.63mm", "38.39mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("36.16mm", "5.03mm", "26.46mm", "5.29mm", "自编号：");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("41.19mm", "5.03mm", "33.07mm", "7.94mm", "退件单位：" + isFS);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_LINE("58.91mm", "2.91mm", "58.65mm", "96.92mm", 0, 1);
    LODOP.ADD_PRINT_BARCODE("48.33mm", "33.87mm", "40.22mm", "10.05mm", "128Auto", Data.TrackingNumber);
    LODOP.ADD_PRINT_LINE("63.76mm", "2.91mm", "63.76mm", "96.92mm", 0, 1);
    LODOP.ADD_PRINT_LINE("68.26mm", "2.91mm", "68mm", "96.92mm", 0, 1);
    LODOP.ADD_PRINT_LINE("73.03mm", "2.91mm", "73.03mm", "96.92mm", 0, 1);
    LODOP.ADD_PRINT_LINE("78.05mm", "2.91mm", "78.05mm", "96.92mm", 0, 1);
    LODOP.ADD_PRINT_LINE("83.08mm", "3.97mm", "83.08mm", "97.98mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("83.61mm", "3.97mm", "90.75mm", "12.44mm", "I, the undersigned,certify that the particulars given in this declaration are correct and this Itm does not contain any dangerous articles prohibited by legislation or by postal or customs regulations");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("93.93mm", "3.97mm", "55.56mm", "5.29mm", "Sender's signiture & Data Signed");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("92.34mm", "80.43mm", "14.55mm", "5.29mm", "CN22");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_LINE("83.08mm", "10.58mm", "58.47mm", "10.58mm", 0, 1);
    LODOP.ADD_PRINT_LINE("83.34mm", "17.58mm", "58.74mm", "17.58mm", 0, 1);
    LODOP.ADD_PRINT_LINE("83.34mm", "55.83mm", "58.74mm", "55.83mm", 0, 1);
    LODOP.ADD_PRINT_LINE("82.81mm", "66.41mm", "58.21mm", "66.41mm", 0, 1);
    LODOP.ADD_PRINT_LINE("83.08mm", "81.49mm", "58.47mm", "81.49mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("61.12mm", "5.03mm", "6.09mm", "5.03mm", "NO");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("61.12mm", "11.91mm", "7.41mm", "5.29mm", "Qty");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("60.85mm", "25.14mm", "28.05mm", "5.29mm", "Description of Contents");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("60.59mm", "59mm", "7.41mm", "5.29mm", "kg.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("61.12mm", "68mm", "15.35mm", "5.29mm", "Vals(USD$)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("61.12mm", "83.08mm", "16.67mm", "5.29mm", "Goods Origin");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    //第一行信息
    LODOP.ADD_PRINT_TEXT("65.35mm", "5.03mm", "6.09mm", "5.29mm", "1");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT("65.35mm", "13.49mm", "7.41mm", "5.29mm", Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT("65.35mm", "19.05mm", "36mm", "5.29mm", Data.Item[0].TitleEn + " " + Data.Item[0].Title);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT("65.35mm", "57.68mm", "8.73mm", "5.29mm", Number((Data.Item[0].Weight / 1000).toFixed(3)) * Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT("65.62mm", "70.64mm", "15.35mm", "5.29mm", (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT("65.35mm", "86.52mm", "16.67mm", "5.29mm", Data.From.Country.CountryCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 1);
    localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 1);
    localData.totalValue = this.printTotalData(Data.Item, 'Amount', 1);
    //第二行
    if (Data.Item.length > 1) {
      LODOP.ADD_PRINT_TEXT("70.35mm", "5.03mm", "6.09mm", "5.29mm", "1");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
      LODOP.ADD_PRINT_TEXT("70.35mm", "13.49mm", "7.41mm", "5.29mm", Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
      LODOP.ADD_PRINT_TEXT("70.35mm", "19.05mm", "36mm", "5.29mm", Data.Item[1].TitleEn + " " + Data.Item[1].Title);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
      LODOP.ADD_PRINT_TEXT("70.35mm", "57.68mm", "8.73mm", "5.29mm", Number((Data.Item[1].Weight / 1000).toFixed(3)) * Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
      LODOP.ADD_PRINT_TEXT("70.62mm", "70.64mm", "15.35mm", "5.29mm", (Data.Item[1].Amount * Data.Item[1].Quantity).toFixed(2));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
      LODOP.ADD_PRINT_TEXT("70.35mm", "86.52mm", "16.67mm", "5.29mm", Data.From.Country.CountryCode);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
      localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 2);
      localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 2);
      localData.totalValue = this.printTotalData(Data.Item, 'Amount', 2);
    }
    //第三行
    if (Data.Item.length > 2) {
      LODOP.ADD_PRINT_TEXT("75.35mm", "5.03mm", "6.09mm", "5.29mm", "1");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
      LODOP.ADD_PRINT_TEXT("75.35mm", "13.49mm", "7.41mm", "5.29mm", Data.Item[2].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
      LODOP.ADD_PRINT_TEXT("75.35mm", "19.05mm", "36mm", "5.29mm", Data.Item[2].TitleEn + " " + Data.Item[2].Title);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
      LODOP.ADD_PRINT_TEXT("75.35mm", "57.68mm", "8.73mm", "5.29mm", Number((Data.Item[2].Weight / 1000).toFixed(3)) * Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
      LODOP.ADD_PRINT_TEXT("75.62mm", "70.64mm", "15.35mm", "5.29mm", (Data.Item[2].Amount * Data.Item[2].Quantity).toFixed(2));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
      LODOP.ADD_PRINT_TEXT("75.35mm", "86.52mm", "16.67mm", "5.29mm", Data.From.Country.CountryCode);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
      localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 3);
      localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 3);
      localData.totalValue = this.printTotalData(Data.Item, 'Amount', 3);
    }
    LODOP.ADD_PRINT_TEXT("80.41mm", "13.49mm", "7.41mm", "5.29mm", localData.totalQty);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT("80.41mm", "19.05mm", "28.05mm", "5.29mm", "Total Gross Weight(Kg)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT("80.41mm", "58.21mm", "8.73mm", "5.29mm", (localData.totalWeight / 1000).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT("80.41mm", "70.11mm", "15.35mm", "5.29mm", localData.totalValue.toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.PRINT();
  },

  //挪威流向
  printWishPostNW: function(Data:Interface.PrintData, type: number) {
    let isFS = '';
    if (type == 1) {
      isFS = '佛山市邮政局函件集邮局'
    } else if (type == 2) {
      isFS = '上海市邮政局函件集邮局'
    } else {
      isFS = '广州小包大宗收寄处理中心'
    }
    var localData = {
      ToAddress: (Data.To.BuyerStreet2 == '' ? '' : ',' + Data.To.BuyerStreet2) + Data.To.BuyerStreet1 + "\n" + Data.To.BuyerCity + '  ' + (Data.To.BuyerState == '' ? '' : Data.To.BuyerState),
      FromAddress: (Data.From.Street2 == "" ? '' : Data.From.Street2 + ',') + Data.From.Street1 + "\n" + Data.From.City + " " + Data.From.SateOrProvince,
      PrintDate: this.getPrintDate(),
      totalQty: 0,
      totalWeight: 0,
      totalValue: 0
    }
    localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 1);
    localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 1);
    localData.totalValue = this.printTotalData(Data.Item, 'Amount', 1);

    LODOP.PRINT_INITA("0mm", "0mm", "100.01mm", "100.01mm", "Wish邮挂号" + isFS + "仓");
    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "Wish邮挂号佛山仓");
    LODOP.ADD_PRINT_RECT("2.99mm", "2.99mm", "94.01mm", "94.01mm", 0, 1);
    LODOP.ADD_PRINT_IMAGE(18, 14, "24.47mm", "8.12mm", "<img src='/static/images/中国邮政logo.png' width='88' height='26px'/>");
    LODOP.ADD_PRINT_TEXT("7.94mm", "32.81mm", "34.13mm", "5.56mm", "Tracked Packet By Air");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_LINE("16.17mm", "38.63mm", "16.17mm", "96.84mm", 0, 1);
    LODOP.ADD_PRINT_LINE("16.4mm", "38.63mm", "40.51mm", "38.63mm", 0, 1);
    LODOP.ADD_PRINT_LINE("2.91mm", "78.37mm", "16.4mm", "78.37mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("8.47mm", "68.26mm", "12.15mm", "5.29mm", this.getChinaPostLM(Data.To.Country.CountryCode));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_IMAGE("6.61mm", "79.9mm", "15.08mm", "6.11mm", "<img src='/static/images/WishPost-logo-large.jpg'  width='55px' height='40px'>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_LINE("40.51mm", "3.44mm", "40.51mm", "96.55mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("16.93mm", "4.76mm", "32mm", "19.84mm", "From: " + Data.From.SendUserName + '\r\n' + localData.FromAddress + '\r\n' + 'Phone: ' + Data.From.Phone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("17.2mm", "39.95mm", "48.95mm", "27.78mm", "SHIP TO: " + Data.To.BuyerFullName + '\r' + localData.ToAddress + '\r' + Data.To.Country.CountryName + ' ' + this.getRegisterAreaCode(Data.To.Country.CountryCode) + " " + Data.To.Country.CountryNameCn + ' ' + Data.To.BuyerZipCode + '\r' + 'Phone: ' + Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_LINE("2.65mm", "65.53mm", "16.14mm", "65.53mm", 0, 1);
    LODOP.ADD_PRINT_LINE("34.02mm", "3.44mm", "34.02mm", "38.66mm", 0, 1);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("36.16mm", "5.03mm", "26.46mm", "5.29mm", "自编号：");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    LODOP.ADD_PRINT_LINE("58.91mm", "2.91mm", "58.91mm", "96.92mm", 0, 1);
    LODOP.ADD_PRINT_BARCODE("43.05mm", "52.39mm", "40.22mm", "10.05mm", "128Auto", Data.TrackingNumber);
    LODOP.ADD_PRINT_LINE("63.76mm", "2.91mm", "63.76mm", "96.92mm", 0, 1);
    LODOP.ADD_PRINT_LINE("68.26mm", "2.91mm", "68.26mm", "96.92mm", 0, 1);
    LODOP.ADD_PRINT_LINE("73.03mm", "2.91mm", "73.03mm", "96.92mm", 0, 1)
    LODOP.ADD_PRINT_TEXT("76.61mm", "3.97mm", "90.75mm", "12.44mm", "I, the undersigned,certify that the particulars given in this declaration are correct and this Itm does not contain any dangerous articles prohibited by legislation or by postal or customs regulations");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("90.28mm", "3.7mm", "60mm", "5.29mm", "Sender's signiture & Data Signed: " + localData.PrintDate);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_RECT("87.31mm", "71.97mm", "21.7mm", "6.61mm", 0, 2);
    LODOP.ADD_PRINT_TEXT("89.69mm", "74.08mm", "21.43mm", "5.29mm", "已验视CN22");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_LINE("73.34mm", "55.83mm", "58.47mm", "55.83mm", 0, 1);
    LODOP.ADD_PRINT_LINE("58.5mm", "76.17mm", "73.29mm", "76.17mm", 0, 1);

    LODOP.ADD_PRINT_TEXT("60.85mm", "18.26mm", "28.05mm", "5.29mm", "Description of Contents");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("60.59mm", "63.24mm", "7.41mm", "5.29mm", "kg.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("61.12mm", "80.96mm", "15.35mm", "5.29mm", "Vals(USD$)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    //第一行信息
    LODOP.ADD_PRINT_TEXT("65.35mm", "3.05mm", "28.05mm", "5.29mm", Data.Item[0].TitleEn + " " + Data.Item[0].Title);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT("65.35mm", "62.44mm", "8.73mm", "5.29mm", Number((Data.Item[0].Weight / 1000).toFixed(3)) * Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT("65.62mm", "83.34mm", "15.35mm", "5.29mm", (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);

    LODOP.ADD_PRINT_TEXT("70.41mm", "3.05mm", "28.05mm", "5.29mm", "Total Gross Weight(Kg)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT("70.41mm", "62.44mm", "8.73mm", "5.29mm", (localData.totalWeight / 1000).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT("70.41mm", "83.34mm", "15.35mm", "5.29mm", (localData.totalValue).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);

    LODOP.ADD_PRINT_LINE("53.47mm", "2.91mm", "53.47mm", "96.81mm", 0, 1);
    LODOP.ADD_PRINT_LINE("58.47mm", "23.81mm", "53.18mm", "23.81mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("55.03mm", "4.23mm", "19.84mm", "5.29mm", "退件单位:");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("55.03mm", "24.08mm", "42.86mm", "5.29mm", isFS);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    if (Data.To.Country.CountryCode != 'NO') {
      LODOP.ADD_PRINT_TEXT("43.13mm", "10.58mm", "9.79mm", "12.96mm", "R");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 23);
      LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    }
    LODOP.PRINT();

  },
  //约旦及其他流向
  printJO: function(Data:Interface.PrintData, type:number) {
    // LogisticsExt转换为JSON
    if (Data.LogisticsExt != '' && typeof Data.LogisticsExt === 'string') {
      Data.LogisticsExt = JSON.parse(Data.LogisticsExt)
    }

    let isFS = '';
    let distance = '';
    if (type == 1) {
      isFS = '佛山'
      distance = '佛山市邮政局函件集邮局'
    } else if (type == 2) {
      isFS = '上海'
      distance = '上海邮政物流公司wish上海仓'
    } else {
      isFS = '广州'
      distance = '广州小包大宗收寄处理中心'
    }
    var localData = {
      ToAddress: (Data.To.BuyerStreet2 == '' ? '' : ',' + Data.To.BuyerStreet2) + Data.To.BuyerStreet1 + "\n" + Data.To.BuyerCity + '  ' + (Data.To.BuyerState == '' ? '' : Data.To.BuyerState),
      FromAddress: (Data.From.Street2 == "" ? '' : Data.From.Street2 + ',') + Data.From.Street1 + "\n" + Data.From.City + " " + Data.From.SateOrProvince,
      PrintDate: this.getPrintDate(),
      totalQty: 0,
      totalWeight: 0,
      totalValue: 0
    }
    localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 1);
    localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 1);
    localData.totalValue = this.printTotalData(Data.Item, 'Amount', 1);

    LODOP.PRINT_INITA("0mm", "0mm", "100.01mm", "100.01mm", "Wish邮挂号" + isFS + "仓");
    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "Wish邮挂号佛山仓");
    LODOP.ADD_PRINT_RECT("2.99mm", "2.99mm", "94.01mm", "94.01mm", 0, 1);
    LODOP.ADD_PRINT_IMAGE(18, 14, "24.47mm", "8.12mm", "<img src='/static/images/中国邮政logo.png' width='88' height='26px'/>");
    LODOP.ADD_PRINT_TEXT("8.47mm", "35.72mm", "34.13mm", "5.56mm", "Small Packet BY AIR");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_LINE("16.17mm", "2.99mm", "16.17mm", "96.99mm", 0, 1);
    LODOP.ADD_PRINT_LINE("16.4mm", "35mm", "40.51mm", "35mm", 0, 1);
    LODOP.ADD_PRINT_LINE("2.99mm", "78.37mm", "16.4mm", "78.37mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("8.47mm", "69.26mm", "12.15mm", "5.29mm", this.getChinaPostLM(Data.To.Country.CountryCode));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_IMAGE("6.61mm", "79.9mm", "15.08mm", "6.11mm", "<img src='/static/images/WishPost-logo-large.jpg'  width='55px' height='40px'>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_LINE("40.51mm", "3.44mm", "40.51mm", "96.55mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("16.93mm", "4.76mm", "32mm", "19.84mm", "From: " + Data.From.SendUserName + '\r\n' + localData.FromAddress + '\r\n' + 'Phone: ' + Data.From.Phone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("17.2mm", "35.72mm", "60mm", "27.78mm", "SHIP TO: " + Data.To.BuyerFullName + '\r' + localData.ToAddress + '\r' + Data.To.Country.CountryName + ' ' + this.getRegisterAreaCode(Data.To.Country.CountryCode) + " " + Data.To.Country.CountryNameCn + ' ' + Data.To.BuyerZipCode + '\r' + 'Phone: ' + Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_LINE("2.99mm", "65.53mm", "16.14mm", "65.53mm", 0, 1);
    LODOP.ADD_PRINT_LINE("34.02mm", "2.99mm", "34.02mm", "35mm", 0, 1);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("36.16mm", "5.03mm", "26.46mm", "5.29mm", "自编号：");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    // 巴西渠道增加税号;
    // Wish邮-中邮挂号佛山仓，ApiType=11，渠道代码1*25;
    // Wish邮-中邮挂号上海仓，ApiType=11，渠道代码1*1
    // Wish邮-中邮挂号广州仓，ApiType=11，渠道代码1*2
    if( Data.To.BuyerCountry=='BR' && Data.MethodApiType==11 && (Data.MethodCode=='1*25' || Data.MethodCode=='1*1' || Data.MethodCode=='1*2')){
      LODOP.ADD_PRINT_TEXT("37.84mm","35.45mm","73.8mm","5.29mm","TAX ID: "+( Data.LogisticsExt.TaxNumber?Data.LogisticsExt.TaxNumber:'' ));
      LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
    }
    if(Data.LogisticsExt.NorwayVatNumber && Data.MethodApiType==11 && (Data.MethodCode=='1*25' || Data.MethodCode=='1*1' || Data.MethodCode=='1*2')){
      let s = Data.LogisticsExt.NorwayVatNumber.substring(0,1) + "*****" + Data.LogisticsExt.NorwayVatNumber.substring(6)
      LODOP.ADD_PRINT_TEXT("30.01mm","4.76mm","42.33mm","5.29mm",`VAT No: VOEC ${s}`);
      LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
    }


    LODOP.ADD_PRINT_LINE("58.91mm", "2.99mm", "58.91mm", "96.92mm", 0, 1);
    LODOP.ADD_PRINT_BARCODE("43.05mm", "52.39mm", "40.22mm", "10.05mm", "128Auto", Data.TrackingNumber);
    LODOP.ADD_PRINT_LINE("63.76mm", "2.99mm", "63.76mm", "96.92mm", 0, 1);
    LODOP.ADD_PRINT_LINE("68.26mm", "2.99mm", "68.26mm", "96.92mm", 0, 1);
    LODOP.ADD_PRINT_LINE("73.03mm", "2.99mm", "73.03mm", "96.92mm", 0, 1)
    LODOP.ADD_PRINT_TEXT("76.61mm", "3.97mm", "90.75mm", "12.44mm", "I certify that the particulars given in this declaration are correct and this Itm does not contain any dangerous articles prohibited by legislation or by postal or customs regulations");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("90.28mm", "3.7mm", "60mm", "5.29mm", "Sender's signiture & Data Signed: " + localData.PrintDate);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_RECT("87.31mm", "71.97mm", "21.7mm", "6.61mm", 0, 2);
    LODOP.ADD_PRINT_TEXT("89.69mm", "74.08mm", "21.43mm", "5.29mm", "已验视CN22");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_LINE("73.34mm", "55.83mm", "58.47mm", "55.83mm", 0, 1);
    LODOP.ADD_PRINT_LINE("58.5mm", "76.17mm", "73.29mm", "76.17mm", 0, 1);

    LODOP.ADD_PRINT_TEXT("60.85mm", "18.26mm", "28.05mm", "5.29mm", "Description of Contents");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("60.59mm", "63.24mm", "7.41mm", "5.29mm", "kg.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("61.12mm", "80.96mm", "15.35mm", "5.29mm", "Vals(USD$)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    //第一行信息
    LODOP.ADD_PRINT_TEXT("65.35mm", "3.5mm", "50mm", "5.29mm", Data.Item[0].TitleEn + " " + Data.Item[0].Title);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT("65.35mm", "62.44mm", "8.73mm", "5.29mm", Number((Data.Item[0].Weight / 1000).toFixed(3)) * Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT("65.62mm", "83.34mm", "15.35mm", "5.29mm", (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);

    LODOP.ADD_PRINT_TEXT("70.41mm", "3.5mm", "50mm", "5.29mm", "Total Gross Weight(Kg)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT("70.41mm", "62.44mm", "8.73mm", "5.29mm", (localData.totalWeight / 1000).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT("70.41mm", "83.34mm", "15.35mm", "5.29mm", localData.totalValue.toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);

    LODOP.ADD_PRINT_LINE("53.47mm", "2.99mm", "53.47mm", "96.99mm", 0, 1);
    LODOP.ADD_PRINT_LINE("58.47mm", "23.81mm", "53.18mm", "23.81mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("55.03mm", "4.23mm", "19.84mm", "5.29mm", "退件单位:");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("55.03mm", "24.08mm", "42.86mm", "5.29mm", distance);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    LODOP.ADD_PRINT_TEXT("41.28mm", "10.58mm", "9.79mm", "12.96mm", "R");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 30);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.PRINT();
    // LODOP.PRINT_DESIGN();

  },

  //飞特物流全球平邮小包 **杨定杰**
  '56-0': function(Data:Interface.PrintData) {
    this.printWishPostFT(Data, 'FUP')
  },
  //飞特物流全球挂号小包 **杨定杰**
  '55-1': function(Data:Interface.PrintData) {
    this.printWishPostFT(Data, 'FRP');
  },
  printWishPostFT: function(Data:Interface.PrintData, type: string) {
    let title = type == 'FUP' ? "面单-飞特物流-全球平邮小包" : "面单-飞特物流-全球挂号小包"
    var localData = {
      ToAddress: Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == '' ? '' : ',' + Data.To.BuyerStreet2) + "\n" + Data.To.BuyerCity + "\n" + (Data.To.BuyerState == '' ? '' : Data.To.BuyerState + '\n') + Data.To.Country.CountryName,
      FromAddress: (Data.From.Street2 == "" ? '' : Data.From.Street2 + ',') + Data.From.Street1 + "\n" + Data.From.City + " " + Data.From.SateOrProvince + "\n" + Data.From.Country.CountryName.toUpperCase(),
      PrintDate: this.getPrintDate(),
      totalQty: 0,
      totalWeight: 0,
      totalValue: 0
    }
    localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 1)
    localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 1)
    localData.totalValue = this.printTotalData(Data.Item, 'Amount', 1)
    LODOP.PRINT_INITA("0mm", "0.26mm", "100.01mm", "100.01mm", title);
    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, title);
    LODOP.ADD_PRINT_LINE("42.95mm", "2.91mm", "42.95mm", "96.41mm", 0, 1);
    LODOP.ADD_PRINT_LINE("52.60mm", "2.91mm", "52.60mm", "96.41mm", 0, 1);
    LODOP.ADD_PRINT_LINE("63.23mm", "2.91mm", "63.23mm", "96.41mm", 0, 1);
    LODOP.ADD_PRINT_LINE("71.41mm", "18.31mm", "75.4mm", "18.31mm", 0, 1);
    LODOP.ADD_PRINT_LINE("71.14mm", "53.85mm", "75.35mm", "53.85mm", 0, 1);
    LODOP.ADD_PRINT_LINE("63.2mm", "67.17mm", "71.19mm", "67.17mm", 0, 1);
    LODOP.ADD_PRINT_LINE("71.41mm", "2.91mm", "71.41mm", "96.41mm", 0, 1);
    LODOP.ADD_PRINT_LINE("75.64mm", "2.91mm", "75.64mm", "96.41mm", 0, 1);
    LODOP.ADD_PRINT_LINE("61.65mm", "41.28mm", "58.74mm", "45.24mm", 0, 1);
    LODOP.ADD_PRINT_LINE("60.06mm", "39.95mm", "61.65mm", "41.54mm", 0, 1);
    LODOP.ADD_PRINT_RECT("2.62mm", "2.99mm", "93.5mm", "94.01mm", 0, 1);
    if (type == 'FUP') {
      LODOP.ADD_PRINT_TEXT("5.03mm", "5.03mm", "37.49mm", "14.79mm", "Massey Short\r\nP.O.Box 150\r\nSuvarnabhumi Airport Post Office\r\nBang Phli Bangkok 10543 THAILAND"); //固定内容
    } else {
      LODOP.ADD_PRINT_TEXT("5.03mm", "5.03mm", "37.49mm", "14.79mm", "Mathis Johnson\r\nP.O.Box 151\r\nSuvarnabhumi Airport Post Office\r\nBang Phli Bangkok 10543 THAILAND"); //固定内容
    }

    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 5);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_HTM("3.44mm", "43.66mm", "25.14mm", "13.76mm", "<img src='/static/images/wish.png' width='90' height='48px'/>"); //面单图片
    LODOP.ADD_PRINT_TEXT("8.2mm", "74.88mm", "15.88mm", "3.7mm", "Postage Paid");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 5);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    if (type == 'FUP') {
      LODOP.ADD_PRINT_TEXT("11.11mm", "69.06mm", "28.84mm", "7.67mm", "Special Permit No 24/2561\r\nSuvarnabhumi Airport Post"); //固定内容
    } else {
      LODOP.ADD_PRINT_TEXT("11.11mm", "69.06mm", "28.84mm", "7.67mm", "Special Permit No 25/2561\r\nSuvarnabhumi Airport Post"); //固定内容
    }

    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 5);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_TEXT("16.4mm", "5.03mm", "17.99mm", "5.29mm", "Deliver To:"); //收件人地址电话
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("20.37mm", "5.03mm", "37mm", "27mm", Data.To.BuyerFullName + "\r\n" + localData.ToAddress + "  Zip " + Data.To.BuyerZipCode + " Tel: " + Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_BARCODE("28.84mm", "52.063%", "41.825%", "13.76mm", "128Auto", Data.TrackingNumber); //跟踪号条码
    if (Data.To.BuyerCountry == 'US') {
      let zipCode: ""|number = '';
      let zip = Number(Data.To.BuyerZipCode.substr(0, 1));
      if (zip >= 0 && zip <= 7) {
        zipCode = 1;
      } else {
        zipCode = 2;
      }
      LODOP.ADD_PRINT_TEXT("25.63mm", "92.60mm", "6.88mm", "5.29mm", zipCode);
      LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    }


    LODOP.ADD_PRINT_TEXT("36.22mm", "37.84mm", "11.64mm", "6.88mm", Data.To.Country.CountryCode); //国家二字简码
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 18);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_TEXT("45.48mm", "5.03mm", "37.04mm", "6.09mm", "CUSTOMS DECLARATION"); //固定内容
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("48.18mm", "5.03mm", "56.89mm", "5.29mm", "Postal administration(May be opened officially)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("44.74mm", "79.64mm", "11.11mm", "5.29mm", "CN22");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("48.45mm", "68.79mm", "21.17mm", "5.29mm", "Important !");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_RECT("53.68mm", "7.67mm", "2.65mm", "2.65mm", 0, 1); //固定内容
    LODOP.ADD_PRINT_TEXT("54.74mm", "12.96mm", "26.46mm", "5.29mm", "Gift");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_RECT("59.5mm", "40.48mm", "2.65mm", "2.65mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("54.47mm", "46.04mm", "36.78mm", "5.29mm", "Commercial sample");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_RECT("53.68mm", "40.48mm", "2.65mm", "2.65mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("60.56mm", "12.96mm", "26.46mm", "5.29mm", "Documents");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_RECT("59.5mm", "7.67mm", "2.65mm", "2.65mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("60.56mm", "46.04mm", "39.42mm", "5.29mm", "Other(Tick one or more boxes)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT("64.79mm", "5.29mm", "54.24mm", "5.29mm", "Detailed description of Contents"); //产品英文名Data.Item[0].TitleEn
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("68.23mm", "5.29mm", "54.24mm", "5.29mm", Data.Item[0].TitleEn + '  ' + localData.totalQty + "  Weight: " + (Data.Item[0].Weight / 1000) + 'kg'); //单个产品重量
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT("64.79mm", "79.64mm", "9mm", "5.29mm", "Value"); //单个产品报关价值
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("68.23mm", "78.32mm", "26.46mm", "5.29mm", 'USD    ' + Data.Item[0].Amount.toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT("72.60mm", "5.29mm", "14.55mm", "5.29mm", "Origin: TH"); //总重量
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("72.60mm", "24.61mm", "31mm", "5.29mm", "TotalWeight:     " + (localData.totalWeight / 1000) + 'kg');
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT("72.60mm", "65.88mm", "35.45mm", "5.29mm", "Total Value      USD  " + localData.totalValue.toFixed(2)); //总报关价值
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT("77.49mm", "4.5mm", "93.93mm", "7.94mm", "     I, the undersigned,certify that the particulars given in this declaration are correct and this Itm does not contain any dangerous articles prohibited by legislation or by postal or customs regulations.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 5);


    LODOP.ADD_PRINT_TEXT("81.47mm", "78.32mm", "26.46mm", "5.29mm", "33426"); //客户物流ID
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("82.52mm", "4.5mm", "40.63mm", "5.29mm", "Date and Sender's Signatrue     " + localData.PrintDate); //打印日期
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 5);

    if (type == 'FRP') {
      LODOP.ADD_PRINT_TEXT("85.78mm", "47.77mm", "6.77mm", "10.32mm", "R");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 17);
    }

    LODOP.ADD_PRINT_BARCODE("85.01mm", "55.413%", "41.561%", "11.38mm", "128Auto", Data.TrackingNumber);
    LODOP.PRINT();
  },

  // 昌辉物流-香港DHL
  DHLHongkong: function(Data:Interface.PrintData) {
    // 另一个methodCode为CAINIAO_STANDARD_FPXFS
    let start = 45.38;
    let startRec = 43.92;
    let isHK = Data.MethodCode == 'DHLHongkong'
    let methodName = "";
    let fontSize = isHK ? 25 : 15
    let toAddress = Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == "" ? "" : " " + Data.To.BuyerStreet2) + " " + Data.To.BuyerCity + " " + Data.To.BuyerState + " " + Data.To.BuyerZipCode + " " + Data.To.Country.CountryName + " " + Data.To.Country.CountryNameCn

    switch (Data.MethodCode) {
      case 'DHLHongkong':
        methodName = '昌辉物流-香港DHL';
        break;

      case 'CAINIAO_STANDARD_FPXFS':
        methodName = 'AliExpress 无忧物流-标准(佛山)普货';
        break;

      case 'DHLChina':
        methodName = '昌辉物流-大陆DHL';
        fontSize = 25;
        break;

      case 'INECOM':
        methodName = 'Paytm-印度电商包裹';
        fontSize = 25;
        break;

      case 'INECOM-BAT':
        methodName = 'Paytm-印度电商包裹（带电产品）';
        break;
    }

    LODOP.PRINT_INITA("0mm", "0mm", "100.01mm", "100.01mm", "面单-昌辉物流-香港DHL");
    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "昌辉物流-香港DHL");
    LODOP.ADD_PRINT_RECT("2.65mm", "2.65mm", "95.01mm", "95.01mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("7.94mm", "4.23mm", "92.6mm", "16.4mm", methodName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", fontSize);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_BARCODE("21.96mm", "10%", "45%", "15.88mm", "128Auto", Data.OrderCode);
    LODOP.ADD_PRINT_TEXT("21.96mm", "54.16mm", "45.32mm", "20.11mm", toAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", "-0.53mm");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 9);

    LODOP.ADD_PRINT_RECT("43.92mm", "10%", "80%", "51mm", 0, 1);
    for (var k = 0; k < 7; k++) {
      startRec += 6.375;
      LODOP.ADD_PRINT_LINE(startRec + "mm", "10%", startRec + "mm", "90.159%", 0, 1);
    }

    for (var i = 0; i < Data.Item.length; i++) {
      LODOP.ADD_PRINT_TEXT(start + "mm", "12.011%", "76.667%", "5.29mm", Data.Item[i].SkuCode + ' * ' + Data.Item[i].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      start += 6.21;
    }

    LODOP.PRINT()
  },
  //Shopee物流渠道面单 **梁炜珍**
  'Shopee': function(Data:Interface.PrintData) {
    var LogisticsExt = Data.LogisticsExt == '' ? '' : JSON.parse(Data.LogisticsExt)
    var Quantity = 0;
    for (let Itm of Data.Item) {
      Quantity += parseFloat(String(Itm.Quantity));
    }
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-Shopee物流面单");

    LODOP.SET_PRINT_PAGESIZE(1, "100mm", "100mm", "Shopee物流面单");
    LODOP.ADD_PRINT_RECT("2.99mm", "2.99mm", "94.01mm", "94.01mm", 0, 1);
    LODOP.ADD_PRINT_LINE("11.59mm", "2.99mm", "11.59mm", "97.18mm", 0, 1);
    LODOP.ADD_PRINT_LINE("36.51mm", "2.99mm", "36.51mm", "97.18mm", 0, 1);
    LODOP.ADD_PRINT_LINE("50.51mm", "2.99mm", "50.51mm", "97.18mm", 0, 1);
    LODOP.ADD_PRINT_LINE("76.49mm", "2.99mm", "76.49mm", "97.18mm", 0, 1);
    LODOP.ADD_PRINT_LINE("50.51mm", "25.4mm", "36.51mm", "25.4mm", 0, 1);
    LODOP.ADD_PRINT_LINE("50.32mm", "49.5mm", "36.51mm", "49.5mm", 0, 1);
    LODOP.ADD_PRINT_LINE("50.51mm", "73.29mm", "36.51mm", "73.29mm", 0, 1);
    LODOP.ADD_PRINT_BARCODE("14.02mm", "8.2mm", "86.25mm", "15.88mm", "128Auto", Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT("5.29mm", "4.76mm", "89.43mm", "7.94mm", LogisticsExt == '' ? "Order ID : " : "Order ID : " + LogisticsExt.ordersn);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("32.54mm", "9.53mm", "82.55mm", "5.29mm", "Tracking NO : " + Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);

    LODOP.ADD_PRINT_TEXT("41.62mm", "4.45mm", "19.05mm", "9.26mm", LogisticsExt == '' ? '' : LogisticsExt.first_mile_name);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("41.54mm", "27.78mm", "20.64mm", "9.26mm", LogisticsExt == '' ? '' : LogisticsExt.last_mile_name);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("35.45mm", "51.33mm", "21.43mm", "8.47mm", LogisticsExt == '' ? '' : LogisticsExt.goods_to_declare == true ? 'T' : 'P');
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 38);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("41.54mm", "74.35mm", "21.7mm", "9.26mm", LogisticsExt == '' ? '' : LogisticsExt.lane_code);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_TEXT("52.12mm", "4.5mm", "44.98mm", "5.56mm", "Recipient Address: " + Data.To.BuyerFullName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", -3);
    LODOP.ADD_PRINT_TEXT("58.21mm", "4.23mm", "47.89mm", "13.76mm", Data.To.BuyerStreet1);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", -3);
    LODOP.ADD_PRINT_TEXT("73.82mm", "4.23mm", "41.8mm", "5.29mm", "Tel: " + Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    LODOP.ADD_PRINT_LINE("76.46mm", "49.5mm", "50.54mm", "49.5mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("51.86mm", "51.33mm", "44.19mm", "5.29mm", LogisticsExt == '' ? '' : LogisticsExt.warehouse_id);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("57.41mm", "51.33mm", "41.8mm", "16.14mm", LogisticsExt == '' ? '' : LogisticsExt.warehouse_address);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");

    LODOP.ADD_PRINT_TEXT("78.32mm", "4.23mm", "26.46mm", "5.29mm", "Items:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("83.87mm", "4.23mm", "70.64mm", "6.35mm", Data.Item[0].TitleEn + '*' + Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    if (Data.Item.length >= 2) {
      LODOP.ADD_PRINT_TEXT("90.49mm", "4.23mm", "70.64mm", "6.35mm", Data.Item[1].TitleEn + '*' + (parseInt(String(Quantity)) - parseInt(String(Data.Item[1].Quantity))));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    }
    LODOP.ADD_PRINT_TEXT("79.38mm", "61.65mm", "34.66mm", "11.91mm", LogisticsExt == '' ? '' : LogisticsExt.service_code);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 38);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.PRINT();
  },
  // Wish达上海仓渠道面单
  '300-1*1': function(Data:Interface.PrintData) {
    var date = new Date();
    var localData = {
      ToAddress: Data.To.BuyerFullName + '\n' + Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == "" ? '' : Data.To.BuyerStreet2 + ',') + "\n" + Data.To.BuyerCity + (Data.To.BuyerState == "" ? '' : ',' + Data.To.BuyerState) + "\n" + Data.To.BuyerZipCode + '\n' + Data.To.Country.CountryName + '\nTEL:' + Data.To.BuyerPhone,
      FromAddress: Data.From.SendUserName + "\n" + (Data.From.Street2 == '' ? '' : Data.From.Street2 + ',') + Data.From.Street1 + "\n" + Data.From.City + "," + Data.From.SateOrProvince + '\n' + Data.From.Country.CountryName + '\n' + 'TEL: ' + Data.From.Phone,
      PrintDate: this.getPrintDate(),
      totalQty: 0,
      totalWeight: 0,
      totalValue: 0
    }
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-Wish达上海仓渠道面单");

    LODOP.SET_PRINT_PAGESIZE(1, "100mm", "100mm", "Wish达上海仓渠道面单");
    LODOP.ADD_PRINT_RECT("3mm", "3mm", "94mm", "94mm", 0, 1);

    LODOP.ADD_PRINT_LINE("18.49mm", "3.18mm", "18.49mm", "96.86mm", 0, 1);
    LODOP.ADD_PRINT_LINE("45.01mm", "2.91mm", "45.01mm", "96.6mm", 0, 1);
    LODOP.ADD_PRINT_LINE("70.09mm", "3.18mm", "70.09mm", "96.86mm", 0, 1);
    LODOP.ADD_PRINT_LINE("90.01mm", "3.18mm", "90.01mm", "96.86mm", 0, 1);

    LODOP.ADD_PRINT_IMAGE(19, 20, 107, 45, "<img src='/static/images/wish达.png'>")
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 2);
    LODOP.ADD_PRINT_TEXT("8.73mm", "38.63mm", "41.54mm", "5.29mm", Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
    LODOP.ADD_PRINT_TEXT("9.79mm", "81.49mm", "16.4mm", "5.29mm", Data.To.Country.CountryNameCn);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("20.64mm", "5.56mm", "89.69mm", "22.23mm", "FROM:" + localData.FromAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8)
    LODOP.ADD_PRINT_TEXT("47.1mm", "5.56mm", "89.69mm", "22.23mm", "TO:" + localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8)
    LODOP.ADD_PRINT_BARCODE("72.76mm", "11.64mm", "78.85mm", "15.88mm", "128Auto", Data.TrackingNumber);
    LODOP.ADD_PRINT_TEXT("92.34mm", "5.29mm", "50.27mm", "3.7mm", "商户自定义：");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT("92.34mm", "76.99mm", "20.9mm", "3.7mm", localData.PrintDate);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.PRINT();
  },
  // UBI和DHL 睿振行-皇家邮政 睿振行-德国专线
  UBIandDHL: function(imageUrl: string, PrintHeight:string) {
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', PrintHeight, "面单");
    LODOP.SET_PRINT_PAGESIZE(1, "100mm", PrintHeight, "面单");
    LODOP.ADD_PRINT_IMAGE("0mm", "0mm", "100mm", PrintHeight, "<img src='" + imageUrl + "'/>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 2);
    LODOP.SET_PRINT_STYLEA(0, "HtmWaitMilSecs", 300);
    LODOP.PRINT();
  },
  // ABLE贯达-拉脱维亚邮政挂号渠道面单  **梁炜珍**
  '1841': function(Data:Interface.PrintData) {
    var localData = {
      ToAddress: Data.To.BuyerFullName + '\n\n' + Data.To.BuyerStreet1 + " " + Data.To.BuyerStreet2 + "\n\n" + Data.To.BuyerCity + " " + Data.To.BuyerState + "\n\n" + Data.To.Country.CountryName + '\n' + Data.To.BuyerZipCode + '\n' + Data.To.BuyerPhone
    }
    var Quantity = 0;
    var Weight = 0;
    var Amount = 0;
    for (let Itm of Data.Item) {
      Quantity += parseFloat(String(Itm.Quantity));
      Weight += parseFloat(String(Itm.Weight));
      Amount += parseFloat(String(Itm.Amount));
    }
    LODOP.PRINT_INITA("0mm", "0mm", '150mm', '100mm', "面单-睿振行-皇家邮政挂号渠道");

    LODOP.SET_PRINT_PAGESIZE(1, 1500, 1000, "面单-睿振行-皇家邮政挂号渠道");

    LODOP.ADD_PRINT_RECT(10, 10, "14.6cm", "9.599cm", 0, 1);
    LODOP.ADD_PRINT_TEXT(19, 19, 62, 49, "FROM\n发件人");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT(15, 243, 183, 20, "CUSTOMS DECLARATION");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(16, 74, 153, 56, "P.O.BOX 120\n1044 Marupe\nLATVIA ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(30, 243, 137, 26, "Designated operator ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT(31, 386, 100, 25, "Latvijias Pasts");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(19, 497, 70, 30, "CN22");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(280, 155, 29, 30, "R");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 16);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.SET_PRINT_STYLEA(0, "Angle", 90);
    LODOP.ADD_PRINT_TEXT(48, 243, 168, 23, "拉脱维亚邮政   海关清关单");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_LINE(72, 11, 71, 530, 0, 1);
    LODOP.ADD_PRINT_LINE(373, 154, 71, 155, 0, 1);
    LODOP.ADD_PRINT_LINE(320, 11, 319, 154, 0, 1);
    LODOP.ADD_PRINT_TEXT(87, 23, 100, 20, "TO  收件人");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT(117, 21, 134, 200, localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_RECT(71, 239, 317, 295, 0, 1);
    LODOP.ADD_PRINT_LINE(114, 240, 113, 556, 0, 1);
    LODOP.ADD_PRINT_LINE(112, 264, 70, 265, 0, 1);
    LODOP.ADD_PRINT_LINE(113, 357, 71, 358, 0, 1);
    LODOP.ADD_PRINT_LINE(113, 381, 71, 382, 0, 1);
    LODOP.ADD_PRINT_LINE(93, 240, 92, 263, 0, 1);
    LODOP.ADD_PRINT_LINE(91, 358, 92, 382, 0, 1);
    LODOP.ADD_PRINT_TEXT(76, 271, 94, 42, "Gift 礼物\r\nDocuments 文件");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(79, 384, 160, 20, "Commercial sample 商业样品");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(94, 361, 21, 20, "√");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(98, 383, 70, 24, "Other 其他");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(99, 446, 114, 20, "Tick one or more boxes");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_BARCODE(114, 178, 56, 217, "128Auto", Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "Angle", -90);
    LODOP.ADD_PRINT_LINE(149, 240, 148, 555, 0, 1);
    LODOP.ADD_PRINT_TEXT(120, 239, 221, 42, "(1)Quantity (2)and detailed description of content     商品名称和件数");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_LINE(273, 442, 114, 443, 0, 1);
    LODOP.ADD_PRINT_LINE(272, 499, 113, 500, 0, 1);
    LODOP.ADD_PRINT_LINE(171, 239, 170, 556, 0, 1);
    LODOP.ADD_PRINT_LINE(194, 240, 193, 556, 0, 1);

    if (Data.Item.length == 2) {
      LODOP.ADD_PRINT_TEXT(180, 255, 44, 20, Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(180, 300, 135, 20, Data.Item[1].TitleEn);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(180, 453, 100, 20, ((Data.Item[1].Weight) / 1000).toFixed(3));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(180, 508, 60, 20, (Data.Item[1].Amount).toFixed(3));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(256, 450, 56, 20, (parseFloat(String(Data.Item[1].Weight)) / 1000 + parseFloat(String(Data.Item[0].Weight)) / 1000).toFixed(3));
      LODOP.ADD_PRINT_TEXT(256, 505, 60, 20, (parseFloat(String(Data.Item[1].Amount)) + parseFloat(String(Data.Item[0].Amount))).toFixed(3));
    } else {
      LODOP.ADD_PRINT_TEXT(156, 255, 100, 20, Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(156, 300, 135, 20, Data.Item[0].TitleEn);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(156, 453, 100, 20, (Weight / 1000).toFixed(3));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(156, 506, 60, 20, Amount.toFixed(3));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

      LODOP.ADD_PRINT_TEXT(256, 450, 56, 20, (Weight / 1000).toFixed(3));
      LODOP.ADD_PRINT_TEXT(256, 505, 60, 20, Amount.toFixed(3));
    }
    LODOP.ADD_PRINT_TEXT(122, 444, 69, 35, "(3)weight\r\n(in kg)重量");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(121, 499, 69, 35, "(5)Value(in\r\nUSD)价格");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_LINE(251, 239, 250, 556, 0, 1);
    LODOP.ADD_PRINT_LINE(274, 239, 273, 557, 0, 1);
    LODOP.ADD_PRINT_TEXT(276, 248, 316, 125, "I,the undersigned, whose name and address are given on the Itm, certify that the particulars given in this declaration are correct and that this Itm does not contain any dangerous articles or articles prohibited by legislations or by postalor customs regulations.我，签名者在此声明，上述清关用姓名及地址准确，该物品不含任 何违禁品、危险品及立法或海关、邮政部门明令禁止运输的违禁物品。\n日期与发件人姓名\n(15)Date and Sender's signature");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", -2);
    LODOP.ADD_PRINT_TEXT(349, 411, 100, 20, Data.From.SendUserName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(195, 251, 201, 56, "For commercial items only:if know HS  tariff  number(7)  and  country of origin of goods(8) 商业物品请填写HS编码和发货国家");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", -2);
    LODOP.ADD_PRINT_TEXT(198, 445, 63, 55, " (4)total weight in (kg)总重量");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(201, 502, 75, 52, " (6)total value (in USD)总价");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    LODOP.ADD_PRINT_TEXT(337, 15, 24, 33, "R");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 16);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(338, 57, 26, 25, "D");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 16);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_IMAGE(337, 31, 22, 23, "<img src='/static/images/Recycle.png' width='20'>");
    LODOP.ADD_PRINT_IMAGE(336, 73, 25, 22, "<img src='/static/images/WEEElogo3.png' width='20'>");
    LODOP.ADD_PRINT_TEXT(326, 100, 61, 55, "Signature required\r\n需要签名");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(241, 154, 91, 25, "LATVIA");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.SET_PRINT_STYLEA(0, "Angle", 90);
    LODOP.ADD_PRINT_IMAGE(330, 169, 69, 46, "<img src='/static/images/JCEX-logo.png' width='60'>");
    LODOP.ADD_PRINT_RECT(332, 14, 40, 29, 0, 1);
    LODOP.ADD_PRINT_RECT(332, 57, 40, 29, 0, 1);
    LODOP.PRINT();
  },
  // ABLE贯达-拉脱维亚邮政简易挂号渠道面单  **梁炜珍**
  '1821': function(Data:Interface.PrintData) {
    var localData = {
      ToAddress: Data.To.BuyerFullName + '\n\n' + Data.To.BuyerStreet1 + " " + Data.To.BuyerStreet2 + "\n\n" + Data.To.BuyerCity + " " + Data.To.BuyerState + "\n\n" + Data.To.Country.CountryName + '\n' + Data.To.BuyerZipCode + '\n' + Data.To.BuyerPhone
    }
    var Quantity = 0;
    var Weight = 0;
    var Amount = 0;
    for (let Itm of Data.Item) {
      Quantity += parseFloat(String(Itm.Quantity));
      Weight += parseFloat(String(Itm.Weight));
      Amount += parseFloat(String(Itm.Amount));
    }
    LODOP.PRINT_INITA("0mm", "0mm", '150mm', '100mm', "面单-睿振行-皇家邮政挂号渠道");

    LODOP.SET_PRINT_PAGESIZE(1, 1500, 1000, "面单-睿振行-皇家邮政挂号渠道");

    LODOP.ADD_PRINT_RECT(10, 10, "14.6cm", "9.599cm", 0, 1);
    LODOP.ADD_PRINT_TEXT(19, 19, 62, 49, "FROM\n发件人");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT(15, 243, 183, 20, "CUSTOMS DECLARATION");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(16, 84, 153, 56, "P.O.BOX 120\n1044 Marupe\nLATVIA ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(30, 243, 137, 26, "Designated operator ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT(31, 386, 100, 25, "Latvijias Pasts");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(19, 497, 70, 30, "CN22");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(50, 503, 50, 25, "SRM");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(48, 243, 168, 23, "拉脱维亚邮政   海关清关单");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_LINE(72, 11, 71, 530, 0, 1);
    LODOP.ADD_PRINT_LINE(373, 154, 71, 155, 0, 1);
    LODOP.ADD_PRINT_LINE(320, 11, 319, 154, 0, 1);
    LODOP.ADD_PRINT_TEXT(87, 23, 100, 20, "TO  收件人");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT(117, 21, 134, 200, localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_RECT(71, 239, 317, 295, 0, 1);
    LODOP.ADD_PRINT_LINE(114, 240, 113, 556, 0, 1);
    LODOP.ADD_PRINT_LINE(112, 264, 70, 265, 0, 1);
    LODOP.ADD_PRINT_LINE(113, 357, 71, 358, 0, 1);
    LODOP.ADD_PRINT_LINE(113, 381, 71, 382, 0, 1);
    LODOP.ADD_PRINT_LINE(93, 240, 92, 263, 0, 1);
    LODOP.ADD_PRINT_LINE(91, 358, 92, 382, 0, 1);
    LODOP.ADD_PRINT_TEXT(76, 271, 94, 42, "Gift 礼物\r\nDocuments 文件");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(79, 384, 160, 20, "Commercial sample 商业样品");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(94, 361, 21, 20, "√");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(98, 383, 70, 24, "Other 其他");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(99, 446, 114, 20, "Tick one or more boxes");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_BARCODE(114, 178, 56, 217, "128Auto", Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "Angle", -90);
    LODOP.ADD_PRINT_LINE(149, 240, 148, 555, 0, 1);
    LODOP.ADD_PRINT_TEXT(120, 239, 221, 42, "(1)Quantity (2)and detailed description of content     商品名称和件数");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_LINE(273, 442, 114, 443, 0, 1);
    LODOP.ADD_PRINT_LINE(272, 499, 113, 500, 0, 1);
    LODOP.ADD_PRINT_LINE(171, 239, 170, 556, 0, 1);
    LODOP.ADD_PRINT_LINE(194, 240, 193, 556, 0, 1);

    if (Data.Item.length == 2) {
      LODOP.ADD_PRINT_TEXT(180, 255, 44, 20, Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(180, 300, 135, 20, Data.Item[1].TitleEn);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(180, 453, 100, 20, ((Data.Item[1].Weight) / 1000).toFixed(3));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(180, 508, 60, 20, (Data.Item[1].Amount).toFixed(3));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(256, 450, 56, 20, (parseFloat(String(Data.Item[1].Weight)) / 1000 + parseFloat(String(Data.Item[0].Weight)) / 1000).toFixed(3));
      LODOP.ADD_PRINT_TEXT(256, 505, 60, 20, (parseFloat(String(Data.Item[1].Amount)) + parseFloat(String(Data.Item[0].Amount))).toFixed(3));
    } else {
      LODOP.ADD_PRINT_TEXT(156, 255, 100, 20, Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(156, 300, 135, 20, Data.Item[0].TitleEn);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(156, 453, 100, 20, (Weight / 1000).toFixed(3));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(156, 506, 60, 20, Amount.toFixed(3));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

      LODOP.ADD_PRINT_TEXT(256, 450, 56, 20, (Weight / 1000).toFixed(3));
      LODOP.ADD_PRINT_TEXT(256, 505, 60, 20, Amount.toFixed(3));
    }
    LODOP.ADD_PRINT_TEXT(122, 444, 69, 35, "(3)weight\r\n(in kg)重量");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(121, 499, 69, 35, "(5)Value(in\r\nUSD)价格");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_LINE(251, 239, 250, 556, 0, 1);
    LODOP.ADD_PRINT_LINE(274, 239, 273, 557, 0, 1);

    LODOP.ADD_PRINT_TEXT(276, 248, 316, 125, "I,the undersigned, whose name and address are given on the Itm, certify that the particulars given in this declaration are correct and that this Itm does not contain any dangerous articles or articles prohibited by legislations or by postalor customs regulations.我，签名者在此声明，上述清关用姓名及地址准确，该物品不含任 何违禁品、危险品及立法或海关、邮政部门明令禁止运输的违禁物品。\n日期与发件人姓名\n(15)Date and Sender's signature");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", -2);
    LODOP.ADD_PRINT_TEXT(349, 411, 100, 20, Data.From.SendUserName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(195, 251, 201, 56, "For commercial items only:if know HS  tariff  number(7)  and  country of origin of goods(8) 商业物品请填写HS编码和发货国家");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", -2);
    LODOP.ADD_PRINT_TEXT(198, 445, 63, 55, " (4)total weight in (kg)总重量");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(201, 502, 75, 52, " (6)total value (in USD)总价");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    LODOP.ADD_PRINT_TEXT(337, 15, 24, 33, "R");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 16);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(338, 57, 26, 25, "D");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 16);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_IMAGE(337, 31, 22, 23, "<img src='/static/images/Recycle.png' width='20'>");
    LODOP.ADD_PRINT_IMAGE(336, 73, 25, 22, "<img src='/static/images/WEEElogo3.png' width='20'>");
    LODOP.ADD_PRINT_TEXT(326, 100, 61, 55, "Signature required\r\n需要签名");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(81, 185, 64, 30, "SRM");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 16);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(241, 155, 91, 25, "LATVIA");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.SET_PRINT_STYLEA(0, "Angle", 90);
    LODOP.ADD_PRINT_IMAGE(330, 169, 69, 46, "<img src='/static/images/JCEX-logo.png' width='60'>");
    LODOP.ADD_PRINT_RECT(332, 14, 40, 29, 0, 1);
    LODOP.ADD_PRINT_RECT(332, 57, 40, 29, 0, 1);
    LODOP.PRINT();
  },
  // 睿振行-皇家邮政挂号渠道面单  **梁炜珍**
  '1822': function(Data:Interface.PrintData) {
    var localData = {
      ToAddress: (Data.To.BuyerFullName + "\n" + Data.To.BuyerStreet1 + " " + Data.To.BuyerStreet2 + "\n\n\n" + Data.To.BuyerCity + " " + Data.To.BuyerState + " " + Data.To.Country.CountryName + "\n" + Data.To.BuyerZipCode).toLocaleUpperCase()
    }
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '150mm', "面单-睿振行-皇家邮政挂号渠道");

    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1500, "面单-睿振行-皇家邮政挂号渠道");
    LODOP.ADD_PRINT_RECT(10, 10, 359, 548, 0, 1);
    LODOP.ADD_PRINT_IMAGE(51, 23, 170, 60, "<img src='/static/images/tracked48.png' width='160'>");
    LODOP.ADD_PRINT_IMAGE(19, 247, 120, 100, "<img src='/static/images/RoyalMail.png' width='100'>");
    LODOP.ADD_PRINT_LINE(115, 10, 116, 369, 0, 1);
    LODOP.ADD_PRINT_BARCODE(160, 181, 180, 66, "128Auto", Data.TrackingNumber);
    LODOP.ADD_PRINT_LINE(251, 10, 250, 369, 0, 1);
    LODOP.ADD_PRINT_TEXT(280, 22, 280, 106, localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 9);
    LODOP.ADD_PRINT_TEXT(406, 275, 158, 64, "RETURN TO: GB FOODS LTD, 1 LAUNCESTON ROAD, WIGSTON, LE18 2GZ, GB");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Angle", 90);
    LODOP.ADD_PRINT_LINE(411, 10, 410, 369, 0, 1);
    LODOP.ADD_PRINT_LINE(444, 10, 443, 369, 0, 1);
    LODOP.ADD_PRINT_TEXT(464, 37, 187, 66, "Sender's reference:\n" + Data.OrderCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.PRINT();
  },
  // 佛山邮政小包平邮渠道 原渠道代码05 变更为004  /*何晓欣*/
  '004': function(Data:Interface.PrintData) {
    this.printFSPostalMails(Data, '004');
  },
  // 佛山邮政小包平邮渠道面单 **何晓欣**
  '05': function(Data:Interface.PrintData) {
    this.printFSPostalMails(Data, '05');
  },
  // mc-MethodCode 05/004-佛山邮政小包平邮  380-vova线上-中国邮政平邮
  printFSPostalMails(Data:Interface.PrintData, mc:string) {
    // LogisticsExt转换为JSON
    if (Data.LogisticsExt != '' && typeof Data.LogisticsExt === 'string') {
      Data.LogisticsExt = JSON.parse(Data.LogisticsExt)
    }
    var date = new Date();
    // 获取中国邮政平邮分区号
    var areaCode = this.getMailAreaCode(Data.To.Country.CountryCode);
    var localData = {
      ToAddress: Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == "" ? '' : ',' + Data.To.BuyerStreet2) + "\n" + Data.To.BuyerCity + (Data.To.BuyerState == '' ? '' : ',' + Data.To.BuyerState) + "\n" + Data.To.Country.CountryName + ' ' + areaCode + ' ' + Data.To.Country.CountryNameCn,
      FromAddress: (Data.From.Street2 == '' ? '' : Data.From.Street2 + ',') + Data.From.Street1 + "\n" + Data.From.City + "," + Data.From.SateOrProvince + ',' + Data.From.Country.CountryName.toUpperCase(),
      PrintDate: this.getPrintDate(),
      totalQty: 0,
      totalWeight: 0,
      totalValue: 0
    }
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-佛山邮政小包平邮渠道面单");

    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-佛山邮政小包平邮渠道面单");

    LODOP.ADD_PRINT_LINE("57.71mm", "2.65mm", "57.71mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("16.64mm", "40.75mm", "16.64mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("44mm", "40.69mm", "16.7mm", "40.69mm", 0, 1);
    LODOP.ADD_PRINT_LINE("36.2mm", "2.91mm", "36.2mm", "40.72mm", 0, 1);
    LODOP.ADD_PRINT_LINE("30.69mm", "2.91mm", "30.69mm", "40.72mm", 0, 1);
    LODOP.ADD_PRINT_LINE("80.41mm", "2.65mm", "80.41mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("79.88mm", "7.7mm", "57.39mm", "7.7mm", 0, 1);
    LODOP.ADD_PRINT_LINE("79.88mm", "14.29mm", "57.39mm", "14.29mm", 0, 1);
    LODOP.ADD_PRINT_LINE("79.88mm", "80.99mm", "57.39mm", "80.99mm", 0, 1);
    LODOP.ADD_PRINT_LINE("79.88mm", "57.2mm", "57.39mm", "57.2mm", 0, 1);
    LODOP.ADD_PRINT_LINE("79.88mm", "67.71mm", "57.39mm", "67.71mm", 0, 1);
    LODOP.ADD_PRINT_RECT("2.65mm", "2.65mm", "95.01mm", "95.01mm", 0, 1);
    LODOP.ADD_PRINT_LINE("62.39mm", "2.65mm", "62.39mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("43.89mm", "2.65mm", "43.89mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("16.64mm", "77.5mm", "2.65mm", "77.5mm", 0, 1);
    LODOP.ADD_PRINT_LINE("16.64mm", "63.79mm", "2.65mm", "63.79mm", 0, 1);
    LODOP.ADD_PRINT_LINE("75.7mm", "2.65mm", "75.7mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("66.68mm", "2.65mm", "66.41mm", "97.9mm", 0, 1);

    LODOP.ADD_PRINT_TEXT("80.7mm", "3.97mm", "96.84mm", "11.11mm", "I certify the particulars given in this customs declaration are correct.This Itm does not contain any dangerous article, or articles prohibitedby legislation or by postal or customs regulations. I have met allapplicable export filing requirements under the Foreign Trade Regulations");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("94.46mm", "3.7mm", "75.29mm", "5.29mm", "Sender's Signature & Date Signed: " + MdPrint.getChinaPostFlag(mc));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("91.28mm", "82.55mm", "15.88mm", "5.29mm", "CN22");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);

    LODOP.ADD_PRINT_IMAGE("4.5mm", "4.23mm", "29.1mm", "8.73mm", "<img src='/static/images/中国邮政logo.png' width='107'>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);

    LODOP.ADD_PRINT_TEXT("8.47mm", "35.19mm", "30.69mm", "5.29mm", "Small Packet BY AIR");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("8.2mm", "77.52mm", "21.17mm", "5.29mm", localData.PrintDate);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT("8.2mm", "64.82mm", "11.91mm", "5.29mm", this.getChinaPostLM(Data.To.Country.CountryCode));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT("32.28mm", "3.97mm", "35.98mm", "4.23mm", "untracked自编号：");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("37.57mm", "3.97mm", "26.46mm", "3.97mm", "退件单位：");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("48.68mm", "11.91mm", "26.46mm", "5.29mm", "untracked");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_BARCODE("44.98mm", "44.19mm", "47.36mm", "11.91mm", "128Auto", Data.TrackingNumber);

    LODOP.ADD_PRINT_TEXT("17.73mm", "42.6mm", "14.82mm", "4.76mm", "Ship To: ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("17.73mm", "55.3mm", "26.46mm", "4.76mm", Data.To.BuyerFullName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("21.17mm", "42.6mm", "54.24mm", "18.26mm", localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT("35.19mm", "42.6mm", "9mm", "3.18mm", "ZIP: ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("35.19mm", "49.74mm", "26.46mm", "3.18mm", Data.To.BuyerZipCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("37.84mm", "42.6mm", "9mm", "3.7mm", "TEL: ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("37.84mm", "50.27mm", "26.46mm", "3.7mm", Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    // 巴西渠道增加税号;
    // 佛山邮政小包-平邮，ApiType=9，渠道代码004
    // Vova线上-中国邮政平常小包，ApiType=24，渠道代码380
    if( Data.To.BuyerCountry=='BR' && (Data.MethodApiType==9||Data.MethodApiType==24) && (Data.MethodCode=='004'||Data.MethodCode=='380') ){
      LODOP.ADD_PRINT_TEXT("40.48mm", "42.6mm", "11.91mm", "3.97mm", "TAX ID: ");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
      LODOP.ADD_PRINT_TEXT("40.48mm", "53.98mm", "73.01mm", "3.97mm", (Data.LogisticsExt.TaxNumber?Data.LogisticsExt.TaxNumber:''));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    }

    if(Data.LogisticsExt.NorwayVatNumber && (Data.MethodApiType==9||Data.MethodApiType==24) && (Data.MethodCode=='004'||Data.MethodCode=='380') ){
      let s = Data.LogisticsExt.NorwayVatNumber.substring(0,1) + "*****" + Data.LogisticsExt.NorwayVatNumber.substring(6)
      LODOP.ADD_PRINT_TEXT("24.6mm","3.97mm","41.8mm","5.29mm",`VAT No: VOEC ${s}`);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    }

    LODOP.ADD_PRINT_TEXT("14.55mm", "3.97mm", "12.44mm", "3.7mm", "FROM:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("14.55mm", "14.55mm", "29.1mm", "3.7mm", Data.From.SendUserName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("17.2mm", "3.97mm", "38.1mm", "10.85mm", localData.FromAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("27.78mm", "3.97mm", "13.23mm", "3.7mm", "PHONE:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("27.78mm", "15.88mm", "29.37mm", "3.7mm", Data.From.Phone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT("59.27mm", "3.44mm", "7.67mm", "6.61mm", "No");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("59.27mm", "8.73mm", "7.41mm", "6.61mm", "Qty");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("59.27mm", "15.88mm", "36.51mm", "6.61mm", "Description of Contents");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("59.27mm", "60.33mm", "6.88mm", "6.61mm", "Kg.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("59.27mm", "69.59mm", "14.02mm", "6.61mm", "Val(US$)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("59.27mm", "83.61mm", "18.52mm", "6.61mm", "Good Origin");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("76.99mm", "15.88mm", "38.36mm", "5.29mm", "Total Gross Weight(kg.)：");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT("63.5mm", "3.7mm", "7.41mm", "5.29mm", "1\r\n");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("63.5mm", "9.26mm", "7.94mm", "5.29mm", Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("63.5mm", "15.88mm", "44.45mm", "5.29mm", Data.Item[0].TitleEn + Data.Item[0].Title + 'x' + Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("63.5mm", "59mm", "12.17mm", "5.29mm", Number((Data.Item[0].Weight / 1000).toFixed(3)) * Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("63.5mm", "73.03mm", "12.7mm", "5.29mm", (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("63.5mm", "87.05mm", "13.23mm", "5.29mm", "CN");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    if (Data.Item.length > 1) {
      // 第二行
      LODOP.ADD_PRINT_TEXT(256, 14, 28, 20, "2");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(256, 35, 29, 20, Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(256, 60, 168, 20, Data.Item[1].TitleEn + Data.Item[1].Title + 'x' + Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(256, 223, 47, 20, Number((Data.Item[1].Weight / 1000).toFixed(3)) * Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(256, 276, 49, 20, (Data.Item[1].Amount * Data.Item[1].Quantity).toFixed(2));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(256, 329, 47, 20, "CN");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

      LODOP.ADD_PRINT_LINE(270, 11, 269, 371, 0, 1);

      if (Data.Item.length > 2) {
        // 第三行
        LODOP.ADD_PRINT_TEXT(275, 14, 28, 20, "3");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.ADD_PRINT_TEXT(275, 35, 29, 20, Data.Item[2].Quantity);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.ADD_PRINT_TEXT(275, 60, 168, 20, Data.Item[2].TitleEn + Data.Item[2].Title + 'x' + Data.Item[2].Quantity);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.ADD_PRINT_TEXT(275, 223, 47, 20, Number((Data.Item[2].Weight / 1000).toFixed(3)) * Data.Item[2].Quantity);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.ADD_PRINT_TEXT(275, 276, 49, 20, (Data.Item[2].Amount * Data.Item[2].Quantity).toFixed(2));
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.ADD_PRINT_TEXT(275, 329, 47, 20, "CN");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

        localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 3)
        localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 3)
        localData.totalValue = this.printTotalData(Data.Item, 'Amount', 3)
      } else {
        localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 2)
        localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 2)
        localData.totalValue = this.printTotalData(Data.Item, 'Amount', 2)
      }
    } else {
      localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 1)
      localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 1)
      localData.totalValue = this.printTotalData(Data.Item, 'Amount', 1)
    }

    // SKU表格统计
    LODOP.ADD_PRINT_TEXT("77.26mm", "9.26mm", "6.88mm", "5.29mm", localData.totalQty);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("77.26mm", "59mm", "8.73mm", "5.29mm", (localData.totalWeight / 1000).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("77.26mm", "73.29mm", "9.79mm", "5.29mm", localData.totalValue.toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    // LODOP.PRINT_DESIGN();
    LODOP.PRINT();
  },

  // 佛山邮政小包挂号渠道面单 原渠道代码04 变更为002 /*何晓欣*/
  '002': function(Data:Interface.PrintData, mc: string|number) {
    this.printFSPostRegistered(Data, mc || '002');
  },

  // 佛山邮政小包挂号渠道面单 **何晓欣**
  '04': function(Data:Interface.PrintData, mc:string|number) {
    this.printFSPostRegistered(Data, mc || '04');
  },

  // mc-MethodCode  04/002-佛山邮政小包挂号  379-vova线上-中国邮政挂号小包
  printFSPostRegistered(Data:Interface.PrintData, mc:string|number) {
    // LogisticsExt转换为JSON
    if (Data.LogisticsExt != '' && typeof Data.LogisticsExt === 'string') {
      Data.LogisticsExt = JSON.parse(Data.LogisticsExt)
    }
    var date = new Date();
    // 获取挂号小包分区号
    var areaCode = this.getRegisterAreaCode(Data.To.Country.CountryCode);
    var localData = {
      ToAddress: Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == '' ? '' : ',' + Data.To.BuyerStreet2) + "\n" + Data.To.BuyerCity + "\n" + (Data.To.BuyerState == '' ? '' : Data.To.BuyerState + '\n') + Data.To.Country.CountryName + ' ' + areaCode + ' ' + Data.To.Country.CountryNameCn,
      FromAddress: (Data.From.Street2 == "" ? '' : Data.From.Street2 + ',') + Data.From.Street1 + "\n" + Data.From.City + " " + Data.From.SateOrProvince + "\n" + Data.From.Country.CountryName.toUpperCase(),
      PrintDate: this.getPrintDate(),
      totalQty: 0,
      totalWeight: 0,
      totalValue: 0
    }
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-佛山邮政小包挂号渠道面单");

    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-佛山邮政小包挂号渠道面单");
    // 表格模板
    LODOP.ADD_PRINT_LINE("55.3mm", "2.65mm", "55.3mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("22.54mm", "40.75mm", "22.54mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("54.98mm", "40.69mm", "22.49mm", "40.69mm", 0, 1);
    LODOP.ADD_PRINT_LINE("47.6mm", "2.91mm", "47.6mm", "40.72mm", 0, 1);
    LODOP.ADD_PRINT_LINE("42.1mm", "2.91mm", "42.1mm", "40.72mm", 0, 1);
    LODOP.ADD_PRINT_LINE("80.41mm", "2.91mm", "80.41mm", "98.16mm", 0, 1);
    LODOP.ADD_PRINT_LINE("80.12mm", "7.7mm", "55.01mm", "7.7mm", 0, 1);
    LODOP.ADD_PRINT_LINE("80.12mm", "14.29mm", "55.01mm", "14.29mm", 0, 1);
    LODOP.ADD_PRINT_LINE("80.12mm", "80.99mm", "55.01mm", "80.99mm", 0, 1);
    LODOP.ADD_PRINT_LINE("80.12mm", "57.2mm", "55.01mm", "57.2mm", 0, 1);
    LODOP.ADD_PRINT_LINE("80.12mm", "67.71mm", "55.01mm", "67.71mm", 0, 1);
    LODOP.ADD_PRINT_RECT("2.65mm", "2.65mm", "95.01mm", "95.01mm", 0, 1);
    LODOP.ADD_PRINT_LINE("60.09mm", "2.38mm", "60.09mm", "97.63mm", 0, 1);
    LODOP.ADD_PRINT_LINE("75.41mm", "2.65mm", "75.41mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("65.09mm", "2.65mm", "65.09mm", "97.9mm", 0, 1);

    LODOP.ADD_PRINT_TEXT("80.7mm", "3.97mm", "96.84mm", "11.11mm", "I certify the particulars given in this customs declaration are correct.This Itm does not contain any dangerous article, or articles prohibitedby legislation or by postal or customs regulations. I have met allapplicable export filing requirements under the Foreign Trade Regulations");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("94.46mm", "3.7mm", "75.55mm", "5.29mm", "Sender's Signature & Date Signed: " + MdPrint.getChinaPostFlag(mc));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("91.55mm", "82.55mm", "15.88mm", "5.29mm", "CN22");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);

    LODOP.ADD_PRINT_BARCODE("3.97mm", "46.63mm", "50.27mm", "14.55mm", "128Auto", Data.TrackingNumber);
    LODOP.ADD_PRINT_IMAGE("3.18mm", "5.82mm", "29.1mm", "8.73mm", "<img src='/static/images/中国邮政logo.png' width='107'>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_TEXT("10.85mm", "6.09mm", "33.07mm", "5.29mm", "Small Packet BY AIR");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontColor", "#808080");

    LODOP.ADD_PRINT_TEXT("18.79mm", "82.02mm", "19.84mm", "3.97mm", localData.PrintDate);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    LODOP.ADD_PRINT_TEXT("23.81mm", "42.6mm", "14.82mm", "4.76mm", "Ship To: ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("23.81mm", "55.3mm", "52.92mm", "4.76mm", Data.To.BuyerFullName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("26.99mm", "42.6mm", "54.24mm", "18.26mm", localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("45.77mm", "42.6mm", "9mm", "3.18mm", "ZIP: ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("45.77mm", "49.74mm", "26.46mm", "3.18mm", Data.To.BuyerZipCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("48.68mm", "42.6mm", "9mm", "3.7mm", "TEL: ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("48.68mm", "50.27mm", "26.46mm", "3.7mm", Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    // 巴西渠道增加税号
    // 佛山邮政小包-挂号，ApiType=9，渠道代码002
    // Vova线上-中国邮政挂号小包，ApiType=24，渠道代码379
    if( Data.To.BuyerCountry== 'BR' && (Data.MethodApiType==9||Data.MethodApiType==24) && (Data.MethodCode=='002'||Data.MethodCode=='379')){
      LODOP.ADD_PRINT_TEXT("51.33mm","42.6mm","11.64mm","3.7mm","TAX ID:");
      LODOP.SET_PRINT_STYLEA(0,"FontName","Arial");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
      LODOP.SET_PRINT_STYLEA(0,"Bold",1);
      LODOP.ADD_PRINT_TEXT("51.33mm","53.18mm","73.06mm","3.7mm", (Data.LogisticsExt.TaxNumber?Data.LogisticsExt.TaxNumber:''));
      LODOP.SET_PRINT_STYLEA(0,"FontName","Arial");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
    }
    console.log(Data.LogisticsExt.NorwayVatNumber)
    if(Data.LogisticsExt.NorwayVatNumber && (Data.MethodApiType==9||Data.MethodApiType==24) && (Data.MethodCode=='002'||Data.MethodCode=='379')){
      let s = Data.LogisticsExt.NorwayVatNumber.substring(0,1) + "*****" + Data.LogisticsExt.NorwayVatNumber.substring(6)
      LODOP.ADD_PRINT_TEXT("35.98mm","3.97mm","39.69mm","5.29mm",`VAT No: VOEC ${s}`);
      LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
    }

    LODOP.ADD_PRINT_TEXT("43.92mm", "3.97mm", "38.1mm", "3.97mm", "untracked自编号：");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("48.68mm", "3.97mm", "37.04mm", "8.2mm", "退件单位：佛山市邮政局函件集邮局");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT("23.02mm", "3.97mm", "12.44mm", "3.7mm", "FROM:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("23.02mm", "14.55mm", "29.1mm", "3.7mm", Data.From.SendUserName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("26.46mm", "3.97mm", "38.1mm", "10.85mm", localData.FromAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("39.16mm", "3.97mm", "8.73mm", "3.7mm", "TEL:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("39.16mm", "10.85mm", "29.37mm", "3.7mm", Data.From.Phone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_RECT("15.08mm", "16.4mm", "13.23mm", "5.29mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("15.35mm", "17.73mm", "14.29mm", "3.7mm", this.getChinaPostLM(Data.To.Country.CountryCode));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_TEXT("56.62mm", "3.44mm", "7.67mm", "6.61mm", "No");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("56.62mm", "9mm", "7.41mm", "6.61mm", "Qty");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("56.62mm", "15.88mm", "36.51mm", "6.61mm", "Description of Contents");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("56.62mm", "60.59mm", "6.88mm", "6.61mm", "Kg.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("56.62mm", "69.59mm", "14.02mm", "6.61mm", "Val(US$)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("56.62mm", "83.61mm", "18.52mm", "6.61mm", "Good Origin");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("76.73mm", "15.88mm", "38.36mm", "5.29mm", "Total Gross Weight(kg.)：");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT("61.38mm", "3.97mm", "7.41mm", "5.29mm", "1\r\n");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("61.38mm", "9.79mm", "7.94mm", "5.29mm", Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("61.38mm", "15.88mm", "44.45mm", "5.29mm", Data.Item[0].TitleEn + Data.Item[0].Title + 'x' + Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("61.38mm", "59.53mm", "12.17mm", "5.29mm", ((Data.Item[0].Weight / 1000) * Data.Item[0].Quantity).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("61.38mm", "73.29mm", "12.7mm", "5.29mm", (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("61.38mm", "88.11mm", "13.23mm", "5.29mm", "CN");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    if (Data.Item.length > 1) {
      LODOP.ADD_PRINT_TEXT(251, 15, 28, 20, "2");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(251, 37, 29, 20, Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(251, 60, 168, 20, Data.Item[1].TitleEn + Data.Item[1].Title + 'x' + Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(251, 225, 47, 20, ((Data.Item[1].Weight / 1000) * Data.Item[1].Quantity).toFixed(3));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(251, 277, 49, 20, (Data.Item[1].Amount * Data.Item[1].Quantity).toFixed(2));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(251, 333, 47, 20, "CN");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

      LODOP.ADD_PRINT_LINE(266, 11, 265, 371, 0, 1);

      if (Data.Item.length > 2) {
        LODOP.ADD_PRINT_TEXT(271, 15, 17, 14, "3");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.ADD_PRINT_TEXT(271, 37, 29, 20, Data.Item[2].Quantity);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.ADD_PRINT_TEXT(271, 60, 168, 20, Data.Item[2].TitleEn + Data.Item[2].Title + 'x' + Data.Item[2].Quantity);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.ADD_PRINT_TEXT(271, 225, 47, 20, ((Data.Item[2].Weight / 1000) * Data.Item[2].Quantity).toFixed(3));
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.ADD_PRINT_TEXT(271, 277, 49, 20, (Data.Item[2].Amount * Data.Item[2].Quantity).toFixed(2));
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.ADD_PRINT_TEXT(271, 333, 47, 20, "CN");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

        localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 3)
        localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 3)
        localData.totalValue = this.printTotalData(Data.Item, 'Amount', 3)
      } else {
        localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 2)
        localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 2)
        localData.totalValue = this.printTotalData(Data.Item, 'Amount', 2)
      }

    } else {
      localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 1)
      localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 1)
      localData.totalValue = this.printTotalData(Data.Item, 'Amount', 1)
    }

    // SKU表格统计
    LODOP.ADD_PRINT_TEXT("76.99mm", "9.53mm", "6.88mm", "5.29mm", localData.totalQty);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("76.99mm", "59.53mm", "8.73mm", "5.29mm", (localData.totalWeight / 1000).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("76.99mm", "73.29mm", "9.79mm", "5.29mm", localData.totalValue.toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.PRINT();
    // LODOP.PRINT_DESIGN();
  },

  // 万邑通-线上中国邮政平常小包+（深圳）（广州ISP仓）渠道面单 **何晓欣**
  'ISP031279*YW10000009': function(Data:Interface.PrintData) {
    // 分区码  && 加拿大的互换局编码
    var areaCode, exchangeCode;
    areaCode = this.getMailAreaCode(Data.To.Country.CountryCode);
    if (Data.To.Country.CountryCode === 'CA') {
      var zipCodeHead = Data.To.BuyerZipCode.slice(0, 1).toLowerCase();
      if (zipCodeHead === 's' || zipCodeHead === 't' || zipCodeHead === 'v' || zipCodeHead === 'x' || zipCodeHead === 'y') {
        exchangeCode = '1';
      } else {
        exchangeCode = '2'
      }
    } else {
      exchangeCode = ''
    }
    var date = new Date();
    var localData = {
      ToAddress: Data.To.BuyerFullName + "\n" + Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == "" ? '' : ',' + Data.To.BuyerStreet2) + "\n" + Data.To.BuyerCity + (Data.To.BuyerState == '' ? '' : ',' + Data.To.BuyerState) + "\n" + Data.To.BuyerZipCode + ',' + Data.To.Country.CountryName + '\r\n' + areaCode + ' ' + Data.To.Country.CountryNameCn + ' ' + exchangeCode + '\nPhone: ' + Data.To.BuyerPhone,
      ReturnAddress: '深圳大宗邮件处理中心',
      FromAddress: "From:1000037\r\n" + Data.From.SendUserName + "\r\n" + (Data.From.Street2 == '' ? '' : Data.From.Street2 + ',') + Data.From.Street1 + "," + Data.From.City + "," + Data.From.SateOrProvince + ',' + Data.From.ZipCode + ',' + Data.From.Country.CountryName + "\r\nPhone: " + Data.From.Phone,

    }
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-万邑通-线上中国邮政平常小包+（深圳）（广州ISP仓）渠道");


    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-万邑通-线上中国邮政平常小包+（深圳）（广州ISP仓）渠道");
    // 表格模板
    LODOP.ADD_PRINT_RECT("2.65mm", "2.65mm", "95.01mm", "95.01mm", 0, 1);
    LODOP.ADD_PRINT_LINE("39.42mm", "2.91mm", "39.42mm", "40.75mm", 0, 1);
    LODOP.ADD_PRINT_LINE("15.88mm", "2.65mm", "15.88mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("47.89mm", "40.75mm", "15.61mm", "40.75mm", 0, 1);
    LODOP.ADD_PRINT_LINE("47.63mm", "2.65mm", "47.63mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("33.6mm", "2.91mm", "33.6mm", "40.75mm", 0, 1);
    LODOP.ADD_PRINT_LINE("80.43mm", "2.65mm", "80.43mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("80.17mm", "54.77mm", "62.71mm", "54.77mm", 0, 1);
    LODOP.ADD_PRINT_LINE("80.17mm", "76.46mm", "62.71mm", "76.46mm", 0, 1);
    LODOP.ADD_PRINT_LINE("62.97mm", "2.65mm", "62.97mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("74.88mm", "2.65mm", "74.88mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("15.61mm", "81.49mm", "2.65mm", "81.49mm", 0, 1);
    LODOP.ADD_PRINT_LINE("15.61mm", "65.35mm", "2.65mm", "65.35mm", 0, 1);
    LODOP.ADD_PRINT_LINE("68.79mm", "2.65mm", "68.79mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("92.34mm", "73.55mm", "92.34mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("97.9mm", "73.55mm", "92.08mm", "73.55mm", 0, 1);

    LODOP.ADD_PRINT_TEXT("80.5mm", "3.97mm", "96.84mm", "11.11mm", "I certify the particulars given in this customs declaration are correct.This Itm does not contain any dangerous article, or articles prohibitedby legislation or by postal or customs regulations. I have met allapplicable export filing requirements under the Foreign Trade Regulations");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("93.66mm", "3.44mm", "59.53mm", "5.29mm", "Sender's Signature & Date Signed:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("93.4mm", "77.26mm", "22.49mm", "5.29mm", "CN22 已验视");

    LODOP.ADD_PRINT_TEXT("7.67mm", "68.26mm", "14.55mm", "5.29mm", this.getChinaPostLM(Data.To.Country.CountryCode));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("8.47mm", "35.98mm", "31.22mm", "5.29mm", "Small Packet BY AIR");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    LODOP.ADD_PRINT_IMAGE("5.29mm", "3.44mm", "29.1mm", "8.73mm", "<img src='/static/images/中国邮政logo.png' width='107'>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_IMAGE("3.7mm", "83.34mm", "10.58mm", "10.58mm", "<img src='/static/images/万邑通图标.png' width='40'>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_TEXT("12mm", "93mm", "7.14mm", "3.97mm", "SZ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");

    LODOP.ADD_PRINT_TEXT("16.67mm", "3.18mm", "39.69mm", "19.05mm", localData.FromAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", "-1.06mm");
    LODOP.ADD_PRINT_TEXT("35.19mm", "4.23mm", "35.98mm", "3.97mm", "自编号：" + Data.OrderCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    LODOP.ADD_PRINT_TEXT("17.46mm", "42.86mm", "55.03mm", "26.46mm", "ShipTo：" + localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    LODOP.ADD_PRINT_TEXT("40.75mm", "3.97mm", "36.78mm", "6.61mm", "退件单位：" + localData.ReturnAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", "-0.53mm");

    LODOP.ADD_PRINT_TEXT("52.92mm", "14.02mm", "19.31mm", "5.29mm", "untracked");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_BARCODE("49.48mm", "46.57mm", "44.98mm", "11.64mm", "128Auto", Data.TrackingNumber);

    LODOP.ADD_PRINT_TEXT("64.82mm", "13.23mm", "37.57mm", "3.18mm", "Description of Content");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("64.82mm", "63.24mm", "7.94mm", "3.18mm", "kg.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("64.82mm", "81.76mm", "16.67mm", "3.18mm", "Val(US $)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("76.46mm", "4.23mm", "46.04mm", "3.18mm", "Total Gross Weight (Kg)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    LODOP.ADD_PRINT_TEXT("70.64mm", "4.23mm", "50.01mm", "3.18mm", Data.Item[0].TitleEn + Data.Item[0].Title + 'x' + Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("70.64mm", "61.91mm", "15.88mm", "3.18mm", Number((Data.Item[0].Weight / 1000).toFixed(3)) * Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("70.64mm", "85.46mm", "12.17mm", "3.18mm", (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    LODOP.ADD_PRINT_TEXT("76.46mm", "61.91mm", "15.88mm", "3.18mm", Number((Data.Item[0].Weight / 1000).toFixed(3)) * Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("76.46mm", "85.46mm", "12.17mm", "3.18mm", (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    LODOP.PRINT();
  },

  // wish邮-欧洲经济小包渠道面单  **何晓欣**
  '200-0': function(Data:Interface.PrintData) {
    var date = new Date();
    var localData = {
      ToAddress: Data.To.BuyerFullName + '\n' + Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == '' ? '' : +',' + Data.To.BuyerStreet2) + '\n' + Data.To.BuyerCity + (Data.To.BuyerState == "" ? '' : ',' + Data.To.BuyerState) + ',' + Data.To.BuyerZipCode,
      PrintDate: this.getPrintDate(),
    }
    // 无德国流向
    if (Data.To.Country.CountryCode === 'DE') {
      return;
    } else if (Data.To.Country.CountryCode === 'GB') {
      // 英国流向(GB)
      LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-wish邮欧洲经济小包渠道(英国)");
      LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-wish邮欧洲经济小包渠道(英国)");
      this.printWishEuropePostForGB(Data, localData);
    } else {
      // 法国或其他流向
      LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-wish邮欧洲经济小包渠道(法国)");
      LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-wish邮欧洲经济小包渠道(法国)");
      this.printWishEuropePostForFR(Data, localData);
      LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-wish邮欧洲经济小包渠道(法国) - 报关单");
      LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-wish邮欧洲经济小包渠道(法国) - 报关单");
      this.printWishEuropePostForFR_back(Data, localData);
    }
  },

  // wish邮 欧洲经济小包渠道面单(英国流向) **何晓欣**
  printWishEuropePostForGB(Data:Interface.PrintData, localData:any) {

    LODOP.ADD_PRINT_RECT("2.65mm", "2.65mm", "95.01mm", "95.01mm", 0, 1);
    LODOP.ADD_PRINT_RECT("5.82mm", "79.11mm", "17.2mm", "15.88mm", 0, 1);
    LODOP.ADD_PRINT_RECT("27.78mm", "5.29mm", "52.92mm", "66.68mm", 0, 2);
    LODOP.ADD_PRINT_RECT("27.78mm", "59mm", "37.31mm", "66.68mm", 0, 2);
    LODOP.ADD_PRINT_LINE("35.98mm", "5.56mm", "36.25mm", "57.94mm", 0, 2);
    LODOP.ADD_PRINT_LINE("41.54mm", "5.56mm", "41.8mm", "57.94mm", 0, 2);
    LODOP.ADD_PRINT_LINE("51.33mm", "5.56mm", "51.06mm", "57.94mm", 0, 2);
    LODOP.ADD_PRINT_LINE("58.47mm", "5.56mm", "58.74mm", "57.94mm", 0, 2);
    LODOP.ADD_PRINT_LINE("64.29mm", "5.56mm", "64.56mm", "57.94mm", 0, 2);
    LODOP.ADD_PRINT_LINE("71.7mm", "5.56mm", "71.97mm", "57.94mm", 0, 2);
    LODOP.ADD_PRINT_LINE("76.46mm", "5.56mm", "76.73mm", "57.94mm", 0, 2);
    LODOP.ADD_PRINT_LINE("89.16mm", "5.56mm", "89.43mm", "57.94mm", 0, 2);
    LODOP.ADD_PRINT_LINE("35.98mm", "24.08mm", "27.78mm", "24.34mm", 0, 2);
    LODOP.ADD_PRINT_LINE("35.98mm", "46.83mm", "27.78mm", "47.1mm", 0, 2);
    LODOP.ADD_PRINT_LINE("76.46mm", "32.81mm", "51.33mm", "33.07mm", 0, 2);
    LODOP.ADD_PRINT_LINE("76.46mm", "46.04mm", "51.33mm", "46.3mm", 0, 2);
    LODOP.ADD_PRINT_LINE("94.19mm", "32.81mm", "89.69mm", "33.07mm", 0, 2);
    LODOP.ADD_PRINT_LINE("27.78mm", "82.02mm", "36.25mm", "82.29mm", 0, 2);
    LODOP.ADD_PRINT_LINE("36.51mm", "82.29mm", "36.25mm", "95.78mm", 0, 2);

    LODOP.ADD_PRINT_TEXT("23.81mm", "80.43mm", "19.31mm", "3.7mm", "UNTRACK");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_BARCODE("6.09mm", "18.52mm", "58.74mm", "19.84mm", "128Auto", Data.TrackingNumber);
    LODOP.ADD_PRINT_IMAGE("21.17mm", "4.76mm", "6.61mm", "6.61mm", "<img src='/static/images/欧洲经济小包英国向.png' width='25'>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_TEXT("8.47mm", "84.4mm", "10.32mm", "12.44mm", "PP\r\nTR");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", "-2.12mm");

    LODOP.ADD_PRINT_TEXT("29.37mm", "6.35mm", "19.84mm", "5.29mm", "CUSTOMS\r\nDECLARATION");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", "-0.26mm");
    LODOP.ADD_PRINT_TEXT("29.37mm", "25.14mm", "22.23mm", "6.61mm", "May be Opened Offically");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", "-0.26mm");
    LODOP.ADD_PRINT_TEXT("30.96mm", "49.21mm", "9mm", "3.97mm", "CN22");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("37.84mm", "6.35mm", "26.46mm", "3.97mm", "OOERATION: TR");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_RECT("42.86mm", "7.41mm", "2.65mm", "2.65mm", 0, 1);
    LODOP.ADD_PRINT_RECT("47.1mm", "7.41mm", "2.65mm", "2.65mm", 0, 1);
    LODOP.ADD_PRINT_RECT("42.86mm", "24.08mm", "2.65mm", "2.65mm", 0, 1);
    LODOP.ADD_PRINT_RECT("47.1mm", "24.08mm", "2.65mm", "2.65mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("42.86mm", "7.94mm", "3.44mm", "3.44mm", "✔");
    LODOP.ADD_PRINT_TEXT("43.39mm", "10.85mm", "9mm", "2.65mm", "GIFT");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT("47.63mm", "10.85mm", "12.96mm", "2.65mm", "PRINTED");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("43.39mm", "27.52mm", "27.78mm", "2.65mm", "COMMERIAL SAMPLE");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("47.63mm", "27.52mm", "32.28mm", "2.65mm", "OTHERS (Tick as appriate)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("52.39mm", "6.35mm", "27.78mm", "5.29mm", "QUANTITY AND DETAILED DESCRIPTION OF");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT("52.39mm", "33.87mm", "11.91mm", "3.7mm", "WEIGHT\r\n(KG)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT("52.39mm", "47.36mm", "11.91mm", "3.7mm", "VALUE\r\n(USD)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);

    LODOP.ADD_PRINT_TEXT("60.85mm", "6.35mm", "26.46mm", "2.91mm", Data.Item[0].TitleEn + Data.Item[0].Title + 'x' + Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("60.85mm", "34.13mm", "10.85mm", "2.65mm", parseFloat((Data.Item[0].Weight / 1000).toFixed(3)) * Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("60.85mm", "46.83mm", "10.85mm", "2.65mm", (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT("64.82mm", "6.35mm", "26.46mm", "5.82mm", "If known, HS Tariff number and country of origin of goods.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", "-1.06mm");
    LODOP.ADD_PRINT_TEXT("65.62mm", "33.87mm", "11.38mm", "5.29mm", "TOTAL WEIGHT\r\n(KG)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", "-0.79mm");
    LODOP.ADD_PRINT_TEXT("65.62mm", "47.1mm", "10.05mm", "5.29mm", "TOTAL VALUE\r\n(USD)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", "-0.79mm");
    LODOP.ADD_PRINT_TEXT("72.76mm", "6.35mm", "25.14mm", "2.65mm", "ORIGIN:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT("73.29mm", "34.13mm", "10.58mm", "2.65mm", Number((Data.Item[0].Weight / 1000).toFixed(3)) * Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("73.29mm", "46.83mm", "10.85mm", "2.65mm", (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT("77.26mm", "6.61mm", "53.45mm", "9.26mm", "The undersigned whose name and address are given on the Itm certify that the particulars given in the declaration are correct and that this Itm does not contain any dangerous article or articles prohibited by legislation or by postal or customs regulations.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", "-1.06mm");

    LODOP.ADD_PRINT_TEXT("90.75mm", "6.35mm", "26.46mm", "2.65mm", "Signature: Karen");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("90.75mm", "33.87mm", "23.81mm", "2.65mm", "DATE " + localData.PrintDate);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("29.37mm", "61.38mm", "18.52mm", "5.29mm", "TO:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_TEXT("38.89mm", "62.18mm", "35.72mm", "31.75mm", localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT("68.79mm", "62.18mm", "38.63mm", "5.56mm", Data.To.Country.CountryName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("74.08mm", "62.18mm", "33.07mm", "3.18mm", "Tel: " + Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT("94.46mm", "4.76mm", "39.16mm", "3.7mm", "Ref:" + Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("96.04mm", "69.85mm", "33.6mm", "3.97mm", Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    LODOP.ADD_PRINT_TEXT("28.84mm", "85.2mm", "11.91mm", "5.29mm", "GB");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 18);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.PRINT();
  },

  // wish邮 欧洲经济小包渠道面单(法国或其他流向) **何晓欣**
  printWishEuropePostForFR(Data:Interface.PrintData, localData:Interface.LocalData) {

    LODOP.ADD_PRINT_RECT("2.65mm", "2.65mm", "95.01mm", "95.01mm", 0, 1);
    LODOP.ADD_PRINT_TEXT(20, 20, 153, 40, "PRIORITY");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 24);
    LODOP.ADD_PRINT_TEXT(77, 20, 350, 42, "Return if undeliverable: H-103095, Postbus 7040, 3109 AA Schiedam, Netherlands");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", -1);
    LODOP.ADD_PRINT_TEXT(120, 20, 293, 121, localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT(203, 20, 33, 15, "Zip: ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(203, 45, 183, 20, Data.To.BuyerZipCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT(221, 20, 33, 15, "Tel:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(221, 45, 241, 15, Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT(238, 20, 100, 15, Data.To.Country.CountryName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT(243, 328, 40, 29, Data.To.Country.CountryCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
    LODOP.ADD_PRINT_BARCODE(295, 48, 306, 60, "128Auto", Data.TrackingNumber);
    LODOP.ADD_PRINT_IMAGE(20, 194, 100, 40, "<img src='/static/images/wishlogo.png' width='95'>")
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_IMAGE(11, 302, 60, 60, "<img src='/static/images/欧洲经济小包法国向.png' height='60'>")
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);

    LODOP.PRINT();
  },

  // wish邮 欧洲经济小包渠道面单(法国或其他流向) 报关单 **何晓欣**
  printWishEuropePostForFR_back(Data:Interface.PrintData, localData:Interface.LocalData) {


    LODOP.ADD_PRINT_RECT("2.65mm", "2.65mm", "95.01mm", "95.01mm", 0, 1);
    LODOP.ADD_PRINT_LINE(81, 11, 82, 367, 0, 2);
    LODOP.ADD_PRINT_LINE(140, 11, 141, 367, 0, 2);
    LODOP.ADD_PRINT_LINE(165, 11, 166, 367, 0, 2);
    LODOP.ADD_PRINT_LINE(242, 11, 243, 367, 0, 2);
    LODOP.ADD_PRINT_LINE(265, 10, 266, 367, 0, 2);
    LODOP.ADD_PRINT_LINE(264, 190, 140, 191, 0, 2);
    LODOP.ADD_PRINT_LINE(264, 252, 140, 253, 0, 2);
    LODOP.ADD_PRINT_LINE(264, 314, 140, 315, 0, 2);

    // 尾部固定内容
    LODOP.ADD_PRINT_TEXT(274, 15, 354, 20, "Country of origin goods: CN");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.ADD_PRINT_TEXT(296, 15, 357, 59, "I, the undersigned, whose name and address are given on this Itm, certify that the data given in this declaration is correct and that this Itm does not contain any dangerous goods or other articles prohibited by transport or export / import regulations.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(347, 15, 355, 15, "Date and sender's signature: " + Data.From.SendUserName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT(349, 295, 77, 10, localData.PrintDate);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");

    // 头部固定内容
    LODOP.ADD_PRINT_TEXT(23, 70, 256, 20, "CUSTOMS DECLARATION");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
    LODOP.ADD_PRINT_TEXT(53, 119, 180, 20, "May be opened officially");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_RECT(88, 45, 15, 15, 0, 1);
    LODOP.ADD_PRINT_RECT(113, 45, 15, 15, 0, 1);
    LODOP.ADD_PRINT_TEXT(86, 48, 13, 13, "✔");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
    LODOP.ADD_PRINT_TEXT(92, 64, 100, 15, "Sales of goods");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT(117, 64, 153, 15, "Gift/commercial sample");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT(92, 250, 100, 20, "|  Operator:NL");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");

    // 表格
    LODOP.ADD_PRINT_TEXT(148, 15, 171, 15, "Description of contents");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT(148, 211, 29, 15, "Qty");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT(148, 274, 30, 15, "Kg");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT(148, 329, 45, 15, "Value");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT(250, 15, 173, 15, "Total of contents");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");


    LODOP.ADD_PRINT_TEXT(196, 15, 169, 41, Data.Item[0].TitleEn + Data.Item[0].Title + 'x' + Data.Item[0].Quantity);
    LODOP.ADD_PRINT_TEXT(196, 213, 25, 20, Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT(196, 267, 40, 20, ((Data.Item[0].Weight / 1000) * Data.Item[0].Quantity).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT(196, 337, 30, 20, (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT(250, 205, 35, 15, Data.Item[0].Quantity + 'Pcs');
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT(250, 257, 60, 15, (((Data.Item[0].Weight / 1000) * Data.Item[0].Quantity).toFixed(3)) + ' Kg');
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT(250, 327, 40, 15, (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2) + ' $');
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");

    LODOP.PRINT();
  },

  // wish邮平邮佛山仓渠道面单(渠道代码拼接仓库代码)  **何晓欣**
  '0*25': function(Data:Interface.PrintData) {
    // LogisticsExt转换为JSON
    if (Data.LogisticsExt != '' && typeof Data.LogisticsExt === 'string') {
      Data.LogisticsExt = JSON.parse(Data.LogisticsExt)
    }
    var areaCode = this.getMailAreaCode(Data.To.Country.CountryCode);
    var isUs = Data.To.Country.CountryCode == 'US' ? true : false;
    var date = new Date();
    var localData = {
      ToAddress: Data.To.BuyerFullName + "\n" + Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == "" ? "" : "," + Data.To.BuyerStreet2) + "\n" + Data.To.BuyerCity + ", " + (Data.To.BuyerState == "" ? '' : Data.To.BuyerState + ',') + Data.To.BuyerZipCode + "\n" + Data.To.Country.CountryName + ' ' + areaCode + ' ' + Data.To.Country.CountryNameCn + '\nPhone: ' + Data.To.BuyerPhone,
      ReturnAddress: '佛山市邮政局函件集邮局',
      FromAddress: "From: " + Data.From.SendUserName + "\r\n" + (Data.From.Street2 == '' ? '' : Data.From.Street2 + ' ') + Data.From.Street1 + "\r\n" + Data.From.City + ", " + Data.From.SateOrProvince + "\r\nPhone: " + Data.From.Phone,
    }
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-wish邮平邮佛山仓渠道");
    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-wish邮平邮佛山仓渠道");
    if (isUs) {
      this.printWishChinaPostUS(Data, localData);
    } else {
      this.printWishChinaPost(Data, localData);
    }
  },

  // wish邮平邮广州仓渠道面单(渠道代码拼接仓库代码)  **何晓欣**
  '0*2': function(Data:Interface.PrintData) {
    // LogisticsExt转换为JSON
    if (Data.LogisticsExt != '' && typeof Data.LogisticsExt === 'string') {
      Data.LogisticsExt = JSON.parse(Data.LogisticsExt)
    }
    var areaCode = this.getMailAreaCode(Data.To.Country.CountryCode);
    var isUs = Data.To.Country.CountryCode == 'US' ? true : false;
    var localData = {
      ToAddress: Data.To.BuyerFullName + "\n" + Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == "" ? "" : "," + Data.To.BuyerStreet2) + "\n" + Data.To.BuyerCity + ", " + (Data.To.BuyerState == "" ? '' : Data.To.BuyerState + ',') + Data.To.BuyerZipCode + "\n" + Data.To.Country.CountryName + ' ' + areaCode + ' ' + Data.To.Country.CountryNameCn + '\nPhone: ' + Data.To.BuyerPhone,
      ReturnAddress: '广州小包大宗收寄处理中心',
      FromAddress: "From: " + Data.From.SendUserName + "\r\n" + (Data.From.Street2 == '' ? '' : Data.From.Street2 + ' ') + ' ' + Data.From.Street1 + "\r\n" + Data.From.City + ", " + Data.From.SateOrProvince + "\r\nPhone: " + Data.From.Phone
    }
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-wish邮平邮广州仓渠道");
    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-wish邮平邮广州仓渠道");
    if (isUs) {
      this.printWishChinaPostUS(Data, localData);
    } else {
      this.printWishChinaPost(Data, localData);
    }
  },
  // wish邮平邮上海仓渠道面单(渠道代码拼接仓库代码)  **何晓欣**
  '0*1': function(Data:Interface.PrintData) {
    // LogisticsExt转换为JSON
    if (Data.LogisticsExt != '' && typeof Data.LogisticsExt === 'string') {
      Data.LogisticsExt = JSON.parse(Data.LogisticsExt)
    }
    var areaCode = this.getMailAreaCode(Data.To.Country.CountryCode);
    var isUs = Data.To.Country.CountryCode == 'US' ? true : false; //是否是美国
    var isRu = Data.To.Country.CountryCode == 'RU' ? true : false; //是否是俄罗斯
    var localData = {
      ToAddress: Data.To.BuyerFullName + "\n" + Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == "" ? "" : "," + Data.To.BuyerStreet2) + "\n" + Data.To.BuyerCity + ", " + (Data.To.BuyerState == "" ? '' : Data.To.BuyerState + ',') + Data.To.BuyerZipCode + "\n" + Data.To.Country.CountryName + ' ' + areaCode + ' ' + Data.To.Country.CountryNameCn + '\nPhone: ' + Data.To.BuyerPhone,
      ReturnAddress: isUs ? '中国邮政集团公司上海市邮政物流服务分公司' : '中国邮政集团公司上海市邮政物流分公司',
      FromAddress: "From: " + Data.From.SendUserName + "\r\n" + (Data.From.Street2 == '' ? '' : Data.From.Street2 + ' ') + ' ' + Data.From.Street1 + "\r\n" + Data.From.City + ", " + Data.From.SateOrProvince + "\r\nPhone: " + Data.From.Phone
    }

    if (isRu) {
      var RUkey = this.getWishPostRuKey(Data.To.BuyerZipCode);
      localData.ToAddress = Data.To.BuyerFullName + "\n" + (Data.To.BuyerStreet2 == "" ? "" : Data.To.BuyerStreet2 + ",") + Data.To.BuyerStreet1 + "\n" + Data.To.BuyerCity + ", " + (Data.To.BuyerState == "" ? '' : Data.To.BuyerState + ',') + Data.To.BuyerZipCode + "\n" + Data.To.Country.CountryName + ' ' + areaCode + ' ' + Data.To.Country.CountryNameCn + ' ' + RUkey + '\nPhone: ' + Data.To.BuyerPhone
    }

    if (isUs) {
      localData.ToAddress = Data.To.BuyerFullName + "\n" + (Data.To.BuyerStreet2 == "" ? "" : Data.To.BuyerStreet2 + ",") + Data.To.BuyerStreet1 + "\n" + Data.To.BuyerCity + ", " + (Data.To.BuyerState == "" ? '' : Data.To.BuyerState + ',') + Data.To.BuyerZipCode + "\n" + Data.To.Country.CountryName + ' ' + areaCode + ' ' + Data.To.Country.CountryNameCn + ' ①(USJFKA)' + '\nPhone: ' + Data.To.BuyerPhone
    }
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-wish邮平邮上海仓渠道");
    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-wish邮平邮上海仓渠道");
    if (isUs) {
      this.printWishChinaPostUS(Data, localData);
    } else {
      this.printWishChinaPost(Data, localData);
    }
  },

  // 绘制wish平邮 佛山、广州、上海 美国向面单 **何晓欣**
  printWishChinaPostUS(Data:Interface.PrintData, localData:Interface.LocalData) {
    let printDate = this.getPrintDate();

    // 表格模板
    LODOP.ADD_PRINT_RECT("2.65mm", "2.65mm", "95.01mm", "95.01mm", 0, 1);
    LODOP.ADD_PRINT_LINE("17.99mm", "2.65mm", "17.99mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("17.94mm", "36.99mm", "2.59mm", "36.99mm", 0, 1);
    LODOP.ADD_PRINT_LINE("47.1mm", "2.65mm", "47.1mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("40.51mm", "2.65mm", "40.51mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("80.41mm", "2.65mm", "80.41mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("80.2mm", "54.8mm", "62.71mm", "54.8mm", 0, 1);
    LODOP.ADD_PRINT_LINE("80.2mm", "76.49mm", "62.71mm", "76.49mm", 0, 1);
    LODOP.ADD_PRINT_LINE("63mm", "2.65mm", "63mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("74.9mm", "2.65mm", "74.9mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("17.94mm", "63mm", "2.59mm", "63mm", 0, 1);
    LODOP.ADD_PRINT_LINE("47.1mm", "50.01mm", "2.65mm", "50.01mm", 0, 1);
    LODOP.ADD_PRINT_LINE("68.79mm", "2.65mm", "68.79mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("62.71mm", "29.1mm", "47.1mm", "29.1mm", 0, 1);

    // 尾部
    LODOP.ADD_PRINT_TEXT("81.23mm", "3.97mm", "96.84mm", "11.11mm", "I certify the particulars given in this declaration are correct and this Itm does not contain any dangerous articles prohibited by legislation or by postal or customs regulations.");
    // LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", "-0.53mm");
    LODOP.ADD_PRINT_TEXT("90.49mm", "3.97mm", "59.53mm", "5.29mm", "Sender's Signature & Date Signed:");
    // LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.ADD_PRINT_TEXT("91.81mm", "80.7mm", "13.23mm", "5.29mm", "已验视");
    // LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "宋体");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("94.46mm", "3.97mm", "26.46mm", "5.29mm", "CN22");
    // LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.ADD_PRINT_RECT("89.96mm", "75.14mm", "21.17mm", "6.09mm", 0, 2);
    LODOP.ADD_PRINT_TEXT("90.75mm", "57.68mm", "26.46mm", "5.29mm", printDate);
    // LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    // 头部
    LODOP.ADD_PRINT_TEXT("8.73mm", "53.45mm", "10.58mm", "5.29mm", "美国");
    // LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "宋体");
    LODOP.ADD_PRINT_TEXT("5.56mm", "39.69mm", "13.23mm", "10.85mm", "Small Packet BY AIR");
    // LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", "-0.26mm");

    // logo
    LODOP.ADD_PRINT_IMAGE("5.56mm", "5.03mm", "29.1mm", "8.73mm", "<img src='/static/images/中国邮政logo.png' width='107'>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_TEXT("14.55mm", "3.44mm", "31.75mm", "2.65mm", "US22");
    // LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_IMAGE("5.82mm", "65.62mm", "30.43mm", "9.26mm", "<img src='/static/images/WishPost-logo-large.jpg' width='130'>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);

    // 寄件地址
    LODOP.ADD_PRINT_TEXT("19.31mm", "4.23mm", "44.98mm", "23.02mm", localData.FromAddress);
    // LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    // 收件地址
    LODOP.ADD_PRINT_TEXT("19.31mm", "51.59mm", "47.63mm", "23.02mm", "ShipTo：" + localData.ToAddress.slice(0, localData.ToAddress.indexOf('Phone')));
    // LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    LODOP.ADD_PRINT_TEXT("42.33mm", "51.06mm", "47.89mm", "5.29mm", localData.ToAddress.slice(localData.ToAddress.indexOf('Phone')));
    // LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("41.28mm", "3.44mm", "48.42mm", "5.29mm", "退件地址：" + localData.ReturnAddress);
    // LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "宋体");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", "-0.26mm");

    // 条码
    LODOP.ADD_PRINT_TEXT("50.27mm", "3.18mm", "25.4mm", "12.17mm", "Delivery scan event not required");
    // LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_BARCODE("48.95mm", "33.34mm", "62.44mm", "9.26mm", "128Auto", Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT("58.74mm", "29.9mm", "68.26mm", "3.97mm", Data.TrackingNumber);
    // LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);

    // 明细
    LODOP.ADD_PRINT_TEXT("64.82mm", "13.23mm", "37.57mm", "3.18mm", "Description of Contents");
    // LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("64.82mm", "63.24mm", "7.94mm", "3.18mm", "kg.");
    // LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("64.82mm", "81.76mm", "16.67mm", "3.18mm", "Val(US $)");
    // LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("76.46mm", "4.23mm", "46.04mm", "3.18mm", "Total Gross Weight (Kg)");
    // LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    // 明细sku
    LODOP.ADD_PRINT_TEXT("70.64mm", "4.23mm", "50.01mm", "3.18mm", Data.Item[0].TitleEn + Data.Item[0].Title + 'x' + Data.Item[0].Amount);
    // LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("70.64mm", "61.91mm", "15.88mm", "3.18mm", ((Data.Item[0].Weight / 1000) * Data.Item[0].Quantity).toFixed(3));
    // LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("70.64mm", "85.46mm", "12.17mm", "3.18mm", (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    // LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    // 汇总
    LODOP.ADD_PRINT_TEXT("76.46mm", "61.91mm", "15.88mm", "3.18mm", ((Data.Item[0].Weight / 1000) * Data.Item[0].Quantity).toFixed(3));
    // LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("76.46mm", "85.46mm", "12.17mm", "3.18mm", (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    // LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    LODOP.PRINT();
  },

  // 绘制wish平邮 佛山、广州、上海 渠道面单  **何晓欣**
  printWishChinaPost(Data:Interface.PrintData, localData:Interface.LocalData) {

    // 表格模板
    LODOP.ADD_PRINT_RECT("2.65mm", "2.65mm", "95.01mm", "95.01mm", 0, 1);
    LODOP.ADD_PRINT_LINE("56.89mm", "2.65mm", "56.89mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("15.88mm", "2.65mm", "15.88mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("42.86mm", "40.75mm", "15.61mm", "40.75mm", 0, 1);
    LODOP.ADD_PRINT_LINE("42.86mm", "2.65mm", "42.86mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("37.31mm", "2.91mm", "37.31mm", "40.75mm", 0, 1);
    LODOP.ADD_PRINT_LINE("80.43mm", "2.65mm", "80.43mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("80.17mm", "54.77mm", "62.71mm", "54.77mm", 0, 1);
    LODOP.ADD_PRINT_LINE("80.17mm", "76.46mm", "62.71mm", "76.46mm", 0, 1);
    LODOP.ADD_PRINT_LINE("62.97mm", "2.65mm", "62.97mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("74.88mm", "2.65mm", "74.88mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("62.71mm", "26.46mm", "56.62mm", "26.46mm", 0, 1);
    LODOP.ADD_PRINT_LINE("15.88mm", "74.08mm", "2.65mm", "74.08mm", 0, 1);
    LODOP.ADD_PRINT_LINE("15.88mm", "61.38mm", "2.65mm", "61.38mm", 0, 1);
    LODOP.ADD_PRINT_LINE("68.79mm", "2.65mm", "68.79mm", "97.9mm", 0, 1);
    // 尾部
    LODOP.ADD_PRINT_TEXT("80.96mm", "3.44mm", "96.84mm", "11.11mm", "I certify the particulars given in this customs declaration are correct.This Itm does not contain any dangerous article, or articles prohibitedby legislation or by postal or customs regulations. I have met allapplicable export filing requirements under the Foreign Trade Regulations");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("93.93mm", "3.18mm", "59.53mm", "5.29mm", "Sender's Signature & Date Signed:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("92.08mm", "75.73mm", "22.49mm", "4mm", "已验视 CN22");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_RECT("91.02mm", "74.67mm", "21.17mm", "5.5mm", 0, 2);
    // 分拣码
    LODOP.ADD_PRINT_TEXT("7.67mm", "62.44mm", "14.55mm", "5.29mm", this.getChinaPostLM(Data.To.Country.CountryCode));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("8.47mm", "33.34mm", "31.22mm", "5.29mm", "Small Packet BY AIR");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    // logo
    LODOP.ADD_PRINT_IMAGE("5.29mm", "3.44mm", "29.1mm", "8.73mm", "<img src='/static/images/中国邮政logo.png' width='100'>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_IMAGE("5.29mm", "75.41mm", "21.17mm", "7.94mm", "<img src='/static/images/WishPost-logo-large.jpg' width='150'>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    // 寄件地址
    LODOP.ADD_PRINT_TEXT("17.46mm", "4.23mm", "36.51mm", "19.05mm", localData.FromAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("39.16mm", "4.23mm", "27.78mm", "3.97mm", "自编号：");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    // 收件地址
    LODOP.ADD_PRINT_TEXT("17.46mm", "42.86mm", "55.03mm", "23.02mm", "ShipTo：" + localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    // 巴西渠道增加税号
    // Wish邮平邮佛山仓，ApiType=11，渠道代码0*25
    // Wish邮平邮广州仓，ApiType=11，渠道代码0*2
    // Wish邮平邮上海仓，ApiType=11，渠道代码0*1
    if (Data.To.BuyerCountry=='BR' && Data.MethodApiType==11 && (Data.MethodCode=='0*25' || Data.MethodCode=='0*2' || Data.MethodCode=='0*1')) {
      LODOP.ADD_PRINT_TEXT("39.42mm","42.6mm","71.17mm","3.7mm","TAX ID:" + (Data.LogisticsExt.TaxNumber?Data.LogisticsExt.TaxNumber:''));
      LODOP.SET_PRINT_STYLEA(0,"FontName","Arial");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
    }
    if(Data.LogisticsExt.NorwayVatNumber && Data.MethodApiType==11 && (Data.MethodCode=='0*25' || Data.MethodCode=='0*2' || Data.MethodCode=='0*1')){
      let s = Data.LogisticsExt.NorwayVatNumber.substring(0,1) + "*****" + Data.LogisticsExt.NorwayVatNumber.substring(6)
      LODOP.ADD_PRINT_TEXT("33.9mm","3.97mm","37.84mm","5.29mm",`VAT No: VOEC ${s}`);
      LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
    }

    // 退件地址
    LODOP.ADD_PRINT_TEXT("58.74mm", "4.23mm", "21.17mm", "3.97mm", "退件单位：");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("58.74mm", "28.05mm", "71.17mm", "3.97mm", localData.ReturnAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    // 跟踪号条码
    LODOP.ADD_PRINT_TEXT("48.68mm", "14.55mm", "19.31mm", "5.29mm", "untracked");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_BARCODE("44.19mm", "46.57mm", "44.98mm", "11.64mm", "128Auto", Data.TrackingNumber);
    // 明细
    LODOP.ADD_PRINT_TEXT("64.56mm", "13.23mm", "37.57mm", "3.18mm", "Description of Contents");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("64.56mm", "63.24mm", "7.94mm", "3.18mm", "kg.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("64.56mm", "81.76mm", "16.67mm", "3.18mm", "Val(US $)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("76.46mm", "4.23mm", "46.04mm", "3.18mm", "Total Gross Weight (Kg)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    LODOP.ADD_PRINT_TEXT("70.64mm", "4.23mm", "50.01mm", "3.18mm", Data.Item[0].TitleEn + Data.Item[0].Title + 'x' + Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("70.38mm", "61.91mm", "15.88mm", "3.18mm", ((Data.Item[0].Weight / 1000) * Data.Item[0].Quantity).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("70.38mm", "85.46mm", "12.17mm", "3.18mm", (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    // 汇总
    LODOP.ADD_PRINT_TEXT("76.2mm", "61.91mm", "15.88mm", "3.18mm", ((Data.Item[0].Weight / 1000) * Data.Item[0].Quantity).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("76.2mm", "85.46mm", "12.17mm", "3.18mm", (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    // LODOP.PRINT_DESIGN();
    LODOP.PRINT();
  },

  // 睿振行-广州小包挂号渠道面单（1801） 三行SKU **何晓欣**
  '1801': function(Data:Interface.PrintData) {
    var date = new Date();
    // 获取挂号小包分区号
    var areaCode = this.getRegisterAreaCode(Data.To.Country.CountryCode);
    var localData = {
      ToAddress: Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == '' ? '' : ',' + Data.To.BuyerStreet2) + "\n" + Data.To.BuyerCity + "\n" + (Data.To.BuyerState == "" ? '' : Data.To.BuyerState + '\n') + Data.To.Country.CountryName + ' ' + areaCode + ' ' + Data.To.Country.CountryNameCn,
      FromAddress: (Data.From.Street2 == '' ? '' : Data.From.Street2 + ' ') + Data.From.Street1 + "." + Data.From.City + ',\n' + Data.From.SateOrProvince + "," + Data.From.Country.CountryName,
      PrintDate: this.getPrintDate(),
      totalQty: 0,
      totalWeight: 0,
      totalValue: 0
    }
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-睿振行-广州小包挂号渠道");

    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-睿振行-广州小包挂号渠道");
    // 表格模板
    LODOP.ADD_PRINT_LINE("55.3mm", "2.65mm", "55.3mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("22.49mm", "41.01mm", "22.49mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("55.03mm", "40.75mm", "22.49mm", "40.75mm", 0, 1);
    LODOP.ADD_PRINT_LINE("47.63mm", "2.91mm", "47.63mm", "40.75mm", 0, 1);
    LODOP.ADD_PRINT_LINE("42.07mm", "2.91mm", "42.07mm", "40.75mm", 0, 1);
    LODOP.ADD_PRINT_LINE("80.43mm", "2.65mm", "80.43mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("80.17mm", "7.67mm", "55.03mm", "7.67mm", 0, 1);
    LODOP.ADD_PRINT_LINE("80.17mm", "14.29mm", "55.03mm", "14.29mm", 0, 1);
    LODOP.ADD_PRINT_LINE("80.17mm", "80.96mm", "55.03mm", "80.96mm", 0, 1);
    LODOP.ADD_PRINT_LINE("80.17mm", "57.15mm", "55.03mm", "57.15mm", 0, 1);
    LODOP.ADD_PRINT_LINE("80.17mm", "67.73mm", "55.03mm", "67.73mm", 0, 1);
    LODOP.ADD_PRINT_RECT("2.65mm", "2.65mm", "95.01mm", "95.01mm", 0, 1);
    LODOP.ADD_PRINT_LINE("60.06mm", "2.65mm", "60.06mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("75.41mm", "2.65mm", "75.41mm", "97.9mm", 0, 1);

    LODOP.ADD_PRINT_TEXT("80.7mm", "3.97mm", "96.84mm", "11.11mm", "I certify the particulars given in this customs declaration are correct.This Itm does not contain any dangerous article, or articles prohibitedby legislation or by postal or customs regulations. I have met allapplicable export filing requirements under the Foreign Trade Regulations");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("93.66mm", "3.97mm", "59.53mm", "5.29mm", "Sender's Signature & Date Signed:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("91.55mm", "82.55mm", "15.88mm", "5.29mm", "CN22");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);

    LODOP.ADD_PRINT_BARCODE("3.97mm", "46.63mm", "50.27mm", "14.55mm", "128Auto", Data.TrackingNumber);
    LODOP.ADD_PRINT_IMAGE("3.18mm", "5.82mm", "29.1mm", "8.73mm", "<img src='/static/images/中国邮政logo.png' width='107'>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_TEXT("10.85mm", "6.09mm", "33.07mm", "5.29mm", "Small Packet BY AIR");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontColor", "#808080");

    LODOP.ADD_PRINT_TEXT("18.79mm", "80.17mm", "19.84mm", "3.97mm", localData.PrintDate);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    LODOP.ADD_PRINT_TEXT("23.81mm", "42.6mm", "14.82mm", "4.76mm", "Ship To: ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("23.81mm", "55.3mm", "26.46mm", "4.76mm", Data.To.BuyerFullName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("27.25mm", "42.6mm", "54.24mm", "18.26mm", localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("47.1mm", "42.6mm", "9mm", "3.18mm", "ZIP: ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("50.8mm", "42.6mm", "9mm", "3.7mm", "TEL: ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("47.1mm", "49.74mm", "26.46mm", "3.18mm", Data.To.BuyerZipCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("50.8mm", "50.27mm", "26.46mm", "3.7mm", Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("43.92mm", "3.97mm", "38.1mm", "3.97mm", "untracked自编号：");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("48.95mm", "3.97mm", "37.04mm", "8.2mm", "退件单位：");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT("23.02mm", "3.97mm", "12.44mm", "3.7mm", "FROM:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("23.02mm", "14.55mm", "29.1mm", "3.7mm", Data.From.SendUserName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("26.46mm", "3.97mm", "38.1mm", "10.85mm", localData.FromAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("39mm", "3.97mm", "8.73mm", "3.7mm", "TEL: ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("39mm", "10.85mm", "29.37mm", "3.7mm", Data.From.Phone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_RECT("15.08mm", "16.4mm", "13.23mm", "5.29mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("15.35mm", "17.73mm", "14.29mm", "3.7mm", this.getChinaPostLM(Data.To.Country.CountryCode));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_TEXT("56.62mm", "3.44mm", "7.67mm", "6.61mm", "No");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("56.62mm", "9mm", "7.41mm", "6.61mm", "Qty");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("56.62mm", "15.88mm", "36.51mm", "6.61mm", "Description of Contents");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("56.62mm", "60.59mm", "6.88mm", "6.61mm", "Kg.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("56.62mm", "69.59mm", "14.02mm", "6.61mm", "Val(US$)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("56.62mm", "83.34mm", "18.52mm", "6.61mm", "Good Origin");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("76.73mm", "15.88mm", "38.36mm", "5.29mm", "Total Gross Weight(kg.)：");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT("61.38mm", "3.97mm", "7.41mm", "5.29mm", "1\r\n");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("61.38mm", "9.79mm", "7.94mm", "5.29mm", Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("61.38mm", "15.88mm", "44.45mm", "5.29mm", Data.Item[0].TitleEn + Data.Item[0].Title + 'x' + Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("61.38mm", "59.53mm", "12.17mm", "5.29mm", ((Data.Item[0].Weight / 1000) * Data.Item[0].Quantity).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("61.38mm", "73.29mm", "12.7mm", "5.29mm", (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("61.38mm", "88.11mm", "13.23mm", "5.29mm", "CN");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_LINE("65.09mm", "2.65mm", "64.82mm", "97.9mm", 0, 1);

    if (Data.Item.length > 1) {
      LODOP.ADD_PRINT_TEXT(251, 15, 28, 20, "2");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(251, 37, 29, 20, Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(251, 60, 168, 20, Data.Item[1].TitleEn + Data.Item[1].Title + 'x' + Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(251, 225, 47, 20, ((Data.Item[1].Weight / 1000) * Data.Item[1].Quantity).toFixed(3));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(251, 277, 49, 20, (Data.Item[1].Amount * Data.Item[1].Quantity).toFixed(2));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(251, 333, 47, 20, "CN");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

      LODOP.ADD_PRINT_LINE(266, 11, 265, 366, 0, 1);

      if (Data.Item.length > 2) {
        LODOP.ADD_PRINT_TEXT(271, 15, 17, 14, "3");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.ADD_PRINT_TEXT(271, 37, 29, 20, Data.Item[2].Quantity);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.ADD_PRINT_TEXT(271, 60, 168, 20, Data.Item[2].TitleEn + Data.Item[2].Title + 'x' + Data.Item[2].Quantity);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
        LODOP.ADD_PRINT_TEXT(271, 225, 47, 20, ((Data.Item[2].Weight / 1000) * Data.Item[2].Quantity).toFixed(3));
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.ADD_PRINT_TEXT(271, 277, 49, 20, (Data.Item[2].Amount * Data.Item[2].Quantity).toFixed(2));
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.ADD_PRINT_TEXT(271, 333, 47, 20, "CN");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

        localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 3);
        localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 3);
        localData.totalValue = this.printTotalData(Data.Item, 'Amount', 3);
      } else {
        localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 2);
        localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 2);
        localData.totalValue = this.printTotalData(Data.Item, 'Amount', 2);
      }

    } else {
      localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 1);
      localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 1);
      localData.totalValue = this.printTotalData(Data.Item, 'Amount', 1);
    }

    // SKU表格统计
    LODOP.ADD_PRINT_TEXT("76.99mm", "9.53mm", "6.88mm", "5.29mm", localData.totalQty);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("76.99mm", "59.53mm", "8.73mm", "5.29mm", (localData.totalWeight / 1000).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("76.99mm", "73.29mm", "9.79mm", "5.29mm", localData.totalValue.toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.PRINT();
  },

  // 睿振行-广州小包平邮渠道面单（1802） 三行SKU  **何晓欣**
  '1802': function(Data:Interface.PrintData) {
    var date = new Date();
    // 获取中国邮政平邮分区号
    var areaCode = this.getMailAreaCode(Data.To.Country.CountryCode);
    var localData = {
      // returnAddress: Data.Return.Street2 + " " + Data.Return.Street1 + " " + Data.Return.City + " " + Data.Return.SateOrProvince + " " + Data.Return.Country.CountryNameCn,
      ToAddress: Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == '' ? '' : ',' + Data.To.BuyerStreet2) + "\n" + Data.To.BuyerCity + (Data.To.BuyerState == '' ? '' : ',' + Data.To.BuyerState) + "\n" + Data.To.Country.CountryName + ' ' + areaCode + ' ' + Data.To.Country.CountryNameCn,
      FromAddress: (Data.From.Street2 == '' ? '' : Data.From.Street2 + ' ') + Data.From.Street1 + "." + Data.From.City + ",\n" + Data.From.SateOrProvince + ',' + Data.From.Country.CountryName,
      PrintDate: this.getPrintDate(),
      totalQty: 0,
      totalWeight: 0,
      totalValue: 0
    }
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-睿振行-广州小包挂号渠道");

    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-睿振行-广州小包挂号渠道");

    // 表格模板
    LODOP.ADD_PRINT_LINE("57.68mm", "2.65mm", "57.68mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("16.67mm", "40.75mm", "16.67mm", "97.63mm", 0, 1);
    LODOP.ADD_PRINT_LINE("43.92mm", "40.75mm", "16.67mm", "40.75mm", 0, 1);
    LODOP.ADD_PRINT_LINE("36.25mm", "2.91mm", "36.25mm", "40.75mm", 0, 1);
    LODOP.ADD_PRINT_LINE("30.69mm", "2.91mm", "30.69mm", "40.75mm", 0, 1);
    LODOP.ADD_PRINT_LINE("80.43mm", "2.65mm", "80.43mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("79.9mm", "7.67mm", "57.41mm", "7.67mm", 0, 1);
    LODOP.ADD_PRINT_LINE("79.9mm", "14.29mm", "57.41mm", "14.29mm", 0, 1);
    LODOP.ADD_PRINT_LINE("79.9mm", "80.96mm", "57.41mm", "80.96mm", 0, 1);
    LODOP.ADD_PRINT_LINE("79.9mm", "57.15mm", "57.41mm", "57.15mm", 0, 1);
    LODOP.ADD_PRINT_LINE("79.9mm", "67.73mm", "57.41mm", "67.73mm", 0, 1);
    LODOP.ADD_PRINT_RECT("2.65mm", "2.65mm", "95.01mm", "95.01mm", 0, 1);
    LODOP.ADD_PRINT_LINE("62.44mm", "2.65mm", "62.44mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("43.92mm", "2.65mm", "43.92mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("16.67mm", "77.52mm", "2.65mm", "77.52mm", 0, 1);
    LODOP.ADD_PRINT_LINE("16.67mm", "63.76mm", "2.65mm", "63.76mm", 0, 1);
    LODOP.ADD_PRINT_LINE("75.67mm", "2.65mm", "75.67mm", "97.9mm", 0, 1);

    LODOP.ADD_PRINT_TEXT("81.23mm", "3.97mm", "96.84mm", "11.11mm", "I certify the particulars given in this customs declaration are correct.This Itm does not contain any dangerous article, or articles prohibitedby legislation or by postal or customs regulations. I have met allapplicable export filing requirements under the Foreign Trade Regulations");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("93.66mm", "3.44mm", "59.53mm", "5.29mm", "Sender's Signature & Date Signed:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("91.55mm", "81.76mm", "15.88mm", "5.29mm", "CN22");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);

    LODOP.ADD_PRINT_IMAGE("4.5mm", "4.23mm", "29.1mm", "8.73mm", "<img src='/static/images/中国邮政logo.png' width='107'>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);

    LODOP.ADD_PRINT_TEXT("8.73mm", "35.19mm", "30.69mm", "5.29mm", "Small Packet BY AIR");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("7.67mm", "76.99mm", "21.17mm", "5.29mm", localData.PrintDate);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT("7.67mm", "64.82mm", "11.91mm", "5.29mm", this.getChinaPostLM(Data.To.Country.CountryCode));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT("32.54mm", "3.97mm", "35.98mm", "4.23mm", "untracked自编号：");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("37.57mm", "3.97mm", "26.46mm", "3.97mm", "退件单位：");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("48.68mm", "11.91mm", "27.78mm", "5.29mm", "untracked");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_BARCODE("44.98mm", "44.19mm", "47.36mm", "11.91mm", "128Auto", Data.TrackingNumber);

    LODOP.ADD_PRINT_TEXT("17.73mm", "42.6mm", "14.82mm", "4.76mm", "Ship To: ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("17.73mm", "55.3mm", "26.46mm", "4.76mm", Data.To.BuyerFullName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("21.17mm", "42.6mm", "54.24mm", "18.26mm", localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("38.36mm", "42.6mm", "9mm", "3.18mm", "ZIP: ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("41.01mm", "42.6mm", "9mm", "3.7mm", "TEL: ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("38.36mm", "49.74mm", "26.46mm", "3.18mm", Data.To.BuyerZipCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("41.01mm", "50.27mm", "26.46mm", "3.7mm", Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT("14.55mm", "3.97mm", "12.44mm", "3.7mm", "FROM:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("14.55mm", "14.55mm", "29.1mm", "3.7mm", Data.From.SendUserName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("17.2mm", "3.97mm", "38.1mm", "10.85mm", localData.FromAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", "-0.79mm");
    LODOP.ADD_PRINT_TEXT("27.78mm", "3.97mm", "13.23mm", "3.7mm", "PHONE:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("27.78mm", "15.88mm", "29.37mm", "3.7mm", Data.From.Phone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT("59.27mm", "3.44mm", "7.67mm", "6.61mm", "No");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("59.27mm", "8.73mm", "7.41mm", "6.61mm", "Qty");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("59.27mm", "15.88mm", "36.51mm", "6.61mm", "Description of Contents");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("59.27mm", "60.33mm", "6.88mm", "6.61mm", "Kg.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("59.27mm", "69.59mm", "14.02mm", "6.61mm", "Val(US$)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("59.27mm", "83.61mm", "18.52mm", "6.61mm", "Good Origin");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("76.99mm", "15.88mm", "38.36mm", "5.29mm", "Total Gross Weight(kg.)：");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT("63.5mm", "3.7mm", "7.41mm", "5.29mm", "1\r\n");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("63.5mm", "9.26mm", "7.94mm", "5.29mm", Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("63.5mm", "15.88mm", "44.45mm", "5.29mm", Data.Item[0].TitleEn + Data.Item[0].Title + 'x' + Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("63.5mm", "59mm", "12.17mm", "5.29mm", ((Data.Item[0].Weight / 1000) * Data.Item[0].Quantity).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("63.5mm", "73.03mm", "12.7mm", "5.29mm", (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("63.5mm", "87.05mm", "13.23mm", "5.29mm", "CN");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_LINE("66.68mm", "2.65mm", "66.41mm", "97.9mm", 0, 1);

    if (Data.Item.length > 1) {
      // 第二行
      LODOP.ADD_PRINT_TEXT(256, 14, 28, 20, "2");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(256, 35, 29, 20, Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(256, 60, 168, 20, Data.Item[1].TitleEn + Data.Item[1].Title + 'x' + Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(256, 223, 47, 20, ((Data.Item[1].Weight / 1000) * Data.Item[1].Quantity).toFixed(3));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(256, 276, 49, 20, (Data.Item[1].Amount * Data.Item[1].Quantity).toFixed(2));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(256, 329, 47, 20, "CN");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_LINE(270, 11, 269, 366, 0, 1);

      if (Data.Item.length > 2) {
        // 第三行
        LODOP.ADD_PRINT_TEXT(275, 14, 28, 20, "3");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.ADD_PRINT_TEXT(275, 35, 29, 20, Data.Item[2].Quantity);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.ADD_PRINT_TEXT(275, 60, 168, 20, Data.Item[2].TitleEn + Data.Item[2].Title + 'x' + Data.Item[2].Quantity);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
        LODOP.ADD_PRINT_TEXT(275, 223, 47, 20, ((Data.Item[2].Weight / 1000) * Data.Item[2].Quantity).toFixed(3));
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.ADD_PRINT_TEXT(275, 276, 49, 20, (Data.Item[2].Amount * Data.Item[2].Quantity).toFixed(2));
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.ADD_PRINT_TEXT(275, 329, 47, 20, "CN");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

        localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 3);
        localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 3);
        localData.totalValue = this.printTotalData(Data.Item, 'Amount', 3);
      } else {
        localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 2);
        localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 2);
        localData.totalValue = this.printTotalData(Data.Item, 'Amount', 2);
      }
    } else {
      localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 1);
      localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 1);
      localData.totalValue = this.printTotalData(Data.Item, 'Amount', 1);
    }

    // SKU表格统计
    LODOP.ADD_PRINT_TEXT("77.26mm", "9.26mm", "6.88mm", "5.29mm", localData.totalQty);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("77.26mm", "59mm", "8.73mm", "5.29mm", (localData.totalWeight / 1000).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("77.26mm", "73.29mm", "9.79mm", "5.29mm", localData.totalValue.toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.PRINT();
  },

  /********* 4PX **********/
  // 4PX联邮通挂号渠道面单  **何晓欣**
  A6: function(Data:Interface.PrintData) {
    var localData = {
      ToAddress: Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == '' ? '' : ',' + Data.To.BuyerStreet2) + '\r\n' + Data.To.BuyerCity + '\r\n' + (Data.To.BuyerState == '' ? '' : Data.To.BuyerState + ',') + Data.To.BuyerZipCode,
      ReturnAddress: "Werner-von-Siemens Str.9"
    }
    LODOP.PRINT_INITA("0mm", "0mm", '80mm', '90mm', "面单-4PX联邮通挂号渠道面单");

    LODOP.SET_PRINT_PAGESIZE(1, 800, 900, "面单-4PX联邮通挂号渠道面单");
    LODOP.ADD_PRINT_RECT("3mm", "3mm", "74mm", "84mm", 0, 1);

    LODOP.ADD_PRINT_IMAGE(48, 256, 25, 25, "<img src='/static/images/battery.bmp' width='25'>"); //电池标识图
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_IMAGE(48, 236, 25, 25, "<img src='/static/images/gjz.bmp' width='20'>"); //高价值标识图
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_IMAGE(48, 213, 25, 25, "<img src='/static/images/return.gif' width='25'>"); //退件标识图
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_IMAGE(48, 187, 25, 25, "<img src='/static/images/insurance.jpg' width='25'>"); //保险标识图
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_RECT(280, "5mm", 264, 18, 0, 1);
    LODOP.ADD_PRINT_RECT(305, "5mm", 264, 18, 0, 1);
    LODOP.ADD_PRINT_TEXT(18, 15, 166, 25, localData.ReturnAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Italic", 1);
    LODOP.ADD_PRINT_TEXT(18, 236, 53, 31, Data.To.Country.CountryCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 20);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(76, 180, 115, 21, "4PX联邮通挂号");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(97, 20, 268, 15, "TO:   " + Data.To.BuyerFullName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(114, 20, 36, 15, "TEL: ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(114, 53, 235, 15, Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT(132, 20, 266, 47, localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT(184, 20, 264, 20, Data.To.Country.CountryName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1);
    LODOP.ADD_PRINT_BARCODE(240, 30, 185, 35, "128Auto", Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT(223, 39, 159, 15, Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(282, 23, 100, 13, "【202129214】");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.ADD_PRINT_TEXT(282, 132, 143, 12, "Ref No: " + Data.OrderCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.ADD_PRINT_TEXT(307, 23, 100, 10, "CS: S10164");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.ADD_PRINT_TEXT(307, 132, 100, 14, "SD: S4257");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.PRINT();
  },

  // 4PX联邮通LARGE LETTER 24平邮标准服务面单  **何晓欣**
  FY: function(Data:Interface.PrintData) {
    var localData = {
      ToAddress: Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == '' ? '' : ',' + Data.To.BuyerStreet2) + '\r\n' + Data.To.BuyerCity + '\r\n' + (Data.To.BuyerState == '' ? '' : Data.To.BuyerState + ',') + Data.To.BuyerZipCode,
    }
    LODOP.PRINT_INITA("0mm", "0mm", '80mm', '90mm', "面单-4PX联邮通LARGE LETTER 24平邮标准服务面单");

    LODOP.SET_PRINT_PAGESIZE(1, 800, 900, "面单-4PX联邮通LARGE LETTER 24平邮标准服务面单");
    LODOP.ADD_PRINT_RECT("3mm", "3mm", "74mm", "84mm", 0, 1);

    LODOP.ADD_PRINT_IMAGE(48, 253, 25, 25, "<img src='/static/images/battery.bmp' width='25'>"); //电池标识图
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_IMAGE(48, 228, 25, 25, "<img src='/static/images/return.gif' width='25'>"); //退件标识图
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_IMAGE(48, 202, 25, 25, "<img src='/static/images/insurance.jpg' width='25'>"); //保险标识图
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_RECT(280, "5mm", 264, 18, 0, 1);
    LODOP.ADD_PRINT_RECT(305, "5mm", 264, 18, 0, 1);

    LODOP.ADD_PRINT_TEXT(18, 236, 53, 31, Data.To.Country.CountryCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 20);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(76, 23, 275, 21, "联邮通LARGE LETTER 24平邮标准服务");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(97, 20, 268, 15, "TO:   " + Data.To.BuyerFullName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(114, 20, 36, 15, "TEL: ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(114, 53, 235, 15, Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT(132, 20, 266, 47, localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT(184, 20, 264, 20, Data.To.Country.CountryName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1);
    LODOP.ADD_PRINT_BARCODE(240, 30, 185, 35, "128Auto", Data.TrackingNumber);
    // LODOP.ADD_PRINT_BARCODE(240, 30, 185, 35, "128Auto", 'EH257275325CS');
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT(223, 39, 159, 15, Data.TrackingNumber);
    // LODOP.ADD_PRINT_TEXT(223, 39, 159, 15, 'EH257275325CS');
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(282, 23, 100, 13, "【202129214】");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.ADD_PRINT_TEXT(282, 132, 143, 12, "Ref No: " + Data.OrderCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.ADD_PRINT_TEXT(307, 23, 100, 10, "CS: S10164");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.ADD_PRINT_TEXT(307, 132, 100, 14, "SD: S4257");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");

    LODOP.PRINT();
  },

  // 4PX联邮通TR48标准服务面单  **何晓欣**
  FU: function(Data:Interface.PrintData, type?:string) {
    var localData = {
      ToAddress: Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == '' ? '' : ',' + Data.To.BuyerStreet2) + '\r\n' + Data.To.BuyerCity + '\r\n' + (Data.To.BuyerState == '' ? '' : Data.To.BuyerState + ',') + Data.To.BuyerZipCode,
    }
    LODOP.PRINT_INITA("0mm", "0mm", '80mm', '90mm', "面单-4PX联邮通TR48标准服务面单");

    var isVova = type === 'vova';

    LODOP.SET_PRINT_PAGESIZE(1, 800, 900, "面单-4PX联邮通TR48标准服务面单");
    LODOP.ADD_PRINT_RECT("3mm", "3mm", "74mm", "84mm", 0, 1);

    if (isVova) {
      LODOP.ADD_PRINT_TEXT(18, 21, 182, 21, "PO Box 737,Southall,YDH" + "\n" + 'UB3 9RE,UK');
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

      LODOP.ADD_PRINT_TEXT(76, 117, 182, 21, "联邮通挂号TR48标准服务");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
      LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
      LODOP.ADD_PRINT_TEXT(307, 20, '88%', 12, Data.Item[0].TitleEn + '*' + Data.Item[0].Quantity + (Data.Item[1] == undefined ? '' : '/' + (Data.Item[1].TitleEn + '*' + Data.Item[1].Quantity)) + (Data.Item[2] == undefined ? '' : '/' + (Data.Item[2].TitleEn + '*' + Data.Item[2].Quantity)));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    } else {
      LODOP.ADD_PRINT_IMAGE(48, 253, 25, 25, "<img src='/static/images/battery.bmp' width='25'>"); //电池标识图
      LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
      LODOP.ADD_PRINT_IMAGE(48, 228, 25, 25, "<img src='/static/images/return.gif' width='25'>"); //退件标识图
      LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
      LODOP.ADD_PRINT_IMAGE(48, 202, 25, 25, "<img src='/static/images/insurance.jpg' width='25'>"); //保险标识图
      LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);

      LODOP.ADD_PRINT_TEXT(74, 117, 182, 21, "联邮通挂号TR48标准服务");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
      LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    }

    LODOP.ADD_PRINT_RECT(isVova ? 263 : 279, "5mm", 264, 18, 0, 1);
    LODOP.ADD_PRINT_RECT(isVova ? 284 : 301, "5mm", 264, 18, 0, 1);

    LODOP.ADD_PRINT_TEXT(isVova ? 43 : 18, 236, 53, 31, Data.To.Country.CountryCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 20);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(97, 20, 268, 15, "TO:   " + Data.To.BuyerFullName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(114, 20, 36, 15, "TEL: ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(114, 53, 235, 15, Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT(132, 20, 266, 47, localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_TEXT(184, 20, 264, 20, Data.To.Country.CountryName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1);
    LODOP.ADD_PRINT_BARCODE(225, 30, 185, 35, "128Auto", Data.TrackingNumber);
    // LODOP.ADD_PRINT_BARCODE(240, 30, 185, 35, "128Auto", 'EH257275325CS');
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT(208, 39, 159, 15, Data.TrackingNumber);
    // LODOP.ADD_PRINT_TEXT(223, 39, 159, 15, 'EH257275325CS');
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(type == 'vova' ? 266 : 282, 23, 90, 13, "【202129214】");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT((type == 'vova' ? 265 : 282), (isVova ? 105 : 132), (isVova ? 177 : 100), 12, "Ref No: " + (isVova ? Data.ThirdPartyCode : Data.OrderCode));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    if (isVova) {
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    }
    LODOP.ADD_PRINT_TEXT(type == 'vova' ? 285 : 303, 23, 100, 10, "CS: " + (isVova ? 'S8631' : 'S10164'));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.ADD_PRINT_TEXT(type == 'vova' ? 285 : 303, 132, 150, 14, "SD: S4257" + (isVova ? '(X110)' : ''));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");

    LODOP.PRINT();
  },

  // 加拿大线下E邮宝  **何晓欣**
  ePacketOffCA: function(Data:Interface.PrintData) {
    var zipCodeHead = Data.To.BuyerZipCode.slice(0, 1).toLowerCase();
    var patt1 = /^[a-r]$/;
    var patt2 = /^[s-z]$/;
    var localData = {
      ToAddress: Data.To.BuyerFullName + "\n" + Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == '' ? '' : ',' + Data.To.BuyerStreet2) + "\n" + Data.To.BuyerCity + "," + (Data.To.BuyerState == '' ? '' : Data.To.BuyerState + ',') + Data.To.BuyerZipCode + "\n" + Data.To.Country.CountryName,
      FromAddress: Data.From.SendUserName + "\n" + (Data.From.Street2 == '' ? '' : Data.From.Street2 + ',') + Data.From.Street1 + "\n" + Data.From.City + "," + Data.From.SateOrProvince + "," + Data.From.ZipCode + "\n" + Data.From.Country.CountryName,
      LatticeMouth: patt1.test(zipCodeHead) ? 1 : patt2.test(zipCodeHead) ? 2 : 0
    }
    // LODOP.PRINT_INITA(2, 2, "100.01mm", "100.01mm", "面单-加拿大E邮宝");
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-加拿大E邮宝");

    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-加拿大E邮宝");
    LODOP.ADD_PRINT_RECT("2.65mm", "2.65mm", "95.01mm", "95.01mm", 0, 1);
    LODOP.ADD_PRINT_RECT("5.03mm", "4.76mm", "14.55mm", "11.64mm", 0, 1);
    LODOP.ADD_PRINT_LINE("11.91mm", "4.76mm", "11.64mm", "19.31mm", 0, 1);
    LODOP.ADD_PRINT_LINE("21.7mm", "2.65mm", "21.7mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("46.57mm", "2.65mm", "46.57mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("78.32mm", "2.65mm", "78.32mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("78.05mm", "22.75mm", "46.3mm", "22.75mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("4.5mm", "4.76mm", "14.82mm", "14.29mm", "CA");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 20);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("12.7mm", "5.29mm", "14.82mm", "5.56mm", "加拿大");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("3.7mm", "41.28mm", "23.81mm", "3.97mm", "ePacket");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_IMAGE("11.64mm", "37.84mm", "34.4mm", "7.94mm", "<img src='/static/images/中国邮政logo.png' width='107'/>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_LINE("10.32mm", "40.48mm", "10.05mm", "64.29mm", 0, 1);
    LODOP.ADD_PRINT_RECT("11.64mm", "19.31mm", "5.03mm", "5.03mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("12.17mm", "20.9mm", "1.85mm", "2.38mm", localData.LatticeMouth);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("17.73mm", "5.82mm", "91.55mm", "3.97mm", "From:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT("57.41mm", "5.29mm", "17.2mm", "10.85mm", "TO:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 24);
    LODOP.ADD_PRINT_TEXT("23.55mm", "6.09mm", "71.44mm", "22.23mm", localData.FromAddress + '\r\n' + 'PHONE: ' + Data.From.Phone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_IMAGE("23.02mm", "80.96mm", "15.88mm", "21.7mm", "<img src='/static/images/PrimeExpres-logo.jpg' height='82'/>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_TEXT("47.63mm", "27.25mm", "67.73mm", "28.58mm", localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_IMAGE("81.76mm", "77.79mm", "13.76mm", "11.11mm", "<img src='/static/images/无需签收图示.png' height='40'/>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_TEXT("92.6mm", "10.58mm", "11.38mm", "5.29mm", "Scan");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.SET_PRINT_STYLEA(0, "Italic", 1);
    LODOP.ADD_PRINT_TEXT("92.6mm", "73.55mm", "23.81mm", "5.29mm", "No Signature");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.SET_PRINT_STYLEA(0, "Italic", 1);

    LODOP.ADD_PRINT_BARCODE("84.4mm", "29.9mm", "39.69mm", "13.23mm", "128Auto", Data.TrackingNumber);
    LODOP.ADD_PRINT_TEXT("67.73mm", "34.93mm", "33.07mm", "7.94mm", Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_IMAGE("66.15mm", "27mm", "7.94mm", "7.67mm", "<img src='/static/images/phone.png' width='15px' height='15px'/>");
    LODOP.ADD_PRINT_IMAGE("81.76mm", "8.47mm", "13.76mm", "11.11mm", "<img src='/static/images/scan.png' height='40'/>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_TEXT("79.9mm", "24.61mm", "60mm", "2.65mm", "TO BE SCANNED BY CANADA POST");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");


    LODOP.PRINT();
  },

  // 线下加拿大e邮宝面单 **何晓欣**
  // mc-MethodCode  ePacketOffCA(将传入undefined)：线下加拿大E邮宝  11-1：wish邮-E邮宝  381：vova线上-E邮宝
  ePacketOffCA_back: function(Data:Interface.PrintData, mc:string) {
    var zipCodeHead = Data.To.BuyerZipCode.slice(0, 1).toLowerCase();
    var patt1 = /^[a-r]$/;
    var patt2 = /^[s-z]$/;
    var localData = {
      ToAddress: Data.To.BuyerFullName + "\n" + Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == '' ? '' : ',' + Data.To.BuyerStreet2) + "\n" + Data.To.BuyerCity + "," + (Data.To.BuyerState == '' ? '' : Data.To.BuyerState + ',') + Data.To.BuyerZipCode + "\n" + Data.To.Country.CountryName,
      FromAddress: Data.From.SendUserName + "\n" + (Data.From.Street2 == '' ? '' : Data.From.Street2 + ',') + Data.From.Street1 + "\n" + Data.From.City + "," + Data.From.SateOrProvince + "," + Data.From.ZipCode + "\n" + Data.From.Country.CountryName,
      LatticeMouth: patt1.test(zipCodeHead) ? 1 : patt2.test(zipCodeHead) ? 2 : 0,
      totalQty: 0,
      totalWeight: 0,
      totalValue: 0
    }
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-线下加拿大e邮宝面单");

    // LODOP.PRINT_INITA(2, 2, "100.01mm", "100.01mm", "面单-加拿大E邮宝");
    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-线下加拿大e邮宝面单");
    LODOP.ADD_PRINT_LINE(224, 7, 224, 369, 0, 1);
    LODOP.ADD_PRINT_LINE(86, 197, 86, 369, 0, 1);
    LODOP.ADD_PRINT_LINE(222, 197, 85, 197, 0, 1);
    LODOP.ADD_PRINT_LINE(202, 7, 202, 197, 0, 1);
    LODOP.ADD_PRINT_LINE(180, 7, 180, 197, 0, 1);
    LODOP.ADD_PRINT_LINE(304, 7, 303, 369, 0, 1);
    LODOP.ADD_PRINT_LINE(303, 27, 223, 27, 0, 1);
    LODOP.ADD_PRINT_LINE(303, 54, 223, 54, 0, 1);
    LODOP.ADD_PRINT_LINE(303, 306, 223, 306, 0, 1);
    LODOP.ADD_PRINT_LINE(303, 216, 223, 216, 0, 1);
    LODOP.ADD_PRINT_LINE(303, 256, 223, 256, 0, 1);
    LODOP.ADD_PRINT_RECT(6, 6, 364, 366, 0, 1);
    LODOP.ADD_PRINT_RECT(42, 116, 45, 54, 0, 1);
    LODOP.ADD_PRINT_LINE(247, 7, 247, 369, 0, 1);
    LODOP.ADD_PRINT_LINE(71, 116, 71, 161, 0, 1);
    LODOP.ADD_PRINT_LINE(284, 7, 284, 369, 0, 1);

    // 格口号
    LODOP.ADD_PRINT_TEXT(46, 117, 44, 19, "CA");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 16);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(76, 133, 21, 23, localData.LatticeMouth);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_BARCODE(13, 180, 190, 57, "128Auto", Data.TrackingNumber);
    LODOP.ADD_PRINT_IMAGE(10, 22, 110, 33, "<img src='/static/images/中国邮政logo.png' width='107'/>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);

    LODOP.ADD_PRINT_TEXT(45, 12, 96, 20, "IMPORTTANT:\n");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(58, 11, 109, 40, "The Itm/parcel may be opened officially Please print in English.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(110, 11, 179, 49, "FROM:" + localData.FromAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(169, 11, 167, 20, "PHONE:" + Data.From.Phone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(92, 202, 173, 20, "SHIP TO: " + Data.To.BuyerFullName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(107, 202, 170, 71, localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(209, 202, 154, 20, "PHONE: " + Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT(191, 11, 169, 20, "Fees (US$)："); // 未找到对应字段
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(212, 11, 169, 20, "Certificate No："); // 未找到对应字段
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT(307, 11, 366, 42, "I certify the particulars given in this customs declaration are correct.This Itm does not contain any dangerous article, or articles prohibitedby legislation or by postal or customs regulations. I have met allapplicable export filing requirements under the Foreign Trade Regulations");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("94.99mm", "2.65mm", "78.05mm", "5.29mm", "Sender's Signature & Date Signed: " + MdPrint.getChinaPostFlag(mc || 'ePacketOffCA'));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
    LODOP.ADD_PRINT_TEXT(348, 312, 60, 20, "CN22");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);

    // 表格头部
    LODOP.ADD_PRINT_TEXT(229, 10, 29, 25, "No");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(229, 33, 28, 25, "Qty");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(229, 60, 138, 25, "Description of Contents");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(229, 228, 26, 25, "Kg.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(229, 260, 53, 25, "Val(US$)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(230, 310, 66, 25, "Good Origin");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(290, 60, 145, 20, "Total Gross Weight(kg.)：");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    // SKU表格
    LODOP.ADD_PRINT_TEXT(251, 12, 28, 20, "1\n");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(251, 35, 30, 20, Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(252, 60, 168, 20, Data.Item[0].TitleEn + Data.Item[0].Title);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(252, 223, 46, 20, ((Data.Item[0].Weight / 1000) * Data.Item[0].Quantity).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(251, 276, 48, 20, (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(252, 329, 50, 20, "CN");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    if (Data.Item.length > 1) {
      LODOP.ADD_PRINT_TEXT(270, 12, 28, 20, "2");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(270, 35, 29, 20, Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(271, 60, 168, 20, Data.Item[1].TitleEn + Data.Item[1].Title);
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(271, 223, 47, 20, ((Data.Item[1].Weight / 1000) * Data.Item[1].Quantity).toFixed(3));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(270, 276, 49, 20, (Data.Item[1].Amount * Data.Item[1].Quantity).toFixed(2));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(270, 329, 47, 20, "CN");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

      LODOP.ADD_PRINT_LINE(265, 7, 265, 369, 0, 1);
      localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 2);
      localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 2);
      localData.totalValue = this.printTotalData(Data.Item, 'Amount', 2);
    } else {
      localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 1);
      localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 1);
      localData.totalValue = this.printTotalData(Data.Item, 'Amount', 1);
    }

    // SKU表格统计
    LODOP.ADD_PRINT_TEXT(290, 35, 26, 20, localData.totalQty);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(290, 223, 47, 20, (localData.totalWeight / 1000).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(290, 277, 37, 20, localData.totalValue.toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    LODOP.PRINT();
  },

  // 多国线下E邮宝  **何晓欣**
  ePacketOffALL: function(Data:Interface.PrintData) {
    // LogisticsExt转换为JSON
    if (Data.LogisticsExt != '' && typeof Data.LogisticsExt === 'string') {
      Data.LogisticsExt = JSON.parse(Data.LogisticsExt)
    }
    var localData = {
      ToAddress: Data.To.BuyerFullName + "\n" + Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == '' ? '' : ',' + Data.To.BuyerStreet2) + "\n" + Data.To.BuyerCity + "," + (Data.To.BuyerState == '' ? '' : Data.To.BuyerState + ',') + Data.To.BuyerZipCode + " " + Data.To.Country.CountryName,
      FromAddress: Data.From.SendUserName + "\n" + (Data.From.Street2 == '' ? '' : Data.From.Street2 + ',') + Data.From.Street1 + "\n" + Data.From.City + "," + Data.From.SateOrProvince + "," + Data.From.ZipCode + "\n" + Data.From.Country.CountryName,
    }
    if (Data.To.Country.CountryCode == 'GB') { // 是否为英国流向
      this.printEpackageOfAllGB(Data, localData)
    } else if(Data.To.Country.CountryCode == 'JP'){ // 日本流向
      this.printEpackageOfAllJP(Data, localData)
    } else {
      this.printEpackageOfAll(Data, localData)
    }
  },

  // 多国线下E邮宝 英国流向  **何晓欣**
  printEpackageOfAllGB(Data:Interface.PrintData, localData:Interface.LocalData) {
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-多国线下E邮宝-英国流向");

    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-多国线下E邮宝-英国流向");

    LODOP.ADD_PRINT_RECT("2.65mm", "2.65mm", "95.01mm", "95.01mm", 0, 1);
    LODOP.ADD_PRINT_LINE("23.5mm", "2.65mm", "23.5mm", "97.63mm", 0, 2);
    LODOP.ADD_PRINT_LINE("48.71mm", "2.65mm", "48.71mm", "97.63mm", 0, 2);
    LODOP.ADD_PRINT_LINE("69.9mm", "2.65mm", "69.9mm", "97.63mm", 0, 2);
    LODOP.ADD_PRINT_LINE("48.42mm", "22.75mm", "70.11mm", "22.75mm", 0, 2);
    LODOP.ADD_PRINT_RECT("5.29mm", "6.09mm", "15.88mm", "10.85mm", 0, 2);
    LODOP.ADD_PRINT_LINE("10.9mm", "35.19mm", "10.9mm", "64.29mm", 0, 1);

    LODOP.ADD_PRINT_IMAGE("3.97mm", "36.25mm", "32.01mm", "6.61mm", "<img src='/static/images/中国邮政logo.png' width='107'/>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 2);
    LODOP.ADD_PRINT_IMAGE("11.64mm", "41.33mm", "17.99mm", "11.91mm", "<img src='/static/images/RoyalMail2.png' width='60px' height='30px'/>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 2);
    LODOP.ADD_PRINT_IMAGE("4.23mm", "78.46mm", "13.55mm", "17.2mm", "<img src='/static/images/PrimeExpres-logo.jpg'>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 2);
    LODOP.ADD_PRINT_TEXT("7.67mm", "7.14mm", "14.29mm", "7.94mm", "英国");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 16);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("19.05mm", "4.5mm", "26.46mm", "3.97mm", "Return to");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("25.4mm", "4mm", "92.87mm", "22.49mm", localData.FromAddress + '\r\n' + 'PHONE: ' + Data.From.Phone);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT("54.24mm", "5.82mm", "16.93mm", "12.17mm", "TO:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 24);
    LODOP.ADD_PRINT_TEXT("49.48mm", "23.81mm", "52.65mm", "19.84mm", localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");

    LODOP.ADD_PRINT_IMAGE("75.14mm", "8.47mm", "13.76mm", "11.11mm", "<img src='/static/images/投递需扫描图示.png' height='40'/>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_IMAGE("75.14mm", "78.32mm", "13.76mm", "11.11mm", "<img src='/static/images/无需签收图示.png' height='40'/>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_TEXT("86.25mm", "10.58mm", "11.38mm", "5.29mm", "Scan");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.SET_PRINT_STYLEA(0, "Italic", 1);
    LODOP.ADD_PRINT_TEXT("86.25mm", "76.2mm", "22.49mm", "5.29mm", "No Signature");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.SET_PRINT_STYLEA(0, "Italic", 1);
    LODOP.ADD_PRINT_TEXT("73.82mm", "22.49mm", "54.24mm", "2.65mm", "Royal Mail Delivery Confirmation");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_BARCODE("78.32mm", "24.08mm", "50.54mm", "13.23mm", "128Auto", Data.TrackingNumber);
    LODOP.ADD_PRINT_TEXT("65.88mm", "28.58mm", "33.07mm", "7.94mm", Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_IMAGE("64.82mm", "23.28mm", "4.76mm", "4.5mm", "<img src='/static/images/phone.png' width='15px' height='15px'/>");


    LODOP.PRINT()
  },

  // 多国线下E邮宝 日本流向  **冯上胜**
  printEpackageOfAllJP(Data:Interface.PrintData, localData:Interface.LocalData) {
    LODOP.PRINT_INITA("0mm","0mm","100.00mm","100.00mm","面单-多国线下E邮宝-日本流向");

    LODOP.SET_PRINT_PAGESIZE(1,1000,1000,"面单-多国线下E邮宝-日本流向");
    LODOP.ADD_PRINT_RECT("2.65mm","2.65mm","95.01mm","95.01mm",0,1);
    LODOP.ADD_PRINT_RECT("5.03mm","4.76mm","20.48mm","11.64mm",0,1);
    LODOP.ADD_PRINT_LINE("11.91mm","4.76mm","11.91mm","24.63mm",0,1);
    LODOP.ADD_PRINT_LINE("21.7mm","2.65mm","21.7mm","97.95mm",0,1);
    LODOP.ADD_PRINT_LINE("46.59mm","2.65mm","46.59mm","97.95mm",0,1);
    LODOP.ADD_PRINT_LINE("78.29mm","2.65mm","78.29mm","97.95mm",0,1);
    LODOP.ADD_PRINT_LINE("78.11mm","22.81mm","46.3mm","22.81mm",0,1);

    // 头部格口号
    LODOP.ADD_PRINT_TEXT("4.5mm","5.03mm","20.37mm","14.29mm", Data.To.Country.CountryCode);
    LODOP.SET_PRINT_STYLEA(0,"FontName","Arial");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",20);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    LODOP.SET_PRINT_STYLEA(0,"Bold",1);
    LODOP.ADD_PRINT_TEXT("12.7mm","5.29mm","20.48mm","5.56mm", Data.To.Country.CountryNameCn);
    if (Data.To.Country.CountryNameCn.length > 6) {
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    } else {
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    }
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    LODOP.SET_PRINT_STYLEA(0,"Bold",1);
    LODOP.ADD_PRINT_TEXT("3.7mm","41.28mm","23.81mm","3.97mm","ePacket");
    LODOP.SET_PRINT_STYLEA(0,"FontName","Arial");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",15);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    LODOP.ADD_PRINT_IMAGE("11.64mm", "37.84mm", "34.4mm", "7.94mm", "<img src='/static/images/中国邮政logo.png' width='107'/>");
    LODOP.SET_PRINT_STYLEA(0,"Stretch",1);
    LODOP.ADD_PRINT_LINE("10.29mm","40.48mm","10.29mm","64.29mm",0,1);

    LODOP.ADD_PRINT_TEXT("17.73mm","5.82mm","91.55mm","3.97mm","From:");
    LODOP.SET_PRINT_STYLEA(0,"FontName","Arial");
    LODOP.ADD_PRINT_TEXT("57.41mm","5.29mm","17.2mm","10.85mm","TO:");
    LODOP.SET_PRINT_STYLEA(0,"FontName","arial");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",24);

    LODOP.ADD_PRINT_TEXT("23.55mm", "6.09mm", "71.44mm", "22.23mm", localData.FromAddress + '\r\n' + 'PHONE: ' + Data.From.Phone);
    LODOP.SET_PRINT_STYLEA(0,"FontName","Arial");
    LODOP.ADD_PRINT_IMAGE("23.02mm", "80.96mm", "15.88mm", "21.7mm", "<img src='/static/images/PrimeExpres-logo.jpg' height='82'/>");
    LODOP.SET_PRINT_STYLEA(0,"Stretch",1);
    LODOP.ADD_PRINT_TEXT("47.63mm", "24.5mm", "67.73mm", "28.58mm", localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0,"FontName","Arial");

    LODOP.ADD_PRINT_IMAGE("81.76mm", "78.32mm", "13.76mm", "11.11mm", "<img src='/static/images/无需签收图示.png' height='40'/>");
    LODOP.SET_PRINT_STYLEA(0,"Stretch",1);
    LODOP.ADD_PRINT_TEXT("92.87mm","73.03mm","23.81mm","5.29mm","No Signature");
    LODOP.SET_PRINT_STYLEA(0,"FontName","Arial");
    LODOP.SET_PRINT_STYLEA(0,"Bold",1);
    LODOP.SET_PRINT_STYLEA(0,"Italic",1);
    LODOP.ADD_PRINT_BARCODE("84.4mm", "29.9mm", "39.69mm", "13.23mm", "128Auto", Data.TrackingNumber);
    LODOP.ADD_PRINT_TEXT("70.91mm", "30.03mm", "33.07mm", "7.94mm", Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0,"FontName","Arial");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
    LODOP.ADD_PRINT_IMAGE("70.11mm", "24.21mm", "4.5mm", "4.67mm", "<img src='/static/images/phone.png' width='15px' height='15px'/>");

    LODOP.ADD_PRINT_IMAGE("81.76mm", "8.47mm", "13.76mm", "11.11mm", "<img src='/static/images/投递需扫描图示.png' height='40'/>");
    LODOP.SET_PRINT_STYLEA(0,"Stretch",1);
    LODOP.ADD_PRINT_TEXT("79.9mm","28.84mm","50.72mm","2.65mm","DELIVERY CONFIRMATION");
    LODOP.SET_PRINT_STYLEA(0,"FontName","Arial");
    LODOP.ADD_PRINT_TEXT("92.87mm","10.58mm","11.38mm","5.29mm","Scan");
    LODOP.SET_PRINT_STYLEA(0,"FontName","arial");
    LODOP.SET_PRINT_STYLEA(0,"Bold",1);
    LODOP.SET_PRINT_STYLEA(0,"Italic",1);

    LODOP.ADD_PRINT_RECT("11.91mm","25.14mm","11.64mm","4.76mm",0,1);
    LODOP.ADD_PRINT_TEXT("12.96mm","25.14mm","11.91mm","3.18mm",(Number(Data.To.BuyerZipCode.substring(0,3)) <= 519 || Number(Data.To.BuyerZipCode.substring(0,3))>=940) ?  '1':'2' );
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    LODOP.SET_PRINT_STYLEA(0,"Bold",1);
    LODOP.SET_PRINT_STYLEA(0,"AlignJustify",1);

    LODOP.PRINT();
  },

  // 多国线下E邮宝 其他流向  **何晓欣**
  printEpackageOfAll(Data:Interface.PrintData, localData:Interface.LocalData) {
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-多国线下E邮宝-其他流向");

    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-多国线下E邮宝-其他流向");
    LODOP.ADD_PRINT_RECT("2.65mm", "2.65mm", "95.01mm", "95.01mm", 0, 1);
    LODOP.ADD_PRINT_RECT("5.03mm", "4.76mm", "30mm", "11.64mm", 0, 1);
    LODOP.ADD_PRINT_LINE("11.91mm", "4.76mm", "11.91mm", "35mm", 0, 1);
    LODOP.ADD_PRINT_LINE("21.7mm", "2.65mm", "21.7mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("46.57mm", "2.65mm", "46.57mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("78.32mm", "2.65mm", "78.32mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("78.05mm", "22.75mm", "46.3mm", "22.75mm", 0, 1);

    // 头部格口号
    LODOP.ADD_PRINT_TEXT("4.5mm", "10.58mm", "14.82mm", "14.29mm", Data.To.Country.CountryCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 20);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("12.7mm", "5.29mm", "30mm", "5.56mm", Data.To.Country.CountryNameCn);
    if (Data.To.Country.CountryNameCn.length > 6) {
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    } else {
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    }
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_TEXT("3.7mm", "41.28mm", "23.81mm", "3.97mm", "ePacket");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_IMAGE("11.64mm", "37.84mm", "34.4mm", "7.94mm", "<img src='/static/images/中国邮政logo.png' width='107'/>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_LINE("10.32mm", "40.48mm", "10.32mm", "64.29mm", 0, 1);

    LODOP.ADD_PRINT_TEXT("17.73mm", "5.82mm", "91.55mm", "3.97mm", "From:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT("57.41mm", "5.29mm", "17.2mm", "10.85mm", "TO:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 24);
    LODOP.ADD_PRINT_TEXT("21.96mm","5.03mm","71.44mm","22.23mm", localData.FromAddress + '\r\n' + 'PHONE: ' + Data.From.Phone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    if ( Data.To.Country.CountryCode=='KR' || Data.To.Country.CountryCode=='MY' || Data.To.Country.CountryCode=='SG' ) {
      LODOP.ADD_PRINT_IMAGE("23.02mm", "80.96mm", "15.88mm", "21.7mm", "<img src='/static/images/PrimeExpres-logo2.jpg' height='82'/>");
    } else {
      LODOP.ADD_PRINT_IMAGE("23.02mm", "80.96mm", "15.88mm", "21.7mm", "<img src='/static/images/PrimeExpres-logo.jpg' height='82'/>");
    }

    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_TEXT("47.63mm", "24.5mm", "67.73mm", "28.58mm", localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");

    LODOP.ADD_PRINT_IMAGE("81.76mm", "78.32mm", "13.76mm", "11.11mm", "<img src='/static/images/无需签收图示.png' height='40'/>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_TEXT("92.87mm", "73.03mm", "23.81mm", "5.29mm", "No Signature");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.SET_PRINT_STYLEA(0, "Italic", 1);
    LODOP.ADD_PRINT_BARCODE("84.4mm", "29.9mm", "39.69mm", "13.23mm", "128Auto", Data.TrackingNumber);
    LODOP.ADD_PRINT_TEXT("70.91mm", "30.03mm", "33.07mm", "7.94mm", Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_IMAGE("70.11mm", "24.21mm", "4.5mm", "4.67mm", "<img src='/static/images/phone.png' width='15px' height='15px'/>");
    // 巴西渠道增加税号
    // 线下E邮宝（帐号1、多渠道），ApiType=3，渠道代码ePacketOffALL
    // Wish邮-E邮宝，ApiType=11，渠道代码11-1
    // Vova线上-E邮宝，ApiType=24，渠道代码381
    // 佛山线下E邮宝, ApiTyp=32, 渠道代码FSEPACKET
    if (Data.To.BuyerCountry=='BR' && (Data.MethodApiType==3 || Data.MethodApiType==11 || Data.MethodApiType==24 || Data.MethodApiType==32) && (Data.MethodCode=='ePacketOffALL'||Data.MethodCode=='11-1'||Data.MethodCode=='381'||Data.MethodCode=='FSEPACKET')) {
      LODOP.ADD_PRINT_TEXT("65.88mm","24.87mm","13.23mm","5.29mm","TAX ID:");
      LODOP.SET_PRINT_STYLEA(0,"FontName","Arial");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
      LODOP.ADD_PRINT_TEXT("65.88mm","36.51mm","73.03mm","5.29mm", (Data.LogisticsExt.TaxNumber?Data.LogisticsExt.TaxNumber:''));
      LODOP.SET_PRINT_STYLEA(0,"FontName","Arial");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
    }
    if(Data.LogisticsExt.NorwayVatNumber && (Data.MethodApiType==3 || Data.MethodApiType==11 || Data.MethodApiType==24 || Data.MethodApiType==32) && (Data.MethodCode=='ePacketOffALL'||Data.MethodCode=='11-1'||Data.MethodCode=='381'||Data.MethodCode=='FSEPACKET')){
      let s = Data.LogisticsExt.NorwayVatNumber.substring(0,1) + "*****" + Data.LogisticsExt.NorwayVatNumber.substring(6)
      LODOP.ADD_PRINT_TEXT("40.75mm","5.03mm","60.59mm","5.29mm",`VAT No: VOEC ${s}`);
      LODOP.SET_PRINT_STYLEA(0,"FontName","Arial");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
    }

    if (Data.To.Country.CountryCode == 'SE') {
      LODOP.ADD_PRINT_BARCODE("61.38mm", "69.85mm", "26.46mm", "10.32mm", "128Auto", Data.To.BuyerZipCode);
      LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
      LODOP.ADD_PRINT_TEXT("72.76mm", "75.94mm", "68.26mm", "3.97mm", 'ZIP  ' + Data.To.BuyerZipCode);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    } else if (Data.To.Country.CountryCode == 'RU') {
      LODOP.ADD_PRINT_IMAGE("81.76mm", "8.47mm", "13.76mm", "11.11mm", "<img src='/static/images/scan.png' height='40'/>");
      LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
      LODOP.ADD_PRINT_TEXT("79.9mm", "24.61mm", "60mm", "2.65mm", "TO BE SCANNED BY RUSSIA POST");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    }
    if (Data.To.Country.CountryCode != 'RU') {
      LODOP.ADD_PRINT_IMAGE("81.76mm", "8.47mm", "13.76mm", "11.11mm", "<img src='/static/images/投递需扫描图示.png' height='40'/>");
      LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
      LODOP.ADD_PRINT_TEXT("79.9mm", "28.84mm", "50.71mm", "2.65mm", "DELIVERY CONFIRMATION");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.ADD_PRINT_TEXT("92.87mm", "10.58mm", "11.38mm", "5.29mm", "Scan");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
      LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
      LODOP.SET_PRINT_STYLEA(0, "Italic", 1);
    }
    LODOP.PRINT();
    // LODOP.PRINT_DESIGN();
  },

  // 多国线下e邮宝面单 **何晓欣**
  // mc-MethodCode  ePacketOffALL(将会传入undefined)-线下E邮宝（账号1、多渠道）  11-1：wish邮-E邮宝  381：vova线上-E邮宝
  ePacketOffALL_back: function(Data:Interface.PrintData, mc:string) {
    var localData = {
      ToAddress: Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == '' ? '' : ',' + Data.To.BuyerStreet2) + "\n" + Data.To.BuyerCity + "," + (Data.To.BuyerState == '' ? '' : Data.To.BuyerState + ',') + Data.To.BuyerZipCode + "\n" + Data.To.Country.CountryName,
      FromAddress: Data.From.SendUserName + "\n" + (Data.From.Street2 == '' ? '' : Data.From.Street2 + ',') + Data.From.Street1 + "\n" + Data.From.City + "," + Data.From.SateOrProvince + "," + Data.From.ZipCode + "\n" + Data.From.Country.CountryName,
      totalQty: 0,
      totalWeight: 0,
      totalValue: 0
    }
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-多国线下E邮宝");

    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-多国线下E邮宝");
    LODOP.ADD_PRINT_LINE(224, 7, 224, 369, 0, 1);
    LODOP.ADD_PRINT_LINE(86, 197, 86, 369, 0, 1);
    LODOP.ADD_PRINT_LINE(222, 197, 85, 197, 0, 1);
    LODOP.ADD_PRINT_LINE(202, 7, 202, 197, 0, 1);
    LODOP.ADD_PRINT_LINE(180, 7, 180, 197, 0, 1);
    LODOP.ADD_PRINT_LINE(304, 7, 303, 369, 0, 1);
    LODOP.ADD_PRINT_LINE(303, 27, 223, 27, 0, 1);
    LODOP.ADD_PRINT_LINE(303, 54, 223, 54, 0, 1);
    LODOP.ADD_PRINT_LINE(303, 306, 223, 306, 0, 1);
    LODOP.ADD_PRINT_LINE(303, 216, 223, 216, 0, 1);
    LODOP.ADD_PRINT_LINE(303, 256, 223, 256, 0, 1);
    LODOP.ADD_PRINT_RECT(6, 6, 364, 366, 0, 1);
    LODOP.ADD_PRINT_LINE(247, 7, 247, 369, 0, 1);
    LODOP.ADD_PRINT_LINE(284, 7, 284, 369, 0, 1);

    // 格口号 英国流向不需要格口号
    if (Data.To.Country.CountryCode != 'GB') {
      LODOP.ADD_PRINT_RECT(42, 116, 45, 27, 0, 1);
      LODOP.ADD_PRINT_TEXT(46, 117, 44, 19, Data.To.Country.CountryCode);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 16);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    }
    LODOP.ADD_PRINT_BARCODE(13, 180, 190, 57, "128Auto", Data.TrackingNumber);
    LODOP.ADD_PRINT_IMAGE(10, 22, 110, 33, "<img src='/static/images/中国邮政logo.png' width='107'/>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);

    LODOP.ADD_PRINT_TEXT(45, 12, 96, 20, "IMPORTTANT:\n");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(58, 11, 109, 40, "The Itm/parcel may be opened officially Please print in English.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(103, 11, 179, 49, "FROM:" + localData.FromAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(155, 11, 167, 20, "PHONE:" + Data.From.Phone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(90, 202, 100, 20, "SHIP TO:" + Data.To.BuyerFullName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(120, 202, 153, 71, localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    // 巴西渠道增加税号
    // Wish邮-E邮宝，ApiType=11，渠道代码11-1
    // Vova线上-E邮宝，ApiType=24，渠道代码381
    // 线下E邮宝（帐号1、多渠道），ApiType=3，渠道代码ePacketOffALL
    // 佛山线下E邮宝, ApiTyp=32, 渠道代码FSEPACKET
    if (Data.To.BuyerCountry=='BR' && (Data.MethodApiType==24　|| Data.MethodApiType==11 || Data.MethodApiType==3|| Data.MethodApiType==32) && (Data.MethodCode=='381'|| Data.MethodCode=='11-1' || Data.MethodCode=='ePacketOffALL'||Data.MethodCode=='FSEPACKET')) {
      LODOP.ADD_PRINT_TEXT(199, 202, 154, 20, "TAX ID: " + (Data.LogisticsExt.TaxNumber?Data.LogisticsExt.TaxNumber:''));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    }

    if(Data.LogisticsExt.NorwayVatNumber && (Data.MethodApiType==24　|| Data.MethodApiType==11 || Data.MethodApiType==3|| Data.MethodApiType==32) && (Data.MethodCode=='381'|| Data.MethodCode=='11-1' || Data.MethodCode=='ePacketOffALL'||Data.MethodCode=='FSEPACKET')){
      let s = Data.LogisticsExt.NorwayVatNumber.substring(0,1) + "*****" + Data.LogisticsExt.NorwayVatNumber.substring(6)
      LODOP.ADD_PRINT_TEXT(166,11,172,20,`VAT No: VOEC ${s}`);
      LODOP.SET_PRINT_STYLEA(0,"FontName","Arial");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
    }

    LODOP.ADD_PRINT_TEXT(209, 202, 154, 20, "PHONE: " + Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT(191, 11, 169, 20, "Fees (US$)："); // 未找到对应字段
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(212, 11, 169, 20, "Certificate No："); // 未找到对应字段
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT(307, 11, 366, 42, "I certify the particulars given in this customs declaration are correct.This Itm does not contain any dangerous article, or articles prohibitedby legislation or by postal or customs regulations. I have met allapplicable export filing requirements under the Foreign Trade Regulations");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("94.99mm", "2.65mm", "76.73mm", "5.29mm", "Sender's Signature & Date Signed: " + MdPrint.getChinaPostFlag(mc));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
    LODOP.ADD_PRINT_TEXT(348, 312, 60, 20, "CN22");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);

    // 表格头部
    LODOP.ADD_PRINT_TEXT(229, 10, 29, 25, "No");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(229, 33, 28, 25, "Qty");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(229, 60, 138, 25, "Description of Contents");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(229, 228, 26, 25, "Kg.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(229, 260, 53, 25, "Val(US$)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(230, 310, 66, 25, "Good Origin");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(290, 60, 145, 20, "Total Gross Weight(kg.)：");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    // SKU表格
    LODOP.ADD_PRINT_TEXT(251, 12, 28, 20, "1\n");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(251, 35, 30, 20, Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(252, 60, 168, 20, Data.Item[0].TitleEn + Data.Item[0].Title);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(252, 223, 46, 20, ((Data.Item[0].Weight / 1000) * Data.Item[0].Quantity).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(251, 276, 48, 20, (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(252, 329, 50, 20, "CN");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    if (Data.Item.length > 1) {
      LODOP.ADD_PRINT_TEXT(270, 12, 28, 20, "2");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(270, 35, 29, 20, Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(271, 60, 168, 20, Data.Item[1].TitleEn + Data.Item[1].Title);
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(271, 223, 47, 20, ((Data.Item[1].Weight / 1000) * Data.Item[1].Quantity).toFixed(3));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(270, 276, 49, 20, (Data.Item[1].Amount * Data.Item[1].Quantity).toFixed(2));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(270, 329, 47, 20, "CN");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

      LODOP.ADD_PRINT_LINE(265, 7, 265, 369, 0, 1);
      localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 2);
      localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 2);
      localData.totalValue = this.printTotalData(Data.Item, 'Amount', 2);
    } else {
      localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 1);
      localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 1);
      localData.totalValue = this.printTotalData(Data.Item, 'Amount', 1);
    }

    // SKU表格统计
    LODOP.ADD_PRINT_TEXT(290, 35, 26, 20, localData.totalQty);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(290, 223, 47, 20, (localData.totalWeight / 1000).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(290, 277, 37, 20, localData.totalValue.toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    if (Data.To.Country.CountryCode == 'RU') {
      let code = Number(Data.To.BuyerZipCode.substr(0, 3));
      let sortCode: string|number = '';
      if ((code >= 101 && code <= 157) || (code >= 170 && code <= 172) || (code >= 210 && code <= 309) || (code >= 346 && code <= 347) || (code == 629) || (code >= 352 && code <= 359) || (code >= 390 && code <= 391) || (code == 689)) {
        sortCode = 1;
      } else if ((code >= 632 && code <= 634) || (code >= 640 && code <= 641) || (code >= 646 && code <= 649) || (code >= 652 && code <= 656) || (code >= 658 && code <= 660) || (code >= 662 && code <= 688) || (code >= 692 && code <= 694) || (code == 630) || (code == 636) || (code == 644) || (code == 650) || (code == 651) || (code == 690)) {
        sortCode = 2;
      } else if ((code >= 160 && code <= 169) || (code >= 173 && code <= 175) || (code >= 180 && code <= 188) || (code >= 190 && code <= 199)) {
        sortCode = 3;
      } else if ((code >= 360 && code <= 364) || (code >= 366 && code <= 369) || (code >= 370 && code <= 384) || (code >= 385 && code <= 386) || (code >= 392 && code <= 393) || (code >= 394 && code <= 399) || (code >= 400 && code <= 401) || (code >= 403 && code <= 405) || (code >= 406 && code <= 409) || (code >= 412 && code <= 414) ||
        (code >= 420 && code <= 423) || (code >= 425 && code <= 433) || (code >= 442 && code <= 446) || (code >= 452 && code <= 457) || (code >= 460 && code <= 462) || (code >= 612 && code <= 614) || (code >= 617 && code <= 620) || (code >= 622 && code <= 624) ||
        (code >= 626 && code <= 628) || code == 344 || code == 350 || code == 410 || code == 416 || code == 424 || code == 440 || code == 450 || code == 610) {
        sortCode = 4;
      } else {
        sortCode = 'NONE';
      }
      LODOP.ADD_PRINT_RECT("18.26mm", "30.69mm", "11.91mm", "5.29mm", 0, 1);
      LODOP.ADD_PRINT_TEXT("19.84mm", "35.45mm", "5.03mm", "5.29mm", sortCode);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    }

    if(Data.To.Country.CountryCode == 'JP'){
      LODOP.ADD_PRINT_RECT(69,116,45,25,0,1);
      LODOP.ADD_PRINT_TEXT(77,118,44,15,(Number(Data.To.BuyerZipCode.substring(0,3)) <= 519 || Number(Data.To.BuyerZipCode.substring(0,3))>=940) ?  '1':'2');
      LODOP.SET_PRINT_STYLEA(0,"FontName","新宋体");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
      LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
      LODOP.SET_PRINT_STYLEA(0,"Bold",1);
    }

    LODOP.PRINT();
    // LODOP.PRINT_DESIGN();
  },

  // 线上美国E邮宝  **何晓欣**
  ePacketUS: function(Data: Interface.PrintData) {
    var zipCodeHead = Data.To.BuyerZipCode.slice(0, 3);
    var localData = {
      ToAddress: Data.To.BuyerFullName + "\n" + Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == '' ? '' : ',' + Data.To.BuyerStreet2) + "\n" + Data.To.BuyerCity + "," + (Data.To.BuyerState == '' ? '' : Data.To.BuyerState + ',') + Data.To.BuyerZipCode + "\n" + Data.To.Country.CountryName,
      FromAddress: 'FROM: ' + Data.From.SendUserName + "\n" + (Data.From.Street2 == '' ? '' : Data.From.Street2 + ',') + Data.From.Street1 + "\n" + Data.From.City + "," + Data.From.SateOrProvince + "," + Data.From.ZipCode + "\n" + Data.From.Country.CountryName
    }
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-线上美国E邮宝");

    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-线上美国E邮宝");

    LODOP.ADD_PRINT_RECT("2.65mm", "2.65mm", "95.01mm", "95.01mm", 0, 1);
    LODOP.ADD_PRINT_RECT("5.03mm", "5.03mm", "13.23mm", "13.23mm", 0, 1);
    LODOP.ADD_PRINT_LINE("25.4mm", "2.65mm", "25.4mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("52.39mm", "2.65mm", "52.39mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("75.14mm", "2.65mm", "75.14mm", "97.9mm", 0, 3);

    LODOP.ADD_PRINT_TEXT("3.97mm", "7.14mm", "10.05mm", "14.29mm", "F");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 40);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_IMAGE("4.23mm", "32.28mm", "34.66mm", "7.94mm", "<img src='/static/images/中国邮政logo.png' width='130'>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_LINE("12.7mm", "29.1mm", "12.7mm", "68mm", 0, 1);
    LODOP.ADD_PRINT_IMAGE("12.96mm", "31.75mm", "34.66mm", "7.94mm", "<img src='/static/images/美国邮政logo.jpg' height='30'>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_TEXT("20.11mm", "39.95mm", "18.52mm", "3.97mm", "ePacket");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("20.64mm", "55.56mm", "5.56mm", "3.7mm", "TM");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 5);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_RECT("4.5mm", "75.94mm", "19.58mm", "12.17mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("6.35mm", "77.26mm", "17.73mm", "9.53mm", "Airmail\r\nPostage Paid\r\nChina Post");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", "-0.26mm");
    LODOP.ADD_PRINT_TEXT("18.52mm", "82.02mm", "10.85mm", "5.29mm", this.getUSLatticeMouth(Number(zipCodeHead)));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("26.46mm", "3.97mm", "52.92mm", "14.55mm", localData.FromAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_LINE("52.12mm", "57.15mm", "25.14mm", "57.12mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("43.66mm", "3.97mm", "53.45mm", "7.41mm", "Customs infomation available on attached CN22.\r\nUSPS Personnel Scan barcode below for delivery event infomation");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_LINE("52.12mm", "19.31mm", "74.88mm", "19.31mm", 0, 1);
    LODOP.ADD_PRINT_BARCODE("28.84mm", "61.12mm", "34.66mm", "17.2mm", "128Auto", '420' + Data.To.BuyerZipCode);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT("47.36mm", "70.64mm", "29.37mm", "5.29mm", "ZIP" + Data.To.BuyerZipCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT("59.27mm", "4.23mm", "15.35mm", "11.91mm", "TO:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 21);
    LODOP.ADD_PRINT_TEXT("53.98mm", "63.76mm", "34.93mm", "5.29mm", "PHONE: " + Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("53.98mm", "21.17mm", "73.03mm", "20.37mm", localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("76.99mm", "36.25mm", "33.87mm", "5.29mm", "UPSPS TRACKING #");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_BARCODE("82.02mm", "21.43mm", "60.59mm", "15.88mm", "128Auto", Data.TrackingNumber);

    LODOP.PRINT();
  },

  // 线上美国e邮宝面单  **何晓欣**
  ePacketUS_back: function(Data: Interface.PrintData) {
    var zipCodeHead = Data.To.BuyerZipCode.slice(0, 3);
    var localData = {
      ToAddress: Data.To.BuyerFullName + "\n" + Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == '' ? '' : ',' + Data.To.BuyerStreet2) + "\n" + Data.To.BuyerCity + "\n" + (Data.To.BuyerState == '' ? '' : Data.To.BuyerState + '\n') + Data.To.BuyerZipCode + "\n" + Data.To.Country.CountryName,
      FromAddress: Data.From.SendUserName + "\n" + (Data.From.Street2 == '' ? '' : Data.From.Street2 + ',') + Data.From.Street1 + "\n" + Data.From.City + "," + Data.From.SateOrProvince + "," + Data.From.ZipCode + "\n" + Data.From.Country.CountryName,
      totalQty: 0,
      totalWeight: 0,
      totalValue: 0,
    }
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-线上美国e邮宝");

    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-线上美国e邮宝");
    LODOP.ADD_PRINT_LINE(228, 7, 228, 369, 0, 1);
    LODOP.ADD_PRINT_LINE(86, 197, 86, 369, 0, 1);
    LODOP.ADD_PRINT_LINE(227, 197, 85, 197, 0, 1);
    LODOP.ADD_PRINT_LINE(205, 7, 205, 197, 0, 1);
    LODOP.ADD_PRINT_LINE(184, 7, 184, 197, 0, 1);
    LODOP.ADD_PRINT_LINE(308, 7, 308, 369, 0, 1);
    LODOP.ADD_PRINT_LINE(307, 27, 227, 27, 0, 1);
    LODOP.ADD_PRINT_LINE(307, 54, 227, 54, 0, 1);
    LODOP.ADD_PRINT_LINE(307, 306, 227, 306, 0, 1);
    LODOP.ADD_PRINT_LINE(307, 217, 227, 217, 0, 1);
    LODOP.ADD_PRINT_LINE(307, 257, 227, 257, 0, 1);
    LODOP.ADD_PRINT_RECT(6, 6, 364, 364, 0, 1);
    LODOP.ADD_PRINT_RECT(46, 116, 45, 54, 0, 1);
    LODOP.ADD_PRINT_LINE(247, 7, 247, 369, 0, 1);
    LODOP.ADD_PRINT_LINE(75, 116, 75, 161, 0, 1);
    LODOP.ADD_PRINT_LINE(288, 7, 288, 369, 0, 1);

    // 格口号
    LODOP.ADD_PRINT_TEXT(50, 117, 44, 19, "US");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 16);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(80, 127, 36, 23, this.getUSLatticeMouth(Number(zipCodeHead)));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_BARCODE(17, 180, 190, 57, "128Auto", Data.TrackingNumber);
    LODOP.ADD_PRINT_IMAGE(14, 22, 110, 33, "<img src='/static/images/中国邮政logo.png' width='107'/>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);

    LODOP.ADD_PRINT_TEXT(49, 12, 96, 20, "IMPORTTANT:\n");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(62, 11, 109, 40, "The Itm/parcel may be opened officially Please print in English.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(114, 11, 179, 49, "FROM:" + localData.FromAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(173, 11, 167, 20, "PHONE:" + Data.From.Phone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(94, 202, 153, 110, "SHIP TO: " + localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(213, 202, 154, 20, "PHONE: " + Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT(195, 11, 169, 20, "Fees (US$)："); // 未找到对应字段
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(216, 11, 169, 20, "Certificate No："); // 未找到对应字段
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT(308, 11, 366, 42, "I certify the particulars given in this customs declaration are correct.This Itm does not contain any dangerous article, or articles prohibitedby legislation or by postal or customs regulations. I have met allapplicable export filing requirements under the Foreign Trade Regulations");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("94.72mm", "2.65mm", "76.73mm", "5.29mm", "Sender's Signature & Date Signed: 线上美eub");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
    LODOP.ADD_PRINT_TEXT(349, 312, 60, 20, "CN22");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);

    // 表格头部
    LODOP.ADD_PRINT_TEXT(233, 10, 29, 25, "No");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(233, 33, 28, 25, "Qty");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(233, 60, 138, 25, "Description of Contents");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(233, 228, 26, 25, "Kg.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(233, 260, 53, 25, "Val(US$)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(233, 310, 66, 25, "Good Origin");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(293, 60, 145, 20, "Total Gross Weight(kg.)：");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    // SKU表格
    LODOP.ADD_PRINT_TEXT(255, 12, 28, 20, "1\n");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(255, 35, 30, 20, Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(256, 60, 168, 20, Data.Item[0].TitleEn + Data.Item[0].Title);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(256, 223, 46, 20, ((Data.Item[0].Weight / 1000) * Data.Item[0].Quantity).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(255, 276, 48, 20, (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(256, 329, 50, 20, "CN");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    if (Data.Item.length > 1) {
      LODOP.ADD_PRINT_TEXT(274, 12, 28, 20, "2");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(274, 35, 29, 20, Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(275, 60, 168, 20, Data.Item[1].TitleEn + Data.Item[1].Title);
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(275, 223, 47, 20, ((Data.Item[1].Weight / 1000) * Data.Item[1].Quantity).toFixed(3));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(274, 276, 49, 20, (Data.Item[1].Amount * Data.Item[1].Quantity).toFixed(2));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(274, 329, 47, 20, "CN");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

      LODOP.ADD_PRINT_LINE(269, 7, 268, 369, 0, 1);
      localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 2);
      localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 2);
      localData.totalValue = this.printTotalData(Data.Item, 'Amount', 2);
    } else {
      localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 1);
      localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 1);
      localData.totalValue = this.printTotalData(Data.Item, 'Amount', 1);
    }

    // SKU表格统计
    LODOP.ADD_PRINT_TEXT(294, 35, 26, 20, localData.totalQty);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(294, 222, 39, 20, (localData.totalWeight / 1000).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(294, 277, 37, 20, localData.totalValue.toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    LODOP.PRINT();
  },

  //线下法国E邮宝渠道  **梁炜珍**
  ePacketOffFR: function(Data: Interface.PrintData) {
    var localData = {
      // returnAddress: Data.Return.Street2 + " " + Data.Return.Street1 + " " + Data.Return.City + " " + Data.Return.SateOrProvince + " " + Data.Return.Country.CountryNameCn,
      ToAddress: Data.To.BuyerFullName + "\n" + Data.To.BuyerStreet1 + " " + Data.To.BuyerStreet2 + "\n" + Data.To.BuyerCity + " " + Data.To.BuyerState + " " + Data.To.BuyerZipCode + "\n" + Data.To.Country.CountryName,
      FromAddress: Data.From.SendUserName + "\n" + Data.From.Street2 + " " + Data.From.Street1 + "\n" + Data.From.City + " " + Data.From.SateOrProvince + " " + Data.From.ZipCode + "\n" + Data.From.Country.CountryName //Data.From.Country.CountryName
    }
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-线下法国E邮宝渠道");


    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-线下法国E邮宝渠道");
    LODOP.ADD_PRINT_RECT("2.12mm", "1.85mm", "96.31mm", "96.31mm", 0, 1);
    LODOP.ADD_PRINT_LINE("28.05mm", "2.38mm", "28.05mm", "98.16mm", 0, 1);
    LODOP.ADD_PRINT_LINE("50.01mm", "2.38mm", "50.01mm", "98.16mm", 0, 1);
    LODOP.ADD_PRINT_LINE("70.64mm", "2.38mm", "70.64mm", "98.16mm", 0, 1);
    LODOP.ADD_PRINT_RECT("4.23mm", "3.18mm", "23.55mm", "18.52mm", 0, 1);

    LODOP.ADD_PRINT_TEXT("7.94mm", "3.97mm", "22.49mm", "4.76mm", "Prioritaire\r\n");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_RECT("14mm", "9.68mm", "9mm", "7.49mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("24.08mm", "2.12mm", "74.19mm", "5.08mm", "  DE:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT("2.65mm", "33.07mm", "34.4mm", "7.94mm", "ePacket");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 24);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("15.08mm", "10.85mm", "10.58mm", "6.61mm", "FR");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_LINE("11.91mm", "29.9mm", "33.75pt", "70.59mm", 0, 1);
    LODOP.ADD_PRINT_IMAGE("15.61mm", "28.84mm", "25mm", "10.5mm", "<img src='/static/images/中国邮政logo.png' width='80'/>");
    LODOP.ADD_PRINT_IMAGE("3.7mm", "75.67mm", "19.82mm", "23.5mm", "<img src='/static/images/PrimeExpres-logo.jpg' width='62' height='83'/>");
    LODOP.ADD_PRINT_IMAGE("12.7mm", "51.59mm", "22.49mm", "9.53mm", "<img src='/static/images/logo-LA POSTE.png' width='75'/>");
    LODOP.ADD_PRINT_TEXT("29.1mm", "3.97mm", "67.52mm", "21.99mm", localData.FromAddress + '\r\n' + 'PHONE: ' + Data.From.Phone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("31.49mm", "70.38mm", "26.48mm", "10.61mm", Data.To.BuyerZipCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 16);
    LODOP.ADD_PRINT_TEXT("39.16mm", "69.85mm", "18.52mm", "10.58mm", "法国");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 20);
    LODOP.ADD_PRINT_LINE("50.03mm", "60.59mm", "28.05mm", "60.59mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("47.36mm", "4.23mm", "15.88mm", "18.52mm", "\r\nA:\r\n\r\n\r\n");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 20);
    LODOP.ADD_PRINT_LINE("70.64mm", "15.08mm", "50.01mm", "15.08mm", 0, 1);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 3);
    LODOP.ADD_PRINT_TEXT("51.59mm", "16.14mm", "65.62mm", "21.96mm", localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", "-0.53mm");
    LODOP.ADD_PRINT_IMAGE("53.98mm", "73.29mm", "21.96mm", "15.61mm", "<img src='/static/images/信箱投递logo.jpg' width='108'/>");
    LODOP.ADD_PRINT_IMAGE("77.26mm", "3.44mm", "14.5mm", "12.51mm", "<img src='/static/images/投递需扫描图示.png' width='43' height='42'/>");
    LODOP.ADD_PRINT_TEXT("73.29mm", "13.49mm", "70mm", "3.7mm", "CONFFIRMATION DE DISTRIBUTION");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_BARCODE("78.85mm", "18.79mm", "61.91mm", "12.51mm", "128Auto", Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT("92.87mm", "19.84mm", "59.53mm", "5.29mm", Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_IMAGE("75.41mm", "83.34mm", "14.58mm", "11.99mm", "<img src='/static/images/无需签收图示.png' width='40' height='40'/>");
    LODOP.ADD_PRINT_TEXT("89.69mm", "5.56mm", "11.91mm", "5.29mm", "Scan");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("88.37mm", "82.81mm", "14.29mm", "9.53mm", "Pas  De\r\nSignature\r\n");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("66.41mm", "21.43mm", "32.28mm", "5.29mm", Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_IMAGE("65.62mm", "15.88mm", "4.5mm", "4.23mm", "<img src='/static/images/phone.png' width='15px' height='15px'/>");


    LODOP.PRINT();
  },

  // 线下法国E邮宝  **梁炜珍**
  // mc-MethodCode  ePacketOffFR(将传入undefined)-线下法国E邮宝  11-1：Wish邮-E邮宝  381：vova线上-E邮宝
  ePacketOffFR_back: function(Data: Interface.PrintData, mc:string) {
    var localData = {
      // returnAddress: Data.Return.Street2 + " " + Data.Return.Street1 + " " + Data.Return.City + " " + Data.Return.SateOrProvince + " " + Data.Return.Country.CountryNameCn,
      ToAddress: Data.To.BuyerFullName + "\n" + Data.To.BuyerStreet1 + " " + Data.To.BuyerStreet2 + "\n" + Data.To.BuyerCity + " " + Data.To.BuyerState + " " + Data.To.BuyerZipCode + "\n" + Data.To.Country.CountryName,
      FromAddress: Data.From.SendUserName + "\n" + Data.From.Street2 + " " + Data.From.Street1 + "\n" + Data.From.City + " " + Data.From.SateOrProvince + " " + Data.From.ZipCode,
      totalQty: 0,
      totalWeight: 0,
      totalValue: 0
    }
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-线下法国E邮宝渠道");


    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-线下法国E邮宝渠道");
    LODOP.ADD_PRINT_RECT("1mm", "1.75mm", "9.6cm", "9.6cm", 0, 1);
    LODOP.ADD_PRINT_LINE("56.36mm", 7, 212, "97.63mm", 0, 1);
    LODOP.ADD_PRINT_LINE("75.96mm", 8, 286, "97.92mm", 0, 1);
    LODOP.ADD_PRINT_LINE("71.2mm", 8, 268, "97.92mm", 0, 1);
    LODOP.ADD_PRINT_LINE("75.38mm", "6.59mm", 197, 26, 0, 1);
    LODOP.ADD_PRINT_LINE("75.64mm", "12.14mm", 197, 47, 0, 1);
    LODOP.ADD_PRINT_LINE("52.1mm", 292, 286, 293, 0, 1);
    LODOP.ADD_PRINT_LINE("83.13mm", "247.89mm", 196, 938, 0, 1);
    LODOP.ADD_PRINT_LINE("75.64mm", 198, 197, 199, 0, 1);
    LODOP.ADD_PRINT_LINE("75.64mm", 240, 197, 241, 0, 1);

    LODOP.ADD_PRINT_IMAGE(10, "4.01mm", "40mm", "12.01mm", "<img src='/static/images/中国邮政logo.png' width='84'/>");
    LODOP.ADD_PRINT_TEXT(43, 11, "34.61mm", "13.12mm", "IMPORTANT\r\n The Itm/parcel may be opened offically.Please print in English.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", -3);
    LODOP.ADD_PRINT_RECT(53, 132, 35, 20, 0, 1);
    LODOP.ADD_PRINT_TEXT(56, 139, 30, 25, "FR");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 13);
    LODOP.ADD_PRINT_BARCODE(18, 194, "42.31mm", "10.5mm", "128Auto", Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT(62, 194, 160, 20, Data.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_LINE("44.16mm", 8, 166, "47.63mm", 0, 1);
    LODOP.ADD_PRINT_LINE("48.15mm", 8, 181, "47.63mm", 0, 1);
    LODOP.ADD_PRINT_LINE("51.91mm", 7, 196, "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("21.7mm", "47.78mm", "52.12mm", 182, 0, 1);
    LODOP.ADD_PRINT_LINE("21.7mm", "47.78mm", 83, 370, 0, 1);
    LODOP.ADD_PRINT_TEXT("24.34mm", "2.91mm", "45.77mm", "16.67mm", "FROM:" + localData.FromAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(90, 186, 190, 100, "SHIP TO:" + localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", -2);
    LODOP.ADD_PRINT_TEXT(184, 186, 190, 20, "PHONE: " + Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("38.71mm", "2.91mm", "33.87mm", "6.09mm", "PHONE:  " + Data.From.Phone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(169, 11, 177, 19, "Fees(US $):");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT(185, 11, 178, 19, "Certificate No.");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");

    LODOP.ADD_PRINT_TEXT(200, 9, 26, 15, "No");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(200, 27, 30, 17, "Qty");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(200, 61, 155, 17, "Description of Contents");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(200, 212, 25, 21, "Kg");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(200, 242, 63, 20, "Val(US $)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(200, 295, 88, 20, "Goods Origin");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8)
    LODOP.ADD_PRINT_TEXT(273, 58, 139, 20, "Total Gross Weight (Kg)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(290, 13, 358, 48, "I certify the particulars given in this customs declaration are correct .Thisitem does not contain any dangerous article,or atricles prohibited by legislation or by postal or customs regulations. I have met all applicable export filing requirements under the Foreign TradeRegulations.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("92.08mm", "3.18mm", "75.67mm", "5.29mm", "Sender'sSignature & Date Signed: " + MdPrint.getChinaPostFlag(mc || 'ePacketOffFR'));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 9);

    LODOP.ADD_PRINT_TEXT(339, 305, 65, 30, "CN22");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 16);

    //sku列表
    LODOP.ADD_PRINT_TEXT(218, 10, 19, 20, "1");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(218, 29, 18, 20, Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT(218, 53, 152, 20, Data.Item[0].TitleEn + Data.Item[0].Title);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(218, 205, 41, 20, ((Data.Item[0].Weight) / 1000).toFixed(3)) * Data.Item[0].Quantity;
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT(218, 244, 48, 20, (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.ADD_PRINT_TEXT(218, 298, 50, 20, "CN");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");

    if (Data.Item.length > 1) {
      LODOP.ADD_PRINT_LINE(232, 7, 231, 370, 0, 1);
      LODOP.ADD_PRINT_TEXT(236, 10, 19, 20, "2");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(236, 29, 18, 20, Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.ADD_PRINT_TEXT(236, 53, 152, 20, Data.Item[1].TitleEn + Data.Item[1].Title);
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(236, 205, 41, 20, ((Data.Item[1].Weight) / 1000).toFixed(3)) * Data.Item[1].Quantity;
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.ADD_PRINT_TEXT(236, 244, 48, 20, (Data.Item[1].Amount * Data.Item[1].Quantity).toFixed(2));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(236, 298, 50, 20, "CN");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");

      localData.totalQty = parseFloat(String(Data.Item[0].Quantity)) + parseFloat(String(Data.Item[1].Quantity));
      localData.totalWeight = parseFloat(((Data.Item[0].Weight) / 1000).toFixed(3)) * Data.Item[0].Quantity + parseFloat(((Data.Item[1].Weight) / 1000).toFixed(3)) * Data.Item[1].Quantity;
      localData.totalValue = parseFloat(Data.Item[0].Amount.toFixed(3)) * Data.Item[0].Quantity + parseFloat(Data.Item[1].Amount.toFixed(3)) * Data.Item[1].Quantity;
    } else {
      localData.totalQty = parseFloat(String(Data.Item[0].Quantity));
      localData.totalWeight = parseFloat(((Data.Item[0].Weight) / 1000).toFixed(3)) * Data.Item[0].Quantity;
      localData.totalValue = parseFloat(Data.Item[0].Amount.toFixed(3)) * Data.Item[0].Quantity;
    }

    LODOP.ADD_PRINT_TEXT(273, 29, 22, 20, localData.totalQty);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(273, 202, 48, 20, localData.totalWeight.toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(273, 244, 51, 20, localData.totalValue.toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    LODOP.PRINT();
  },

  // 线下美国E邮宝渠道面单（-） **徐丽婷**
  ePacketOffUS: function(Data: Interface.PrintData) {
    var localData = {
      ToAddress: Data.To.BuyerFullName + "\n" + Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == "" ? Data.To.BuyerStreet2 + "" : "," + Data.To.BuyerStreet2) + "\n" + Data.To.BuyerCity + "\n" + Data.To.BuyerState + "\n" + Data.To.BuyerZipCode + " " + Data.To.Country.CountryName,
      FromAddress: Data.From.SendUserName + " " + (Data.From.Street2 == "" ? Data.From.Street2 + "" : Data.From.Street2 + ",") + Data.From.Street1 + " " + Data.From.City + " " + Data.From.SateOrProvince + " " + Data.From.ZipCode + " " + Data.From.Country.CountryName
    }
    var ZipCodeHead = Data.To.BuyerZipCode.slice(0, 3);
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-线下美国E邮宝渠道");

    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-线下美国E邮宝渠道");
    LODOP.ADD_PRINT_RECT(7, 7, 364, 364, 0, 1);
    LODOP.ADD_PRINT_RECT(15, 12, 50, 50, 0, 1);
    LODOP.ADD_PRINT_LINE(92, 8, 91, 371, 0, 1);
    LODOP.ADD_PRINT_LINE(194, 8, 193, 371, 0, 1);
    LODOP.ADD_PRINT_LINE(290, 8, 289, 371, 0, 1);
    LODOP.ADD_PRINT_TEXT(11, 20, 38, 54, "F");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 40);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(78, 13, 51, 20, "From: ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_IMAGE(12, 115, 131, 30, "<img src='/static/images/中国邮政logo.png' width='130'>")
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_LINE(44, 107, 43, 257, 0, 1);
    LODOP.ADD_PRINT_IMAGE(45, 113, 131, 30, "<img src='/static/images/美国邮政logo.jpg' height='30'>")
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_TEXT(72, 144, 70, 20, "ePacket");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(74, 203, 21, 14, "TM");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 5);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_RECT(13, 280, 74, 46, 0, 1);
    LODOP.ADD_PRINT_TEXT(14, 284, 85, 50, "Airmail\r\nPostage Paid\r\nChina Post");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(66, 303, 41, 25, this.getUSLatticeMouth(Number(ZipCodeHead)));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(96, 10, 210, 70, localData.FromAddress + '\r\n' + 'PHONE: ' + Data.From.Phone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_LINE(192, 212, 92, 213, 0, 1);
    LODOP.ADD_PRINT_TEXT(172, 14, 193, 23, "Customs infomation available on attached CN22.\r\nUSPS Personnel Scan barcode below for delivery event infomation");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 4);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_LINE(193, 73, 288, 74, 0, 1);
    LODOP.ADD_PRINT_BARCODE(112, 240, 120, 50, "128Auto", '420' + Data.To.BuyerZipCode);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT(168, 237, 120, 21, "ZIP" + Data.To.BuyerZipCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 9);

    LODOP.ADD_PRINT_TEXT(220, 14, 58, 45, "TO:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 21);
    LODOP.ADD_PRINT_TEXT("51.86mm", "21.7mm", "76.73mm", "26.46mm", localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(296, 130, 124, 20, "USPS TRACKING #");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_BARCODE(315, 74, 229, 50, "128Auto", Data.TrackingNumber);
    LODOP.ADD_PRINT_TEXT("72.76mm", "25.93mm", "33.07mm", "7.94mm", Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_IMAGE("71.97mm", "21.38mm", "3.97mm", "4.23mm", "<img src='/static/images/phone.png' width='15px' height='15px'/>");


    LODOP.PRINT();
  },

  // 线下美国E邮宝渠道面单（二） **徐丽婷**
  // mc-MethodCode  ePacketOffUS(将传入undefined)：线下美国E邮宝   11-1：wish邮-E邮宝  381：vova线上-E邮宝
  ePacketOffUS_back: function(Data: Interface.PrintData, mc:string) {
    var localData = {
      ToAddress: Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == "" ? Data.To.BuyerStreet2 + "" : "," + Data.To.BuyerStreet2) + "\n" + Data.To.BuyerCity + "\n" + Data.To.BuyerState + "\n" + Data.To.BuyerZipCode + "\n" + Data.To.Country.CountryName,
      FromAddress: Data.From.SendUserName + " " + (Data.From.Street2 == "" ? Data.From.Street2 + "" : Data.From.Street2 + ",") + Data.From.Street1 + " " + Data.From.City + " " + Data.From.SateOrProvince + " " + Data.From.ZipCode + " " + Data.From.Country.CountryName,
      totalQty: 0,
      totalWeight: 0,
      totalValue: 0,
    }
    var ZipCodeHead = Data.To.BuyerZipCode.slice(0, 3);
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-线下美国E邮宝渠道");

    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-线下美国E邮宝渠道");
    LODOP.ADD_PRINT_LINE(74, 199, 73, 373, 0, 1);
    LODOP.ADD_PRINT_LINE(74, 199, 202, 200, 0, 1);
    LODOP.ADD_PRINT_LINE(166, 9, 165, 199, 0, 1);
    LODOP.ADD_PRINT_LINE(185, 9, 184, 199, 0, 1);
    LODOP.ADD_PRINT_LINE(203, 10, 202, 371, 0, 1);
    LODOP.ADD_PRINT_LINE(226, 10, 225, 371, 0, 1);
    LODOP.ADD_PRINT_LINE(313, 29, 202, 30, 0, 1);
    LODOP.ADD_PRINT_LINE(313, 56, 202, 56, 0, 1);
    LODOP.ADD_PRINT_LINE(313, 224, 202, 224, 0, 1);
    LODOP.ADD_PRINT_LINE(313, 269, 202, 269, 0, 1);
    LODOP.ADD_PRINT_LINE(313, 316, 202, 316, 0, 1);
    LODOP.ADD_PRINT_LINE(315, 11, 315, 372, 0, 1);
    LODOP.ADD_PRINT_RECT(8, 8, 364, 364, 0, 1);
    LODOP.ADD_PRINT_RECT(44, 120, 40, 25, 0, 1);
    LODOP.ADD_PRINT_RECT(69, 120, 40, 25, 0, 1);
    LODOP.ADD_PRINT_TEXT(48, 123, 35, 20, "US");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(73, 123, 35, 20, this.getUSLatticeMouth(Number(ZipCodeHead)));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_BARCODE(35, 179, 185, 30, "128Auto", Data.TrackingNumber);
    LODOP.ADD_PRINT_IMAGE(10, 23, 113, 31, "<img border='0' src='/static/images/中国邮政logo.png' 'width='113' height='25'/>");
    LODOP.ADD_PRINT_TEXT(47, 12, 96, 20, "IMPORTTANT:\r\n");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT(59, 12, 112, 40, "The Itm/parcel may be opened officially Please print in English.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT(98, 12, 186, 60, "FROM: " + localData.FromAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(155, 16, 183, 20, "PHONE:" + Data.From.Phone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(78, 202, 178, 20, "SHIP TO: " + Data.To.BuyerFullName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(90, 202, 178, 112, localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(190, 202, 178, 20, "PHONE: " + Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(174, 15, 183, 20, "Fees(US $)：");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(190, 15, 183, 20, "Certificate No：");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(209, 11, 29, 25, "No");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(209, 33, 28, 25, "Qty");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(209, 73, 138, 25, "Description of Contents");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(209, 239, 26, 25, "Kg.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(209, 271, 55, 25, "Val(US $)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(210, 319, 69, 20, "Goods Origin");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(320, 12, 365, 42, "I certify the particulars given in this customs declaration are correct.This Itm does not contain any dangerous article, or articles prohibitedby legislation or by postal or customs regulations. I have met allapplicable export filing requirements under the Foreign Trade Regulations");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 5);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("94.46mm", "3.18mm", "80.7mm", "5.29mm", "Send's Signature & Date Signed: " + MdPrint.getChinaPostFlag(mc || 'ePacketOffUS'));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(350, 315, 68, 27, "CN22");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    // sku表格 一行
    LODOP.ADD_PRINT_TEXT(231, 12, 26, 20, "1");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(231, 27, 35, 20, Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(231, 60, 168, 20, Data.Item[0].TitleEn + Data.Item[0].Title);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(231, 222, 53, 20, Number((Data.Item[0].Weight / 1000).toFixed(3)) * Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(231, 271, 50, 20, (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(231, 340, 30, 20, "CN");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    // 两行
    if (Data.Item.length > 1) {
      LODOP.ADD_PRINT_LINE(245, 11, 245, 373, 0, 1);
      LODOP.ADD_PRINT_TEXT(253, 12, 28, 20, "2");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(253, 28, 35, 20, Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_TEXT(254, 60, 168, 20, Data.Item[1].TitleEn + Data.Item[1].Title);
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_TEXT(253, 222, 53, 20, Number((Data.Item[1].Weight / 1000).toFixed(3)) * Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_TEXT(253, 271, 50, 20, (Data.Item[1].Amount * Data.Item[1].Quantity).toFixed(2));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_TEXT(253, 341, 30, 20, "CN");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      // 三行
      if (Data.Item.length > 2) {
        LODOP.ADD_PRINT_LINE(266, 10, 266, 372, 0, 1);
        LODOP.ADD_PRINT_TEXT(274, 12, 28, 20, "3");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.ADD_PRINT_TEXT(273, 28, 35, 20, Data.Item[2].Quantity);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT(273, 60, 168, 20, Data.Item[2].TitleEn + Data.Item[2].Title);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT(273, 222, 53, 20, Number((Data.Item[2].Weight / 1000).toFixed(3)) * Data.Item[2].Quantity);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT(273, 271, 50, 20, (Data.Item[2].Amount * Data.Item[2].Quantity).toFixed(2));
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT(273, 341, 30, 20, "CN");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

        localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 3)
        localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 3)
        localData.totalValue = this.printTotalData(Data.Item, 'Amount', 3)
      } else {
        localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 2)
        localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 2)
        localData.totalValue = this.printTotalData(Data.Item, 'Amount', 2)
      }
    } else {
      localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 1)
      localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 1)
      localData.totalValue = this.printTotalData(Data.Item, 'Amount', 1)
    }

    LODOP.ADD_PRINT_LINE(297, 10, 297, 372, 0, 1);
    LODOP.ADD_PRINT_TEXT(302, 28, 35, 20, localData.totalQty);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(303, 64, 175, 20, "Total Gross Weight(kg.)：");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(302, 222, 53, 22, (localData.totalWeight / 1000).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(302, 272, 50, 20, localData.totalValue.toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);

    LODOP.PRINT();
  },

  // 顺丰国际平邮小包面单绘制(带电、不带电)  **徐丽婷**
  printSFMail: function(Data: Interface.PrintData, IsBattery:string) {
    if (Data.To.BuyerCountry == 'AU') {
      this.printSFAUOrUSOrGB(Data, 'U'); // 澳大利亚流向
    } else if (Data.To.BuyerCountry == 'RU' || Data.To.BuyerCountry == 'BY' || Data.To.BuyerCountry == 'LT' ||
      Data.To.BuyerCountry == 'EE' || Data.To.BuyerCountry == 'LV' || Data.To.BuyerCountry == 'FI' ||
      Data.To.BuyerCountry == 'NO' || Data.To.BuyerCountry == 'SE' || Data.To.BuyerCountry == 'PL' || Data.To.BuyerCountry == 'UA') {
      this.printSFRU(Data, 'U', IsBattery); // 俄罗斯(俄罗斯、白俄罗斯、立陶宛、爱沙尼亚、拉脱维亚、芬兰、挪威、瑞典、波兰、乌克兰)10个国家流向
    } else if (Data.To.BuyerCountry == 'BR' || Data.To.BuyerCountry == 'BN' || Data.To.BuyerCountry == 'KH' ||
      Data.To.BuyerCountry == 'FO' || Data.To.BuyerCountry == 'GL' || Data.To.BuyerCountry == 'IN' ||
      Data.To.BuyerCountry == 'ID' || Data.To.BuyerCountry == 'MY' || Data.To.BuyerCountry == 'MT' || Data.To.BuyerCountry == 'NZ' ||
      Data.To.BuyerCountry == 'PK' || Data.To.BuyerCountry == 'PH' || Data.To.BuyerCountry == 'KR' ||
      Data.To.BuyerCountry == 'LK' || Data.To.BuyerCountry == 'TH' || Data.To.BuyerCountry == 'VN') {
      this.printSFEA(Data, 'U'); // 欧亚(巴西、文莱、柬埔寨、法鲁群岛、格陵兰、印度、印度尼西亚、马来西亚、马尔他、新西兰、巴基斯坦、菲律宾、韩国、斯里兰卡、泰国、越南)16个国家 （-）
      this.printSFEA_back(Data); // 欧亚16个国家 （二）
    } else {
      this.printSFTag(Data, 'U'); // 其他流向（标签）
      this.printSFCDF(Data); // 其他流向（报关单）
    }
  },

  // 顺丰国际挂号小包面单绘制(带电、不带电)  **徐丽婷**
  printSFRegistered: function(Data: Interface.PrintData, IsBattery:string) {
    if (Data.To.BuyerCountry == 'US' || Data.To.BuyerCountry == 'AU' || Data.To.BuyerCountry == 'GB') {
      this.printSFAUOrUSOrGB(Data, 'R'); // 美国流向 、 澳大利亚流向 、英国流向
    } else if (Data.To.BuyerCountry == 'RU' || Data.To.BuyerCountry == 'BY' || Data.To.BuyerCountry == 'LT' ||
      Data.To.BuyerCountry == 'EE' || Data.To.BuyerCountry == 'LV' || Data.To.BuyerCountry == 'FI' ||
      Data.To.BuyerCountry == 'NO' || Data.To.BuyerCountry == 'SE' || Data.To.BuyerCountry == 'PL' || Data.To.BuyerCountry == 'UA') {
      this.printSFRU(Data, 'R', IsBattery); // 俄罗斯(俄罗斯、白俄罗斯、立陶宛、爱沙尼亚、拉脱维亚、芬兰、挪威、瑞典、波兰、乌克兰)10个国家流向
    } else if (Data.To.BuyerCountry == 'BR' || Data.To.BuyerCountry == 'BN' || Data.To.BuyerCountry == 'KH' ||
      Data.To.BuyerCountry == 'FO' || Data.To.BuyerCountry == 'GL' || Data.To.BuyerCountry == 'IN' ||
      Data.To.BuyerCountry == 'ID' || Data.To.BuyerCountry == 'MY' || Data.To.BuyerCountry == 'MT' || Data.To.BuyerCountry == 'NZ' ||
      Data.To.BuyerCountry == 'PK' || Data.To.BuyerCountry == 'PH' || Data.To.BuyerCountry == 'KR' ||
      Data.To.BuyerCountry == 'LK' || Data.To.BuyerCountry == 'TH' || Data.To.BuyerCountry == 'VN') {
      this.printSFEA(Data, 'R'); // 欧亚(巴西、文莱、柬埔寨、法鲁群岛、格陵兰、印度、印度尼西亚、马来西亚、马尔他、新西兰、巴基斯坦、菲律宾、韩国、斯里兰卡、泰国、越南)16个国家 （-）
      this.printSFEA_back(Data); // 欧亚16个国家 （二）
    } else {
      this.printSFTag(Data, 'R'); // 其他流向（标签）
      this.printSFCDF(Data); // 其他流向（报关单）
    }
  },

  // 顺丰平邮 & 挂号澳大利亚流向 & 美国流向 &  英国流向  **徐丽婷**
  printSFAUOrUSOrGB(Data: Interface.PrintData, type:string) {
    // LogisticsExt转换为JSON
    if (Data.LogisticsExt != '' && typeof Data.LogisticsExt === 'string') {
      Data.LogisticsExt = JSON.parse(Data.LogisticsExt)
    }
    var localData = {
      ToAddress: Data.To.BuyerFullName + "\n" + Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == "" ? Data.To.BuyerStreet2 + "" : "," + Data.To.BuyerStreet2) + "\n" + Data.To.BuyerCity + "\n" + Data.To.BuyerState + "\n" + Data.To.BuyerZipCode + "\n" + Data.To.Country.CountryName,
    }
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-顺丰平邮 & 挂号澳大利亚流向 & 美国流向 &  英国流向");

    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-澳大利亚流向");
    LODOP.ADD_PRINT_RECT("3mm", "3mm", "94mm", "94mm", 0, 1);
    // 头部
    if (Data.To.BuyerCountry == 'AU') {
      LODOP.ADD_PRINT_TEXT(22, 22, 160, 80, "If undelivered return to:\nSF express c/o \nAMS 118 denison stress\nHillsadale NSW 2306");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    }
    LODOP.ADD_PRINT_IMAGE(24, 180, 117, 38, "<img border='0' src='/static/images/sf-logo.png'/>");
    LODOP.ADD_PRINT_TEXT(29, 307, 54, 45, Data.To.BuyerCountry);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 20);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(70, 230, 126, 35, "国际小包" + (type == "U" ? "平邮" : "挂号"));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
    // 收件人信息
    LODOP.ADD_PRINT_TEXT(94, 25, 150, 20, "Deliver To:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 9);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(111, 25, 320, 117, localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 9);
    // 服务单号条码
    LODOP.ADD_PRINT_BARCODE(226, 41, "51.7mm", "10.61mm", "128Auto", Data.LogisticsExt == '' ? '' : Data.LogisticsExt.TrackingNumber);
    LODOP.ADD_PRINT_IMAGE(220, 251, 35, 35, "<img border='0' src='/static/images/star(1).png' width='35px' height='35px'/>");
    // 底部
    if (Data.To.BuyerCountry != 'AU') {
      LODOP.ADD_PRINT_TEXT(280, 20, 220, 19, "Tel:" + Data.To.BuyerPhone);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 9);
      LODOP.ADD_PRINT_TEXT(295, 20, 235, 19, Data.LogisticsExt == '' ? '' : Data.LogisticsExt.TrackingNumber);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 9);
      LODOP.ADD_PRINT_TEXT(316, 20, 230, 19, this.getSfNowDate());
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 9);
    } else {
      LODOP.ADD_PRINT_TEXT(287, 20, 235, 19, Data.LogisticsExt == '' ? '' : Data.LogisticsExt.TrackingNumber);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 9);
      LODOP.ADD_PRINT_TEXT(305, 20, 230, 19, this.getSfNowDate());
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 9);
    }

    if (Data.To.BuyerCountry == 'GB') {
      LODOP.ADD_PRINT_TEXT(334, 21, 128, 19, "【E757002785】Ref");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 9);
      LODOP.ADD_PRINT_TEXT(334, 143, 220, 20, "No: " + Data.OrderCode);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 9);
    } else if (Data.To.BuyerCountry == 'US') {
      LODOP.ADD_PRINT_TEXT(334, 21, 220, 19, "【E757002785】Ref");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 9);
      LODOP.ADD_PRINT_TEXT(351, 22, 235, 20, "No: " + Data.OrderCode);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 9);
    } else {
      LODOP.ADD_PRINT_TEXT(323, 21, 220, 19, "【E757002785】Ref");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 9);
      LODOP.ADD_PRINT_TEXT(341, 22, 235, 20, "No: " + Data.OrderCode);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 9);
    }
    // （平邮、挂号）分拣码
    LODOP.ADD_PRINT_TEXT(294, 238, 130, 40, (type == 'U' ? this.getSFMailLatticeMouth(Data.To.BuyerCountry) : this.getSFRegisteredLatticeMouth(Data.To.BuyerCountry, Data.To.BuyerZipCode)));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 20);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.PRINT();
  },

  // 顺丰平邮 & 挂号俄罗斯10个国家流向   **徐丽婷**
  printSFRU(Data: Interface.PrintData, type:string, IsBattery:string) {
    // LogisticsExt转换为JSON
    if (Data.LogisticsExt != '' && typeof Data.LogisticsExt === 'string') {
      Data.LogisticsExt = JSON.parse(Data.LogisticsExt)
    }
    var localData = {
      ToAddress: Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == "" ? Data.To.BuyerStreet2 + "" : "," + Data.To.BuyerStreet2) + " " + Data.To.BuyerCity + " " + Data.To.BuyerState + ';ZIP: ' + Data.To.BuyerZipCode + ';Tel: ' + Data.To.BuyerPhone + ';Conutry: ' + Data.To.Country.CountryName,
      totalWeight: 0,
    }
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-顺丰平邮 & 挂号俄罗斯10个国家流向");

    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-顺丰平邮俄罗斯10个国家流向");
    LODOP.ADD_PRINT_RECT("2.99mm", "2.99mm", "94.01mm", "94.01mm", 0, 1);
    LODOP.ADD_PRINT_LINE(72, 134, 12, 135, 0, 1);
    LODOP.ADD_PRINT_LINE(72, 288, 12, 289, 0, 1);
    LODOP.ADD_PRINT_LINE(72, 13, 71, 368, 0, 1);
    LODOP.ADD_PRINT_LINE(163, "2.99mm", 162, 366, 0, 1);
    LODOP.ADD_PRINT_LINE(238, "2.99mm", 237, 366, 0, 1);
    LODOP.ADD_PRINT_LINE(256, "2.99mm", 255, 366, 0, 1);
    LODOP.ADD_PRINT_LINE(301, "2.99mm", 300, 366, 0, 1);
    LODOP.ADD_PRINT_LINE(322, "2.99mm", 321, 366, 0, 1);
    LODOP.ADD_PRINT_LINE(215, 281, 162, 281, 0, 1);
    LODOP.ADD_PRINT_LINE(320, 206, 237, 207, 0, 1);
    LODOP.ADD_PRINT_LINE(214, "2.99mm", 214, 366, 0, 1);
    LODOP.ADD_PRINT_LINE(321, 281, 237, 281, 0, 1);
    //头部
    LODOP.ADD_PRINT_IMAGE(15, 15, 114, 38, "<img border='0' src='/static/images/sf-logo.png'/>");
    LODOP.ADD_PRINT_TEXT(57, 18, 100, 23, "Small Packet");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(18, 136, 155, 20, "From: " + Data.From.SendUserName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(33, 136, 162, 36, "P.O.Box 7031 14002 Tallinn\nEstonia");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(20, 289, 90, 56, "   POSTIMAKS\n TASUTUD TAXE\nPERCUE ESTONIE");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(59, 312, 56, 20, "No:199");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    // 收件人信息
    LODOP.ADD_PRINT_TEXT(80, 13, 98, 21, "HAWB Ship to:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(93, 14, 185, 20, Data.To.BuyerFullName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(118, 14, 362, 54, "Address: " + localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    // 服务单号条码
    LODOP.ADD_PRINT_BARCODE(75, 198, 150, 24, "128Auto", Data.LogisticsExt == '' ? '' : Data.LogisticsExt.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT(102, 198, 150, 20, Data.LogisticsExt == '' ? '' : Data.LogisticsExt.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    // 服务商单号条码
    LODOP.ADD_PRINT_TEXT(166, 30, 35, "9.45mm", type);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 18);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_BARCODE(167, 69, 189, "7.94mm", "128Auto", Data.LogisticsExt == '' ? '' : Data.LogisticsExt.MethodOrderCode);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT(201, 66, 189, 20, Data.LogisticsExt == '' ? '' : Data.LogisticsExt.MethodOrderCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    // 立陶宛、爱沙尼亚、拉脱维亚、芬兰、瑞典、挪威、波兰
    if (Data.To.BuyerCountry == 'LT' || Data.To.BuyerCountry == 'EE' || Data.To.BuyerCountry == 'LV' || Data.To.BuyerCountry == 'FI' ||
      Data.To.BuyerCountry == 'SE' || Data.To.BuyerCountry == 'PL' || Data.To.BuyerCountry == 'NO') {
      LODOP.ADD_PRINT_IMAGE(169, 295, "9mm", "9mm", "<img border='0' src='/static/images/star.png' width='34px' height='34px'/>");
    } else { // 其他
      LODOP.ADD_PRINT_IMAGE(163, 302, "7.38mm", "7.38mm", "<img border='0' src='/static/images/star(1).png' width='28px' height='28px'/>");
      LODOP.ADD_PRINT_TEXT(193, 310, 34, 33, "国际\r\n小包");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.SET_PRINT_STYLEA(0, "Bold", 1)
    }

    LODOP.ADD_PRINT_RECT(218, 20, 14, 14, 0, 0);
    LODOP.ADD_PRINT_RECT(218, 185, 14, 14, 0, 1);
    LODOP.ADD_PRINT_RECT(218, 304, 14, 14, 0, 1);
    LODOP.ADD_PRINT_TEXT(223, 188, 18, 19, "√");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(221, 40, 140, 24, "Gift/Commerical items");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(221, 205, 105, 20, "Sales of goods");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(221, 324, 48, 20, "Others");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    // 表格 sku统计
    LODOP.ADD_PRINT_TEXT(241, 16, 131, 20, "Details of contents");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(241, 213, 72, 20, "Weight(kg)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(242, 292, 75, 20, "Value(US $)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    //  一行
    LODOP.ADD_PRINT_TEXT(259, 14, 192, 17, Data.Item[0].TitleEn + "  x  " + Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(259, 205, 80, 17, Number((Data.Item[0].Weight / 1000).toFixed(3)) * Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(259, 288, 80, 17, (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    // 两行
    if (Data.Item.length > 1) {
      LODOP.ADD_PRINT_LINE(271, "2.99mm", 270, 366, 0, 1);
      LODOP.ADD_PRINT_TEXT(273, 14, 192, 17, Data.Item[1].TitleEn + "  x  " + Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(273, 208, 75, 17, Number((Data.Item[1].Weight / 1000).toFixed(3)) * Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_TEXT(273, 288, 80, 17, (Data.Item[1].Amount * Data.Item[1].Quantity).toFixed(2));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      // 三行
      if (Data.Item.length > 2) {
        LODOP.ADD_PRINT_LINE(286, "2.99mm", 285, 366, 0, 1);
        LODOP.ADD_PRINT_TEXT(289, 14, 192, 17, Data.Item[2].TitleEn + "  x  " + Data.Item[2].Quantity);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.ADD_PRINT_TEXT(289, 205, 80, 17, Number((Data.Item[2].Weight / 1000).toFixed(3)) * Data.Item[2].Quantity);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT(289, 288, 80, 17, (Data.Item[2].Amount * Data.Item[2].Quantity).toFixed(2));
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);

        localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 3)
      } else {
        localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 2)
      }
    } else {
      localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 1)
    }

    LODOP.ADD_PRINT_TEXT(307, 13, 160, 20, "Total Gross Weight(Kg):");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(307, 205, 80, 17, (localData.totalWeight / 1000).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    // （平邮、挂号）分拣码
    LODOP.ADD_PRINT_TEXT(306, 278, 92, 22, (type == 'U' ? this.getSFMailLatticeMouth(Data.To.BuyerCountry) : this.getSFRegisteredLatticeMouth(Data.To.BuyerCountry, Data.To.BuyerZipCode)));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    // 尾部
    LODOP.ADD_PRINT_TEXT(327, 19, 308, 35, "I certity that particulars given in this declaration are sorrect and this Itm does not contain any dangerous articles pronibited by legislation or by postal or customs regulations. Sender's signature:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 5);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(356, 19, 270, 18, Data.From.SendUserName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(336, 345, 29, 30, IsBattery);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.PRINT();
  },

  // 顺丰平邮欧洲10个国家流向 || 顺丰挂号德国流向  **徐丽婷**
  printSFEU(Data: Interface.PrintData, type:string, IsBattery:string) {
    // LogisticsExt转换为JSON
    if (Data.LogisticsExt != '' && typeof Data.LogisticsExt === 'string') {
      Data.LogisticsExt = JSON.parse(Data.LogisticsExt)
    }
    var localData = {
      ToAddress: Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == "" ? Data.To.BuyerStreet2 + "" : "," + Data.To.BuyerStreet2) + " " + Data.To.BuyerCity + " " + Data.To.BuyerState + ';ZIP: ' + Data.To.BuyerZipCode + ';Tel: ' + Data.To.BuyerPhone + ';Conutry: ' + Data.To.Country.CountryName,
      totalWeight: 0,
    }
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-顺丰平邮欧洲10个国家流向");

    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-顺丰平邮欧洲10个国家流向");
    LODOP.ADD_PRINT_RECT("3mm", "3mm", "94mm", "94mm", 0, 1);
    LODOP.ADD_PRINT_LINE(71, 132, 11, 133, 0, 1);
    LODOP.ADD_PRINT_LINE(71, 286, 11, 287, 0, 1);
    LODOP.ADD_PRINT_LINE(71, "2.99mm", 70, 366, 0, 1);
    LODOP.ADD_PRINT_LINE(157, "2.99mm", 156, 366, 0, 1);
    LODOP.ADD_PRINT_LINE(233, "2.99mm", 232, 366, 0, 1);
    LODOP.ADD_PRINT_LINE(250, "2.99mm", 249, 366, 0, 1);
    LODOP.ADD_PRINT_LINE(280, "2.99mm", 279, 366, 0, 1);
    LODOP.ADD_PRINT_LINE(300, "2.99mm", 299, 366, 0, 1);
    LODOP.ADD_PRINT_LINE(317, "2.99mm", 316, 366, 0, 1);
    LODOP.ADD_PRINT_LINE(211, 281, 156, 281, 0, 1);
    LODOP.ADD_PRINT_LINE(299, 206, 231, 207, 0, 1);
    LODOP.ADD_PRINT_LINE(211, "2.99mm", 211, 366, 0, 1);
    LODOP.ADD_PRINT_LINE(299, 281, 232, 281, 0, 1);
    LODOP.ADD_PRINT_LINE(367, 281, 316, 281, 0, 1);
    //头部
    LODOP.ADD_PRINT_IMAGE(14, 13, 114, 388, "<img border='0' src='/static/images/sf-logo.png'/>");
    LODOP.ADD_PRINT_TEXT(56, 16, 100, 23, "Small Packet");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(17, 134, 155, 20, "From: " + Data.From.SendUserName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(32, 133, 130, 36, "P.O.Box 7057 14002\nTallinn,Estonia");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_IMAGE(43, 255, 23, 23, "<img border='0' src='/static/images/star(1).png' width='23px' height='23px'/>");
    LODOP.ADD_PRINT_TEXT(18, 288, 90, 56, "   POSTIMAKS\n TASUTUD TAXE\nPERCUE ESTONIE");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(57, 308, 67, 20, "No:228");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    // 收件人信息
    LODOP.ADD_PRINT_TEXT(77, 13, 98, 21, "HAWB Ship to: ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(90, 14, 180, 20, Data.To.BuyerFullName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(113, 14, 360, 60, "Address:" + localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    // 服务单号条码
    LODOP.ADD_PRINT_BARCODE(73, 198, 150, 22, "128Auto", Data.LogisticsExt == '' ? '' : Data.LogisticsExt.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT(98, 198, 150, 20, Data.LogisticsExt == '' ? '' : Data.LogisticsExt.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    // 服务商单号条码
    LODOP.ADD_PRINT_TEXT(164, 30, 35, "9.45mm", type);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 18);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_BARCODE(163, 69, 189, "7.94mm", "128Auto", Data.LogisticsExt == '' ? '' : Data.LogisticsExt.MethodOrderCode);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT(197, 66, 189, 20, Data.LogisticsExt == '' ? '' : Data.LogisticsExt.MethodOrderCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    // （平邮、挂号）分拣码
    LODOP.ADD_PRINT_TEXT(174, 273, 100, 34, (type == 'U' ? this.getSFMailLatticeMouth(Data.To.BuyerCountry) : this.getSFRegisteredLatticeMouth(Data.To.BuyerCountry, Data.To.BuyerZipCode)));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_RECT(214, 20, 14, 14, 0, 0);
    LODOP.ADD_PRINT_RECT(214, 185, 14, 14, 0, 1);
    LODOP.ADD_PRINT_RECT(214, 304, 14, 14, 0, 1);
    LODOP.ADD_PRINT_TEXT(219, 188, 18, 19, "√");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(217, 40, 140, 24, "Gift/Commerical items");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(217, 205, 105, 20, "Sales of goods");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(217, 324, 48, 20, "Others");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    // 表格 sku统计
    LODOP.ADD_PRINT_TEXT(237, 16, 131, 20, "Details of contents");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(237, 209, 75, 20, "Weight(kg)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(238, 291, 75, 20, "Value(US $)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    // 一行
    LODOP.ADD_PRINT_TEXT(253, 15, 185, 17, Data.Item[0].TitleEn + "  x  " + Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(253, 203, 80, 17, Number((Data.Item[0].Weight / 1000).toFixed(3)) * Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(253, 289, 80, 17, Number(Data.Item[0].Amount.toFixed(2)) * Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    // 两行
    if (Data.Item.length > 1) {
      LODOP.ADD_PRINT_LINE(265, "2.99mm", 264, 366, 0, 1);
      LODOP.ADD_PRINT_TEXT(268, 15, 185, 17, Data.Item[1].TitleEn + "  x  " + Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(268, 203, 80, 17, Number((Data.Item[1].Weight / 1000).toFixed(3)) * Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_TEXT(268, 289, 80, 17, Number(Data.Item[1].Amount.toFixed(2)) * Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);

      localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 2)
    } else {
      localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 1)
    }
    LODOP.ADD_PRINT_TEXT(285, 16, 165, 17, "Total Gross Weight(Kg):");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(286, 203, 80, 17, (localData.totalWeight / 1000).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    // 尾部
    LODOP.ADD_PRINT_TEXT(305, 25, 330, 20, "【E755037643】 " + Data.OrderCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(323, 14, 280, 51, "I certity that particulars given in this declaration are sorrect and this Itm does not contain any dangerous articles pronibited by legislation or by postal or customs regulations. Sender's signature:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 5);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(354, 14, 279, 18, Data.From.SendUserName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT(283, 317, 22, 20, IsBattery);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_IMAGE(321, 303, 36, 36, "<img border='0' src='/static/images/e.png' width='36px' height='36px'/>");

    LODOP.PRINT();
  },

  // 顺丰平邮 & 挂号欧亚16个国家 （-）   **徐丽婷**
  printSFEA(Data:Interface.PrintData, type: string) {
    // LogisticsExt转换为JSON
    if (Data.LogisticsExt != '' && typeof Data.LogisticsExt === 'string') {
      Data.LogisticsExt = JSON.parse(Data.LogisticsExt)
    }
    var localData = {
      ToAddress: Data.To.BuyerFullName + "\nTel: " + Data.To.BuyerPhone + "\n" + Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == "" ? Data.To.BuyerStreet2 + "" : "," + Data.To.BuyerStreet2) + " " + Data.To.BuyerCity + " " + Data.To.BuyerState + "\n" + Data.To.BuyerZipCode + "\n" + Data.To.Country.CountryName,
      ItemsName: Data.Item[0].TitleEn,
      totalValue: 0,
    }
    if (Data.Item.length > 1) {
      localData.ItemsName += " & " + Data.Item[1].TitleEn;
      let len = Data.Item.length;
      localData.totalValue = this.printTotalData(Data.Item, 'Amount', len);
    } else {
      localData.totalValue = this.printTotalData(Data.Item, 'Amount', 1);
    }
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-顺丰平邮欧亚16个国家流向");

    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-顺丰平邮欧亚16个国家流向");
    LODOP.ADD_PRINT_RECT("3mm", "3mm", "94mm", "94mm", 0, 1);
    // 头部
    LODOP.ADD_PRINT_TEXT(19, 92, 200, 25, "COMMERCIAL WAYBILL");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    // 渠道转单号
    LODOP.ADD_PRINT_BARCODE(38, 76, 217, 36, "128Auto", Data.LogisticsExt == '' ? '' : Data.LogisticsExt.SkybillCode);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT(78, 76, 217, 20, Data.LogisticsExt == '' ? '' : Data.LogisticsExt.SkybillCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_IMAGE(34, 298, 45, 45, "<img border='0' src='/static/images/star(1).png'/>");
    LODOP.ADD_PRINT_TEXT(95, 16, 145, 70, "SF EXPRESS\nDept 1180-S05 PO BOX\n4680 S SE-202 26 MALMO\nSWEDEN");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    // 中间
    LODOP.ADD_PRINT_RECT(103, 151, 14, 14, 0, 1);
    LODOP.ADD_PRINT_RECT(122, 151, 14, 14, 0, 1);
    LODOP.ADD_PRINT_RECT(143, 151, 14, 14, 0, 1);
    LODOP.ADD_PRINT_TEXT(148, 154, 18, 19, "√");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(106, 177, 33, 24, "Gift");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(125, 177, 130, 20, "Commericial Sample");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(147, 177, 53, 20, "Other");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    // 收件人信息
    LODOP.ADD_PRINT_TEXT(168, 14, 97, 200, "Deliver To:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(182, 14, 160, 126, localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(178, 177, 200, 26, "Quantity and Description of Goods");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(193, 177, 190, 20, localData.ItemsName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_LINE(222, 177, 221, 366, 2, 1);
    LODOP.ADD_PRINT_TEXT(231, 177, 80, 22, "Total Value");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(242, 251, 110, 22, "USD " + localData.totalValue.toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_LINE(258, 177, 257, 366, 2, 1);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    // 底部
    LODOP.ADD_PRINT_TEXT(317, 22, 55, 26, Data.To.BuyerCountry);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 13);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(317, 89, 90, 32, "国际小包");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 13);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    // （平邮、挂号）分拣码
    LODOP.ADD_PRINT_TEXT(342, 21, 160, 37, (type == 'U' ? this.getSFMailLatticeMouth(Data.To.BuyerCountry) : this.getSFRegisteredLatticeMouth(Data.To.BuyerCountry, Data.To.BuyerZipCode)));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 16);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(263, 177, 194, 63, "I,the undersigned,certify that the particulars\ngiven in this declaration are correct and that\nthis Itm does not contain any dagerous or\nprohibited articles accordance with postal\nand/or customs legislation.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(321, 177, 132, 26, "Sender's Signature");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(324, 306, 62, 39, "Any");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Segoe Print");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.SET_PRINT_STYLEA(0, "Italic", 1);
    LODOP.ADD_PRINT_LINE(362, 177, 361, 366, 2, 1);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.PRINT();
  },

  // 顺丰平邮 & 挂号欧亚16个国家 （二）   **徐丽婷**
  printSFEA_back(Data:Interface.PrintData) {
    // LogisticsExt转换为JSON
    if (Data.LogisticsExt != '' && typeof Data.LogisticsExt === 'string') {
      Data.LogisticsExt = JSON.parse(Data.LogisticsExt)
    }
    var localData = "SF No: " + (Data.LogisticsExt == '' ? '' : Data.LogisticsExt.TrackingNumber) + "\n【E757002785】 Ref No: " + Data.OrderCode + "\n" + (Data.LogisticsExt == '' ? '' : Data.LogisticsExt.SkybillCode) + "\n" + this.getSfNowDate();
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-顺丰平邮欧亚16个国家流向");

    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-顺丰平邮欧亚16个国家流向");
    LODOP.ADD_PRINT_RECT("3mm", "3mm", "94mm", "94mm", 0, 1);
    LODOP.ADD_PRINT_IMAGE(29, 15, 117, 38, "<img border='0' src='/static/images/sf-logo.png'/>");
    LODOP.ADD_PRINT_TEXT(76, 17, 320, 94, localData);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.ADD_PRINT_IMAGE(30, 276, 50, 50, "<img border='0' src='/static/images/圆形图标.png' width='45px' height='45px'/>");
    // 服务单号条码
    LODOP.ADD_PRINT_BARCODE(174, 32, 210, 43, "128Auto", Data.LogisticsExt == '' ? '' : Data.LogisticsExt.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT(223, 32, 210, 25, Data.LogisticsExt == '' ? '' : Data.LogisticsExt.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_IMAGE(167, 251, 45, 45, "<img border='0' src='/static/images/star(1).png' width='45px' height='45px'/>");
    LODOP.ADD_PRINT_TEXT(231, 279, 90, 36, "国际小包");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);

    LODOP.PRINT();
  },

  // 顺丰平邮 & 挂号其他流向 （标签）   **徐丽婷**
  printSFTag(Data:Interface.PrintData, type:string) {
    // LogisticsExt转换为JSON
    if (Data.LogisticsExt != '' && typeof Data.LogisticsExt === 'string') {
      Data.LogisticsExt = JSON.parse(Data.LogisticsExt)
    }
    var localData = {
      ToAddress: Data.To.BuyerFullName + "\n" + Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == "" ? Data.To.BuyerStreet2 + "" : "," + Data.To.BuyerStreet2) + "\n" + Data.To.BuyerCity + "\n" + Data.To.BuyerState + "\n" + Data.To.BuyerZipCode + "\n" + Data.To.Country.CountryName,
      ToBottomInfo: "  SF No: " + (Data.LogisticsExt == '' ? '' : Data.LogisticsExt.TrackingNumber) + "\n  TEL: " + Data.To.BuyerPhone + "\n【E757002785】 Ref No: " + Data.OrderCode + "\n  " + this.getSfNowDate(),
    }
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-顺丰平邮其他流向（标签）");

    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-顺丰平邮其他流向（标签）");
    LODOP.ADD_PRINT_RECT("3mm", "3mm", "94mm", "94mm", 0, 1);
    //头部
    LODOP.ADD_PRINT_IMAGE(16, 174, 117, 38, "<img border='0' src='/static/images/sf-logo.png'/>");
    LODOP.ADD_PRINT_TEXT(31, 14, 87, 27, "PRIORITY");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(59, 14, 140, 25, "Return if undeliverable:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(76, 14, 350, 20, "H-11940SFT, Postbus 7040,3109AA Schiedam The Netherlands");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_IMAGE(13, 305, 60, 60, "<img src='/static/images/欧洲经济小包法国向.png' height='60'>");
    if (type == 'R') {
      LODOP.ADD_PRINT_IMAGE(106, 30, 41, 41, "<img border='0' src='/static/images/tui.png' width='36px' height='36px'/>");
      // 服务商单号条码
      LODOP.ADD_PRINT_BARCODE(111, 102, 170, 34, "128Auto", Data.LogisticsExt == '' ? '' : Data.LogisticsExt.MethodOrderCode);
      LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
      LODOP.ADD_PRINT_TEXT(149, 113, 140, 20, Data.LogisticsExt == '' ? '' : Data.LogisticsExt.MethodOrderCode);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_IMAGE(104, 294, 43, 43, "<img border='0' src='/static/images/star(1).png' width='43px' height='43px'/>");
      LODOP.ADD_PRINT_TEXT(162, 15, 350, 120, localData.ToAddress);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
      LODOP.ADD_PRINT_TEXT(88, 102, 26, 25, "R");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 18);
      LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    } else {
      LODOP.ADD_PRINT_TEXT(103, 15, 350, 105, localData.ToAddress);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
      LODOP.ADD_PRINT_IMAGE(220, 23, 41, 41, "<img border='0' src='/static/images/tui.png' width='36px' height='36px'/>");
      //顺丰单号条码
      LODOP.ADD_PRINT_BARCODE(219, 77, 170, 34, "128Auto", Data.LogisticsExt == '' ? '' : Data.LogisticsExt.TrackingNumber);
      LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
      LODOP.ADD_PRINT_TEXT(257, 88, 140, 20, Data.LogisticsExt == '' ? '' : Data.LogisticsExt.TrackingNumber);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_IMAGE(214, 255, 43, 43, "<img border='0' src='/static/images/star(1).png' width='43px' height='43px'/>");
    }
    // 底部
    LODOP.ADD_PRINT_TEXT(260, 279, 50, 27, Data.To.BuyerCountry);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    // （平邮、挂号）分拣码
    LODOP.ADD_PRINT_TEXT(286, 208, 165, 35, (type == 'U' ? this.getSFMailLatticeMouth(Data.To.BuyerCountry) : this.getSFRegisteredLatticeMouth(Data.To.BuyerCountry, Data.To.BuyerZipCode)));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 18);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(317, 258, 90, 32, "国际小包");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(309, 12, 260, 70, localData.ToBottomInfo);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

    LODOP.PRINT();
  },

  // 顺丰平邮 & 挂号其他流向 （报关单）   **徐丽婷**
  printSFCDF(Data:Interface.PrintData) {
    console.log(Data)
    // LogisticsExt转换为JSON
    if (Data.LogisticsExt != '' && typeof Data.LogisticsExt === 'string') {
      Data.LogisticsExt = JSON.parse(Data.LogisticsExt)
    }
    var localData = {
      ToAddress: Data.To.BuyerFullName + '\n' + (Data.To.BuyerStreet2 == "" ? Data.To.BuyerStreet1 + Data.To.BuyerStreet2 + "" : "," + Data.To.BuyerStreet2) + '\n' + Data.To.BuyerCity + ', ' + Data.To.BuyerState,
      totalQty: 0,
      totalWeight: 0,
      totalValue: 0,
    }
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-顺丰平邮其他流向（报关单）");

    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-顺丰平邮其他流向（报关单）");
    LODOP.ADD_PRINT_RECT("3mm", "3mm", "94mm", "94mm", 0, 1);
    LODOP.ADD_PRINT_LINE(54, "3.52mm", 55, 366, 0, 2);
    LODOP.ADD_PRINT_LINE(102, "3.52mm", 103, 366, 0, 2);
    LODOP.ADD_PRINT_LINE(121, "3.52mm", 122, 366, 0, 2);
    LODOP.ADD_PRINT_LINE(193, "3.52mm", 194, 366, 0, 2);
    LODOP.ADD_PRINT_LINE(215, "3.52mm", 216, 366, 0, 2);
    LODOP.ADD_PRINT_LINE(214, 186, 102, 187, 0, 2);
    LODOP.ADD_PRINT_LINE(214, 249, 102, 250, 0, 2);
    LODOP.ADD_PRINT_LINE(214, 314, 102, 315, 0, 2);
    // 头部固定内容
    LODOP.ADD_PRINT_TEXT(16, 68, 276, 24, "CUSTOMS DECLARATION");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(39, 116, 180, 23, "May be opened officially");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_RECT(63, 22, 13, 13, 0, 1);
    LODOP.ADD_PRINT_RECT(82, 22, 13, 13, 0, 1);
    LODOP.ADD_PRINT_TEXT(60, 23, 12, 12, "✔");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
    LODOP.ADD_PRINT_TEXT(64, 41, 104, 15, "Sales of goods");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(83, 41, 170, 15, "Gift/commercial sample");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(64, 249, 100, 20, "Operator:NL");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    // 尾部固定内容
    LODOP.ADD_PRINT_TEXT(221, 17, 189, 19, "Country of origin goods");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(222, 217, 80, 20, "PR China");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_LINE(238, 213, 237, 308, 2, 1);
    LODOP.ADD_PRINT_TEXT(240, 17, 357, 59, "I, the undersigned, whose name and address are given on this Itm, certify that the data given in this declaration is correct and that this Itm does not contain any dangerous goods or other articles prohibited by transport or export / import regulations.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(294, 17, 168, 20, "Date and sender's signature");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(293, 178, 121, 15, this.getSfNowDate());
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_LINE(305, 178, 304, 283, 2, 1);
    LODOP.ADD_PRINT_TEXT(277, 293, 57, 30, "Any");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Segoe Print");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.SET_PRINT_STYLEA(0, "Italic", 1);
    LODOP.ADD_PRINT_LINE(313, 13, 312, 367, 0, 1);
    // 服务单号条码
    LODOP.ADD_PRINT_BARCODE(319, 35, 160, 27, "128Auto", Data.LogisticsExt == '' ? '' : Data.LogisticsExt.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT(351, 35, 160, 20, Data.LogisticsExt == '' ? '' : Data.LogisticsExt.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_IMAGE(315, 207, 33, 33, "<img border='0' src='/static/images/star(1).png' width='33px' height='33px'/>");
    LODOP.ADD_PRINT_TEXT(324, 268, 110, 34, "国际小包");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 16);
    // 表格 sku统计
    LODOP.ADD_PRINT_TEXT(107, 28, 162, 15, "Description of contents");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(107, 207, 29, 15, "Qty");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(107, 271, 30, 15, "Kg");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(107, 322, 45, 15, "Value");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(200, 41, 132, 15, "total of contents");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    // 一行
    LODOP.ADD_PRINT_TEXT(129, 16, 170, 20, Data.Item[0].TitleEn);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(131, 187, 62, 20, Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(130, 250, 65, 20, Number((Data.Item[0].Weight / 1000).toFixed(3)) * Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(130, 316, 53, 20, (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    // 两行
    if (Data.Item.length > 1) {
      LODOP.ADD_PRINT_LINE(143, 13, 142, 366, 2, 1);
      LODOP.ADD_PRINT_TEXT(150, 16, 170, 20, Data.Item[1].TitleEn);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
      LODOP.ADD_PRINT_TEXT(149, 187, 62, 21, Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
      LODOP.ADD_PRINT_TEXT(151, 250, 65, 20, Number((Data.Item[1].Weight / 1000).toFixed(3)) * Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
      LODOP.ADD_PRINT_TEXT(151, 316, 53, 20, (Data.Item[1].Amount * Data.Item[1].Quantity).toFixed(2));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
      LODOP.ADD_PRINT_LINE(164, 11, 163, 364, 2, 1);

      localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 2)
      localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 2)
      localData.totalValue = this.printTotalData(Data.Item, 'Amount', 2)
    } else {
      localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 1)
      localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 1)
      localData.totalValue = this.printTotalData(Data.Item, 'Amount', 1)
    }
    LODOP.ADD_PRINT_TEXT(201, 187, 62, 15, localData.totalQty + ' Pcs');
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(201, 250, 65, 15, (localData.totalWeight / 1000).toFixed(3) + ' Kg');
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(201, 316, 53, 15, '$' + localData.totalValue.toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.PRINT();
  },

  // 云途全球专线平邮（特惠普货）、 云途全球专线挂号（特惠普货）渠道
  pritnGlobalCircuit_YT(val:Interface.PrintData, isRegistra:boolean){
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', isRegistra ?"云途全球专线挂号（特惠普货）渠道":"面单-云途全球专线平邮（特惠普货）");
    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, isRegistra ?"云途全球专线挂号（特惠普货）渠道":"面单-云途全球专线平邮（特惠普货）");
    LODOP.ADD_PRINT_RECT("1.51mm","1.51mm","97mm","97mm",0,1);
    LODOP.ADD_PRINT_TEXT("1.27mm","2.91mm","94.19mm","8.86mm",isRegistra ? "THPHR":"THPHU");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",28);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    LODOP.SET_PRINT_STYLEA(0,"Bold",1);
    LODOP.ADD_PRINT_LINE("11.64mm","2.38mm","11.91mm","98.16mm",0,1);
    LODOP.ADD_PRINT_TEXT("10.85mm","30.43mm","15.61mm","9.53mm",val.To.BuyerCountry);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",28);
    LODOP.SET_PRINT_STYLEA(0,"Bold",1);
    LODOP.ADD_PRINT_LINE("21.17mm","2.65mm","21.43mm","73.82mm",0,1);
    LODOP.ADD_PRINT_BARCODE("22.23mm","8.2mm","55.83mm","8.47mm","128Auto",val.TrackingNumber );
    LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);
    LODOP.ADD_PRINT_LINE("34.93mm","2.91mm","35.19mm","97.9mm",0,1);
    LODOP.ADD_PRINT_LINE("34.93mm","73.82mm","11.64mm","74.08mm",0,1);
    LODOP.ADD_PRINT_TEXT("13.23mm","79.11mm","16.93mm","21.7mm",isRegistra ? "R":"P");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",50);
    LODOP.SET_PRINT_STYLEA(0,"Bold",1);
    LODOP.ADD_PRINT_TEXT("36.78mm","3.7mm","17.46mm","5.82mm","SHIP TO:");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.ADD_PRINT_TEXT("41.28mm","8.7mm","90.49mm","5.29mm",val.To.BuyerFullName);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.ADD_PRINT_TEXT("46.04mm","8.7mm","89.96mm","5.29mm",val.To.BuyerStreet1+' '+val.To.BuyerStreet2);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.ADD_PRINT_TEXT("50.8mm","8.73mm","89.96mm","5.29mm",val.To.BuyerState+' '+val.To.BuyerCity);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.ADD_PRINT_TEXT("55.83mm","8.73mm","89.96mm","5.29mm",val.To.BuyerZipCode);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.ADD_PRINT_TEXT("60.59mm","8.73mm","90.49mm","5.29mm",val.To.Country.CountryName);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.ADD_PRINT_TEXT("65.35mm","4.5mm","10.32mm","5.29mm","Tel:");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.ADD_PRINT_TEXT("70.11mm","8.7mm","89.96mm","5.29mm",val.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.ADD_PRINT_LINE("76.78mm","3.7mm","76.49mm","97.9mm",0,1);
    LODOP.ADD_PRINT_BARCODE("77.79mm","8.2mm","55.83mm","7.14mm","128Auto",val.OrderCode.toUpperCase());
    LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);
    LODOP.ADD_PRINT_LINE("88.37mm","1.59mm","88.64mm","97.9mm",0,1);
    LODOP.ADD_PRINT_LINE("94.19mm","2.38mm","94.46mm","97.9mm",0,1);
    LODOP.ADD_PRINT_TEXT("90.75mm","6.35mm","13.76mm","4.23mm","C03788");
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.ADD_PRINT_TEXT("90.22mm","78.05mm","20.11mm","5.29mm",this.getPrintDate());
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.ADD_PRINT_TEXT("31.49mm","2.12mm","72.23mm","5.29mm",val.TrackingNumber);
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    LODOP.ADD_PRINT_TEXT("85.46mm","1.59mm","65.62mm","5.29mm",val.OrderCode.toUpperCase());
    LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    LODOP.PRINT();
  },

  // 253、253_AU、prime 合并渠道代码 003  
  // Type 1-Wish邮中邮挂号佛山仓 2-Wish邮中邮挂号上海仓 3-Wish邮-中邮挂号广州仓渠道面单 379-vova线上-中国邮政挂号小包
  '003': function(Data:Interface.PrintData, Type:string|number) {
    switch (Data.To.BuyerCountry) {
      case 'AU':
        this.prime(Data,"253_AU", 1, Type);
        // this['253_AU'](Data)
        break
      case 'MA': // 摩洛哥
        if(Type){
          this.printAMOrMA(Data, Type)
        }else{
          this['253'](Data)
        }
        break;
      case 'EE': // 爱沙尼亚
      case 'BY': // 白俄罗斯
      case 'GE': // 格鲁吉亚
      case 'MY': // 马来西亚
      case 'TH': // 泰国
      case 'SG': // 新加坡
      case 'GB': // 英国
      case 'KR': // 韩国
        this.prime(Data, "prime", 2, Type);
        break;
      case 'FR': // 法国
      case 'DE': // 德国
      case 'NO': // 挪威
        this.prime(Data, "253", 3, Type);
        break;
      case 'AM': // ​​亚美尼亚
        this.prime(Data, "253", 4, Type);
        break;
      case 'NZ': // 新西兰
        this.prime(Data, "253", 5, Type);
        break;
      // case 'CZ':
      // case 'SK':
      // case 'PL':
      // case 'HR':
      // case 'SI':
        // if(Type === 1 || Type === 2 || Type === 3){
        //   this.printWishPostFS(Data, Type)
        //   this.printWishPostFS_back(Data, Type)
        // }else if(Type === '379'){
        //   this.printFSPostRegistered(Data, Type); 
        // }
        // break;
      default:
        if(Type === 1 || Type === 2 || Type === 3){
          this.printJO(Data, Type)
        }else if(Type === '379'){
          this.printFSPostRegistered(Data, Type);
        }
        break;
    }
  },

  //澳大利亚跟踪小包渠道面单  **徐丽婷**
  '253_AU': function(Data:Interface.PrintData) {
    this.EnhancePrint(Data); // 澳大利亚跟踪小包渠道面单1
    this.EnhancePrint_back(Data, '253_AU'); // 澳大利亚跟踪小包渠道面单2
  },

  // 中邮增强小包渠道面单  **徐丽婷**
  '253': function(Data:Interface.PrintData) {
    if (Data.To.BuyerCountry == 'NO') {
      this['002'](Data, '253'); // 挪威向 与佛山邮政挂号的面单 一致
    } else if (Data.To.BuyerCountry == 'MA' || Data.To.BuyerCountry == 'AM') {
      this.printAMOrMA(Data, '253')
    } else {
      // 捷克，斯洛文尼亚，斯洛伐克，波兰，克罗地亚向 || 法国向 || 德国向 || 新西兰向
      this.EnhancePrint(Data);
      this.EnhancePrint_back(Data, '253');
    }
  },

  //澳大利亚跟踪小包渠道面单1 || 增强小包(捷克，斯洛文尼亚，斯洛伐克，波兰，克罗地亚向1 || 法国向1 || 德国向1 || 新西兰向1)  **徐丽婷**
  'EnhancePrint': function(Data:Interface.PrintData) {
    var localData = {
      ToAddress: Data.To.BuyerFullName + '\n' + Data.To.BuyerZipCode + " " + Data.To.BuyerStreet1 + " " + Data.To.BuyerStreet2 + "\n" + Data.To.BuyerCity + " " + Data.To.BuyerState + "\n" + Data.To.BuyerPhone,
      FromAddress: Data.From.Street2 + " " + Data.From.Street1 + " " + Data.From.City + " " + Data.From.SateOrProvince + " " + Data.From.Country.CountryName + " " + Data.From.ZipCode + "\n" + Data.From.Phone
    }
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-澳大利亚跟踪小包渠道");

    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-澳大利亚跟踪小包渠道");
    LODOP.ADD_PRINT_RECT("1.59mm", "1.59mm", "96.31mm", "96.31mm", 0, 1);
    LODOP.ADD_PRINT_LINE("26.19mm", "1.85mm", "26.19mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("48.42mm", "1.85mm", "48.42mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("69.06mm", "1.85mm", "69.06mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_TEXT(85, "2.38mm", "79.48mm", "6.14mm", "协议客户：" + Data.From.SendUserName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_IMAGE(29, 10, "24.47mm", "8.12mm", "<img src='/static/images/中国邮政logo.png' width='88' height='26px'/>");

    if (Data.To.BuyerCountry == 'AU') { // 澳大利亚跟踪小包渠道面单1
      LODOP.ADD_PRINT_IMAGE(28, 108, 80, 28, "<img src='/static/images/Australia Post.png' width='78px' height='21px'/>");
    } else if (Data.To.BuyerCountry == 'CZ' || Data.To.BuyerCountry == 'SI' || Data.To.BuyerCountry == 'SK' || Data.To.BuyerCountry == 'PL' || Data.To.BuyerCountry == 'HR') {
      // 捷克，斯洛文尼亚，斯洛伐克，波兰，克罗地亚向1
      LODOP.ADD_PRINT_TEXT(37, 110, 85, 30, "VPG POST");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
      LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    } else if (Data.To.BuyerCountry == 'FR') { // 法国向1
      LODOP.ADD_PRINT_IMAGE(24, 117, 57, 39, "<img src='/static/images/LA Poste.png' width='57px' height='39px'/>");
    } else if (Data.To.BuyerCountry == 'DE') { // 德国向1
      LODOP.ADD_PRINT_IMAGE(31, 104, 80, 28, "<img src='/static/images/Deutsche Post.png' width='78px' height='21px'/>");
    } else if (Data.To.BuyerCountry == 'NZ') { // 新西兰向1
      LODOP.ADD_PRINT_IMAGE(26, 108, 80, 25, "<img src='/static/images/New_Zealand_Post_logo.png' width='80px' height='25px'/>");
    }

    if (Data.To.BuyerCountry == 'FR') { // 法国向1
      LODOP.ADD_PRINT_TEXT(29, 196, 120, 45, "国际小包面单\r\nTRACKED PACKET");
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_TEXT(294, 89, 185, 20, "À FLASHER EN DISTRIBUTION");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.ADD_PRINT_BARCODE("81.5mm", "20%", "60%", "12.51mm", "128Auto", Data.TrackingNumber);
      LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
      LODOP.ADD_PRINT_TEXT("95mm", "3.97mm", "93.66mm", "6.61mm", Data.TrackingNumber);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_IMAGE('81.49mm', 27, 34, 35, "<img src='/static/images/lightning1.png' width='32' height='35px'/>");
      LODOP.ADD_PRINT_HTM('81.49mm', '81.76mm', 45, 37, "<img src='/static/images/无需签收图示.png' width='43' height='35px'/>");
    } else { // 其他
      LODOP.ADD_PRINT_TEXT(29, 196, 120, 45, "跟踪小包\r\nTRACKED PACKET");
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_BARCODE("80mm", "20%", "60%", "12.51mm", "128Auto", Data.TrackingNumber);
      LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
      LODOP.ADD_PRINT_TEXT("94mm", "3.97mm", "93.66mm", "6.61mm", Data.TrackingNumber);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    }
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);

    LODOP.ADD_PRINT_IMAGE(13, 325, "10.29mm", "14.92mm", "<img src='/static/images/PrimeExpres-logo.jpg' width='30px' height='52px'/>");
    LODOP.ADD_PRINT_TEXT(110, 59, "70mm", "21.99mm", localData.FromAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(129, 275, "26.48mm", "13.26mm", Data.To.BuyerZipCode.slice(0, 5));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 16);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_LINE("48.45mm", "72.76mm", "26.46mm", "72.76mm", 0, 1);
    LODOP.ADD_PRINT_TEXT(172, 13, "15.88mm", "18.52mm", "\r\nA:\r\n\r\n\r\n");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial Narrow");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 20);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_LINE("69.06mm", "17.2mm", "48.42mm", "17.2mm", 0, 1);
    LODOP.ADD_PRINT_TEXT(188, 70, 302, 70, localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", -2);
    LODOP.ADD_PRINT_TEXT(269, 11, 360, 22, "退件单位：Chian Cheng District");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(111, 12, 48, 36, "FROM:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_LINE("20.37mm", "1.85mm", "20.37mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_TEXT(249, 70, 301, 20, Data.To.Country.CountryName.toUpperCase() + " " + Data.To.Country.CountryNameCn + " " + this.getRegisterAreaCode(Data.To.Country.CountryCode));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_LINE("74.88mm", "1.85mm", "74.88mm", "97.9mm", 0, 1);
    LODOP.PRINT();
  },

  //增强小包 (澳大利亚跟踪小包渠道面单2 || 捷克，斯洛文尼亚，斯洛伐克，波兰，克罗地亚向2  || 法国向2 || 德国向2 ||  新西兰向2) **徐丽婷**
  'EnhancePrint_back': function(Data:Interface.PrintData, mc:string) {
    var localData = {
      totalWeight: 0,
      totalValue: 0
    }
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-增强小包法国向");

    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-增强小包法国向");

    LODOP.ADD_PRINT_RECT("2.12mm", "1.85mm", "95.99mm", "95.01mm", 0, 1);
    LODOP.ADD_PRINT_LINE("26.19mm", "2.12mm", "26.19mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("19.31mm", "2.91mm", "54.35mm", "6.14mm", "报关签条 （CUSTOMS DECLARTION）");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT("7.67mm", "33.6mm", "31.75mm", "7.41mm", "SMALL PACKET");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_LINE("40.45mm", "37.57mm", "26.46mm", "37.57mm", 0, 1);
    LODOP.ADD_PRINT_LINE("15.61mm", "2.12mm", "15.61mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("5.56mm", "2.65mm", "23.81mm", "13.23mm", "航空\r\nBY AIR");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);

    if (Data.To.BuyerCountry == 'CZ' || Data.To.BuyerCountry == 'SI' || Data.To.BuyerCountry == 'SK' || Data.To.BuyerCountry == 'PL' || Data.To.BuyerCountry == 'HR') {
      LODOP.ADD_PRINT_TEXT("7.94mm", "69.06mm", "26.99mm", "7.14mm", "VPG POST");
    } else { // 除 捷克，斯洛文尼亚，斯洛伐克，波兰，克罗地亚向 的其他向
      LODOP.ADD_PRINT_TEXT("7.94mm", "69.06mm", "26.99mm", "7.14mm", this.getChinaPostLM(Data.To.Country.CountryCode));
    }
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 3);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_TEXT(67, 212, 62, 38, "邮2113\r\nCN22");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(69, 279, 93, 38, "可以经行开拆\r\nMay be opened");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(106, 6, 150, 71, "邮件种类\r\nCategory of Itm\r\n请在适当的内容前划“√”");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(111, 154, 21, 20, "√");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_LINE("40.48mm", "46.3mm", "26.19mm", "46.3mm", 0, 1);
    LODOP.ADD_PRINT_TEXT(102, 180, 49, 35, "礼品\r\nGift");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(130, 175, 63, 36, "文件\r\nDocuments");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_LINE("33.87mm", "37.57mm", "33.87mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("40.22mm", "72.76mm", "26.19mm", "72.76mm", 0, 1);
    LODOP.ADD_PRINT_LINE("77.52mm", "63.5mm", "26.19mm", "63.5mm", 0, 1);
    LODOP.ADD_PRINT_TEXT(102, 279, 95, 35, "商品货样\r\nCommercial sample");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(130, 299, 63, 36, "其他\r\nOther");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(159, 5, 238, 36, "内容详细名称和数量\r\nQuantities and detailed description of contents");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(159, 237, 95, 31, "重量（千克）\r\nWeight（Kg）");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(159, 330, 43, 31, "价值\r\nValue");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_LINE("77.79mm", "85.2mm", "40.22mm", "85.2mm", 0, 1);
    LODOP.ADD_PRINT_LINE("50.27mm", "1.85mm", "50.27mm", "98.16mm", 0, 1);
    LODOP.ADD_PRINT_LINE("55.83mm", "2.12mm", "55.83mm", "97.9mm", 0, 1);
    //sku信息 一行
    LODOP.ADD_PRINT_TEXT(198, 10, 230, 23, Data.Item[0].TitleEn + " " + Data.Item[0].Title + " * " + Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(198, 248, 70, 23, Number((Data.Item[0].Weight / 1000).toFixed(3)) * Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(198, 325, 50, 23, (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 1)
    localData.totalValue = this.printTotalData(Data.Item, 'Amount', 1)
    // 两行
    if (Data.Item.length > 1) {
      LODOP.ADD_PRINT_TEXT(219, 10, 230, 22, Data.Item[1].TitleEn + " " + Data.Item[1].Title + " * " + Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT(219, 248, 70, 22, Number((Data.Item[1].Weight / 1000).toFixed(3)) * Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_TEXT(219, 325, 50, 22, (Data.Item[1].Amount * Data.Item[1].Quantity).toFixed(2));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 2)
      localData.totalValue = this.printTotalData(Data.Item, 'Amount', 2)
      LODOP.ADD_PRINT_LINE(230, 7, 230, 370, 0, 1);
    }

    LODOP.ADD_PRINT_TEXT(236, 10, 230, 47, "协调系统税则号列和货物原产国（只对商品邮件填写）\r\nHS trariff number and country of origin of\r\ngoods (For commercial items only)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(236, 240, 80, 47, "总重量\r\nTotal Weight\r\n(Kg)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(236, 319, 60, 47, "总价值\r\nTotal\r\nValue");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_LINE("78.05mm", "2.12mm", "77.79mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_TEXT(283, 102, 100, 21, "China");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(283, 248, 70, 21, (localData.totalWeight / 1000));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(283, 325, 50, 21, localData.totalValue.toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_LINE("73.82mm", "2.12mm", "73.82mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("40.22mm", "2.12mm", "40.22mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_TEXT(303, 11, 362, 67, "我保证上述申报准确无误，本函件内未装寄法律或邮政和海关规章禁止寄递的任何危险物品\r\nI, the undersigned, certify that the particulars given in this declaration are correct and this Itm does not contain any dangerous articles prohibited by legislation or by postal or customers regulations.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(355, 11, 182, 25, "寄件人签字 Sender's signature：");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_LINE("96.31mm", "47.63mm", "96.31mm", "74.08mm", 0, 1);
    LODOP.ADD_PRINT_TEXT(352, 191, 115, 23, MdPrint.getChinaPostFlag(mc));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_TEXT(354, 325, 49, 27, "CN22");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.PRINT();
  },

  //中邮增强小包新增亚美尼亚和摩洛哥向面单 *杨定杰*
  printAMOrMA(Data:Interface.PrintData, type:string|number) {
    let distance = '';
    if (type == 1 || type === '379' || type === '253') {
      distance = '佛山市邮政局函件集邮局'
    } else if (type == 2) {
      distance = '上海邮政物流公司wish上海仓'
    } else {
      distance = '广州小包大宗收寄处理中心'
    }
    var localData = {
      ToAddress: Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == '' ? '' : ',' + Data.To.BuyerStreet2) + "\n" + Data.To.BuyerCity + '  ' + (Data.To.BuyerState == '' ? '' : Data.To.BuyerState + '\n') + Data.To.Country.CountryName.toUpperCase(),
      FromAddress: Data.From.Street1 + (Data.From.Street2 == "" ? '' : Data.From.Street2 + ',') + "\n" + Data.From.City + " " + Data.From.SateOrProvince + " " + Data.From.Country.CountryName.toUpperCase(),
      PrintDate: this.getPrintDate(),
      totalQty: 0,
      totalWeight: 0,
      totalValue: 0
    }

    LODOP.PRINT_INITA("0mm", "0mm", "100.01mm", "100.01mm", "中邮增强小包");
    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "中邮增强小包");
    LODOP.ADD_PRINT_RECT("2.99mm", "2.99mm", "94.01mm", "94.01mm", 0, 1);
    LODOP.ADD_PRINT_IMAGE(18, 14, "24.47mm", "8.12mm", "<img src='/static/images/中国邮政logo.png' width='88' height='26px'/>");
    LODOP.ADD_PRINT_TEXT("9.26mm", "35.45mm", "35.19mm", "9.79mm", "Tracked Packet BY AIR");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_LINE("16.17mm", "35.37mm", "16.14mm", "96.84mm", 0, 1);
    LODOP.ADD_PRINT_LINE("16.23mm", "35.35mm", "47.31mm", "35.35mm", 0, 1);
    LODOP.ADD_PRINT_LINE("2.99mm", "85.37mm", "16.4mm", "85.37mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("9mm", "71.97mm", "20mm", "5.29mm", this.getChinaPostLM(Data.To.Country.CountryCode));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    if (Data.To.BuyerCountry == 'AM') {
      LODOP.ADD_PRINT_IMAGE("4.5mm", "87.05mm", "9mm", "13mm", "<img src='/static/images/postTrackedPacket-logo.jpg' width='28px' height='37px'/>");
    }
    LODOP.ADD_PRINT_LINE("47.51mm", "3.44mm", "47.51mm", "96.55mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("16.93mm", "4.76mm", "30.96mm", "19.84mm", "From: " + Data.From.SendUserName + '\r\n' + localData.FromAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("17.2mm", "36.78mm", "54.24mm", "27.78mm", "SHIP TO: " + Data.To.BuyerFullName + '\r' + localData.ToAddress + '\r' + 'Zip: ' + Data.To.BuyerZipCode + '\r' + '\r' + 'Phone: ' + Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_LINE("2.99mm", "67.53mm", "16.14mm", "67.53mm", 0, 1);
    LODOP.ADD_PRINT_LINE("34.02mm", "3.18mm", "34.02mm", "35.39mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("39.21mm", "68.55mm", "26.46mm", "5.29mm", Data.To.Country.CountryNameCn);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
    LODOP.ADD_PRINT_LINE("40.63mm", "3.18mm", "40.63mm", "35.39mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("36.16mm", "5.03mm", "40mm", "5.29mm", 'Phone: ' + Data.From.Phone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("40.93mm", "5.03mm", "33.07mm", "7.94mm", "退件单位：" + distance);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.ADD_PRINT_LINE("58.91mm", "2.99mm", "58.91mm", "96.92mm", 0, 1);
    LODOP.ADD_PRINT_BARCODE("48.33mm", "33.87mm", "40.22mm", "10.05mm", "128Auto", Data.TrackingNumber);
    LODOP.ADD_PRINT_LINE("63.76mm", "2.99mm", "63.76mm", "96.99mm", 0, 1);
    LODOP.ADD_PRINT_LINE("68.26mm", "2.99mm", "68.26mm", "96.99mm", 0, 1);
    LODOP.ADD_PRINT_LINE("73.03mm", "2.99mm", "73.03mm", "96.99mm", 0, 1);
    LODOP.ADD_PRINT_LINE("78.05mm", "2.99mm", "78.05mm", "96.99mm", 0, 1);
    LODOP.ADD_PRINT_LINE("83.05mm", "2.99mm", "83.05mm", "96.99mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("83.61mm", "3.97mm", "90.75mm", "12.44mm", "I certify that the particulars given in this declaration are correct and this Itm does not contain any dangerous articles prohibited by legislation or by postal or customs regulations");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("93.93mm", "3.97mm", "60.56mm", "5.29mm", "Sender's signiture & Data Signed：" + (typeof type === 'number' ? '' : MdPrint.getChinaPostFlag(type)));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("92.34mm", "80.43mm", "14.55mm", "5.29mm", "CN22");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_LINE("83.34mm", "10.58mm", "58.74mm", "10.58mm", 0, 1);
    LODOP.ADD_PRINT_LINE("83.34mm", "17.58mm", "58.74mm", "17.58mm", 0, 1);
    LODOP.ADD_PRINT_LINE("83.34mm", "55.83mm", "58.74mm", "55.83mm", 0, 1);
    LODOP.ADD_PRINT_LINE("83.34mm", "66.41mm", "58.74mm", "66.41mm", 0, 1);
    LODOP.ADD_PRINT_LINE("83.34mm", "81.49mm", "58.74mm", "81.49mm", 0, 1);
    LODOP.ADD_PRINT_TEXT("61.12mm", "5.03mm", "6.09mm", "5.03mm", "NO");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("61.12mm", "11.91mm", "7.41mm", "5.29mm", "Qty");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("60.85mm", "25.14mm", "28.05mm", "5.29mm", "Description of Contents");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("60.59mm", "59mm", "7.41mm", "5.29mm", "kg.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("61.12mm", "68mm", "15.35mm", "5.29mm", "Vals(USD$)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("61.12mm", "83.08mm", "16.67mm", "5.29mm", "Goods Origin");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    //第一行信息
    LODOP.ADD_PRINT_TEXT("65.35mm", "5.03mm", "6.09mm", "5.29mm", "1");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT("65.35mm", "13.49mm", "7.41mm", "5.29mm", Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT("65.35mm", "19.05mm", "28.05mm", "5.29mm", Data.Item[0].TitleEn + " " + Data.Item[0].Title);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT("65.35mm", "57.68mm", "8.73mm", "5.29mm", Number((Data.Item[0].Weight / 1000).toFixed(3)) * Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT("65.62mm", "70.64mm", "15.35mm", "5.29mm", (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT("65.35mm", "86.52mm", "16.67mm", "5.29mm", Data.From.Country.CountryCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 1);
    localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 1);
    localData.totalValue = this.printTotalData(Data.Item, 'Amount', 1);
    //第二行
    if (Data.Item.length > 1) {
      LODOP.ADD_PRINT_TEXT("70.35mm", "5.03mm", "6.09mm", "5.29mm", "1");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
      LODOP.ADD_PRINT_TEXT("70.35mm", "13.49mm", "7.41mm", "5.29mm", Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
      LODOP.ADD_PRINT_TEXT("70.35mm", "19.05mm", "28.05mm", "5.29mm", Data.Item[1].TitleEn + " " + Data.Item[1].Title);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
      LODOP.ADD_PRINT_TEXT("70.35mm", "57.68mm", "8.73mm", "5.29mm", Number((Data.Item[1].Weight / 1000).toFixed(3)) * Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
      LODOP.ADD_PRINT_TEXT("70.62mm", "70.64mm", "15.35mm", "5.29mm", (Data.Item[1].Amount * Data.Item[1].Quantity).toFixed(2));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
      LODOP.ADD_PRINT_TEXT("70.35mm", "86.52mm", "16.67mm", "5.29mm", Data.From.Country.CountryCode);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
      localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 2);
      localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 2);
      localData.totalValue = this.printTotalData(Data.Item, 'Amount', 2);
    }
    //第三行
    if (Data.Item.length > 2) {
      LODOP.ADD_PRINT_TEXT("75.35mm", "5.03mm", "6.09mm", "5.29mm", "1");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
      LODOP.ADD_PRINT_TEXT("75.35mm", "13.49mm", "7.41mm", "5.29mm", Data.Item[2].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
      LODOP.ADD_PRINT_TEXT("75.35mm", "19.05mm", "28.05mm", "5.29mm", Data.Item[2].TitleEn + " " + Data.Item[2].Title);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
      LODOP.ADD_PRINT_TEXT("75.35mm", "57.68mm", "8.73mm", "5.29mm", Number((Data.Item[2].Weight / 1000).toFixed(3)) * Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
      LODOP.ADD_PRINT_TEXT("75.62mm", "70.64mm", "15.35mm", "5.29mm", (Data.Item[2].Amount * Data.Item[2].Quantity).toFixed(2));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
      LODOP.ADD_PRINT_TEXT("75.35mm", "86.52mm", "16.67mm", "5.29mm", Data.From.Country.CountryCode);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
      localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 3);
      localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 3);
      localData.totalValue = this.printTotalData(Data.Item, 'Amount', 3);
    }
    LODOP.ADD_PRINT_TEXT("80.41mm", "13.49mm", "7.41mm", "5.29mm", localData.totalQty);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT("80.41mm", "19.05mm", "28.05mm", "5.29mm", "Total Gross Weight(Kg)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT("80.41mm", "58.21mm", "8.73mm", "5.29mm", (localData.totalWeight / 1000).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.ADD_PRINT_TEXT("80.41mm", "70.64mm", "15.35mm", "5.29mm", localData.totalValue.toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
    LODOP.PRINT();

  },
  // 中邮PRIME跟踪小包
  prime(Data:Interface.PrintData, mc:string, str:number, Type:number|string) {
    var date = new Date();
    // 获取中国邮政平邮分区号
    var areaCode = this.getMailAreaCode(Data.To.Country.CountryCode);
    var localData = {
      ToAddress: Data.To.BuyerStreet1 + (Data.To.BuyerStreet2 == "" ? '' : ',' + Data.To.BuyerStreet2) + "\n" + Data.To.BuyerCity + (Data.To.BuyerState == '' ? '' : ',' + Data.To.BuyerState),
      FromAddress: (Data.From.Street2 == '' ? '' : Data.From.Street2 + ',') + Data.From.Street1 + "\n" + Data.From.City + "," + Data.From.SateOrProvince + ',' + Data.From.Country.CountryName.toUpperCase(),
      PrintDate: this.getPrintDate(),
      totalQty: 0,
      totalWeight: 0,
      totalValue: 0
    }
    LODOP.PRINT_INITA("0mm", "0mm", '100mm', '100mm', "面单-中邮PRIME跟踪小包渠道面单");

    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "面单-中邮PRIME跟踪小包渠道面单");

    LODOP.ADD_PRINT_LINE("57.71mm", "2.65mm", "57.71mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("16.64mm", "40.75mm", "16.64mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("44mm", "40.69mm", "16.7mm", "40.69mm", 0, 1);
    LODOP.ADD_PRINT_LINE("36.2mm", "2.91mm", "36.2mm", "40.72mm", 0, 1);
    LODOP.ADD_PRINT_LINE("80.41mm", "2.65mm", "80.41mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("79.88mm", "7.7mm", "57.39mm", "7.7mm", 0, 1);
    LODOP.ADD_PRINT_LINE("79.88mm", "14.29mm", "57.39mm", "14.29mm", 0, 1);
    LODOP.ADD_PRINT_LINE("79.88mm", "80.99mm", "57.39mm", "80.99mm", 0, 1);
    LODOP.ADD_PRINT_LINE("79.88mm", "57.2mm", "57.39mm", "57.2mm", 0, 1);
    LODOP.ADD_PRINT_LINE("79.88mm", "67.71mm", "57.39mm", "67.71mm", 0, 1);
    LODOP.ADD_PRINT_RECT("2.65mm", "2.65mm", "95.01mm", "95.01mm", 0, 1);
    LODOP.ADD_PRINT_LINE("62.39mm", "2.65mm", "62.39mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("43.89mm", "2.65mm", "43.89mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("16.64mm", "77.5mm", "2.65mm", "77.5mm", 0, 1);
    LODOP.ADD_PRINT_LINE("16.64mm", "63.79mm", "2.65mm", "63.79mm", 0, 1);
    LODOP.ADD_PRINT_LINE("75.7mm", "2.65mm", "75.7mm", "97.9mm", 0, 1);
    LODOP.ADD_PRINT_LINE("66.68mm", "2.65mm", "66.41mm", "97.9mm", 0, 1);

    LODOP.ADD_PRINT_TEXT("80.7mm", "3.97mm", "96.84mm", "11.11mm", "I certify the particulars given in this customs declaration are correct.This Itm does not contain any dangerous article, or articles prohibitedby legislation or by postal or customs regulations. I have met allapplicable export filing requirements under the Foreign Trade Regulations");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("94.46mm", "3.7mm", "80.7mm", "5.29mm", "Sender's Signature & Date Signed: " + MdPrint.getChinaPostFlag( (Type === 1 ? '1*25' : Type === 2 ? '1*1' : Type === 3 ? '1*2' : Type === '379' ? '379' : mc ) || 'prime') );
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("91.28mm", "82.55mm", "15.88mm", "5.29mm", "CN22");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);

    LODOP.ADD_PRINT_IMAGE("4.5mm", "4.23mm", "29.1mm", "8.73mm", "<img src='/static/images/中国邮政logo.png' width='107'>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);

    LODOP.ADD_PRINT_TEXT("6.01mm", "33.07mm", "33.34mm", "5.29mm", (str === 1 || str === 3 || str === 4 || str === 5) ? "Tracked Packet \r\nBY AIR" : "Prime Tracked Mail \r\nBY AIR");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);

    if(str === 5){
      LODOP.ADD_PRINT_TEXT("7.43mm","81.36mm",59,"8.89mm", "Economy");
    }else{
      LODOP.ADD_PRINT_IMAGE("3.47mm", "84mm", 35, "13.65mm", (str === 2 || str === 4) ? "<img src='/static/images/PrimeExpres-logo-color.png' width='35'>" : "<img src='/static/images/PrimeExpres-logo.jpg' width='35'>");
    }
    if (Data.LogisticsExt != '' && typeof Data.LogisticsExt === 'string') {
      Data.LogisticsExt = JSON.parse(Data.LogisticsExt)
    }
    if(Data.LogisticsExt.NorwayVatNumber && Data.To.BuyerCountry === 'NO'){
      let s = Data.LogisticsExt.NorwayVatNumber.substring(0,1) + "*****" + Data.LogisticsExt.NorwayVatNumber.substring(6)
      LODOP.ADD_PRINT_TEXT("27.25mm","3.97mm","37.57mm","5.29mm",`VAT No: VOEC ${s}`);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    }

    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    LODOP.ADD_PRINT_TEXT("8.2mm", "64.82mm", "11.91mm", "5.29mm", this.getChinaPostLM(Data.To.Country.CountryCode));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT("32.28mm", "3.97mm", "35.98mm", "4.23mm", "PHONE：" + Data.From.Phone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("37.57mm", "3.97mm", "26.46mm", "3.97mm", "退件单位：" + (Type === 2 ? "上海邮政物流公司wish上海仓" :Type === 3 ? "广州小包大宗收寄处理中心" : "佛山市邮政局函件集邮局"));
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_BARCODE("44.98mm", "30%", "40%", "11.91mm", "128Auto", Data.TrackingNumber);

    LODOP.ADD_PRINT_TEXT("17.73mm", "42.6mm", "14.82mm", "4.76mm", "To: ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("17.73mm", "47.1mm", "26.46mm", "4.76mm", Data.To.BuyerFullName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("21.17mm", "42.6mm", "54.24mm", "18.26mm", localData.ToAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("39mm", "42.6mm", "12mm", "3.7mm", "PHONE: ");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("34.7mm", "42.6mm", "26.46mm", "3.18mm", Data.To.Country.CountryName + ' ' + Data.To.BuyerZipCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("39mm", "54mm", "26.46mm", "3.7mm", Data.To.BuyerPhone);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("33.34mm", "72.76mm", "23.81mm", "9.26mm", Data.To.Country.CountryNameCn);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

    LODOP.ADD_PRINT_TEXT("14.55mm", "3.97mm", "12.44mm", "3.7mm", "FROM:");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("14.55mm", "14.55mm", "29.1mm", "3.7mm", Data.From.SendUserName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("17.2mm", "3.97mm", "38.1mm", "10.85mm", localData.FromAddress);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT("59.27mm", "3.44mm", "7.67mm", "6.61mm", "No");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("59.27mm", "8.73mm", "7.41mm", "6.61mm", "Qty");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("59.27mm", "15.88mm", "36.51mm", "6.61mm", "Description of Contents");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("59.27mm", "60.33mm", "6.88mm", "6.61mm", "Kg.");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("59.27mm", "68mm", "16.67mm", "6.61mm", "Vals(USD$)");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("59.27mm", "83.61mm", "18.52mm", "6.61mm", "Good Origin");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("76.99mm", "15.88mm", "38.36mm", "5.29mm", "Total Gross Weight(kg.)：");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.ADD_PRINT_TEXT("63.5mm", "3.7mm", "7.41mm", "5.29mm", "1\r\n");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("63.5mm", "9.26mm", "7.94mm", "5.29mm", Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("63.5mm", "15.88mm", "44.45mm", "5.29mm", Data.Item[0].TitleEn + Data.Item[0].Title + 'x' + Data.Item[0].Quantity);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("63.5mm", "59mm", "12.17mm", "5.29mm", (Number((Data.Item[0].Weight / 1000).toFixed(3)) * Data.Item[0].Quantity).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("63.5mm", "73.03mm", "12.7mm", "5.29mm", (Data.Item[0].Amount * Data.Item[0].Quantity).toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("63.5mm", "87.05mm", "13.23mm", "5.29mm", "CN");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    if (Data.Item.length > 1) {
      // 第二行
      LODOP.ADD_PRINT_TEXT(256, 14, 28, 20, "2");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(256, 35, 29, 20, Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(256, 60, 168, 20, Data.Item[1].TitleEn + Data.Item[1].Title + 'x' + Data.Item[1].Quantity);
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(256, 223, 47, 20, (Number((Data.Item[1].Weight / 1000).toFixed(3)) * Data.Item[1].Quantity).toFixed(3));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(256, 276, 49, 20, (Data.Item[1].Amount * Data.Item[1].Quantity).toFixed(2));
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
      LODOP.ADD_PRINT_TEXT(256, 329, 47, 20, "CN");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

      LODOP.ADD_PRINT_LINE(270, 11, 269, 371, 0, 1);

      if (Data.Item.length > 2) {
        // 第三行
        LODOP.ADD_PRINT_TEXT(275, 14, 28, 20, "3");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.ADD_PRINT_TEXT(275, 35, 29, 20, Data.Item[2].Quantity);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.ADD_PRINT_TEXT(275, 60, 168, 20, Data.Item[2].TitleEn + Data.Item[2].Title + 'x' + Data.Item[2].Quantity);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.ADD_PRINT_TEXT(275, 223, 47, 20, (Number((Data.Item[2].Weight / 1000).toFixed(3)) * Data.Item[2].Quantity).toFixed(3));
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.ADD_PRINT_TEXT(275, 276, 49, 20, (Data.Item[2].Amount * Data.Item[2].Quantity).toFixed(2));
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
        LODOP.ADD_PRINT_TEXT(275, 329, 47, 20, "CN");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

        localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 3)
        localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 3)
        localData.totalValue = this.printTotalData(Data.Item, 'Amount', 3)
      } else {
        localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 2)
        localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 2)
        localData.totalValue = this.printTotalData(Data.Item, 'Amount', 2)
      }
    } else {
      localData.totalQty = this.printTotalData(Data.Item, 'Quantity', 1)
      localData.totalWeight = this.printTotalData(Data.Item, 'Weight', 1)
      localData.totalValue = this.printTotalData(Data.Item, 'Amount', 1)
    }

    // SKU表格统计
    LODOP.ADD_PRINT_TEXT("77.26mm", "9.26mm", "6.88mm", "5.29mm", localData.totalQty);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("77.26mm", "59mm", "8.73mm", "5.29mm", (localData.totalWeight / 1000).toFixed(3));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
    LODOP.ADD_PRINT_TEXT("77.26mm", "73.29mm", "9.79mm", "5.29mm", localData.totalValue.toFixed(2));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

    LODOP.PRINT();
    // LODOP.PRINT_DESIGN()
  },

  // 顺丰平邮获取当前日期方法
  getSfNowDate() {
    let now = new Date();
    let nowMonth = now.getMonth() + 1;
    return now.getFullYear() + "-" + (nowMonth < 10 ? '0' + nowMonth : nowMonth) + "-" + (now.getDate() < 10 ? '0' + now.getDate() : now.getDate()) +
      " " + (now.getHours() < 10 ? '0' + now.getHours() : now.getHours()) + ":" + (now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()) +
      ":" + (now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds());
  },

  getPrintDate() {
    let date = new Date();
    let month = date.getMonth() + 1
    let day = date.getDate();
    return date.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
  },

  // 循环统计重量&数量&申报价值的和
  printTotalData(Data:Interface.PrintItem[], params:string, total:number) {
    let sum:number = 0;
    for( let Itm=0; Itm< Data.length; Itm++){
      if (params == 'Quantity') {
        sum += Data[Itm].Quantity
      } else {
        sum += ((Data[Itm] as any)[params] * Data[Itm].Quantity)
      }

      if (Itm >= total - 1) {
        break;
      }
    }

    // for (let Itm in data) {
    //   if (params == 'Quantity') {
    //     sum += data[Itm].Quantity
    //   } else {
    //     sum += (data[Itm][params] * data[Itm].Quantity)
    //   }

    //   if (Itm >= total - 1) {
    //     break;
    //   }
    // }
    return sum;
  },

  // 中国邮政 美国E邮宝面单 格口号
  getUSLatticeMouth(val: number) {
    var val = Number(val);
    if ((val >= 0 && val <= 5) || (val >= 10 && val <= 69) || (val >= 80 && val <= 87) ||
      (val >= 90 && val <= 99) || (val >= 105 && val <= 109) || val == 115 || (val >= 117 && val <= 299)) { return '1F'; }
    if (val == 103 || (val >= 110 && val <= 114) || (val >= 88 && val <= 89)) { return '1P'; }
    if ((val >= 70 && val <= 73) || val == 79 || (val >= 80 && val <= 89)) { return '1Q'; }
    if ((val >= 100 && val <= 102) || val == 104) { return '1R'; }
    if (val == 942 || (val >= 950 && val <= 953) || (val >= 956 && val <= 973) ||
      (val >= 975 && val <= 976) || val == 979 || (val >= 986 && val <= 999)) { return '2F'; }
    if (val >= 980 && val <= 985) { return '2P'; }
    if (val >= 800 && val <= 812) { return '2Q'; }
    if (val >= 945 && val <= 948) { return '2R'; }
    if ((val >= 940 && val <= 941) || (val >= 943 && val <= 944) || val == 949 || (val >= 954 && val <= 955)) { return '2U'; }
    if (val == 974 || (val >= 977 && val <= 978)) { return '2V'; }
    if ((val >= 400 && val <= 429) || val == 439 || (val >= 450 && val <= 455) || val == 459 ||
      (val >= 470 && val <= 471) || (val >= 475 && val <= 477) || val == 480 || (val >= 483 && val <= 485) ||
      (val >= 490 && val <= 491) || (val >= 493 && val <= 497) || (val >= 500 && val <= 529) || val == 533 ||
      val == 536 || val == 540 || (val >= 546 && val <= 548) || (val >= 550 && val <= 609) || val == 612 ||
      (val >= 617 && val <= 619) || val == 621 || val == 624 || val == 632 || val == 635 || (val >= 642 && val <= 643) ||
      (val >= 650 && val <= 653) || val == 659 || val == 663 || (val >= 669 && val <= 699) || (val >= 740 && val <= 758) ||
      (val >= 760 && val <= 769) || val == 771 || (val >= 785 && val <= 787) || (val >= 789 && val <= 799)) { return '3F'; }
    if ((val >= 460 && val <= 469) || (val >= 472 && val <= 474) || (val >= 478 && val <= 479)) { return '3P'; }
    if ((val >= 498 && val <= 799) || (val >= 530 && val <= 532) || (val >= 534 && val <= 535) ||
      (val >= 537 && val <= 539) || (val >= 541 && val <= 545) || val == 549 || (val >= 610 && val <= 611)) { return '3Q'; }
    if (val == 759 || val == 770 || (val >= 772 && val <= 778)) { return '3R'; }
    if ((val >= 613 && val <= 616) || val == 620 || (val >= 622 && val <= 623) ||
      (val >= 625 && val <= 631) || (val >= 633 && val <= 634) || (val >= 636 && val <= 639)) { return '3U'; }
    if ((val >= 434 && val <= 436) || (val >= 481 && val <= 482) || (val >= 486 && val <= 489) || val == 492) { return '3C'; }
    if ((val >= 779 && val <= 784) || val == 788) { return '3D'; }
    if (val >= 440 && val <= 449) { return '3H'; }
    if ((val >= 640 && val <= 641) || (val >= 644 && val <= 649) || (val >= 654 && val <= 658) ||
      (val >= 660 && val <= 662) || (val >= 664 && val <= 668)) { return '3V'; }
    if ((val >= 430 && val <= 433) || (val >= 437 && val <= 438) || (val >= 456 && val <= 458)) { return '3X'; }
    if ((val >= 813 && val <= 828) || val == 833 || (val >= 835 && val <= 839) || (val >= 848 && val <= 849) ||
      val == 854 || val == 906 || val == 909 || (val >= 917 && val <= 918) || (val >= 922 && val <= 939)) { return '4F'; }
    if (val >= 900 && val <= 904) { return '4P'; }
    if (val == 905 || (val >= 907 && val <= 908)) { return '4W'; }
    if ((val >= 850 && val <= 853) || val == 855 || (val >= 859 && val <= 860) || val == 863) { return '4Q'; }
    if (val >= 919 && val <= 921) { return '4R'; }
    if (val >= 910 && val <= 916) { return '4U'; }
    if ((val >= 829 && val <= 832) || val == 834 || (val >= 840 && val <= 847) || val == 898) { return '4V'; }
    if ((val >= 300 && val <= 320) || (val >= 322 && val <= 326) || (val >= 334 && val <= 339) ||
      (val >= 341 && val <= 346) || (val >= 348 && val <= 399) || (val >= 700 && val <= 346)) { return '5F'; }
    if (val == 340 || (val >= 330 && val <= 333) || val == 347) { return '5P'; }
    if (val == 321 || (val >= 327 && val <= 329) || val == 347) { return '5Q'; }
    if (val >= 6 && val <= 9) { return '5R'; }
  },

  // 获取中邮分拣码
  getChinaPostLM(val: string) {
    if (val === 'RU') { return 'RU21' }
    if (val === 'US') { return 'US22' }
    if (val === 'GB') { return 'GB23' }
    if (val === 'BR') { return 'BR24' }
    if (val === 'AU') { return 'AU25' }
    if (val === 'FR') { return 'FR26' }
    if (val === 'ES') { return 'ES27' }
    if (val === 'CA') { return 'CA28' }
    if (val === 'IL') { return 'IL29' }
    if (val === 'IT') { return 'IT30' }
    if (val === 'DE') { return 'DE31' }
    if (val === 'CL') { return 'CL32' }
    if (val === 'SE') { return 'SE33' }
    if (val === 'BY') { return 'BY34' }
    if (val === 'NO') { return 'NO35' }
    if (val === 'NL') { return 'NL36' }
    if (val === 'UA') { return 'UA37' }
    if (val === 'CH') { return 'CH38' }
    if (val === 'MX') { return 'MX39' }
    if (val === 'PL') { return 'PL40' }
    if (val === 'CZ') { return 'CZ41' }
    if (val === 'HR') { return 'HR42' }
    if (val === 'SK') { return 'SK43' }
    if (val === 'SI') { return 'SI44' }
    if (val === 'NZ') { return 'NZ45' }
    if (val === 'MA') { return 'MA46' }
    if (val === 'HU') { return 'HU47' }
    if (val === 'AM') { return 'AM48' }
    if (val === 'EE') { return 'EE49' }
    if (val === 'MY') { return 'MY50' }
    if (val === 'SG') { return 'SG51' }
    if (val === 'TH') { return 'TH52' }
    if (val === 'GE') { return 'GE53' }
    return val;
  },

  // 获取中国邮政挂号小包 分区号
  getRegisterAreaCode(val:string) {
    if (val === 'JP') { return '1' };
    if (val == 'KR' || val === 'MY' || val === 'TH' || val === 'SG' || val === 'IN' || val === 'ID') { return '2' };
    if (val === 'AT' || val === 'BG' || val === 'HR' || val === 'SK' || val === 'HU' || val === 'AU' || val === 'IE' || val === 'PL' || val === 'BE' || val === 'DE' || val === 'DK' || val === 'FL' || val === 'NL' || val === 'CZ' || val === 'NO' || val === 'PT' || val === 'SE' || val === 'CH' || val === 'GR' || val === 'IT' || val === 'IL') { return '3' };
    if (val === 'TR' || val === 'NZ') { return '4' };
    if (val === 'GB' || val === 'OM' || val === 'AZ' || val === 'EE' || val === 'BY' || val === 'BA' || val === 'PK' || val === 'KP' || val === 'FR' || val === 'PH' || val === 'KZ' || val === 'KG' || val === 'CA' || val === 'QA' || val === 'RO' || val === 'LU' || val === 'LT' || val === 'LV' || val === 'MT' || val === 'MN' || val === 'US' || val === 'LK' || val === 'SI' || val === 'CY' || val === 'SA' || val === 'TJ' || val === 'TM' || val === 'UA' || val === 'UZ' || val === 'ES' || val === 'SY' || val === 'AM' || val === 'VN' || val === 'BL') { return '5' };
    if (val === 'RU') { return '11' };
    if (val === 'ZA') { return '6' };
    if (val === 'AR' || val === 'BR' || val === 'MX') { return '7' };
    if (val === 'AF' || val === 'AE' || val === 'BT' || val === 'BH' || val === 'TL' || val === 'KH' || val === 'KW' || val === 'LB' || val === 'LA' || val === 'MM' || val === 'MV' || val === 'BD' || val === 'PE' || val === 'NP' || val === 'BN' || val === 'JO' || val === 'IR' || val === 'IQ' || val === 'YE' || val === 'CL') { return '8' }
    if (val === 'AD' || val === 'AL' || val === 'IS' || val === 'VA' || val === 'FO' || val === 'GE' || val === 'ME' || val === 'LI' || val === 'MD' || val === 'MC' || val === 'MK' || val === 'RS' || val === 'SM' || val === 'GI') { return '9' };
    if (val === 'DZ' || val === 'AO' || val === 'EG' || val === 'ET' || val === 'AC' || val === 'PG' || val === 'BW' || val === 'BF' || val === 'BI' || val === 'PF' || val === 'BJ' || val === 'PA' || val === 'GQ' || val === 'TG' || val === 'EC' || val === 'ER' || val === 'CV' || val === 'FJ' || val === 'CU' || val === 'GM' || val === 'GU' || val === 'CG' || val === 'CD' || val === 'CO' || val === 'ZW' || val === 'DJ' || val === 'KI' || val === 'GH' || val === 'IC' || val === 'GN' || val === 'GW' || val === 'GA' || val === 'CP' || val === 'CK' || val === 'CC' || val === 'KM' || val === 'CM' || val === 'KE' || val === 'CI' || val === 'LR' || val === 'LY' || val === 'RE' || val === 'LS' || val === 'RW' || val === 'MG' || val === 'FM' || val === 'ML' || val === 'MA' || val === 'MU' || val === 'MR' || val === 'MW' || val === 'MP' || val === 'MZ' || val === 'MH' || val === 'YT' || val === 'NU' || val === 'NR' || val === 'NA' || val === 'GS' || val === 'NE' || val === 'NG' || val === 'PW' || val === 'PN' || val === 'NF' || val === 'UM' || val === 'SD' || val === 'CX' || val === 'ST' || val === 'SH' || val === 'KN' || val === 'SL' || val === 'SB' || val === 'SR' || val === 'SO' || val === 'AS' || val === 'SN' || val === 'SC' || val === 'SZ' || val === 'TO' || val === 'TK' || val === 'TA' || val === 'TN' || val === 'TZ' || val === 'TV' || val === 'UG' || val === 'WF' || val === 'VU' || val === 'VE' || val === 'NC' || val === 'EH' || val === 'WS' || val === 'IO' || val === 'Z4' || val === 'Z7' || val === 'XH' || val === 'ZM' || val === 'TD' || val === 'CF' || val === 'HM' || val === 'SJ' || val === 'TF' || val === 'AI' || val === 'AW' || val === 'AG' || val === 'BB' || val === 'PR' || val === 'BS' || val === 'PY' || val === 'BO' || val === 'BZ' || val === 'BM' || val === 'DO' || val === 'FK' || val === 'GF' || val === 'GP' || val === 'GL' || val === 'GD' || val === 'CR' || val === 'GY' || val === 'HT' || val === 'HN' || val === 'AN' || val === 'KY' || val === 'VI' || val === 'MQ' || val === 'MS' || val === 'NI' || val === 'SV' || val === 'LC' || val === 'PM' || val === 'VC' || val === 'TC' || val === 'TT' || val === 'GT' || val === 'UY' || val === 'JM' || val === 'VG' || val === 'ZR' || val === 'Z9') { return '10' };
  },

  // 获取中国邮政平邮小包 分区号
  getMailAreaCode(val:String) {
    if (val === 'JP') { return '1' };
    if (val === 'AT' || val === 'BG' || val === 'KR' || val === 'MY' || val === 'SK' || val === 'TH' || val === 'SG' || val === 'IN' || val === 'ID') { return '2' };
    if (val === 'IE' || val === 'PL' || val === 'BE' || val === 'DK' || val === 'FI' || val === 'CZ' || val === 'PT' || val === 'CH' || val === 'GR' || val === 'IT') { return '3' };
    if (val === 'OM' || val === 'AZ' || val === 'EE' || val === 'BY' || val === 'BA' || val === 'PK' || val === 'KP' || val === 'FR' || val === 'PH' || val === 'KZ' || val === 'KG' || val === 'CA' || val === 'QA' || val === 'RO' || val === 'LU' || val === 'LT' || val === 'LV' || val === 'MT' || val === 'MN' || val === 'US' || val === 'LK' || val === 'SI' || val === 'CY' || val === 'SA' || val === 'TR' || val === 'TJ' || val === 'TM' || val === 'UA' || val === 'UZ' || val === 'ES' || val === 'SY' || val === 'NZ' || val === 'AM' || val === 'VN' || val === 'BL') { return '4' };
    if (val === 'AD' || val === 'AL' || val === 'DZ' || val === 'AF' || val === 'AO' || val === 'AR' || val === 'EG' || val === 'AE' || val === 'ET' || val === 'AC' || val === 'PG' || val === 'BW' || val === 'BT' || val === 'IS' || val === 'BF' || val === 'BH' || val === 'BI' || val === 'PF' || val === 'BJ' || val === 'PA' || val === 'BR' || val === 'GQ' || val === 'TL' || val === 'TG' || val === 'EC' || val === 'ER' || val === 'VA' || val === 'CV' || val === 'FJ' || val === 'FO' || val === 'CU' || val === 'GM' || val === 'GU' || val === 'CG' || val === 'CD' || val === 'CO' || val === 'GE' || val === 'ME' || val === 'ZW' || val === 'DJ' || val === 'KI' || val === 'GH' || val === 'IC' || val === 'GN' || val === 'GW' || val === 'GA' || val === 'KH' || val === 'CP' || val === 'CK' || val === 'CC' || val === 'KM' || val === 'CM' || val === 'KE' || val === 'CI' || val === 'KW' || val === 'LR' || val === 'LB' || val === 'LY' || val === 'RE' || val === 'LS' || val === 'LA' || val === 'RW' || val === 'LI' || val === 'MM' || val === 'MG' || val === 'MV' || val === 'MD' || val === 'BD' || val === 'FM' || val === 'PE' || val === 'ML' || val === 'MA' || val === 'MU' || val === 'MR' || val === 'MW' || val === 'MP' || val === 'MC' || val === 'MK' || val === 'MZ' || val === 'MH' || val === 'MX' || val === 'YT' || val === 'NU' || val === 'NP' || val === 'ZA' || val === 'NR' || val === 'NA' || val === 'GS' || val === 'NE' || val === 'NG' || val === 'PW' || val === 'PN' || val === 'NF' || val === 'UM' || val === 'SD' || val === 'CX' || val === 'ST' || val === 'RS' || val === 'SH' || val === 'KN' || val === 'SL' || val === 'SB' || val === 'SR' || val === 'SO' || val === 'SM' || val === 'AS' || val === 'SN' || val === 'SC' || val === 'SZ' || val === 'TO' || val === 'TK' || val === 'TA' || val === 'TN' || val === 'TZ' || val === 'TV' || val === 'UG' || val === 'BN' || val === 'WF' || val === 'VU' || val === 'VE' || val === 'NC' || val === 'EH' || val === 'WS' || val === 'IO' || val === 'JO' || val === 'Z4' || val === 'Z7' || val === 'IR' || val === 'IQ' || val === 'YE' || val === 'XH' || val === 'GI' || val === 'ZM' || val === 'TD' || val === 'CF' || val === 'HM' || val === 'SJ' || val === 'TF') { return '5' };
    if (val === 'AI' || val === 'AW' || val === 'AG' || val === 'BB' || val === 'PR' || val === 'BS' || val === 'PY' || val === 'BO' || val === 'BZ' || val === 'BM' || val === 'DO' || val === 'FK' || val === 'GF' || val === 'GP' || val === 'GL' || val === 'GD' || val === 'CR' || val === 'GY' || val === 'HT' || val === 'HN' || val === 'AN' || val === 'KY' || val === 'VI' || val === 'MQ' || val === 'MS' || val === 'NI' || val === 'SV' || val === 'LC' || val === 'PM' || val === 'VC' || val === 'TC' || val === 'TT' || val === 'GT' || val === 'UY' || val === 'JM' || val === 'VG' || val === 'CL' || val === 'ZR' || val === 'Z9') { return '6' };
    if (val === 'RU') { return '7' };
    if (val === 'HR' || val === 'HU' || val === 'AU' || val === 'DE' || val === 'NL' || val === 'NO' || val === 'SE' || val === 'GB' || val === 'IL') { return '8' };
  },

  // 获取顺丰国家小包 平邮分拣码
  getSFMailLatticeMouth(val:string) {
    if (val === 'GB') { return '1P-GB-*' }
    if (val === 'FR') { return '1P-FR-*' }
    if (val === 'DE') { return '1P-DE-*' }
    if (val === 'IT') { return '1P-IT-*' }
    if (val === 'ES') { return '1P-ES-*' }
    if (val === 'NL') { return '1P-NL-*' }
    if (val === 'US') { return '1P-US' }
    if (val === 'CA') { return '1P-CA' }
    if (val === 'AT') { return '1P-AT-*' }
    if (val === 'BE') { return '1P-BE-*' }
    if (val === 'GR') { return '1P-GR-*' }
    if (val === 'HU') { return '1P-HU-*' }
    if (val === 'CH') { return '1P-CH' }
    if (val === 'CZ') { return '1P-CZ-*' }
    if (val === 'PT') { return '1P-PT-*' }
    if (val === 'SK') { return '1P-SK-*' }
    if (val === 'IE') { return '1P-IE-*' }
    if (val === 'RO') { return '1P-RO-*' }
    if (val === 'DK') { return '1P-DK-*' }
    if (val === 'SI') { return '1P-SI-*' }
    if (val === 'IS') { return '1P-IS' }
    if (val === 'LU') { return '1P-LU-*' }
    if (val === 'TR') { return '1P-TR' }
    if (val === 'BG') { return '1P-BG-*' }
    if (val === 'HR') { return '1P-HR-*' }
    if (val === 'CY') { return '1P-CY-*' }
    if (val === 'CL') { return '1P-CL' }
    if (val === 'MX') { return '1P-MX' }
    if (val === 'AR') { return '1P-AR' }
    if (val === 'AU') { return '5P-AU' }
    if (val === 'EG') { return '1P-EG' }
    if (val === 'IL') { return '1P-IL' }
    if (val === 'JP') { return '1P-JP' }
    if (val === 'KW') { return '1P-KW' }
    if (val === 'QA') { return '1P-QA' }
    if (val === 'SA') { return '1P-SA' }
    if (val === 'SG') { return '1P-SG' }
    if (val === 'ZA') { return '1P-ZA' }
    if (val === 'AE') { return '1P-AE' }
    if (val === 'RU') { return '5-EE-RU-P' }
    if (val === 'LT') { return '7-EE-LT-P' }
    if (val === 'LV') { return '11-EE-LV-P' }
    if (val === 'EE') { return '9-EE-EE-P' }
    if (val === 'FI') { return '13-EE-FI-P' }
    if (val === 'NO') { return '17-EE-NO-P' }
    if (val === 'SE') { return '15-EE-SE-P' }
    if (val === 'BY') { return '19-EE-BY-P' }
    if (val === 'UA') { return '21-EE-UA-P' }
    if (val === 'PL') { return '23-EE-PL-P' }
    if (val === 'BR') { return '2P-BR' }
    if (val === 'BN') { return '2P-BN' }
    if (val === 'KH') { return '2P-KH' }
    if (val === 'FO') { return '2P-FO' }
    if (val === 'GL') { return '2P-GL' }
    if (val === 'IN') { return '2P-IN' }
    if (val === 'ID') { return '2P-ID' }
    if (val === 'MY') { return '2P-MY' }
    if (val === 'MT') { return '2P-MT-*' }
    if (val === 'NZ') { return '2P-NZ' }
    if (val === 'PK') { return '2P-PK' }
    if (val === 'PH') { return '2P-PH' }
    if (val === 'KR') { return '2P-KR' }
    if (val === 'LK') { return '2P-LK' }
    if (val === 'TH') { return '2P-TH' }
    if (val === 'VN') { return '2P-VN' }
    if (val === 'AI') { return '1P-ROA' }
    if (val === 'AG') { return '1P-ROA' }
    if (val === 'AW') { return '1P-ROA' }
    if (val === 'BS') { return '1P-ROA' }
    if (val === 'BB') { return '1P-ROA' }
    if (val === 'BZ') { return '1P-ROA' }
    if (val === 'BM') { return '1P-ROA' }
    if (val === 'BQ') { return '1P-ROA' }
    if (val === 'KY') { return '1P-ROA' }
    if (val === 'CR') { return '1P-ROA' }
    if (val === 'CW') { return '1P-ROA' }
    if (val === 'DM') { return '1P-ROA' }
    if (val === 'DO') { return '1P-ROA' }
    if (val === 'SV') { return '1P-ROA' }
    if (val === 'GD') { return '1P-ROA' }
    if (val === 'GP') { return '1P-ROA' }
    if (val === 'GT') { return '1P-ROA' }
    if (val === 'HT') { return '1P-ROA' }
    if (val === 'HN') { return '1P-ROA' }
    if (val === 'JM') { return '1P-ROA' }
    if (val === 'MQ') { return '1P-ROA' }
    if (val === 'MS') { return '1P-ROA' }
    if (val === 'NI') { return '1P-ROA' }
    if (val === 'PA') { return '1P-ROA' }
    if (val === 'KN') { return '1P-ROA' }
    if (val === 'LC') { return '1P-ROA' }
    if (val === 'VC') { return '1P-ROA' }
    if (val === 'SX') { return '1P-ROA' }
    if (val === 'TT') { return '1P-ROA' }
    if (val === 'TC') { return '1P-ROA' }
    if (val === 'VG') { return '1P-ROA' }
    if (val === 'DZ') { return '1P-ROF' }
    if (val === 'AO') { return '1P-ROF' }
    if (val === 'BJ') { return '1P-ROF' }
    if (val === 'BW') { return '1P-ROF' }
    if (val === 'IO') { return '1P-ROF' }
    if (val === 'BF') { return '1P-ROF' }
    if (val === 'BI') { return '1P-ROF' }
    if (val === 'CM') { return '1P-ROF' }
    if (val === 'CV') { return '1P-ROF' }
    if (val === 'CF') { return '1P-ROF' }
    if (val === 'TD') { return '1P-ROF' }
    if (val === 'KM') { return '1P-ROF' }
    if (val === 'CG') { return '1P-ROF' }
    if (val === 'DJ') { return '1P-ROF' }
    if (val === 'GQ') { return '1P-ROF' }
    if (val === 'ET') { return '1P-ROF' }
    if (val === 'GA') { return '1P-ROF' }
    if (val === 'GM') { return '1P-ROF' }
    if (val === 'GH') { return '1P-ROF' }
    if (val === 'GN') { return '1P-ROF' }
    if (val === 'GW') { return '1P-ROF' }
    if (val === 'KE') { return '1P-ROF' }
    if (val === 'LS') { return '1P-ROF' }
    if (val === 'LY') { return '1P-ROF' }
    if (val === 'MG') { return '1P-ROF' }
    if (val === 'MW') { return '1P-ROF' }
    if (val === 'ML') { return '1P-ROF' }
    if (val === 'MR') { return '1P-ROF' }
    if (val === 'MU') { return '1P-ROF' }
    if (val === 'MA') { return '1P-ROF' }
    if (val === 'MZ') { return '1P-ROF' }
    if (val === 'NA') { return '1P-ROF' }
    if (val === 'NE') { return '1P-ROF' }
    if (val === 'NG') { return '1P-ROF' }
    if (val === 'RE') { return '1P-ROF' }
    if (val === 'RW') { return '1P-ROF' }
    if (val === 'ST') { return '1P-ROF' }
    if (val === 'SN') { return '1P-ROF' }
    if (val === 'SC') { return '1P-ROF' }
    if (val === 'SZ') { return '1P-ROF' }
    if (val === 'TZ') { return '1P-ROF' }
    if (val === 'TG') { return '1P-ROF' }
    if (val === 'TN') { return '1P-ROF' }
    if (val === 'UG') { return '1P-ROF' }
    if (val === 'EH') { return '1P-ROF' }
    if (val === 'ZM') { return '1P-ROF' }
    if (val === 'ZW') { return '1P-ROF' }
    if (val === 'CK') { return '1P-ROW' }
    if (val === 'FJ') { return '1P-ROW' }
    if (val === 'PF') { return '1P-ROW' }
    if (val === 'KI') { return '1P-ROW' }
    if (val === 'NR') { return '1P-ROW' }
    if (val === 'NC') { return '1P-ROW' }
    if (val === 'NU') { return '1P-ROW' }
    if (val === 'PG') { return '1P-ROW' }
    if (val === 'WS') { return '1P-ROW' }
    if (val === 'SB') { return '1P-ROW' }
    if (val === 'TK') { return '1P-ROW' }
    if (val === 'TO') { return '1P-ROW' }
    if (val === 'VU') { return '1P-ROW' }
    if (val === 'WF') { return '1P-ROW' }
    if (val === 'AL') { return '1P-ROW' }
    if (val === 'AD') { return '1P-ROW' }
    if (val === 'BA') { return '1P-ROW' }
    if (val === 'GI') { return '1P-ROW' }
    if (val === 'XZ') { return '1P-ROW' }
    if (val === 'LI') { return '1P-ROW' }
    if (val === 'MK') { return '1P-ROW' }
    if (val === 'MD') { return '1P-ROW' }
    if (val === 'MC') { return '1P-ROW' }
    if (val === 'ME') { return '1P-ROW' }
    if (val === 'SM') { return '1P-ROW' }
    if (val === 'RS') { return '1P-ROW' }
    if (val === 'VA') { return '1P-ROW' }
    if (val === 'BO') { return '1P-ROA' }
    if (val === 'CO') { return '1P-ROA' }
    if (val === 'EC') { return '1P-ROA' }
    if (val === 'GF') { return '1P-ROA' }
    if (val === 'GY') { return '1P-ROA' }
    if (val === 'PY') { return '1P-ROA' }
    if (val === 'PE') { return '1P-ROA' }
    if (val === 'SR') { return '1P-ROA' }
    if (val === 'UY') { return '1P-ROA' }
    if (val === 'VE') { return '1P-ROA' }
    if (val === 'AF') { return '1P-ROW' }
    if (val === 'BD') { return '1P-ROW' }
    if (val === 'BT') { return '1P-ROW' }
    if (val === 'KZ') { return '1P-ROW' }
    if (val === 'KG') { return '1P-ROW' }
    if (val === 'LA') { return '1P-ROW' }
    if (val === 'MV') { return '1P-ROW' }
    if (val === 'MN') { return '1P-ROW' }
    if (val === 'MM') { return '1P-ROW' }
    if (val === 'NP') { return '1P-ROW' }
    if (val === 'TJ') { return '1P-ROW' }
    if (val === 'TM') { return '1P-ROW' }
    if (val === 'UZ') { return '1P-ROW' }
    if (val === 'AM') { return '1P-ROW' }
    if (val === 'AZ') { return '1P-ROW' }
    if (val === 'BH') { return '1P-ROW' }
    if (val === 'GE') { return '1P-ROW' }
    if (val === 'IQ') { return '1P-ROW' }
    if (val === 'JO') { return '1P-ROW' }
    if (val === 'LB') { return '1P-ROW' }
    if (val === 'OM') { return '1P-ROW' }
    if (val === 'YE') { return '1P-ROW' }
    if (val === 'PR') { return '1P-US' }
    if (val === 'HI') { return '1P-US' }
    if (val === 'BL') { return '1P-FR-*' }
    if (val === 'MF') { return '1P-ROW' }
    if (val === 'VI') { return '1P-US' }
    if (val === 'SH') { return '1P-ZA' }
    if (val === 'AS') { return '1P-US' }
    if (val === 'IM') { return '1P-GB-*' }
    if (val === 'CX') { return '1P-AU' }
    if (val === 'CC') { return '1P-AU' }
    if (val === 'GU') { return '1P-US' }
    if (val === 'MH') { return '1P-US' }
    if (val === 'FM') { return '1P-US' }
    if (val === 'NF') { return '1P-AU' }
    if (val === 'MP') { return '1P-US' }
    if (val === 'PW') { return '1P-US' }
    if (val === 'UM') { return '1P-US' }
    if (val === 'AX') { return '1P-FI' }
    if (val === 'GG') { return '1P-GB-*' }
    if (val === 'JE') { return '1P-GB-*' }
    if (val === 'PM') { return '1P-CA' }
    if (val === 'FK') { return '1P-GB-*' }
    if (val === 'TL') { return '1P-PT-*' }
  },

  // 获取顺丰国家小包 挂号分拣码
  getSFRegisteredLatticeMouth(val:string, zipCodes:string) {
    if (val === 'GB') { return '8R-GB-L' }
    if (val === 'FR') { return '1R-FR-*' }
    if (val === 'DE') { return '1R-DE-*' }
    if (val === 'IT') { return '1P-IT-*' }
    if (val === 'ES') { return '1R-ES-*' }
    if (val === 'NL') { return '1R-NL-*' }
    if (val === 'US') {
      // 匹配邮编前5位，东部:4R-JFK  西部：4R-LAX
      let code = '4R-LAX'
      let zipCode = Number(zipCodes.slice(0, 5))
      if ((zipCode >= 500 && zipCode <= 599) || (zipCode >= 1000 && zipCode <= 8999) || (zipCode >= 1000 && zipCode <= 21299) ||
        (zipCode >= 21400 && zipCode <= 26899) || (zipCode >= 27000 && zipCode <= 33999) || (zipCode >= 34100 && zipCode <= 34299) ||
        (zipCode >= 34400 && zipCode <= 34499) || (zipCode >= 34600 && zipCode <= 34799) || (zipCode >= 34900 && zipCode <= 35299) ||
        (zipCode >= 35400 && zipCode <= 41899) || (zipCode >= 42000 && zipCode <= 42799) || (zipCode >= 43000 && zipCode <= 51699) ||
        (zipCode >= 52000 && zipCode <= 52899) || (zipCode >= 53000 && zipCode <= 53299) || (zipCode >= 53400 && zipCode <= 53599) ||
        (zipCode >= 53700 && zipCode <= 55199) || (zipCode >= 55300 && zipCode <= 56799) || (zipCode >= 57000 && zipCode <= 57799) ||
        (zipCode >= 58000 && zipCode <= 58899) || (zipCode >= 60000 && zipCode <= 62099) || (zipCode >= 62200 && zipCode <= 63199) ||
        (zipCode >= 63300 && zipCode <= 64199) || (zipCode >= 64400 && zipCode <= 65899) || (zipCode >= 66000 && zipCode <= 66299) ||
        (zipCode >= 66400 && zipCode <= 67699) || zipCode == 67701 || (zipCode >= 67800 && zipCode <= 67899) || zipCode == 67901 ||
        zipCode == 67905 || (zipCode >= 68000 && zipCode <= 68199) || (zipCode >= 68300 && zipCode <= 68999) || zipCode == 69001 ||
        zipCode == 69101 || zipCode == 69130 || zipCode == 69132 || zipCode == 69153 || zipCode == 69160 || zipCode == 69162 ||
        zipCode == 69171 || zipCode == 69301 || zipCode == 69341 || zipCode == 69361 || zipCode == 69363 || (zipCode >= 72300 && zipCode <= 72334) ||
        (zipCode >= 72337 && zipCode <= 72395) || (zipCode >= 72397 && zipCode <= 72499) || (zipCode >= 72601 && zipCode <= 72602)) {
        code = '4R-JFK'
      }
      return code
    }
    if (val === 'CA') { return '1R-CA' }
    if (val === 'AT') { return '1R-AT-*' }
    if (val === 'BE') { return '1R-BE-*' }
    if (val === 'GR') { return '1P-GR-*' }
    if (val === 'HU') { return '1R-HU-*' }
    if (val === 'CH') { return '1R-CH' }
    if (val === 'CZ') { return '1R-CZ-*' }
    if (val === 'PT') { return '1R-PT-*' }
    if (val === 'SK') { return '1R-SK-*' }
    if (val === 'IE') { return '1R-IE-*' }
    if (val === 'RO') { return '1R-RO-*' }
    if (val === 'DK') { return '1R-DK-*' }
    if (val === 'SI') { return '1R-SI-*' }
    if (val === 'IS') { return '1R-IS' }
    if (val === 'LU') { return '1R-LU-*' }
    if (val === 'TR') { return '1R-TR' }
    if (val === 'BG') { return '1R-BG-*' }
    if (val === 'HR') { return '1R-HR-*' }
    if (val === 'CY') { return '1R-CY-*' }
    if (val === 'CL') { return '1R-CL' }
    if (val === 'MX') { return '1R-MX' }
    if (val === 'AR') { return '1R-AR' }
    if (val === 'AU') { return '5R-AU' }
    if (val === 'EG') { return '1R-EG' }
    if (val === 'IL') { return '1R-IL' }
    if (val === 'JP') { return '1R-JP' }
    if (val === 'KW') { return '1R-KW' }
    if (val === 'QA') { return '1R-QA' }
    if (val === 'SA') { return '1R-SA' }
    if (val === 'SG') { return '1R-SG' }
    if (val === 'ZA') { return '1R-ZA' }
    if (val === 'AE') { return '1R-AE' }
    if (val === 'RU') { return '6-EE-RU-G' }
    if (val === 'LT') { return '8-EE-LT-G' }
    if (val === 'LV') { return '12-EE-LV-G' }
    if (val === 'EE') { return '10-EE-EE-G' }
    if (val === 'FI') { return '14-EE-FI-G' }
    if (val === 'NO') { return '18-EE-NO-G' }
    if (val === 'SE') { return '16-EE-SE-G' }
    if (val === 'BY') { return '20-EE-BY-G' }
    if (val === 'UA') { return '22-EE-UA-G' }
    if (val === 'PL') { return '24-EE-PL-G' }
    if (val === 'BR') { return '2R-BR' }
    if (val === 'BN') { return '2R-BN' }
    if (val === 'KH') { return '2R-KH' }
    if (val === 'FO') { return '2R-FO' }
    if (val === 'GL') { return '2R-GL' }
    if (val === 'IN') { return '2R-IN' }
    if (val === 'ID') { return '2R-ID' }
    if (val === 'MY') { return '2R-MY' }
    if (val === 'MT') { return '2R-MT-*' }
    if (val === 'NZ') { return '2R-NZ' }
    if (val === 'PK') { return '2R-PK' }
    if (val === 'PH') { return '2R-PH' }
    if (val === 'KR') { return '2R-KR' }
    if (val === 'LK') { return '2R-LK' }
    if (val === 'TH') { return '2R-TH' }
    if (val === 'VN') { return '2R-VN' }
    if (val === 'AI') { return '1R-ROA' }
    if (val === 'AG') { return '1R-ROA' }
    if (val === 'AW') { return '1R-ROA' }
    if (val === 'BS') { return '1R-ROA' }
    if (val === 'BB') { return '1R-ROA' }
    if (val === 'BZ') { return '1R-ROA' }
    if (val === 'BM') { return '1R-ROA' }
    if (val === 'BQ') { return '1R-ROA' }
    if (val === 'KY') { return '1R-ROA' }
    if (val === 'CR') { return '1R-ROA' }
    if (val === 'CW') { return '1R-ROA' }
    if (val === 'DM') { return '1R-ROA' }
    if (val === 'DO') { return '1R-ROA' }
    if (val === 'SV') { return '1R-ROA' }
    if (val === 'GD') { return '1R-ROA' }
    if (val === 'GP') { return '1R-ROA' }
    if (val === 'GT') { return '1R-ROA' }
    if (val === 'HT') { return '1R-ROA' }
    if (val === 'HN') { return '1R-ROA' }
    if (val === 'JM') { return '1R-ROA' }
    if (val === 'MQ') { return '1R-ROA' }
    if (val === 'MS') { return '1R-ROA' }
    if (val === 'NI') { return '1R-ROA' }
    if (val === 'PA') { return '1R-ROA' }
    if (val === 'KN') { return '1R-ROA' }
    if (val === 'LC') { return '1R-ROA' }
    if (val === 'VC') { return '1R-ROA' }
    if (val === 'SX') { return '1R-ROA' }
    if (val === 'TT') { return '1R-ROA' }
    if (val === 'TC') { return '1R-ROA' }
    if (val === 'VG') { return '1R-ROA' }
    if (val === 'DZ') { return '1R-ROF' }
    if (val === 'AO') { return '1R-ROF' }
    if (val === 'BJ') { return '1R-ROF' }
    if (val === 'BW') { return '1R-ROF' }
    if (val === 'IO') { return '1R-ROF' }
    if (val === 'BF') { return '1R-ROF' }
    if (val === 'BI') { return '1R-ROF' }
    if (val === 'CM') { return '1R-ROF' }
    if (val === 'CV') { return '1R-ROF' }
    if (val === 'CF') { return '1R-ROF' }
    if (val === 'TD') { return '1R-ROF' }
    if (val === 'KM') { return '1R-ROF' }
    if (val === 'CG') { return '1R-ROF' }
    if (val === 'DJ') { return '1R-ROF' }
    if (val === 'GQ') { return '1R-ROF' }
    if (val === 'ET') { return '1R-ROF' }
    if (val === 'GA') { return '1R-ROF' }
    if (val === 'GM') { return '1R-ROF' }
    if (val === 'GH') { return '1R-ROF' }
    if (val === 'GN') { return '1R-ROF' }
    if (val === 'GW') { return '1R-ROF' }
    if (val === 'KE') { return '1R-ROF' }
    if (val === 'LS') { return '1R-ROF' }
    if (val === 'LY') { return '1R-ROF' }
    if (val === 'MG') { return '1R-ROF' }
    if (val === 'MW') { return '1R-ROF' }
    if (val === 'ML') { return '1R-ROF' }
    if (val === 'MR') { return '1R-ROF' }
    if (val === 'MU') { return '1R-ROF' }
    if (val === 'MA') { return '1R-ROF' }
    if (val === 'MZ') { return '1R-ROF' }
    if (val === 'NA') { return '1R-ROF' }
    if (val === 'NE') { return '1R-ROF' }
    if (val === 'NG') { return '1R-ROF' }
    if (val === 'RE') { return '1R-ROF' }
    if (val === 'RW') { return '1R-ROF' }
    if (val === 'ST') { return '1R-ROF' }
    if (val === 'SN') { return '1R-ROF' }
    if (val === 'SC') { return '1R-ROF' }
    if (val === 'SZ') { return '1R-ROF' }
    if (val === 'TZ') { return '1R-ROF' }
    if (val === 'TG') { return '1R-ROF' }
    if (val === 'TN') { return '1R-ROF' }
    if (val === 'UG') { return '1R-ROF' }
    if (val === 'EH') { return '1R-ROF' }
    if (val === 'ZM') { return '1R-ROF' }
    if (val === 'ZW') { return '1R-ROF' }
    if (val === 'CK') { return '1R-ROW' }
    if (val === 'FJ') { return '1R-ROW' }
    if (val === 'PF') { return '1R-ROW' }
    if (val === 'KI') { return '1R-ROW' }
    if (val === 'NR') { return '1R-ROW' }
    if (val === 'NC') { return '1R-ROW' }
    if (val === 'NU') { return '1R-ROW' }
    if (val === 'PG') { return '1R-ROW' }
    if (val === 'WS') { return '1R-ROW' }
    if (val === 'SB') { return '1R-ROW' }
    if (val === 'TK') { return '1R-ROW' }
    if (val === 'TO') { return '1R-ROW' }
    if (val === 'VU') { return '1R-ROW' }
    if (val === 'WF') { return '1R-ROW' }
    if (val === 'AL') { return '1R-ROW' }
    if (val === 'AD') { return '1R-ROW' }
    if (val === 'BA') { return '1R-ROW' }
    if (val === 'GI') { return '1R-ROW' }
    if (val === 'XZ') { return '1R-ROW' }
    if (val === 'LI') { return '1R-ROW' }
    if (val === 'MK') { return '1R-ROW' }
    if (val === 'MD') { return '1R-ROW' }
    if (val === 'MC') { return '1R-ROW' }
    if (val === 'ME') { return '1R-ROW' }
    if (val === 'SM') { return '1R-ROW' }
    if (val === 'RS') { return '1R-ROW' }
    if (val === 'VA') { return '1R-ROW' }
    if (val === 'BO') { return '1R-ROA' }
    if (val === 'CO') { return '1R-ROA' }
    if (val === 'EC') { return '1R-ROA' }
    if (val === 'GF') { return '1R-ROA' }
    if (val === 'GY') { return '1R-ROA' }
    if (val === 'PY') { return '1R-ROA' }
    if (val === 'PE') { return '1R-ROA' }
    if (val === 'SR') { return '1R-ROA' }
    if (val === 'UY') { return '1R-ROA' }
    if (val === 'VE') { return '1R-ROA' }
    if (val === 'AF') { return '1R-ROW' }
    if (val === 'BD') { return '1R-ROW' }
    if (val === 'BT') { return '1R-ROW' }
    if (val === 'KZ') { return '1R-ROW' }
    if (val === 'KG') { return '1R-ROW' }
    if (val === 'LA') { return '1R-ROW' }
    if (val === 'MV') { return '1R-ROW' }
    if (val === 'MN') { return '1R-ROW' }
    if (val === 'MM') { return '1R-ROW' }
    if (val === 'NP') { return '1R-ROW' }
    if (val === 'TJ') { return '1R-ROW' }
    if (val === 'TM') { return '1R-ROW' }
    if (val === 'UZ') { return '1R-ROW' }
    if (val === 'AM') { return '1R-ROW' }
    if (val === 'AZ') { return '1R-ROW' }
    if (val === 'BH') { return '1R-ROW' }
    if (val === 'GE') { return '1R-ROW' }
    if (val === 'IQ') { return '1R-ROW' }
    if (val === 'JO') { return '1R-ROW' }
    if (val === 'LB') { return '1R-ROW' }
    if (val === 'OM') { return '1R-ROW' }
    if (val === 'YE') { return '1R-ROW' }
    if (val === 'PR') { return '1R-US' }
    if (val === 'HI') { return '1R-US' }
    if (val === 'BL') { return '1R-FR-*' }
    if (val === 'MF') { return '1R-ROW' }
    if (val === 'VI') { return '1R-US' }
    if (val === 'SH') { return '1R-ZA' }
    if (val === 'AS') { return '1R-US' }
    if (val === 'IM') { return '1R-GB-*' }
    if (val === 'CX') { return '1R-AU' }
    if (val === 'CC') { return '1R-AU' }
    if (val === 'GU') { return '1R-US' }
    if (val === 'MH') { return '1R-US' }
    if (val === 'FM') { return '1R-US' }
    if (val === 'NF') { return '1R-AU' }
    if (val === 'MP') { return '1R-US' }
    if (val === 'PW') { return '1R-US' }
    if (val === 'UM') { return '1R-US' }
    if (val === 'AX') { return '1R-FI' }
    if (val === 'GG') { return '1R-GB-*' }
    if (val === 'JE') { return '1R-GB-*' }
    if (val === 'PM') { return '1R-CA' }
    if (val === 'FK') { return '1R-GB-*' }
    if (val === 'TL') { return '1R-PT-*' }
  },

  // wish邮平邮上海仓俄罗斯向
  getWishPostRuKey(zipCode:string) {
    let startOne = parseInt(zipCode.slice(0, 1));
    let startTwo = parseInt(zipCode.slice(0, 2));

    var returnValue = "";
    if (startOne == 3 || startOne == 4 || (startTwo >= 60 && startTwo <= 62)) {
      returnValue = '②(RUEKAA)';
    } else if (startTwo >= 63 && startTwo <= 67) {
      returnValue = '③(RUOVBB)';
    } else if (startTwo >= 68 && startTwo <= 69) {
      returnValue = '④(RUVVOI)';
    } else {
      returnValue = '①(RUMOWS)';
    }

    return returnValue;
  },

  getChinaPostFlag(mc:string) {
    switch (mc) {
      case '05': // 旧渠道代码
      case '004': // 新渠道代码
        return '线下平邮';
      case '04': // 旧渠道代码
      case '002': // 新渠道代码
        return '线下挂号';
      case '379':
        return 'Vova挂号';
      case '380':
        return 'Vova平邮';
      case 'ePacketUS':
        return '线上美eub';
      case 'ePacketOffALL':
        return '线下eub';
      case 'ePacketOffFR':
        return '线下法eub';
      case 'ePacketOffCA':
        return '线下加eub';
      case 'ePacketOffUS':
        return '线下美eub';
      case '11-1':
        return 'Wisheub';
      case '4621':
        return '广州线下';
      case '381':
        return 'Vovaeub';
      case 'prime':
        return '线下PRIME';
      case '253_AU':
        return '线下澳挂';
      case '253':
        return '线下增强'
      case 'FSEPACKET':
        return '佛山线下'
      case '1*25':
        return 'Wish佛挂'
      case '1*2':
        return 'Wish广挂'
      case '1*1':
        return 'Wish上挂'
      default:
        return ''
    }
  }
}

