(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3b83bca7"],{"99ec":function(e,t,r){"use strict";r.r(t);var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"P-Inline-Block "},[r("Col",[r("Button",{staticClass:"P-MR-10",attrs:{type:"primary"},on:{click:function(t){return e.OpenCurModal("BatchPrint")}}},[e._v("打印拣货批次")]),r("Button",{attrs:{type:"primary"},on:{click:function(t){return e.OpenCurModal("BoxPrint")}}},[e._v("打印箱号")]),r("Modal",{attrs:{title:"BatchPrint"===e.CurModalType?"打印拣货批次":"打印箱号","mask-closable":!1,width:600},on:{"on-cancel":function(t){return e.ClearModal(!1)}},model:{value:e.CurIsShowModal,callback:function(t){e.CurIsShowModal=t},expression:"CurIsShowModal"}},[r("Form",{ref:"CurOperateForm",attrs:{model:e.CurOperateForm,rules:e.CurOperateFormRules,"label-width":90,onsubmit:"return false"}},["BatchPrint"===e.CurModalType?r("div",[r("Form-item",{attrs:{label:"纸张类型：",prop:"PrintType"}},[r("Select",{attrs:{placeholder:"请选择纸张类型",options:e.DropPrintType},model:{value:e.CurOperateForm.PrintType,callback:function(t){e.$set(e.CurOperateForm,"PrintType",t)},expression:"CurOperateForm.PrintType"}})],1)],1):r("div",[r("Form-item",{attrs:{label:"打印方式：",prop:"PrintBoxType"}},[r("Select",{attrs:{placeholder:"请选择打印方式",opotions:e.DropPrintBoxType},model:{value:e.CurOperateForm.PrintBoxType,callback:function(t){e.$set(e.CurOperateForm,"PrintBoxType",t)},expression:"CurOperateForm.PrintBoxType"}})],1),r("Form-item",{attrs:{label:"箱号：",prop:"PrintBoxCode"}},[r("InputNumber",{staticClass:"P-W-100-Percent",attrs:{min:0,placeholder:"请输入箱号",step:1},model:{value:e.CurOperateForm.PrintBoxCode,callback:function(t){e.$set(e.CurOperateForm,"PrintBoxCode",t)},expression:"CurOperateForm.PrintBoxCode"}})],1)],1)]),r("div",{attrs:{slot:"footer"},slot:"footer"},[r("Button",{attrs:{type:"primary"},on:{click:e.SubModal}},[e._v("提交")]),r("Button",{on:{click:function(t){return e.ClearModal(!1)}}},[e._v("取消")])],1)],1)],1)],1)},o=[],i=(r("76bb"),r("6bf8"),r("b916"),r("eb83"),r("50c0"),r("9bdd"),r("3231")),n=r("064d"),l=r("46d7"),T=r("631e"),m=r("4a81"),s=r("d11d"),u=r("1f41"),c=r("2437"),d=function(e){Object(l["a"])(r,e);var t=Object(T["a"])(r);function r(){var e;return Object(i["a"])(this,r),e=t.apply(this,arguments),e.CurModalType="",e.CurIsShowModal=!1,e.CurOperateForm=new u["a"].PickBatchPrint,e.CurOperateFormRules={PrintType:[{required:!0,message:"请选择纸张类型",trigger:"change",type:"number"}],PrintBoxType:[{required:!0,message:"请选择打印方式",trigger:"change",type:"number"}],PrintBoxCode:[{required:!0,message:"请输入箱号",trigger:"change",type:"number"}]},e.PropSelectedData=[],e.DropPrintType=[{Key:"A4",Value:1},{Key:"热敏纸",Value:2}],e.DropPrintBoxType=[{Key:"从001开始打印",Value:1},{Key:"单独打印",Value:2}],e}return Object(n["a"])(r,[{key:"EmitChange",value:function(e,t){}},{key:"$Trigger",value:function(e){var t=e.IsShowModal,r=e.ModalType,a=e.SelectedData;switch(this.CurModalType=r,this.$set(this,"PropSelectedData",a),r){case"BoxPrint":this.CurIsShowModal=t;break;case"BatchPrint":this.CurIsShowModal=Boolean(a.length),!this.CurIsShowModal&&this.$UI.Tips.Floating("warning","请选择需要打印的拣货批次");break}}},{key:"OpenCurModal",value:function(e){this.EmitChange(!1,e)}},{key:"SubModal",value:function(){var e=this;this.$refs["CurOperateForm"].validate((function(t){if(t){if(void 0==Object(c["a"])(e))return void e.EmitChange(!1);switch(e.CurModalType){case"BatchPrint":1==e.CurOperateForm.PrintType?e.PrintA4():2==e.CurOperateForm.PrintType&&e.PrintThermalPaper();break;case"BoxPrint":e.PrintBox();break}}}))}},{key:"PrintBox",value:function(){var e=Object(c["a"])();if(e.PRINT_INITA("0mm","0mm","60mm","40mm",""),e.SET_PRINT_PAGESIZE(0,"60mm","40mm",""),1==this.CurOperateForm.PrintBoxType){for(var t=1;t<=this.CurOperateForm.PrintBoxCode;t++){var r=t.toString().padStart(3,"0");e.NewPage(),e.ADD_PRINT_BARCODE("2.99mm","10%","80%","20.24mm","128Auto","box-"+r),e.SET_PRINT_STYLEA(0,"ShowBarText",0),e.ADD_PRINT_TEXT("29.05mm","10%","44mm",32,r),e.SET_PRINT_STYLEA(0,"FontName","微软雅黑"),e.SET_PRINT_STYLEA(0,"FontSize",24),e.SET_PRINT_STYLEA(0,"Bold",1),e.SET_PRINT_STYLEA(0,"AlignJustify",1)}e.PRINT()}else if(2==this.CurOperateForm.PrintBoxType){e.NewPage();var a=this.CurOperateForm.PrintBoxCode.toString().padStart(3,"0");e.ADD_PRINT_BARCODE("2.99mm","10%","80%","20.24mm","128Auto","box-"+a),e.SET_PRINT_STYLEA(0,"ShowBarText",0),e.ADD_PRINT_TEXT("29.05mm","10%","44mm",32,a),e.SET_PRINT_STYLEA(0,"FontName","微软雅黑"),e.SET_PRINT_STYLEA(0,"FontSize",24),e.SET_PRINT_STYLEA(0,"Bold",1),e.SET_PRINT_STYLEA(0,"AlignJustify",1),e.PRINT()}this.ClearModal(!0)}},{key:"PrintA4",value:function(){var e=this;this.$UI.Loading.Show(),this.$Request.Post({Server:this.$Server.Warehouse,Api:{Address:this.$Api.BatchOrderGetNoPickItemArray,Login:!0},Data:new u["a"].PickBatchGetA4Detail(this.PropSelectedData.map((function(e){return e.Id}))),Callback:function(t){e.$UI.Loading.Hide(),t.IsSuccess?null==t.Data.Data?e.$UI.Tips.Floating("warning","该批次号不存在"):""==t.Data.Data[0].Key?e.$UI.Tips.Floating("warning","打印拣货批次的订单数必须大于0"):e.PrintNoPackItem(t.Data.Data):e.$Request.Error(t)}})}},{key:"PrintThermalPaper",value:function(){for(var e=Object(c["a"])(),t=0;t<this.PropSelectedData.length;t++)e.PRINT_INITA("0mm","0mm","60mm","40mm",""),e.SET_PRINT_PAGESIZE(0,"60mm","40mm",""),e.ADD_PRINT_BARCODE("2.99mm","10%","80%","15mm","128Auto",this.PropSelectedData[t].BatchCode),e.ADD_PRINT_TEXT("19.31mm","10.441%","50.01mm","5.29mm","待拣订单数："+this.PropSelectedData[t].OrderCount),e.SET_PRINT_STYLEA(0,"FontName","微软雅黑"),e.SET_PRINT_STYLEA(0,"FontSize",11),e.ADD_PRINT_TEXT("24.61mm","10.441%","50.01mm","5.29mm","待拣SKU数："+this.PropSelectedData[t].SkuCount),e.SET_PRINT_STYLEA(0,"FontName","微软雅黑"),e.SET_PRINT_STYLEA(0,"FontSize",11),e.ADD_PRINT_TEXT("30.16mm","6.09mm","51.33mm","5.29mm","面单尺寸："+(0==this.PropSelectedData[t].LabelSize?"":"10 * "+this.PropSelectedData[t].LabelSize)),e.SET_PRINT_STYLEA(0,"FontName","微软雅黑"),e.SET_PRINT_STYLEA(0,"FontSize",11),e.ADD_PRINT_TEXT("36mm","6.09mm","53.18mm","5.29mm",this.$UI.Render.NewDate(new Date,!0).replace("T"," ")),e.SET_PRINT_STYLEA(0,"FontName","微软雅黑"),e.SET_PRINT_STYLEA(0,"FontSize",10),e.PRINT();this.SetChangeBatchOrderStatus()}},{key:"PrintNoPackItem",value:function(e){for(var t=Object(c["a"])(),r=0;r<e.length;r++){var a="<table cellspacing='0' cellpadding='6' border='1' id='printTable' style='text-align:center;width:100%;font-size:14px;'><tr><th style='width:100px'>SKU编号</th><th style='width:400px;'>产品名</th><th style='width:60px'>待拣数</th><th style='width:100px'>可用库存数</th><th style='width:120px;'>货架号</th></tr>";for(var o in e[r].Value)a+="<tr><td>"+e[r].Value[o].SkuCode+"</td><td>"+e[r].Value[o].SkuName+"</td><td>"+(e[r].Value[o].Quantity-e[r].Value[o].PickedQuantity)+"</td><td>"+e[r].Value[o].InventoryAmout+"</td><td>"+e[r].Value[o].LocationCode+"</td></tr>";a+="</table>",t.NewPage(),t.SET_PRINT_PAGESIZE(1,0,0,"A4"),t.ADD_PRINT_BARCODE("5mm","5mm",176,60,"128Auto",e[r].Key),t.ADD_PRINT_TEXT(22,341,132,54,"拣货单"),t.SET_PRINT_STYLEA(0,"FontName","微软雅黑"),t.SET_PRINT_STYLEA(0,"FontSize",30),t.SET_PRINT_STYLEA(0,"Bold",1),t.ADD_PRINT_TEXT(117,15,250,20,"订单数："+this.PropSelectedData[r].OrderCount+(0==this.PropSelectedData[r].LabelSize?"":"   面单尺寸：10 * "+this.PropSelectedData[r].LabelSize)),t.SET_PRINT_STYLEA(0,"FontName","微软雅黑"),t.SET_PRINT_STYLEA(0,"FontSize",11),t.ADD_PRINT_TEXT("30.96mm","116.15mm","83.08mm","5.29mm","打印时间："+this.$UI.Render.NewDate(new Date,!0).replace("T"," ")),t.SET_PRINT_STYLEA(0,"FontName","微软雅黑"),t.SET_PRINT_STYLEA(0,"FontSize",11),t.SET_PRINT_STYLEA(0,"Alignment",3),t.ADD_PRINT_TABLE(148,12,746,"250mm",a),t.SET_PRINT_STYLEA(0,"FontName","微软雅黑"),t.PRINT()}this.SetChangeBatchOrderStatus()}},{key:"SetChangeBatchOrderStatus",value:function(){var e=this;this.$UI.Loading.Show(),this.$Request.Post({Server:this.$Server.Warehouse,Api:{Address:this.$Api.BatchOrderChangeToPrinted,Login:!0},Data:this.PropSelectedData.map((function(e){return e.Id})),Callback:function(t){e.$UI.Loading.Hide(),t.IsSuccess?e.$nextTick((function(){e.ClearModal(!0)})):e.$Request.Error(t)}})}},{key:"ClearModal",value:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.CurIsShowModal=!1,this.$refs["CurOperateForm"].resetFields(),e&&this.EmitChange(!0)}}]),r}(s["d"]);m["a"]([Object(s["b"])()],d.prototype,"EmitChange",null),d=m["a"]([Object(s["a"])({name:"PickBatchPrint.vue"})],d);var P=d,p=P,S=(r("a6cd"),r("4023")),h=Object(S["a"])(p,a,o,!1,null,null,null);t["default"]=h.exports},a6cd:function(e,t,r){"use strict";var a=r("bb2d"),o=r.n(a);o.a},bb2d:function(e,t,r){}}]);