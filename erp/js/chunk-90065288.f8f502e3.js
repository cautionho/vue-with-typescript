(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-90065288"],{"1b39":function(t,e,s){"use strict";var a=s("20fd"),n=s.n(a);n.a},"20fd":function(t,e,s){},"28e1":function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("Row",{staticClass:"Max-600"},[s("Form",{attrs:{inline:"","label-width":100}},[s("FormItem",{staticClass:"P-W-49-Percent P-MB-10",attrs:{label:"编号："}},[s("span",[t._v(t._s(t.IsState?t.CASE_INFO.CaseId:t.CaseInfo.CaseId))])]),s("FormItem",{staticClass:"P-W-49-Percent P-MB-10",attrs:{label:"来源纠纷："}},[s("span",[t._v(t._s(t.IsState?t.CASE_INFO.SourceCode:t.CaseInfo.SourceCode))])]),s("FormItem",{staticClass:"P-W-49-Percent P-MB-10",attrs:{label:"店铺："}},[s("span",[t._v(t._s(t.IsState?t.CASE_INFO.StoreName:t.CaseInfo.StoreName))])]),s("FormItem",{staticClass:"P-W-49-Percent P-MB-10",attrs:{label:"买家ID："}},[s("span",[t._v(t._s(t.IsState?t.CASE_INFO.BuyerId:t.CaseInfo.BuyerId))])]),s("FormItem",{staticClass:"P-W-49-Percent P-MB-10",attrs:{label:"升级原因："}},[s("span",[t._v(t._s(t.IsState?t.CASE_INFO.Reason:t.CaseInfo.Reason))])]),s("FormItem",{staticClass:"P-W-49-Percent P-MB-10",attrs:{label:"状态："}},[s("span",[t._v(t._s(t.IsState?t.CASE_INFO.OrderStatus:t.CaseInfo.OrderStatus))])]),s("FormItem",{staticClass:"P-W-49-Percent P-MB-10",attrs:{label:"是否可申诉："}},[s("span",[t._v(t._s((t.IsState?t.CASE_INFO.IsAppeal:t.CaseInfo.IsAppeal)?"是":"否"))])]),s("FormItem",{staticClass:"P-W-49-Percent P-MB-10",attrs:{label:"申诉结果："}},[s("span",[t._v(t._s(t.IsState?t.CASE_INFO.AppealResult:t.CaseInfo.AppealResult))])]),s("FormItem",{staticClass:"P-W-49-Percent P-MB-10",attrs:{label:"创建时间："}},[s("span",[t._v(t._s(t.$UI.Render.Date(t.IsState?t.CASE_INFO.Created:t.CaseInfo.Created,!0)))])]),s("FormItem",{staticClass:"P-W-49-Percent P-MB-10",attrs:{label:"更新时间："}},[s("span",[t._v(t._s(t.$UI.Render.Date(t.IsState?t.CASE_INFO.Updated:t.CaseInfo.Updated,!0)))])])],1),s("Col",{staticClass:"P-MB-10",attrs:{span:"24"}},t._l(t.IsState?t.CASE_INFO.Chats:t.CaseInfo.Chats,(function(e,a){return s("div",{key:a,staticClass:"Chat-Item"},[s("p",[t._v(t._s(e.Title)+" "),s("span",{staticClass:"P-Float-Right"},[e.Content?s("Button",{staticClass:"P-MR-5",attrs:{size:"small"},on:{click:function(s){return t.Translation(e.Content)}}},[t._v("翻译成英文")]):t._e(),t._v(t._s(t.$UI.Render.Date(e.Created,!0)))],1)]),s("section",{domProps:{innerHTML:t._s(e.Content)}})])})),0),t.Disputed>2?s("Handle",{ref:"Handle",attrs:{Disputed:t.Disputed},on:{"emit-handle-success":t.EmitOperateSuccess,"emit-cancel-modal":t.EmitCancelDetails}}):t._e()],1)},n=[],r=(s("6bf8"),s("3231")),i=s("064d"),o=s("46d7"),l=s("631e"),c=s("4a81"),u=s("d11d"),C=s("a349"),I=s("4606"),d=function(t){Object(o["a"])(s,t);var e=Object(l["a"])(s);function s(){var t;return Object(r["a"])(this,s),t=e.apply(this,arguments),t.Disputed=0,t.IsState=!0,t.CaseInfo=new I["a"].CaseInfo,t}return Object(i["a"])(s,[{key:"EmitOperateSuccess",value:function(){}},{key:"EmitCancelDetails",value:function(){}},{key:"Trigger",value:function(t){var e=this,s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;this.$set(this,"CaseInfo",new I["a"].CaseInfo),this["CustomerService/CASE_INFO"].CaseId?(this.$set(this,"IsState",!1),this.GetDisputedDetails(t)):(this["CustomerService/UPDATE_DISPUTED"]({Type:"CASE",Id:t}),this.$nextTick((function(){e.$set(e,"Disputed",s),s>2&&setTimeout((function(){e.$refs.Handle.Reset()}),300)})))}},{key:"GetDisputedDetails",value:function(t){var e=this;this.$UI.Loading.Show(),this.$Request.Post({Server:this.$Server.CustomerService,Api:{Address:this.$Api.GetCaseDetail,Login:!0},Data:t,Callback:function(t){e.$UI.Loading.Hide(),t.IsSuccess?e.$set(e,"CaseInfo",t.Data.Data):e.$Request.Error(t)}})}},{key:"Translation",value:function(t){window.open("https://translate.google.cn/#view=home&op=translate&sl=auto&tl=en&text=".concat(t),"_blank")}},{key:"Validate",value:function(){this.$refs.Handle.Validate()}},{key:"CASE_INFO",get:function(){return this["CustomerService/CASE_INFO"]}}]),s}(u["d"]);c["a"]([C["a"]],d.prototype,"CustomerService/UPDATE_DISPUTED",void 0),c["a"]([C["b"]],d.prototype,"CustomerService/CASE_INFO",void 0),c["a"]([Object(u["b"])()],d.prototype,"EmitOperateSuccess",null),c["a"]([Object(u["b"])()],d.prototype,"EmitCancelDetails",null),d=c["a"]([Object(u["a"])({name:"CaseDetails",components:{Handle:function(){return s.e("chunk-b90e1248").then(s.bind(null,"cf83"))}}})],d);var p=d,S=p,_=(s("1b39"),s("4023")),m=Object(_["a"])(S,a,n,!1,null,"6d373dc9",null);e["default"]=m.exports}}]);