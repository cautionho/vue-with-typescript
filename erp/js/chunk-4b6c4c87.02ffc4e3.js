(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4b6c4c87"],{"70b3":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("Row",[a("Form",{ref:"HandleForm",attrs:{model:e.HandleForm,onsubmit:"return false","label-width":100}},[a("FormItem",{staticClass:"P-MB-10",attrs:{label:"操作："}},[a("RadioGroup",{model:{value:e.HandleForm.OperationType,callback:function(t){e.$set(e.HandleForm,"OperationType",t)},expression:"HandleForm.OperationType"}},[a("Radio",{attrs:{label:"1"}},[e._v("回复纠纷消息")]),a("Radio",{attrs:{label:"2"}},[e._v("请求关闭纠纷")])],1)],1),a("FormItem",{staticClass:"P-MB-10",attrs:{label:"模板："}},[a("div",{staticClass:"Tpl-Container"},e._l(e.TemplateList,(function(t,r){return a("a",{key:r,staticClass:"P-MR-5",on:{click:function(a){return e.RenderContent(t)}}},[e._v(e._s("("+(r+1)+") "+t.Title))])})),0)]),a("FormItem",{attrs:{label:"消息：",rules:{required:!0,message:"请输入消息"},prop:"Content"}},[a("Input",{attrs:{placeholder:"消息",type:"textarea",autosize:{minRows:6,maxRows:6}},model:{value:e.HandleForm.Content,callback:function(t){e.$set(e.HandleForm,"Content",t)},expression:"HandleForm.Content"}})],1),2!=e.HandleForm.OperationType?a("FormItem",{attrs:{label:"附件："}},[a("Upload",{ref:"uploadFile",attrs:{"show-upload-list":!1,action:e.UploadUrl,headers:e.Headers,"max-size":2048,"on-exceeded-size":e.HandleMaxSize,"before-upload":e.UploadBefore,"on-success":e.UploadSuccess,"on-error":e.HandleError}},[a("Button",{staticClass:"P-MR-10",attrs:{type:"primary"}},[e._v("附件")]),a("span",[e._v(e._s(e.HandleForm.Enclosure))])],1)],1):e._e()],1)],1)},i=[],n=(a("d9b9"),a("1ff3"),a("e8f2"),a("b916"),a("9bdd"),a("3231")),o=a("064d"),s=a("46d7"),l=a("631e"),d=a("4a81"),c=a("d11d"),u=a("a349"),p=a("4606"),S=function(e){Object(s["a"])(a,e);var t=Object(l["a"])(a);function a(){var e;return Object(n["a"])(this,a),e=t.apply(this,arguments),e.TemplateList=[],e.HandleForm=new p["a"].HandleAllegroOrder,e.UploadUrl=e.$Server.Settings+e.$Api.UploadImage,e.Headers={userid:JSON.parse(e.$Cookie.Get("frler_user")).UserId},e}return Object(o["a"])(a,[{key:"EmitHandleSuccess",value:function(){}},{key:"EmitCancelModal",value:function(){}},{key:"mounted",value:function(){this.GetTemplateList()}},{key:"GetTemplateList",value:function(){var e=this;arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.$Request.Post({Server:this.$Server.CustomerService,Api:{Address:this.$Api.GetEmailTemplateList,Login:!0},Data:{PageIndex:1,PageSize:9999,Conditions:{KeyWord:"",TypeId:8}},Callback:function(t){t.IsSuccess?e.$set(e,"TemplateList",t.Data.PageModel.Items):e.$Request.Error(t)}})}},{key:"RenderContent",value:function(e){var t=e.Content;if(this.SHIP_ORDER_INFO.Id){var a=this.$UI.Render.Date(this.SHIP_ORDER_INFO.ShipedTime,!0),r=this.$UI.Render.Date(this.SHIP_ORDER_INFO.PaidTime,!0);t=t.replace(/\[BuyerId\]/g,this.SHIP_ORDER_INFO.BuyerUserId),t=t.replace(/\[TrackingNumber\]/g,this.SHIP_ORDER_INFO.TrackingNumber||"[TrackingNumber]"),t=t.replace(/\[ShippingCarrier\]/g,this.SHIP_ORDER_INFO.ShippingService),t=t.replace(/\[ShipedTime\]/g,"-"===a?"[ShipedTime]":a),t=t.replace(/\[PaidTime\]/g,"-"===r?"[PaidTime]":r),t=t.replace(/\[ShipToAddress\]/g,"".concat(this.SHIP_ORDER_ADDRESS.BuyerStreet2?this.SHIP_ORDER_ADDRESS.BuyerStreet2+",":"").concat(this.SHIP_ORDER_ADDRESS.BuyerStreet1,",").concat(this.SHIP_ORDER_ADDRESS.BuyerCity,",").concat(this.SHIP_ORDER_ADDRESS.BuyerState,",").concat(this.SHIP_ORDER_ADDRESS.BuyerCountry,",").concat(this.SHIP_ORDER_ADDRESS.BuyerZipCode))}this.$set(this.HandleForm,"Content",t)}},{key:"UploadBefore",value:function(){this.$UI.Loading.Show()}},{key:"UploadSuccess",value:function(e){this.$UI.Loading.Hide(),this.HandleForm.Enclosure=e.Data.Url,this.$refs["uploadFile"].clearFiles()}},{key:"HandleError",value:function(e,t){this.$UI.Loading.Hide(),this.$UI.Tips.Modal({Type:"warning",Content:e,Callback:function(e){}})}},{key:"HandleMaxSize",value:function(e){this.$UI.Loading.Hide(),this.HandleForm.Enclosure="",this.$Notice.warning({title:"超出文件大小限制",desc:"文件 "+e.name+" 太大，不能超过 2M。"})}},{key:"Reset",value:function(){this.$refs.HandleForm.resetFields(),this.$set(this,"HandleForm",new p["a"].HandleAllegroOrder)}},{key:"Validate",value:function(){var e=this,t=JSON.parse(JSON.stringify(this.HandleForm));t.Id=this["ALLEGRO_ORDER_INFO"].Id,t.OperationType=Number(t.OperationType),2==t.OperationType&&(t.Enclosure=""),this.$refs.HandleForm.validate((function(a){a&&(e.$UI.Loading.Show(),e.$Request.Post({Server:e.$Server.CustomerService,Api:{Address:e.$Api.AllegroDisputesOrderProcess,Login:!0},Data:t,Callback:function(a){a.IsSuccess?(e.$UI.Tips.Floating("success","".concat(1==t.OperationType?"回复纠纷消息":"请求关闭纠纷","成功")),e.EmitHandleSuccess()):(e.$UI.Loading.Hide(),e.$Request.Error(a))}}))}))}},{key:"ALLEGRO_ORDER_INFO",get:function(){return this["CustomerService/ALLEGRO_ORDER_INFO"]}},{key:"SHIP_ORDER_INFO",get:function(){return this["ShipOrder/SHIP_ORDER_INFO"]}},{key:"SHIP_ORDER_ADDRESS",get:function(){return this["ShipOrder/SHIP_ORDER_ADDRESS"]}}]),a}(c["d"]);d["a"]([u["b"]],S.prototype,"CustomerService/ALLEGRO_ORDER_INFO",void 0),d["a"]([u["b"]],S.prototype,"ShipOrder/SHIP_ORDER_INFO",void 0),d["a"]([u["b"]],S.prototype,"ShipOrder/SHIP_ORDER_ADDRESS",void 0),d["a"]([Object(c["b"])()],S.prototype,"EmitHandleSuccess",null),d["a"]([Object(c["b"])()],S.prototype,"EmitCancelModal",null),S=d["a"]([Object(c["a"])({name:"HandleAllegroOrder",components:{}})],S);var R=S,m=R,O=(a("ec35"),a("4023")),h=Object(O["a"])(m,r,i,!1,null,"506fc2c8",null);t["default"]=h.exports},"747b":function(e,t,a){},ec35:function(e,t,a){"use strict";var r=a("747b"),i=a.n(r);i.a}}]);