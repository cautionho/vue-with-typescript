(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-544f656e","chunk-2d2213fb"],{"9c61":function(e,r,a){var t={"./AddRemark.vue":["043f","chunk-2d0a3c8d"],"./Cancel.vue":["32f4","chunk-2d0b9823"],"./CancelFLS.vue":["4b77","chunk-2d0cbb04"],"./CancelLMA.vue":["0610","chunk-2d0a439b"],"./ChangeCustomerProcessType.vue":["e219","chunk-2d224c4b"],"./Check.vue":["1e3a","chunk-2d0b68d8"],"./Confirm.vue":["81fc","chunk-2d0dda6c"],"./Contact.vue":["b70a","chunk-2d2101fc"],"./Create.vue":["d288","chunk-344965bc"],"./CreateBatch.vue":["4f9c","chunk-2d0cca72"],"./Export.vue":["16b4","chunk-2d0abded"],"./ExportSkuErrorOrder.vue":["738f","chunk-2d0d6800"],"./HoldUp.vue":["8f28","chunk-2d0e9aea"],"./ImportLogisticsExceptionOrder.vue":["c58c","chunk-2d216fd3"],"./ImportShipOrder.vue":["6838","chunk-2d0d059d"],"./LogisticsExceptionAddRemark.vue":["1d4f","chunk-2d0b653b"],"./LogisticsExceptionOrderList.vue":["073c","chunk-6737bd6e"],"./Merge.vue":["72f2","chunk-2d0d699d"],"./ModifyOrder.vue":["ac1a","chunk-2d2132e8"],"./PauseOutStockOrder.vue":["be35","chunk-2d21aedb"],"./PrintLabel.vue":["70e0","chunk-2d0d61fa"],"./QuickCreateBatch.vue":["cb7b","chunk-2d2218a0"],"./ReCreate.vue":["8b48","chunk-2d0e8c24"],"./ReplaceLogisticsLabel.vue":["b300","chunk-2d20f2c7"],"./Resent.vue":["4057","chunk-2d0bff14"],"./ReturnGoods.vue":["a710","chunk-2d208d8b"],"./RevertPack.vue":["c31b","chunk-2d216777"],"./Review.vue":["7adcd","chunk-74b52645"],"./SearchShipOrder.vue":["eee0","chunk-2d231201"],"./SetShipWarehouse.vue":["b862","chunk-2d210648"],"./SetShippingMethod.vue":["ad3b","chunk-2d2136e8"],"./SetStockout.vue":["7631","chunk-2d0d7273"],"./SetTrackingNumber.vue":["93ab","chunk-2d0e55b1"],"./ShipOrderAddress.vue":["4b6b","chunk-2d0cbb10"],"./ShipOrderAfterSales.vue":["240b","chunk-461d2cd2"],"./ShipOrderBaseInfo.vue":["f7c4","chunk-2d22d978"],"./ShipOrderDetails.vue":["6652","chunk-2d0cfe53"],"./ShipOrderDetailsOperate.vue":["55c4","chunk-2d0c8bc7"],"./ShipOrderExpand.vue":["abb3","chunk-2d2134e8"],"./ShipOrderGrossProfits.vue":["feb0","chunk-2d238603"],"./ShipOrderHistory.vue":["d0e3","chunk-2d21d6b0"],"./ShipOrderItems.vue":["67ca","chunk-2d0d07d5"],"./ShipOrderList.vue":["ca18","chunk-2d2213fb"],"./ShipOrderLogistics.vue":["5266","chunk-2d0c7b13"],"./SignShiped.vue":["cece","chunk-2d22293a"],"./SkuErrorOrder.vue":["c55a","chunk-2d216f74"],"./Split.vue":["2123","chunk-fc0c2f14"],"./UnMatchWarehouseOrder.vue":["f849","chunk-2d22d78d"],"./UpdateEdis.vue":["6168","chunk-2d0cebb3"],"./WaitAuditOrder.vue":["9a22","chunk-2d0efc7e"],"./WaitHoldUpOrder.vue":["bea1","chunk-2d21b469"]};function n(e){if(!a.o(t,e))return Promise.resolve().then((function(){var r=new Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}));var r=t[e],n=r[0];return a.e(r[1]).then((function(){return a(n)}))}n.keys=function(){return Object.keys(t)},n.id="9c61",e.exports=n},ca18:function(e,r,a){"use strict";a.r(r);var t=function(){var e=this,r=e.$createElement,a=e._self._c||r;return a("Col",{attrs:{span:"24"}},[e._l(e.GetUsablePowers(),(function(r,t){return a("span",{key:t},["AddShipOrderRemark"!==t?a(t,{directives:[{name:"show",rawName:"v-show",value:e.TOperations.find((function(e){return e===t})),expression:"TOperations.find(Itm => Itm === Item)"}],ref:t,refInFor:!0,tag:"component",staticClass:"P-Inline-Block P-MR-10 P-MB-10",attrs:{Page:e.Page},on:{"trigger-operations":e.TriggerOperations,"emit-operate-success":e.EmitOperateSuccess}}):e._e()],1)})),a("Table",{ref:"ShipOrderList",attrs:{columns:e.Cols,data:e.List,size:"small",stripe:"",height:e.CalculateHeight()},on:{"on-selection-change":e.GetSelectedData}}),a("Page",{staticClass:"P-MT-10",attrs:{current:e.Pager.PageIndex,total:e.Pager.TotalItems,"page-size":e.Pager.PageSize,"page-size-opts":e.Pager.PageSizeOpt,"show-total":"","show-sizer":"","show-elevator":""},on:{"on-change":e.ChangePage,"on-page-size-change":e.ChangePageSize}})],2)},n=[],i=(a("d9b9"),a("3fa9"),a("5e8c"),a("76bb"),a("6ed5"),a("cee1"),a("f8cd"),a("6bf8"),a("3231")),u=a("064d"),c=a("46d7"),s=a("631e"),o=a("5c62"),d=a("4a81"),p=a("d11d"),l=a("a349"),h=a("1459"),S=a("db83"),y=[{Key:"ShipOrderExpand",Value:"./ShipOrderExpand"},{Key:"ShipOrderCreate",Value:"./Create"},{Key:"ShipOrderModify",Value:"./ModifyOrder"},{Key:"ImportShipOrder",Value:"./ImportShipOrder"},{Key:"ToConfirmed",Value:"./Confirm"},{Key:"ToNoCheck",Value:"./Check"},{Key:"ToCancel",Value:"./Cancel"},{Key:"ToHoldUp",Value:"./HoldUp"},{Key:"ToOutStock",Value:"./SetStockout"},{Key:"ToContact",Value:"./Contact"},{Key:"SplitShipOrder",Value:"./Split"},{Key:"MergeShipOrder",Value:"./Merge"},{Key:"ChangeShipWarehouse",Value:"./SetShipWarehouse"},{Key:"CancelFLSFlag",Value:"./CancelFLS"},{Key:"CancelLmaParcel",Value:"./CancelLMA"},{Key:"ReSentOrder",Value:"./Resent"},{Key:"SetShippingMethod",Value:"./SetShippingMethod"},{Key:"PrintLable",Value:"./PrintLabel"},{Key:"CreateBatchOrder",Value:"./CreateBatch"},{Key:"QuickCreateBatchOrder",Value:"./QuickCreateBatch"},{Key:"ReturnGoods",Value:"./ReturnGoods"},{Key:"UpdEdisPackage",Value:"./UpdateEdis"},{Key:"ExportShipOrder",Value:"./Export"},{Key:"SetTrackNumber",Value:"./SetTrackingNumber"},{Key:"ReplaceLogisticsLabel",Value:"./ReplaceLogisticsLabel"},{Key:"OrderReCreate",Value:"./ReCreate"},{Key:"SignShiped",Value:"./SignShiped"},{Key:"RevertPack",Value:"./RevertPack"},{Key:"ReviewShipOrder",Value:"./Review"},{Key:"ExportDetailsErrorOrder",Value:"./ExportSkuErrorOrder"}];function O(){for(var e=[],r=function(r,t){e.push((function(){return{component:a("9c61")("".concat(y[r].Value,".vue")),delay:1e3,timeout:3e3}}))},t=0,n=y.length;t<n;t++)r(t,n);return e}for(var k=Object(o["a"])(O()),f=k[0],P=(k[1],k[2],k[3],k[4],k[5],k[6],k[7],k[8],k[9],k[10],k[11],k[12],k[13],k[14],k[15],k[16],k[17],k[18],k[19],k[20],k[21],k[22],k[23],k[24],k[25],k[26],k[27],k[28],k[29],function(e,r){p["d"].component(y[e].Key,(function(r,t){setTimeout((function(){var t=y[e].Value;Promise.all([a.e("chunk-2d2132e8"),a.e("chunk-fc0c2f14"),a.e("chunk-7876b156"),a.e("chunk-1c57a13d")]).then(function(){var e=[a("d2b9")("".concat(t,".vue"))];r.apply(null,e)}.bind(this)).catch(a.oe)}),1e3)}))}),b=0,v=y.length;b<v;b++)P(b,v);var g=function(e){Object(c["a"])(a,e);var r=Object(s["a"])(a);function a(){var e;return Object(i["a"])(this,a),e=r.apply(this,arguments),e.Cols=[{type:"selection",width:60,align:"center"},{type:"expand",width:40,align:"center",render:function(e,r){return e(f,{props:{ShipOrder:r.row}})}},{title:"发货单/订单/标识",key:"",render:function(r,a){var t=e.GetShipOrderTags(a.row.ShipOrder),n=a.row.Remark.map((function(e){return r("p","".concat(e.UserName,"：").concat(e.Content))})),i=[r("div",{slot:"content"},n)],u=[r("Icon",{props:{type:"ios-text"}})],c=a.row.Remark.length?r("Tooltip",{class:"P-Table-Tip P-BG-Error"},u.concat(i)):"";return r("div",[r("a",{on:{click:function(){e.GetSelectedData([a.row]),e.$nextTick((function(){e.TriggerOperations("ShipOrderView",!0)}))}}},a.row.ShipOrder.OrderCode),r("p",a.row.ShipOrder.PlatformOrderId),r("p",t.map((function(e){return r("span",{class:"P-Table-Tip P-BG-Error"},e)})).concat(c))])}},{title:"国家/收件人/电话",key:"",render:function(e,r){var a=[{Key:"国",Value:"".concat(r.row.Address.Country?r.row.Address.Country.CountryNameCn:"-","(").concat(r.row.Address.Country?r.row.Address.Country.CountryName:"-",")")},{Key:"收",Value:r.row.Address.BuyerFullName||"-"},{Key:"电",Value:r.row.Address.BuyerPhone||"-"}];return e("div",a.map((function(r){return e("p",[e("span",{class:"P-Table-Tip P-BG-Primary"},r.Key),e("span",r.Value)])})))}},{title:"地址/邮编",width:300,render:function(e,r){return e("div",[e("Tooltip",{class:"P-LINE-3",props:{content:"".concat(r.row.Address.BuyerStreet2," ").concat(r.row.Address.BuyerStreet1," ").concat(r.row.Address.BuyerCity," ").concat(r.row.Address.BuyerState)}},[e("span",{class:"P-Table-Tip P-BG-Primary"},"地"),e("span","".concat(r.row.Address.BuyerStreet2," ").concat(r.row.Address.BuyerStreet1," ").concat(r.row.Address.BuyerCity," ").concat(r.row.Address.BuyerState))]),e("p",[e("span",{class:"P-Table-Tip P-BG-Primary"},"邮"),e("span",r.row.Address.BuyerZipCode||"-")])])}},{title:"交易号/原金额/美金金额",key:"",render:function(e,r){return e("div",[e("Tooltip",{props:{content:r.row.ShipOrder.TransationId||"-"},class:"P-LINE-1"},[e("span",{class:"P-Table-Tip P-BG-Primary"},"交"),e("span",r.row.ShipOrder.TransationId||"-")]),e("p",[e("span",{class:"P-Table-Tip P-BG-Primary"},"原"),e("span","".concat(r.row.ShipOrder.PayPrice).concat(r.row.ShipOrder.PayCurrency))]),e("p",[e("span",{class:"P-Table-Tip P-BG-Primary"},"美"),e("span","".concat(r.row.ShipOrder.TotalPrice,"USD"))])])}},{title:"物流渠道/跟踪号/批次号",key:"",render:function(e,r){var a=[{Key:"物",Value:r.row.ShipOrder.MethodName||"-"},{Key:"跟",Value:r.row.ShipOrder.TrackingNumber||"-"},{Key:"批",Value:r.row.ShipOrder.BatchNumber||"-"}];return e("div",a.map((function(r){return e("p",[e("span",{class:"P-Table-Tip P-BG-Primary"},r.Key),e("span",r.Value)])})))}},{title:"平台/店铺/买家ID",key:"",render:function(r,a){var t=[{Key:"平",Value:e.$Enums.Sales.Platform[a.row.ShipOrder.Platform]||"-"},{Key:"店",Value:a.row.ShipOrder.StoreName||"-"},{Key:"买",Value:a.row.ShipOrder.BuyerUserId||"-"}];return r("div",t.map((function(e){return r("p",[r("span",{class:"P-Table-Tip P-BG-Primary"},e.Key),r("span",e.Value)])})))}},{title:"发货仓/重量/运费",key:"",render:function(e,r){var a=[{Key:"仓",Value:r.row.ShipOrder.WarehouseName||"-"},{Key:"重",Value:r.row.ShipOrder.Weight||"-"},{Key:"运",Value:r.row.ShipOrder.ShipFee||"-"}];return e("div",a.map((function(r){return e("p",[e("span",{class:"P-Table-Tip P-BG-Primary"},r.Key),e("span",r.Value)])})))}},{title:"买家/操作/异常备注",key:"",render:function(e,r){var a=[{Key:"买",Value:r.row.ShipOrder.BuyerRemark||"-"},{Key:"操",Value:r.row.ShipOrder.Remark||"-"},{Key:"异",Value:r.row.ShipOrder.AutoMatchRemark||"-"}],t=[],n=a.map((function(r){return t.push(e("p","[".concat(r.Key,"] ").concat(r.Value))),e("p",{class:"P-LINE-1"},[e("span",{class:"P-Table-Tip P-BG-Primary"},r.Key),e("span",r.Value)])})),i=e("div",{slot:"content"},t);return e("Tooltip",{class:"P-W-100-Percent P-MT-5"},n.concat(i))}},{title:"下单/付款/发货时间",width:180,render:function(r,a){var t=[{Key:"下",Value:e.$UI.Render.Date(a.row.ShipOrder.CreateTime,!0)},{Key:"付",Value:e.$UI.Render.Date(a.row.ShipOrder.PaidTime,!0)},{Key:"发",Value:e.$UI.Render.Date(a.row.ShipOrder.ShipedTime,!0)}];return r("div",t.map((function(e){return r("p",[r("span",{class:"P-Table-Tip P-BG-Primary"},e.Key),r("span",e.Value)])})))}},{title:"操作",width:100,render:function(r,a){var t=e.GetOrderOperations(a.row);return r("Dropdown",{on:{"on-click":function(r){e.GetSelectedData([a.row]),e.$nextTick((function(){e.TriggerOperations(r,!0)}))}}},[r("a",[r("span",{class:"P-MR-5"},"操作"),r("Icon",{props:{type:"ios-arrow-down"}})]),r("DropdownMenu",{slot:"list"},t.map((function(e){return r("DropdownItem",{props:{name:e.Value},class:"P-TA-C"},e.Key)})))])}}],e.Pager=new S["a"].Pager,e.SelectedData=[],e.IsFromSales=!1,e.IsHasTopOperateUsable=!0,e}return Object(u["a"])(a,[{key:"EmitPagerChange",value:function(e){}},{key:"EmitDetails",value:function(e){}},{key:"EmitCloseSearch",value:function(){}},{key:"mounted",value:function(){this.SetStatus()}},{key:"SetStatus",value:function(){var e=this,r=["Confirmed","WaitPick","Picked","Packed","Shiped","StockOut","HoldUp","Contact","ClearOutStock"];!this.IsFromSales&&r.includes(this.Page)||this.Cols.splice(-1,0,{title:"状态",width:80,render:function(r,a){return r("span",e.$Enums.Warehouse.ShipOrderStatus[a.row.ShipOrder.Status])}})}},{key:"GetUsablePowers",value:function(){var e=this,r={},a={},t=function(t){e.SHIP_ORDER_POWERS[t]&&"AddShipOrderRemark"!==t&&(a[t]=e.SHIP_ORDER_POWERS[t],e.TOperations.find((function(e){return e===t}))&&(r[t]=e.SHIP_ORDER_POWERS[t]))};for(var n in this.SHIP_ORDER_POWERS)t(n);return this.$set(this,"IsHasTopOperateUsable",Object.keys(r).some((function(e){return!0===r[e]}))),a}},{key:"CalculateHeight",value:function(){return this.$UI.FullHeight()-210-(this.IsHasTopOperateUsable?42:0)}},{key:"ChangePage",value:function(e){this.$set(this.Pager,"PageIndex",e),this.EmitPagerChange(this.Pager)}},{key:"ChangePageSize",value:function(e){this.$set(this.Pager,"PageSize",e),this.EmitPagerChange(this.Pager)}},{key:"SetTotalItems",value:function(e){this.Pager.TotalItems=e}},{key:"PagerReset",value:function(){this.Pager=new S["a"].Pager}},{key:"EmitOperateSuccess",value:function(){this.CancelSelected(),this.EmitPagerChange(this.Pager)}},{key:"GetOrderOperations",value:function(e){var r=[];for(var a in this.SHIP_ORDER_POWERS)if(this.SHIP_ORDER_POWERS[a]){var t=e.ShipOrder.Status,n=e.ShipOrder.IsException,i=e.ShipOrder.MethodApiType,u=e.ShipOrder.ApiType,c=[15,16,17].includes(u),s=""!==e.ShipOrder.TrackingNumber,o=e.ShipOrder.ItemType,d=e.ShipOrder.ShipWarehouseId,p=e.ShipOrder.ShippingMethodId;switch(a){case"CancelFLSFlag":26===u&&s&&i&&[7,8,9,99].includes(t)&&r.push({Key:"取消FLS包裹单",Value:a});break;case"CancelLmaParcel":29===u&&s&&i&&[7,8,9,99].includes(t)&&r.push({Key:"取消LMA包裹单",Value:a});break;case"ShipOrderModify":([1,7,8,9].includes(t)||[2,3,4].includes(t)&&n)&&r.push({Key:"编辑",Value:a});break;case"ToConfirmed":[1,7,8,9].includes(t)&&d&&p&&r.push({Key:"确认",Value:a});break;case"ToCancel":[1,7,8,9].includes(t)&&r.push({Key:"取消",Value:a});break;case"ToContact":[2,7,8].includes(t)&&!c&&r.push({Key:"联系客户",Value:a});break;case"SplitShipOrder":1!==o&&([2,4,7,8,9].includes(t)&&!c||c&&n)&&r.push({Key:"拆分",Value:a});break;case"SetShippingMethod":([2,3].includes(t)&&n||[4,7,9].includes(t))&&r.push({Key:"设置物流渠道",Value:a});break;case"ChangeShipWarehouse":[7,9].includes(t)&&r.push({Key:"设置发货仓",Value:a});break;case"ToOutStock":3===t&&r.push({Key:"设置缺货",Value:a});break;case"ReSentOrder":6===t&&r.push({Key:"重发",Value:a});break;case"PrintLable":[5,6].includes(t)&&r.push({Key:"重打面单",Value:a});break;case"RevertPack":5===t&&r.push({Key:"还原打包",Value:a});break;case"ToNoCheck":99===t&&r.push({Key:"检查",Value:a});break;case"ToHoldUp":[2,3,4,5].includes(t)&&!c&&r.push({Key:"拦截",Value:a});break;case"UpdEdisPackage":20===u&&[7,8,9].includes(t)&&r.push({Key:"更新eDIS包裹",Value:a});break}}return r.push({Key:"查看",Value:"ShipOrderView"}),r}},{key:"GetShipOrderTags",value:function(e){var r=[],a=e.ShipOrderExt?JSON.parse(e.ShipOrderExt):new h["a"].ShipOrderExt;return r.push(e.IsApiDownLoad?"API":"手"),e.IsHoldUp&&r.push("拦截"),e.IsMerge&&r.push("合"),e.IsSplit&&r.push("拆"),e.IsReport&&r.push("报表"),e.IsException&&r.push("异"),a.LazadaGC&&r.push("GC"),a.WishExpress&&r.push("Wish WE"),a.WishEPC&&r.push("EPC"),a.PremiumCarrier&&r.push("优"),a.VovaIsCombinedOrder&&r.push("集运"),1===e.AfterSaleOrderType&&r.push("退"),2===e.AfterSaleOrderType&&r.push("重"),r}},{key:"GetSelectedData",value:function(e){this.$set(this,"SelectedData",e)}},{key:"CancelSelected",value:function(){this.$refs.ShipOrderList.selectAll(!1),this.GetSelectedData([])}},{key:"TriggerOperations",value:function(e,r){switch(this.EmitCloseSearch(),e){case"ShipOrderView":this.EmitDetails({OrderId:this.SelectedData[0].ShipOrder.Id,OrderCode:""}),this.CancelSelected();break;case"EbayMsgSend":this.$refs.EbayMsgSend[0].TriggerWrite(this.SelectedData);break;default:if(!this.SelectedData.length)return void this.$UI.Tips.Floating("warning","请选择发货订单进行操作");this.$refs[e][0].Validate(JSON.parse(JSON.stringify(this.SelectedData))),r&&this.CancelSelected();break}}},{key:"SHIP_ORDER_POWERS",get:function(){return this["ShipOrder/SHIP_ORDER_POWERS"]}}]),a}(p["d"]);d["a"]([Object(p["c"])(Array)],g.prototype,"List",void 0),d["a"]([Object(p["c"])({default:function(){return[]}})],g.prototype,"TOperations",void 0),d["a"]([Object(p["c"])(String)],g.prototype,"Page",void 0),d["a"]([l["b"]],g.prototype,"ShipOrder/SHIP_ORDER_POWERS",void 0),d["a"]([Object(p["b"])()],g.prototype,"EmitPagerChange",null),d["a"]([Object(p["b"])()],g.prototype,"EmitDetails",null),d["a"]([Object(p["b"])()],g.prototype,"EmitCloseSearch",null),g=d["a"]([Object(p["a"])({name:"ShipOrderList",components:{EbayMsgSend:function(){return a.e("chunk-2d0c5b2b").then(a.bind(null,"3fce"))}}})],g);var m=g,C=m,w=a("4023"),T=Object(w["a"])(C,t,n,!1,null,"0bd1337a",null);r["default"]=T.exports}}]);