(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d21d7e9"],{d216:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("Row",{staticClass:"P-Inline-Block"},[a("Button",{attrs:{type:"primary"},on:{click:e.Trigger}},[e._v("发送Cancel Request")]),a("Modal",{attrs:{title:"发送Cancel Request",width:700},on:{"on-cancel":e.CancelModal},model:{value:e.RequestModal,callback:function(t){e.RequestModal=t},expression:"RequestModal"}},[a("Form",{ref:"CancelRequestForm",attrs:{model:e.CancelRequestForm,rules:e.CancelRequestRules,onsubmit:"return false","label-width":90}},[a("FormItem",{attrs:{label:"取消原因：",prop:"Reason"}},[a("Select",{attrs:{placeholder:"取消原因",options:e.ReasonDrop},model:{value:e.CancelRequestForm.Reason,callback:function(t){e.$set(e.CancelRequestForm,"Reason",t)},expression:"CancelRequestForm.Reason"}})],1),a("FormItem",{attrs:{label:"平台单号：",prop:"OrderId"}},[a("Select",{attrs:{placeholder:"平台单号",options:e.PlatformIds},model:{value:e.CancelRequestForm.OrderId,callback:function(t){e.$set(e.CancelRequestForm,"OrderId",t)},expression:"CancelRequestForm.OrderId"}})],1)],1),a("footer",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"primary"},on:{click:e.Validate}},[e._v("提交")]),a("Button",{on:{click:e.CancelModal}},[e._v("取消")])],1)],1)],1)},r=[],o=a("3231"),l=a("064d"),n=a("46d7"),i=a("631e"),c=a("4a81"),u=a("d11d"),d=a("a349"),R=a("4606"),m=function(e){Object(n["a"])(a,e);var t=Object(i["a"])(a);function a(){var e;return Object(o["a"])(this,a),e=t.apply(this,arguments),e.RequestModal=!1,e.ReasonDrop=e.$Utils.GetEnumArr(e.$Enums.CustomerService.CancelRequestReason),e.PlatformIds=[],e.CancelRequestForm=new R["a"].CancelRequest,e.CancelRequestRules={OrderId:[{required:!0,message:"请选择平台单号",trigger:"change"}]},e}return Object(l["a"])(a,[{key:"Trigger",value:function(){this.$set(this,"RequestModal",!0),this.GetPlatformIds()}},{key:"GetPlatformIds",value:function(){var e=this;this.$UI.Loading.Show(),this.$Request.Post({Server:this.$Server.CustomerService,Api:{Address:this.$Api.AfterSaleGetEbayPlatformOrderId,Login:!0},Data:this["ShipOrder/SHIP_ORDER_INFO"].Id,Callback:function(t){e.$UI.Loading.Hide(),t.IsSuccess?e.$set(e,"PlatformIds",t.Data.Data):e.$Request.Error(t)}})}},{key:"Validate",value:function(){var e=this;this.$refs.CancelRequestForm.validate((function(t){t&&e.PostCancelRequest()}))}},{key:"PostCancelReqeust",value:function(){var e=this,t=JSON.parse(JSON.stringify(this.CancelRequestForm));t.ShipOrderId=this["ShipOrder/SHIP_ORDER_INFO"].Id,this.$UI.Loading.Show(),this.$Request.Post({Server:this.$Server.CustomerService,Api:{Address:this.$Api.AfterSaleSubmitCancel,Login:!0},Data:t,Callback:function(t){e.$UI.Loading.Hide(),t.IsSuccess?(e.$UI.Tips.Floating("success","发送成功"),e.CancelModal()):e.$Request.Error(t)}})}},{key:"CancelModal",value:function(){this.$set(this,"RequestModal",!1),this.$refs.CancelRequestForm.resetFields()}}]),a}(u["d"]);c["a"]([d["b"]],m.prototype,"ShipOrder/SHIP_ORDER_INFO",void 0),m=c["a"]([Object(u["a"])({name:"CancelRequest"})],m);var h=m,p=h,f=a("4023"),q=Object(f["a"])(p,s,r,!1,null,"cb880300",null);t["default"]=q.exports}}]);