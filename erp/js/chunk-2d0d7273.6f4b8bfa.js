(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0d7273"],{7631:function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("Col",[r("Button",{attrs:{type:"primary"},on:{click:e.Trigger}},[e._v("设置缺货")])],1)},a=[],i=(r("76bb"),r("6ed5"),r("3231")),o=r("064d"),s=r("46d7"),u=r("631e"),c=r("4a81"),p=r("d11d"),l=function(e){Object(s["a"])(r,e);var t=Object(u["a"])(r);function r(){return Object(i["a"])(this,r),t.apply(this,arguments)}return Object(o["a"])(r,[{key:"TriggerOperations",value:function(e){}},{key:"EmitOperateSuccess",value:function(){}},{key:"Trigger",value:function(){this.TriggerOperations("ToOutStock")}},{key:"Validate",value:function(e){var t=this;e.some((function(e){return 3!==e.ShipOrder.Status}))?this.$UI.Tips.Floating("warning","请选择状态为待拣货的发货订单进行操作"):this.$UI.Tips.Modal({Type:"confirm",Content:"是否将发货订单状态变更为缺货",Callback:function(r){if(r){t.$UI.Loading.Show();var n={OrderId:e.map((function(e){return e.ShipOrder.Id})),Targetstatus:7,Remark:""};t.$Request.Post({Server:t.$Server.Warehouse,Api:{Address:t.$Api.ShipOrderChangeStatus,Login:!0},Data:n,Callback:function(e){e.IsSuccess?(t.$UI.Tips.Floating("success","发货订单状态已变更为缺货"),t.EmitOperateSuccess()):(t.$UI.Loading.Hide(),t.$Request.Error(e))}})}}})}}]),r}(p["d"]);c["a"]([Object(p["b"])()],l.prototype,"TriggerOperations",null),c["a"]([Object(p["b"])()],l.prototype,"EmitOperateSuccess",null),l=c["a"]([Object(p["a"])({name:"Stockout"})],l);var d=l,O=d,g=r("4023"),b=Object(g["a"])(O,n,a,!1,null,null,null);t["default"]=b.exports}}]);