(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0bab15"],{"37fa":function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("Row",{staticClass:"P-Inline-Block"},[i("Button",{staticClass:"P-Inline-Block P-MR-10",attrs:{type:"primary"},on:{click:t.TriggerModal}},[t._v("打印SKU标签")]),i("Modal",{attrs:{"mask-closable":!1,title:"打印SKU标签",width:600},on:{"on-cancel":function(e){return t.CancelPrint(!0)}},model:{value:t.ShowModal,callback:function(e){t.ShowModal=e},expression:"ShowModal"}},[i("Form",{ref:"PrintMsg",attrs:{onsubmit:"return false",model:t.PrintMsg,rules:t.PrintMsgRule,"label-width":100,name:"PrintMsg"}},[i("Form-item",{staticClass:"pw85",attrs:{label:"选择仓库：",prop:"WarehouseId"}},[i("Select",{attrs:{placeholder:"请选择仓库",options:t.WarehouseList},model:{value:t.PrintMsg.WarehouseId,callback:function(e){t.$set(t.PrintMsg,"WarehouseId",e)},expression:"PrintMsg.WarehouseId"}})],1),i("Form-item",{attrs:{label:"SKU编号：",prop:"SkuCode"}},[i("Input",{ref:"skuInput",attrs:{placeholder:"请输入SKU编号"},on:{"on-enter":t.SubmitPrint},model:{value:t.PrintMsg.SkuCode,callback:function(e){t.$set(t.PrintMsg,"SkuCode","string"===typeof e?e.trim():e)},expression:"PrintMsg.SkuCode"}})],1),i("Form-item",{staticClass:"ivu-form-item-required",attrs:{label:"打印数量："}},[i("InputNumber",{staticClass:"P-W-100-Percent",attrs:{min:1},model:{value:t.PrintNum,callback:function(e){t.PrintNum=e},expression:"PrintNum"}})],1)],1),i("footer",{attrs:{slot:"footer"},slot:"footer"},[i("Button",{attrs:{type:"primary"},on:{click:t.SubmitPrint}},[t._v("打印")]),i("Button",{on:{click:function(e){return t.CancelPrint(!0)}}},[t._v("取消")])],1)],1)],1)},r=[],s=(i("03d8"),i("4d62"),i("3231")),a=i("064d"),o=i("46d7"),u=i("631e"),l=i("4a81"),c=i("d11d"),d=i("1f41"),h=i("2437"),m=function(t){Object(o["a"])(i,t);var e=Object(u["a"])(i);function i(){var t;return Object(s["a"])(this,i),t=e.apply(this,arguments),t.PrintNum=1,t.ShowModal=!1,t.PrintMsg=new d["a"].SkuLabel,t.IsSplit=0,t.PrintMsgRule={WarehouseId:[{required:!0,message:"请选择仓库",trigger:"change",type:"number"}],SkuCode:[{required:!0,message:"请输入SKU编号",trigger:"blur"}]},t}return Object(a["a"])(i,[{key:"CancelPrint",value:function(t){t&&(this.ShowModal=!1,this.$refs["PrintMsg"].resetFields())}},{key:"TriggerModal",value:function(){this.ShowModal=!0,this.InputFocus()}},{key:"SubmitPrint",value:function(){var t=this;this.$refs["PrintMsg"].validate((function(e){e&&t.GetPrintData(JSON.parse(JSON.stringify(t.PrintMsg)))}))}},{key:"GetPrintData",value:function(t){var e=this;void 0!=Object(h["a"])(this)?(this.IsSplit++,this.$UI.Loading.Show(),this.$Request.Post({Server:this.$Server.Warehouse,Api:{Address:this.$Api.InventoryGetSkuInventory},Data:t,Callback:function(i){i.IsSuccess?(e.IsSplit=0,e.PrintFunc(i.Data.Data)):e.IsSplit%2==1&&-1!=t.SkuCode.lastIndexOf("-")?(t.SkuCode=t.SkuCode.slice(0,t.SkuCode.lastIndexOf("-")),e.GetPrintData(t)):(e.IsSplit=0,e.$UI.Loading.Hide(),e.$Request.Error(i),e.CancelPrint(!1))}})):this.CancelPrint(!0)}},{key:"PrintFunc",value:function(t){var e;e=Object(h["a"])();for(var i=Math.ceil(this.PrintNum/40),n=1;n<=i;n++){e.PRINT_INITA("0mm","0mm","60mm","40mm",""),e.SET_PRINT_PAGESIZE(0,"60mm","40mm","SKU标签"),e.SET_PRINT_MODE("PRINT_NOCOLLATE",1);for(var r=this.$Utils.ComputedSkuLabelAmount(n,this.PrintNum,40),s=0;s<r;s++)this.$Utils.DesignSkuLabel(e,this.PrintMsg.SkuCode,this.PrintMsg.SkuCode,t.SkuName,t.LocationCode);e.PRINT()}this.$UI.Loading.Hide(),this.CancelPrint(!1),this.$UI.Tips.Floating("success","打印SKU标签成功"),this.PrintNum=1,this.PrintMsg.SkuCode=""}},{key:"InputFocus",value:function(){var t=this;this.$nextTick((function(){t.$refs["skuInput"].focus()}))}}]),i}(c["d"]);l["a"]([Object(c["c"])()],m.prototype,"WarehouseList",void 0),m=l["a"]([Object(c["a"])({name:"PrintShelvesBarcode"})],m);var P=m,S=P,p=i("4023"),f=Object(p["a"])(S,n,r,!1,null,null,null);e["default"]=f.exports}}]);