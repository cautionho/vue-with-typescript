(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6737bd6e"],{"073c":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("Row",{staticClass:"P-Inline-Block"},[a("Col",{attrs:{span:"24"}},[e.Powers.ImportLogisticsAnomalyRecord?a("Import",{staticClass:"P-MB-10",on:{"emit-operate-success":e.OperateSuccess}}):e._e(),e.Powers.ChangeLogisticsCustomerStatus?a("ChangeProcessStatus",{ref:"ChangeCustomerStatus",staticClass:"P-MB-10 P-ML-10",on:{"emit-operate-success":e.OperateSuccess,"emit-get-selected":e.GetSelected}}):e._e(),e.Powers.AddLogisticsRemark?a("AddRemark",{ref:"AddRemark",staticClass:"P-MB-10 P-ML-10",on:{"emit-get-selected":e.GetSelected,"emit-cancel-select":e.CancelSelected}}):e._e(),a("ShipOrderDetails",{ref:"ShipOrderDetails"}),e.Powers.BatchSendMail?a("Button",{staticClass:"P-MB-10 P-ML-10 P-VA-T",attrs:{type:"primary"},on:{click:function(t){return e.TriggerOperations("SendEmail")}}},[e._v("发送邮件")]):e._e(),e.Powers.BatchSendMail?a("SendEmail",{ref:"SendEmail",on:{"emit-handle-success":e.OperateSuccess}}):e._e(),a("SendStationMail",{ref:"EbayMsgSend",staticClass:"P-MB-10 P-ML-10",on:{"trigger-operations":e.TriggerOperations,"emit-operate-success":e.OperateSuccess}})],1),a("Col",{attrs:{span:"24"}},[a("Table",{ref:"List",staticClass:"P-MB-10",attrs:{columns:e.Cols,data:e.List,stripe:"",height:e.CalculateHeight()}})],1),a("Col",{attrs:{span:"24"}},[a("Page",{attrs:{current:e.Pager.PageIndex,total:e.Pager.TotalItems,"page-size":e.Pager.PageSize,"page-size-opts":e.Pager.PageOpt,"show-total":"","show-sizer":"","show-elevator":""},on:{"on-change":e.ChangePage,"on-page-size-change":e.ChangePageSize}})],1)],1)},n=[],s=(a("d9b9"),a("5e8c"),a("76bb"),a("6bf8"),a("a815"),a("9b6f"),a("3231")),i=a("064d"),o=a("46d7"),c=a("631e"),l=a("4a81"),u=a("d11d"),d=a("db83"),h=function(e){Object(o["a"])(a,e);var t=Object(c["a"])(a);function a(){var e;return Object(s["a"])(this,a),e=t.apply(this,arguments),e.Powers={},e.List=[],e.Pager=new d["a"].Pager,e.Cols=[{type:"selection",width:60,align:"center"},{title:"发货单号/订单号",width:140,render:function(t,a){return t("div",[t("a",{on:{click:function(){e.CancelSelected(),e.$nextTick((function(){e.TriggerOperations("ShipOrderView",a.row)}))}}},a.row.OrderCode),t("p",a.row.PlatformOrderId)])}},{title:"发货仓",key:"WarehouseName",width:140},{title:"国家",key:"Country",width:140},{title:"物流渠道/跟踪号",key:"",render:function(e,t){var a=[{Key:"物",Value:t.row.ShipMethodName||"-"},{Key:"跟",Value:t.row.TrackingNumber||"-"}];return e("div",a.map((function(t){return e("p",[e("span",{class:"P-Table-Tip P-BG-Primary"},t.Key),e("span",t.Value)])})))}},{title:"平台/店铺/买家ID",key:"",render:function(t,a){var r=[{Key:"平",Value:e.$Enums.Sales.Platform[a.row.Platform]||"-"},{Key:"店",Value:a.row.StoreName||"-"},{Key:"买",Value:a.row.BuyerId||"-"}];return t("div",r.map((function(e){return t("p",[t("span",{class:"P-Table-Tip P-BG-Primary"},e.Key),t("span",e.Value)])})))}},{title:"物流状态/物流信息/异常原因",width:300,render:function(t,a){var r=[{Key:"状",Value:e.$Enums.CustomerService.LogisticsStatus[a.row.LogisticsStatus]||"-"},{Key:"流",Value:a.row.LogisticsInfo||"-"},{Key:"异",Value:a.row.LogisticsAnomalyReason||"-"}],n=[],s=r.map((function(e){return n.push(t("p","[".concat(e.Key,"] ").concat(e.Value))),t("p",{class:"P-LINE-1"},[t("span",{class:"P-Table-Tip P-BG-Primary"},e.Key),t("span",e.Value)])})),i=t("div",{slot:"content"},n);return t("Tooltip",{class:"P-W-100-Percent P-MT-5"},s.concat(i))}},{title:"下单/付款/发货时间",width:180,render:function(t,a){var r=[{Key:"下",Value:e.$UI.Render.Date(a.row.CreatedTime,!0)},{Key:"付",Value:e.$UI.Render.Date(a.row.PayTime,!0)},{Key:"发",Value:e.$UI.Render.Date(a.row.ShipTime,!0)}];return t("div",r.map((function(e){return t("p",[t("span",{class:"P-Table-Tip P-BG-Primary"},e.Key),t("span",e.Value)])})))}},{title:"客服联系状态",width:120,render:function(t,a){return t("span",e.$Enums.CustomerService.CustomerHandleProcess[a.row.CustomerStatus])}},{title:"添加时间",width:160,render:function(t,a){return t("span",e.$UI.Render.Date(a.row.OrderTime,!0))}},{title:"操作",width:100,render:e.RenderOperates}],e}return Object(i["a"])(a,[{key:"EmitPagerChange",value:function(e){}},{key:"mounted",value:function(){this.$set(this,"Powers",this.$Utils.GetUserResource.call(this,["ImportLogisticsAnomalyRecord","ReplyLogisticsAnomalyRecord","AddLogisticsRemark","ChangeLogisticsCustomerStatus","BatchSendMail"]))}},{key:"CalculateHeight",value:function(){return this.$UI.FullHeight()-(Object.values(this.Powers).includes(!0)?255:210)}},{key:"RenderOperates",value:function(e,t){var a=this,r=[{Key:"查看",Value:"ShipOrderView"}];return this.Powers.AddLogisticsRemark&&r.push({Key:"添加备注",Value:"AddRemark"}),this.Powers.ChangeLogisticsCustomerStatus&&r.push({Key:"更改客服联系状态",Value:"ChangeCustomerStatus"}),e("Dropdown",{on:{"on-click":function(e){a.CancelSelected(),a.$nextTick((function(){a.TriggerOperations(e,t.row)}))}}},[e("a",[e("span",{class:"P-MR-5"},"操作"),e("Icon",{props:{type:"ios-arrow-down"}})]),e("DropdownMenu",{slot:"list"},r.map((function(t){return e("DropdownItem",{props:{name:t.Value},class:"P-TA-C"},t.Key)})))])}},{key:"ChangePage",value:function(e){this.$set(this.Pager,"PageIndex",e),this.EmitPagerChange(this.Pager)}},{key:"ChangePageSize",value:function(e){this.$set(this.Pager,"PageSize",e),this.EmitPagerChange(this.Pager)}},{key:"GetSelected",value:function(e){this.$refs[e].TriggerSelected(this.$refs.List.getSelection())}},{key:"CancelSelected",value:function(){this.$refs.List.selectAll(!1)}},{key:"TriggerOperations",value:function(e,t){switch(e){case"SendEmail":case"EbayMsgSend":this.ValidateSelected(e);break;case"ShipOrderView":this.$refs.ShipOrderDetails.Validate({OrderId:t.Id,OrderCode:t.OrderCode});break;default:this.$refs[e].TriggerSelected([t]);break}}},{key:"ValidateSelected",value:function(e){var t=this.$refs.List.getSelection();t.length?this.$refs[e].TriggerLogisticsWrite(t):this.$UI.Tips.Floating("warning","请选择订单进行操作")}},{key:"OperateSuccess",value:function(){this.EmitPagerChange(this.Pager)}}]),a}(u["d"]);l["a"]([Object(u["b"])()],h.prototype,"EmitPagerChange",null),h=l["a"]([Object(u["a"])({name:"LogisticsExceptionOrder",components:{Import:function(){return a.e("chunk-2d216fd3").then(a.bind(null,"c58c"))},ChangeProcessStatus:function(){return a.e("chunk-2d224c4b").then(a.bind(null,"e219"))},AddRemark:function(){return a.e("chunk-2d0b653b").then(a.bind(null,"1d4f"))},ShipOrderDetails:function(){return a.e("chunk-1c5a19f1").then(a.bind(null,"6652"))},SendEmail:function(){return a.e("chunk-2d22dbe5").then(a.bind(null,"f995"))},SendStationMail:function(){return a.e("chunk-2d0c5b2b").then(a.bind(null,"3fce"))}}})],h);var g=h,p=g,f=a("4023"),m=Object(f["a"])(p,r,n,!1,null,"0fadbf9e",null);t["default"]=m.exports},"2b6e":function(e,t,a){var r=a("ab04"),n=a("4ad5"),s=a("5f98"),i=a("7bd7").f,o=function(e){return function(t){var a,o=s(t),c=n(o),l=c.length,u=0,d=[];while(l>u)a=c[u++],r&&!i.call(o,a)||d.push(e?[a,o[a]]:o[a]);return d}};e.exports={entries:o(!0),values:o(!1)}},a815:function(e,t,a){var r=a("7b30"),n=a("2b6e").values;r({target:"Object",stat:!0},{values:function(e){return n(e)}})}}]);