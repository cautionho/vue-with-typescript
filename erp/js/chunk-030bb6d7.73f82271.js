(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-030bb6d7"],{"43e1":function(e,t,s){},"4e3d":function(e,t,s){"use strict";var a=s("43e1"),i=s.n(a);i.a},"8e5c":function(e,t,s){"use strict";s.r(t);var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("Row",{staticClass:"Max-600"},[s("Form",{attrs:{inline:"","label-width":100}},[s("FormItem",{staticClass:"P-W-49-Percent P-MB-10",attrs:{label:"编号："}},[s("span",[e._v(e._s(e.IsState?e.WISH_TICKET_INFO.TicketId:e.WishTicketInfo.TicketId))])]),s("FormItem",{staticClass:"P-W-49-Percent P-MB-10",attrs:{label:"发货单号："}},[s("span",[e._v(e._s(e.IsState?e.WISH_TICKET_INFO.ShipOrderCode:e.WishTicketInfo.ShipOrderCode))])]),s("FormItem",{staticClass:"P-W-49-Percent P-MB-10",attrs:{label:"店铺："}},[s("span",[e._v(e._s(e.IsState?e.WISH_TICKET_INFO.StoreName:e.WishTicketInfo.StoreName))])]),s("FormItem",{staticClass:"P-W-49-Percent P-MB-10",attrs:{label:"买家ID："}},[s("span",[e._v(e._s(e.IsState?e.WISH_TICKET_INFO.BuyerName:e.WishTicketInfo.BuyerName))])]),s("FormItem",{staticClass:"P-W-49-Percent P-MB-10",attrs:{label:"关闭人："}},[s("span",[e._v(e._s(e.IsState?e.WISH_TICKET_INFO.CloseBy:e.WishTicketInfo.CloseBy))])]),s("FormItem",{staticClass:"P-W-49-Percent P-MB-10",attrs:{label:"标签："}},[s("span",[e._v(e._s(e.IsState?e.WISH_TICKET_INFO.Label:e.WishTicketInfo.Label))])]),s("FormItem",{staticClass:"P-W-49-Percent P-MB-10",attrs:{label:"创建时间："}},[s("span",[e._v(e._s(e.$UI.Render.Date(e.IsState?e.WISH_TICKET_INFO.Created:e.WishTicketInfo.Created,!0)))])]),s("FormItem",{staticClass:"P-W-49-Percent P-MB-10",attrs:{label:"更新时间："}},[s("span",[e._v(e._s(e.$UI.Render.Date(e.IsState?e.WISH_TICKET_INFO.LastUpdateTime:e.WishTicketInfo.LastUpdateTime,!0)))])])],1),s("Col",{attrs:{span:"24"}},e._l(e.IsState?e.WISH_TICKET_INFO.Replies:e.WishTicketInfo.Replies,(function(t,a){return s("div",{key:a,staticClass:"Chat-Item"},[s("p",[e._v(e._s(t.CustomerName)+"("+e._s(t.CustomerName?"客服":"买家")+") "),s("span",{staticClass:"P-Float-Right"},[t.Message?s("Button",{staticClass:"P-MR-5",attrs:{size:"small"},on:{click:function(s){return e.Translation(t.Message)}}},[e._v("翻译成英文")]):e._e(),e._v(e._s(e.$UI.Render.Date(t.Date,!0)))],1)]),s("section",{domProps:{innerHTML:e._s(t.Message)}})])})),0),5===e.Disputed?s("Handle",{ref:"Handle",on:{"emit-handle-success":e.EmitOperateSuccess}}):e._e()],1)},i=[],n=(s("6bf8"),s("3231")),r=s("064d"),c=s("46d7"),o=s("631e"),I=s("4a81"),l=s("d11d"),u=s("a349"),T=s("4606"),_=function(e){Object(c["a"])(s,e);var t=Object(o["a"])(s);function s(){var e;return Object(n["a"])(this,s),e=t.apply(this,arguments),e.Disputed=0,e.IsState=!0,e.WishTicketInfo=new T["a"].WishTicketInfo,e}return Object(r["a"])(s,[{key:"EmitOperateSuccess",value:function(){}},{key:"Trigger",value:function(e){var t=this,s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;this.$set(this,"WishTicketInfo",new T["a"].WishTicketInfo),this["CustomerService/WISH_TICKET_INFO"].TicketId?(this.$set(this,"IsState",!1),this.GetDisputedDetails(e)):(this.$set(this,"IsState",!0),this["CustomerService/UPDATE_DISPUTED"]({Type:"WISH_TICKET",Id:e})),this.$nextTick((function(){t.$set(t,"Disputed",s)}))}},{key:"GetDisputedDetails",value:function(e){var t=this;this.$UI.Loading.Show(),this.$Request.Post({Server:this.$Server.CustomerService,Api:{Address:this.$Api.WishTicketOrderDetai,Login:!0},Data:e,Callback:function(e){t.$UI.Loading.Hide(),e.IsSuccess?t.$set(t,"WishTicketInfo",e.Data.Data):t.$Request.Error(e)}})}},{key:"Translation",value:function(e){window.open("https://translate.google.cn/#view=home&op=translate&sl=auto&tl=en&text=".concat(e),"_blank")}},{key:"Validate",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;this.$refs.Handle.Validate(e)}},{key:"WISH_TICKET_INFO",get:function(){return this["CustomerService/WISH_TICKET_INFO"]}}]),s}(l["d"]);I["a"]([u["a"]],_.prototype,"CustomerService/UPDATE_DISPUTED",void 0),I["a"]([u["b"]],_.prototype,"CustomerService/WISH_TICKET_INFO",void 0),I["a"]([Object(l["b"])()],_.prototype,"EmitOperateSuccess",null),_=I["a"]([Object(l["a"])({name:"WishTicketDetails",components:{Handle:function(){return s.e("chunk-42c61967").then(s.bind(null,"401f"))}}})],_);var d=_,h=d,p=(s("4e3d"),s("4023")),S=Object(p["a"])(h,a,i,!1,null,"4beaa139",null);t["default"]=S.exports}}]);