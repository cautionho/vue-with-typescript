(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0cca72"],{"4f9c":function(e,t,n){"use strict";n.r(t);var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("Col",[n("Button",{attrs:{type:"primary"},on:{click:e.Trigger}},[e._v("生成拣货批次")])],1)},r=[],a=(n("76bb"),n("6ed5"),n("6bf8"),n("7623"),n("522a"),n("52af"),n("430a")),o=n("e24e"),c=n("3231"),s=n("064d"),u=n("46d7"),p=n("631e"),l=n("4a81"),d=n("d11d"),h=function(e){Object(u["a"])(n,e);var t=Object(p["a"])(n);function n(){return Object(c["a"])(this,n),t.apply(this,arguments)}return Object(s["a"])(n,[{key:"TriggerOperations",value:function(e){}},{key:"EmitOperateSuccess",value:function(){}},{key:"Trigger",value:function(){this.TriggerOperations("CreateBatchOrder")}},{key:"Validate",value:function(e){var t,n=this,i=[],r=[],c=Object(o["a"])(e);try{var s=function(){var e=t.value;return 2!==e.ShipOrder.Status?(n.$UI.Tips.Floating("warning","请选择状态为已确认的发货订单进行操作"),{v:void 0}):e.ShipOrder.IsException?(n.$UI.Tips.Floating("warning","请选择非异常的发货订单进行操作"),{v:void 0}):[15,16,17].some((function(t){return t===e.ShipOrder.ApiType}))?(n.$UI.Tips.Floating("warning","请选择非海外仓的发货订单进行操作"),{v:void 0}):([9,27,80,81,85,86,99,101,105,107,113,118,119,120,148,150,151,154,156,157,158,161,162,170,171,172,173,174,184].some((function(t){return t===e.ShipOrder.ShippingMethodId}))?i.push(15):[28,108,138,147,176,177].some((function(t){return t===e.ShipOrder.ShippingMethodId}))?i.push(20):i.push(10),void(e.ShipOrder.ItemType<=3?r.push(1):r.push(2)))};for(c.s();!(t=c.n()).done;){var u=s();if("object"===Object(a["a"])(u))return u.v}}catch(d){c.e(d)}finally{c.f()}var p=new Set(i),l=new Set(r);p.size>1?this.$UI.Tips.Floating("warning","请选择面单大小一致的发货订单进行操作"):l.size>1?this.$UI.Tips.Floating("warning","请选择明细类型相同的发货订单进行操作"):1===r[0]&&e.length>500?this.$UI.Tips.Floating("warning","明细类型为单品的发货订单单次生成拣货批次不可超过500条"):2===r[0]&&e.length>100?this.$UI.Tips.Floating("warning","明细类型为多品的发货订单单次生成拣货批次不可超过100条"):this.$UI.Tips.Modal({Type:"confirm",Content:"是否确认生成拣货批次",Callback:function(t){t&&(n.$UI.Loading.Show(),n.$Request.Post({Server:n.$Server.Warehouse,Api:{Address:n.$Api.CreateBatchOrder,Login:!0},Data:e.map((function(e){return e.ShipOrder.Id})),Callback:function(e){n.$UI.Loading.Hide(),e.IsSuccess?setTimeout((function(){n.$UI.Tips.Modal({Type:"success",Content:"生成拣货批次成功，批次号为：".concat(e.Data.BatchCode),Callback:function(e){n.EmitOperateSuccess()}})}),500):n.$Request.Error(e)}}))}})}}]),n}(d["d"]);l["a"]([Object(d["b"])()],h.prototype,"TriggerOperations",null),l["a"]([Object(d["b"])()],h.prototype,"EmitOperateSuccess",null),h=l["a"]([Object(d["a"])({name:"CreateBatch"})],h);var g=h,f=g,v=n("4023"),O=Object(v["a"])(f,i,r,!1,null,null,null);t["default"]=O.exports}}]);