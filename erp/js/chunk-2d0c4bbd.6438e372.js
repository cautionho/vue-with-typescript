(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0c4bbd"],{"3ba9":function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("Modal",{attrs:{title:"查看操作记录","mask-closable":!1,width:1200},on:{"on-cancel":t.HandleRes},model:{value:t.showHistoryModal,callback:function(e){t.showHistoryModal=e},expression:"showHistoryModal"}},[a("div",[t._v("跟踪号："),a("span",[t._v(t._s(t.trackingNumber))])]),a("Row",{staticClass:"P-MT-10"},[a("Table",{attrs:{size:"small","highlight-row":!0,height:"500",stripe:"",columns:t.historyCol,data:t.historyList}})],1),a("footer",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{on:{click:t.HandleRes}},[t._v("返回")])],1)],1)},i=[],r=a("3231"),o=a("064d"),n=a("46d7"),l=a("631e"),c=a("4a81"),d=a("d11d"),h=a("1b1c"),u=function(t){Object(n["a"])(a,t);var e=Object(l["a"])(a);function a(){var t;return Object(r["a"])(this,a),t=e.apply(this,arguments),t.trackingNumber="-",t.SelectedData=new h["a"].GrossProfitList,t.showHistoryModal=!1,t.historyList=[],t.historyCol=[{title:"发货单号",key:"ShipOrderCode"},{title:"操作人",key:"OperateUserName"},{title:"操作时间",key:"OperateTime",render:function(e,a){return e("span",t.$UI.Render.Date(a.row.OperateTime,!0))}},{title:"操作记录",width:700,key:"OperateContent"}],t}return Object(o["a"])(a,[{key:"HandleRes",value:function(){this.showHistoryModal=!1}},{key:"TriggerModal",value:function(t){this.SelectedData=t,this.trackingNumber=""===this.SelectedData.TrackingNumber?"-":this.SelectedData.TrackingNumber,this.showHistoryModal=!0,this.GetHistoryData()}},{key:"GetHistoryData",value:function(){var t=this;this.$UI.Loading.Show(),this.$Request.Post({Server:this.$Server.Warehouse,Api:{Address:this.$Api.SalesTradingProfitHistoryList,Login:!0},Data:this.SelectedData.ShipOrderCode,Callback:function(e){t.$UI.Loading.Hide(),e.IsSuccess?t.historyList=e.Data.Data:t.$Request.Error(e)}})}}]),a}(d["d"]);u=c["a"]([Object(d["a"])({name:"SaleGrossOpeHistory"})],u);var y=u,b=y,p=a("4023"),k=Object(p["a"])(b,s,i,!1,null,null,null);e["default"]=k.exports}}]);