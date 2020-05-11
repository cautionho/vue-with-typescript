(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0de677"],{8603:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("Row",{staticClass:"P-Inline-Block"},[a("Button",{staticClass:"P-MR-10 P-MB-10",attrs:{type:"primary"},on:{click:t.TriggerModal}},[t._v("打印批次")]),a("Modal",{attrs:{title:"打印批次","mask-closable":!1,width:"500"},on:{"on-cancel":function(e){return t.ChangePrintModal(!1)}},model:{value:t.IsPrint,callback:function(e){t.IsPrint=e},expression:"IsPrint"}},[a("Form",{ref:"PrintForm",attrs:{inline:"",onsubmit:"return false",model:t.PrintForm,"label-width":120}},[a("Form-item",{staticClass:"ivu-form-item-required",attrs:{prop:"PaperType",label:"纸张类型："}},[a("Select",{attrs:{placeholder:"请选择纸张类型",options:t.PaperTypeList},model:{value:t.PrintForm.PaperType,callback:function(e){t.$set(t.PrintForm,"PaperType",e)},expression:"PrintForm.PaperType"}})],1)],1),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"primary"},on:{click:t.CheckData}},[t._v("打印")]),a("Button",{staticStyle:{"margin-left":"8px"},attrs:{type:"default"},on:{click:function(e){return t.ChangePrintModal(!1)}}},[t._v("取消")])],1)],1),a("Col",{staticStyle:{display:"none"},attrs:{span:"24",id:"tpl"}},[a("table",{staticClass:"viewTable",staticStyle:{"margin-top":"20px","font-family":"'宋体'","font-size":"12px"},attrs:{border:"1",cellspacing:"0",cellpadding:"8",width:"720"}},[a("th",[t._v("SKU编号")]),a("th",{staticStyle:{"word-break":"break-all"}},[t._v("产品名")]),a("th",[t._v("待拣数")]),a("th",[t._v("可用库存数")]),a("th",[t._v("货架号")]),t._l(t.PrintData,(function(e){return t.PrintData.length>0?a("tr",{staticClass:"tcenter",staticStyle:{"text-align":"center"}},[a("td",[t._v(t._s(e.SkuCode))]),a("td",[t._v(t._s(e.SkuName))]),a("td",[t._v(t._s(e.NeedPickQuantity))]),a("td",[t._v(t._s(e.StockQuantity))]),a("td",[t._v(t._s(e.LocationCode))])]):t._e()}))],2)])],1)},r=[],i=(a("02cc"),a("76bb"),a("6ed5"),a("cee1"),a("3231")),o=a("064d"),m=a("46d7"),s=a("631e"),T=a("4a81"),c=a("d11d"),l=a("1f41"),P=a("2437"),_=function(t){Object(m["a"])(a,t);var e=Object(s["a"])(a);function a(){var t;return Object(i["a"])(this,a),t=e.apply(this,arguments),t.PrintData=[],t.SelectData=[],t.IsPrint=!1,t.PrintForm=new l["a"].PrintBatchForm,t.PaperTypeList=t.$Utils.GetEnumArr(t.$Enums.Warehouse.PaperType),t}return Object(o["a"])(a,[{key:"ChangePrintModal",value:function(t){this.PrintForm=new l["a"].PrintBatchForm,this.IsPrint=!1}},{key:"TriggerModal",value:function(){this.SelectedData.some((function(t){return t.TransferRequireStatus>2}))?this.$UI.Tips.Floating("warning","请选择状态为待拣货或已打印的批次进行操作"):this.IsPrint=!0}},{key:"CheckData",value:function(){var t=this;this.$UI.Loading.Show(),this.$Request.Post({Server:this.$Server.Warehouse,Api:{Address:this.$Api.TransferBatchPrint,Login:!0},Data:{TransferBatchCode:this.SelectData.map((function(t){return t.TransferBatchCode})),NeedItemData:1===this.PrintForm.PaperType},Callback:function(e){t.$UI.Loading.Hide(),e.IsSuccess?t.PrepareData(e.Data.Data):t.$Request.Error(e)}})}},{key:"PrepareData",value:function(t){var e=this;1===this.PrintForm.PaperType&&t[0].Items&&(this.PrintData=t[0].Items.filter((function(t){return t.NeedPickQuantity>0}))),this.$nextTick((function(){e.PrintPickingOrder(t,e.PrintForm.PaperType)}))}},{key:"PrintPickingOrder",value:function(t,e){var a=t[0],n=new Date,r=n.getMonth()+1,i=n.getFullYear()+"-"+(r<10?"0"+r:r)+"-"+(n.getDate()<10?"0"+n.getDate():n.getDate())+" "+(n.getHours()<10?"0"+n.getHours():n.getHours())+":"+(n.getMinutes()<10?"0"+n.getMinutes():n.getMinutes())+":"+(n.getSeconds()<10?"0"+n.getSeconds():n.getSeconds()),o=Object(P["a"])();1===e?(o.PRINT_INITA("0mm","0mm","210mm","296.99mm","拣货单"),o.SET_PRINT_PAGESIZE(1,2100,2970,"拣货单"),o.ADD_PRINT_BARCODE("8.2mm","10.58mm","65.88mm","18.52mm","128Auto",a.TransferBatchCode),o.SET_PRINT_STYLEA(0,"ShowBarText",0),o.ADD_PRINT_TEXT("27.52mm","10.58mm","60.59mm","6.35mm",a.TransferBatchCode),o.SET_PRINT_STYLEA(0,"FontName","微软雅黑"),o.SET_PRINT_STYLEA(0,"FontSize",10),o.SET_PRINT_STYLEA(0,"Alignment",2),o.ADD_PRINT_TEXT("11.64mm","81.49mm","74.08mm","12.17mm","调拨批次拣货单"),o.SET_PRINT_STYLEA(0,"FontName","微软雅黑"),o.SET_PRINT_STYLEA(0,"FontSize",22),o.SET_PRINT_STYLEA(0,"Bold",1),o.ADD_PRINT_TEXT("36.78mm","10.58mm","60.59mm","6.35mm","待拣SKU数量：".concat(a.NeedPickQuantity)),o.SET_PRINT_STYLEA(0,"FontName","微软雅黑"),o.SET_PRINT_STYLEA(0,"FontSize",10),o.ADD_PRINT_TEXT("36.51mm","139.96mm","60.59mm","6.35mm",i),o.SET_PRINT_STYLEA(0,"FontName","微软雅黑"),o.SET_PRINT_STYLEA(0,"FontSize",10),o.ADD_PRINT_HTM(180,40,"100%","81%",document.getElementById("tpl").innerHTML),o.PRINT()):(o.PRINT_INITA("0mm","0mm","60.01mm","40.01mm","拣货单"),o.SET_PRINT_PAGESIZE(1,600,400,"拣货单"),o.ADD_PRINT_BARCODE("2.65mm","10.85mm","37.84mm","11.38mm","128Auto",a.TransferBatchCode),o.SET_PRINT_STYLEA(0,"FontSize",8),o.SET_PRINT_STYLEA(0,"ShowBarText",0),o.ADD_PRINT_TEXT("15.29mm","-0.53mm","60.59mm","6.35mm",a.TransferBatchCode),o.SET_PRINT_STYLEA(0,"FontName","微软雅黑"),o.SET_PRINT_STYLEA(0,"Alignment",2),o.ADD_PRINT_TEXT("20.11mm","4.23mm","60.59mm","6.35mm","待拣SKU数量：".concat(a.NeedPickQuantity)),o.SET_PRINT_STYLEA(0,"FontName","微软雅黑"),o.SET_PRINT_STYLEA(0,"FontSize",8),o.ADD_PRINT_TEXT("28.05mm","4.5mm","60.59mm","6.35mm","打印时间：".concat(i)),o.SET_PRINT_STYLEA(0,"FontName","微软雅黑"),o.SET_PRINT_STYLEA(0,"FontSize",8),o.PRINT()),t.length>1?(t.splice(0,1),this.PrepareData(t)):(this.$UI.Tips.Floating("success","打印批次成功"),this.ChangePrintModal(!0))}}]),a}(c["d"]);T["a"]([Object(c["c"])()],_.prototype,"SelectedData",void 0),T["a"]([Object(c["b"])()],_.prototype,"ChangePrintModal",null),_=T["a"]([Object(c["a"])({name:"PrintTransferBatch"})],_);var u=_,S=u,d=a("4023"),p=Object(d["a"])(S,n,r,!1,null,null,null);e["default"]=p.exports}}]);