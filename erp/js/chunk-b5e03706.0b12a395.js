(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-b5e03706","chunk-2d0c8bc7","chunk-2d2213fb"],{"55c4":function(e,r,a){"use strict";a.r(r);var t=function(){var e=this,r=e.$createElement,a=e._self._c||r;return a("Row",[e.SHIP_ORDER_POWERS.AddShipOrderRemark?a("AddShipOrderRemark",{ref:"AddShipOrderRemark",staticClass:"P-Inline-Block P-MR-5",on:{"emit-operate-success":e.EmitOperateSuccess}}):e._e(),e._l(e.EnableOperate,(function(r,t){return a("span",{key:""+r.Value+t},[e.IsEnableOperate(r.Value)?a(r.Value,{ref:r.Value,refInFor:!0,tag:"component",staticClass:"P-Inline-Block P-MR-5",on:{"trigger-operations":e.TriggerOperations,"emit-operate-success":e.EmitOperateSuccess}}):e._e()],1)})),a("Button",{on:{click:e.CancelShipOrderModal}},[e._v("返回")])],2)},n=[],i=(a("6ed5"),a("6bf8"),a("3231")),s=a("064d"),o=a("46d7"),u=a("631e"),c=a("5c62"),l=a("4a81"),p=a("d11d"),d=a("a349"),h=[{Key:"AddShipOrderRemark",Value:"./AddRemark"},{Key:"CancelFLSFlag",Value:"./CancelFLS"},{Key:"CancelLmaParcel",Value:"./CancelLMA"},{Key:"ShipOrderModify",Value:"./ModifyOrder"},{Key:"ToConfirmed",Value:"./Confirm"},{Key:"ToCancel",Value:"./Cancel"},{Key:"ToHoldUp",Value:"./HoldUp"},{Key:"ToContact",Value:"./Contact"},{Key:"ToNoCheck",Value:"./Check"},{Key:"ReSentOrder",Value:"./Resent"},{Key:"SetShippingMethod",Value:"./SetShippingMethod"},{Key:"ChangeShipWarehouse",Value:"./SetShipWarehouse"},{Key:"SplitShipOrder",Value:"./Split"},{Key:"UpdEdisPackage",Value:"./UpdateEdis"}];function S(){for(var e=[],r=function(r,t){e.push((function(){return{component:a("9c61")("".concat(h[r].Value,".vue")),delay:1e3,timeout:3e3}}))},t=0,n=h.length;t<n;t++)r(t,n);return e}for(var O=Object(c["a"])(S()),y=(O[0],O[1],O[2],O[3],O[4],O[5],O[6],O[7],O[8],O[9],O[10],O[11],O[12],O[13],function(e,r){p["d"].component(h[e].Key,(function(r,t){setTimeout((function(){var t=h[e].Value;Promise.all([a.e("chunk-2d2132e8"),a.e("chunk-fc0c2f14"),a.e("chunk-7876b156"),a.e("chunk-1c6d2971")]).then(function(){var e=[a("d2b9")("".concat(t,".vue"))];r.apply(null,e)}.bind(this)).catch(a.oe)}),1e3)}))}),P=0,f=h.length;P<f;P++)y(P,f);var m=function(e){Object(o["a"])(a,e);var r=Object(u["a"])(a);function a(){var e;return Object(i["a"])(this,a),e=r.apply(this,arguments),e.EnableOperate=[],e}return Object(s["a"])(a,[{key:"CancelShipOrderModal",value:function(){}},{key:"EmitOperateSuccess",value:function(){arguments.length>0&&void 0!==arguments[0]&&arguments[0]}},{key:"mounted",value:function(){this.SetEnableOperate()}},{key:"SetEnableOperate",value:function(){for(var e in this.EnableOperate=[],this.SHIP_ORDER_POWERS)if(this.SHIP_ORDER_POWERS[e])switch(e){case"CancelFLSFlag":this.EnableOperate.push({Key:"取消FLS包裹单",Value:e});break;case"CancelLmaParcel":this.EnableOperate.push({Key:"取消LMA包裹单",Value:e});break;case"ShipOrderModify":this.EnableOperate.push({Key:"编辑",Value:e});break;case"ToConfirmed":this.EnableOperate.push({Key:"确认",Value:e});break;case"ToCancel":this.EnableOperate.push({Key:"取消",Value:e});break;case"ToHoldUp":this.EnableOperate.push({Key:"拦截",Value:e});break;case"ToContact":this.EnableOperate.push({Key:"联系客户",Value:e});break;case"ToNoCheck":this.EnableOperate.push({Key:"检查",Value:e});break;case"ReSentOrder":this.EnableOperate.push({Key:"重发",Value:e});break;case"SetShippingMethod":this.EnableOperate.push({Key:"设置发货渠道",Value:e});break;case"ChangeShipWarehouse":this.EnableOperate.push({Key:"设置发货仓",Value:e});break;case"SplitShipOrder":this.EnableOperate.push({Key:"拆分",Value:e});break;case"UpdEdisPackage":this.EnableOperate.push({Key:"更新EDIS包裹单",Value:e});break}}},{key:"IsEnableOperate",value:function(e){var r=this,a=this.SHIP_ORDER_INFO.Status,t=this.SHIP_ORDER_INFO.ApiType,n=""!==this.SHIP_ORDER_INFO.TrackingNumber,i=""!==this.SHIP_ORDER_INFO.MethodApiCode,s=this.SHIP_ORDER_INFO.IsException||!1,o=this.SHIP_ORDER_INFO.ItemType,u=[15,16,17].some((function(e){return r.SHIP_ORDER_INFO.ApiType===e})),c=0!==this.SHIP_ORDER_INFO.ShipWarehouseId,l=0!==this.SHIP_ORDER_INFO.ShippingMethodId;switch(e){case"CancelFLSFlag":return 26===t&&[7,8,9,99].some((function(e){return e===a}))&&n&&i;case"CancelLmaParcel":return 29===t&&[7,8,9,99].some((function(e){return e===a}))&&n&&i;case"ShipOrderModify":return[1,7,8,9].some((function(e){return e===a}))||[2,3,4].some((function(e){return e===a}))&&s;case"ToConfirmed":return[1,7,8,9].some((function(e){return e===a}))&&c&&l;case"ToCancel":return[1,7,8,9].some((function(e){return e===a}));case"ToHoldUp":return[2,3,4,5].some((function(e){return e===a}))&&!u;case"ToContact":return[2,7,8].some((function(e){return e===a}))&&!u;case"ToNoCheck":return 99===a;case"ReSentOrder":return 6===a;case"SetShippingMethod":return[7,9].some((function(e){return e===a}));case"ChangeShipWarehouse":case"SplitShipOrder":return 1!==o&&[2,4,7].some((function(e){return e===a}))&&!u;case"UpdEdisPackage":return 20===t&&[7,8,9].some((function(e){return e===a}));default:return!1}}},{key:"TriggerOperations",value:function(e){this.$refs[e][0].Validate([{ShipOrder:this.SHIP_ORDER_INFO,Address:this.SHIP_ORDER_ADDRESS,Remark:this.SHIP_ORDER_REMARK}])}},{key:"TriggerRemark",value:function(){}},{key:"SHIP_ORDER_INFO",get:function(){return this["ShipOrder/SHIP_ORDER_INFO"]}},{key:"SHIP_ORDER_ADDRESS",get:function(){return this["ShipOrder/SHIP_ORDER_ADDRESS"]}},{key:"SHIP_ORDER_REMARK",get:function(){return this["ShipOrder/SHIP_ORDER_REMARK"]}},{key:"SHIP_ORDER_POWERS",get:function(){return this["ShipOrder/SHIP_ORDER_POWERS"]}}]),a}(p["d"]);l["a"]([d["b"]],m.prototype,"ShipOrder/SHIP_ORDER_INFO",void 0),l["a"]([d["b"]],m.prototype,"ShipOrder/SHIP_ORDER_ADDRESS",void 0),l["a"]([d["b"]],m.prototype,"ShipOrder/SHIP_ORDER_REMARK",void 0),l["a"]([d["b"]],m.prototype,"ShipOrder/SHIP_ORDER_POWERS",void 0),l["a"]([Object(p["b"])()],m.prototype,"CancelShipOrderModal",null),l["a"]([Object(p["b"])()],m.prototype,"EmitOperateSuccess",null),m=l["a"]([Object(p["a"])({name:"ShipOrderDetailsOperate",components:{}})],m);var R=m,b=R,k=a("4023"),g=Object(k["a"])(b,t,n,!1,null,"6f8e93ce",null);r["default"]=g.exports},ca18:function(e,r,a){"use strict";a.r(r);var t=function(){var e=this,r=e.$createElement,a=e._self._c||r;return a("Col",{attrs:{span:"24"}},[e._l(e.GetUsablePowers(),(function(r,t){return a("span",{key:t},["AddShipOrderRemark"!==t?a(t,{directives:[{name:"show",rawName:"v-show",value:e.TOperations.find((function(e){return e===t})),expression:"TOperations.find(Itm => Itm === Item)"}],ref:t,refInFor:!0,tag:"component",staticClass:"P-Inline-Block P-MR-10 P-MB-10",attrs:{Page:e.Page},on:{"trigger-operations":e.TriggerOperations,"emit-operate-success":e.EmitOperateSuccess}}):e._e()],1)})),a("Table",{ref:"ShipOrderList",attrs:{columns:e.Cols,data:e.List,size:"small",stripe:"",height:e.CalculateHeight()},on:{"on-selection-change":e.GetSelectedData}}),a("Page",{staticClass:"P-MT-10",attrs:{current:e.Pager.PageIndex,total:e.Pager.TotalItems,"page-size":e.Pager.PageSize,"page-size-opts":e.Pager.PageSizeOpt,"show-total":"","show-sizer":"","show-elevator":""},on:{"on-change":e.ChangePage,"on-page-size-change":e.ChangePageSize}})],2)},n=[],i=(a("d9b9"),a("3fa9"),a("5e8c"),a("76bb"),a("6ed5"),a("cee1"),a("f8cd"),a("6bf8"),a("3231")),s=a("064d"),o=a("46d7"),u=a("631e"),c=a("5c62"),l=a("4a81"),p=a("d11d"),d=a("a349"),h=a("1459"),S=a("db83"),O=[{Key:"ShipOrderExpand",Value:"./ShipOrderExpand"},{Key:"ShipOrderCreate",Value:"./Create"},{Key:"ShipOrderModify",Value:"./ModifyOrder"},{Key:"ImportShipOrder",Value:"./ImportShipOrder"},{Key:"ToConfirmed",Value:"./Confirm"},{Key:"ToNoCheck",Value:"./Check"},{Key:"ToCancel",Value:"./Cancel"},{Key:"ToHoldUp",Value:"./HoldUp"},{Key:"ToOutStock",Value:"./SetStockout"},{Key:"ToContact",Value:"./Contact"},{Key:"SplitShipOrder",Value:"./Split"},{Key:"MergeShipOrder",Value:"./Merge"},{Key:"ChangeShipWarehouse",Value:"./SetShipWarehouse"},{Key:"CancelFLSFlag",Value:"./CancelFLS"},{Key:"CancelLmaParcel",Value:"./CancelLMA"},{Key:"ReSentOrder",Value:"./Resent"},{Key:"SetShippingMethod",Value:"./SetShippingMethod"},{Key:"PrintLable",Value:"./PrintLabel"},{Key:"CreateBatchOrder",Value:"./CreateBatch"},{Key:"QuickCreateBatchOrder",Value:"./QuickCreateBatch"},{Key:"ReturnGoods",Value:"./ReturnGoods"},{Key:"UpdEdisPackage",Value:"./UpdateEdis"},{Key:"ExportShipOrder",Value:"./Export"},{Key:"SetTrackNumber",Value:"./SetTrackingNumber"},{Key:"ReplaceLogisticsLabel",Value:"./ReplaceLogisticsLabel"},{Key:"OrderReCreate",Value:"./ReCreate"},{Key:"SignShiped",Value:"./SignShiped"},{Key:"RevertPack",Value:"./RevertPack"},{Key:"ReviewShipOrder",Value:"./Review"},{Key:"ExportDetailsErrorOrder",Value:"./ExportSkuErrorOrder"}];function y(){for(var e=[],r=function(r,t){e.push((function(){return{component:a("9c61")("".concat(O[r].Value,".vue")),delay:1e3,timeout:3e3}}))},t=0,n=O.length;t<n;t++)r(t,n);return e}for(var P=Object(c["a"])(y()),f=P[0],m=(P[1],P[2],P[3],P[4],P[5],P[6],P[7],P[8],P[9],P[10],P[11],P[12],P[13],P[14],P[15],P[16],P[17],P[18],P[19],P[20],P[21],P[22],P[23],P[24],P[25],P[26],P[27],P[28],P[29],function(e,r){p["d"].component(O[e].Key,(function(r,t){setTimeout((function(){var t=O[e].Value;Promise.all([a.e("chunk-2d2132e8"),a.e("chunk-fc0c2f14"),a.e("chunk-7876b156"),a.e("chunk-1c57a13d")]).then(function(){var e=[a("d2b9")("".concat(t,".vue"))];r.apply(null,e)}.bind(this)).catch(a.oe)}),1e3)}))}),R=0,b=O.length;R<b;R++)m(R,b);var k=function(e){Object(o["a"])(a,e);var r=Object(u["a"])(a);function a(){var e;return Object(i["a"])(this,a),e=r.apply(this,arguments),e.Cols=[{type:"selection",width:60,align:"center"},{type:"expand",width:40,align:"center",render:function(e,r){return e(f,{props:{ShipOrder:r.row}})}},{title:"发货单/订单/标识",key:"",render:function(r,a){var t=e.GetShipOrderTags(a.row.ShipOrder),n=a.row.Remark.map((function(e){return r("p","".concat(e.UserName,"：").concat(e.Content))})),i=[r("div",{slot:"content"},n)],s=[r("Icon",{props:{type:"ios-text"}})],o=a.row.Remark.length?r("Tooltip",{class:"P-Table-Tip P-BG-Error"},s.concat(i)):"";return r("div",[r("a",{on:{click:function(){e.GetSelectedData([a.row]),e.$nextTick((function(){e.TriggerOperations("ShipOrderView",!0)}))}}},a.row.ShipOrder.OrderCode),r("p",a.row.ShipOrder.PlatformOrderId),r("p",t.map((function(e){return r("span",{class:"P-Table-Tip P-BG-Error"},e)})).concat(o))])}},{title:"国家/收件人/电话",key:"",render:function(e,r){var a=[{Key:"国",Value:"".concat(r.row.Address.Country?r.row.Address.Country.CountryNameCn:"-","(").concat(r.row.Address.Country?r.row.Address.Country.CountryName:"-",")")},{Key:"收",Value:r.row.Address.BuyerFullName||"-"},{Key:"电",Value:r.row.Address.BuyerPhone||"-"}];return e("div",a.map((function(r){return e("p",[e("span",{class:"P-Table-Tip P-BG-Primary"},r.Key),e("span",r.Value)])})))}},{title:"地址/邮编",width:300,render:function(e,r){return e("div",[e("Tooltip",{class:"P-LINE-3",props:{content:"".concat(r.row.Address.BuyerStreet2," ").concat(r.row.Address.BuyerStreet1," ").concat(r.row.Address.BuyerCity," ").concat(r.row.Address.BuyerState)}},[e("span",{class:"P-Table-Tip P-BG-Primary"},"地"),e("span","".concat(r.row.Address.BuyerStreet2," ").concat(r.row.Address.BuyerStreet1," ").concat(r.row.Address.BuyerCity," ").concat(r.row.Address.BuyerState))]),e("p",[e("span",{class:"P-Table-Tip P-BG-Primary"},"邮"),e("span",r.row.Address.BuyerZipCode||"-")])])}},{title:"交易号/原金额/美金金额",key:"",render:function(e,r){return e("div",[e("Tooltip",{props:{content:r.row.ShipOrder.TransationId||"-"},class:"P-LINE-1"},[e("span",{class:"P-Table-Tip P-BG-Primary"},"交"),e("span",r.row.ShipOrder.TransationId||"-")]),e("p",[e("span",{class:"P-Table-Tip P-BG-Primary"},"原"),e("span","".concat(r.row.ShipOrder.PayPrice).concat(r.row.ShipOrder.PayCurrency))]),e("p",[e("span",{class:"P-Table-Tip P-BG-Primary"},"美"),e("span","".concat(r.row.ShipOrder.TotalPrice,"USD"))])])}},{title:"物流渠道/跟踪号/批次号",key:"",render:function(e,r){var a=[{Key:"物",Value:r.row.ShipOrder.MethodName||"-"},{Key:"跟",Value:r.row.ShipOrder.TrackingNumber||"-"},{Key:"批",Value:r.row.ShipOrder.BatchNumber||"-"}];return e("div",a.map((function(r){return e("p",[e("span",{class:"P-Table-Tip P-BG-Primary"},r.Key),e("span",r.Value)])})))}},{title:"平台/店铺/买家ID",key:"",render:function(r,a){var t=[{Key:"平",Value:e.$Enums.Sales.Platform[a.row.ShipOrder.Platform]||"-"},{Key:"店",Value:a.row.ShipOrder.StoreName||"-"},{Key:"买",Value:a.row.ShipOrder.BuyerUserId||"-"}];return r("div",t.map((function(e){return r("p",[r("span",{class:"P-Table-Tip P-BG-Primary"},e.Key),r("span",e.Value)])})))}},{title:"发货仓/重量/运费",key:"",render:function(e,r){var a=[{Key:"仓",Value:r.row.ShipOrder.WarehouseName||"-"},{Key:"重",Value:r.row.ShipOrder.Weight||"-"},{Key:"运",Value:r.row.ShipOrder.ShipFee||"-"}];return e("div",a.map((function(r){return e("p",[e("span",{class:"P-Table-Tip P-BG-Primary"},r.Key),e("span",r.Value)])})))}},{title:"买家/操作/异常备注",key:"",render:function(e,r){var a=[{Key:"买",Value:r.row.ShipOrder.BuyerRemark||"-"},{Key:"操",Value:r.row.ShipOrder.Remark||"-"},{Key:"异",Value:r.row.ShipOrder.AutoMatchRemark||"-"}],t=[],n=a.map((function(r){return t.push(e("p","[".concat(r.Key,"] ").concat(r.Value))),e("p",{class:"P-LINE-1"},[e("span",{class:"P-Table-Tip P-BG-Primary"},r.Key),e("span",r.Value)])})),i=e("div",{slot:"content"},t);return e("Tooltip",{class:"P-W-100-Percent P-MT-5"},n.concat(i))}},{title:"下单/付款/发货时间",width:180,render:function(r,a){var t=[{Key:"下",Value:e.$UI.Render.Date(a.row.ShipOrder.CreateTime,!0)},{Key:"付",Value:e.$UI.Render.Date(a.row.ShipOrder.PaidTime,!0)},{Key:"发",Value:e.$UI.Render.Date(a.row.ShipOrder.ShipedTime,!0)}];return r("div",t.map((function(e){return r("p",[r("span",{class:"P-Table-Tip P-BG-Primary"},e.Key),r("span",e.Value)])})))}},{title:"操作",width:100,render:function(r,a){var t=e.GetOrderOperations(a.row);return r("Dropdown",{on:{"on-click":function(r){e.GetSelectedData([a.row]),e.$nextTick((function(){e.TriggerOperations(r,!0)}))}}},[r("a",[r("span",{class:"P-MR-5"},"操作"),r("Icon",{props:{type:"ios-arrow-down"}})]),r("DropdownMenu",{slot:"list"},t.map((function(e){return r("DropdownItem",{props:{name:e.Value},class:"P-TA-C"},e.Key)})))])}}],e.Pager=new S["a"].Pager,e.SelectedData=[],e.IsFromSales=!1,e.IsHasTopOperateUsable=!0,e}return Object(s["a"])(a,[{key:"EmitPagerChange",value:function(e){}},{key:"EmitDetails",value:function(e){}},{key:"EmitCloseSearch",value:function(){}},{key:"mounted",value:function(){this.SetStatus()}},{key:"SetStatus",value:function(){var e=this,r=["Confirmed","WaitPick","Picked","Packed","Shiped","StockOut","HoldUp","Contact","ClearOutStock"];!this.IsFromSales&&r.includes(this.Page)||this.Cols.splice(-1,0,{title:"状态",width:80,render:function(r,a){return r("span",e.$Enums.Warehouse.ShipOrderStatus[a.row.ShipOrder.Status])}})}},{key:"GetUsablePowers",value:function(){var e=this,r={},a={},t=function(t){e.SHIP_ORDER_POWERS[t]&&"AddShipOrderRemark"!==t&&(a[t]=e.SHIP_ORDER_POWERS[t],e.TOperations.find((function(e){return e===t}))&&(r[t]=e.SHIP_ORDER_POWERS[t]))};for(var n in this.SHIP_ORDER_POWERS)t(n);return this.$set(this,"IsHasTopOperateUsable",Object.keys(r).some((function(e){return!0===r[e]}))),a}},{key:"CalculateHeight",value:function(){return this.$UI.FullHeight()-210-(this.IsHasTopOperateUsable?42:0)}},{key:"ChangePage",value:function(e){this.$set(this.Pager,"PageIndex",e),this.EmitPagerChange(this.Pager)}},{key:"ChangePageSize",value:function(e){this.$set(this.Pager,"PageSize",e),this.EmitPagerChange(this.Pager)}},{key:"SetTotalItems",value:function(e){this.Pager.TotalItems=e}},{key:"PagerReset",value:function(){this.Pager=new S["a"].Pager}},{key:"EmitOperateSuccess",value:function(){this.CancelSelected(),this.EmitPagerChange(this.Pager)}},{key:"GetOrderOperations",value:function(e){var r=[];for(var a in this.SHIP_ORDER_POWERS)if(this.SHIP_ORDER_POWERS[a]){var t=e.ShipOrder.Status,n=e.ShipOrder.IsException,i=e.ShipOrder.MethodApiType,s=e.ShipOrder.ApiType,o=[15,16,17].includes(s),u=""!==e.ShipOrder.TrackingNumber,c=e.ShipOrder.ItemType,l=e.ShipOrder.ShipWarehouseId,p=e.ShipOrder.ShippingMethodId;switch(a){case"CancelFLSFlag":26===s&&u&&i&&[7,8,9,99].includes(t)&&r.push({Key:"取消FLS包裹单",Value:a});break;case"CancelLmaParcel":29===s&&u&&i&&[7,8,9,99].includes(t)&&r.push({Key:"取消LMA包裹单",Value:a});break;case"ShipOrderModify":([1,7,8,9].includes(t)||[2,3,4].includes(t)&&n)&&r.push({Key:"编辑",Value:a});break;case"ToConfirmed":[1,7,8,9].includes(t)&&l&&p&&r.push({Key:"确认",Value:a});break;case"ToCancel":[1,7,8,9].includes(t)&&r.push({Key:"取消",Value:a});break;case"ToContact":[2,7,8].includes(t)&&!o&&r.push({Key:"联系客户",Value:a});break;case"SplitShipOrder":1!==c&&([2,4,7,8,9].includes(t)&&!o||o&&n)&&r.push({Key:"拆分",Value:a});break;case"SetShippingMethod":([2,3].includes(t)&&n||[4,7,9].includes(t))&&r.push({Key:"设置物流渠道",Value:a});break;case"ChangeShipWarehouse":[7,9].includes(t)&&r.push({Key:"设置发货仓",Value:a});break;case"ToOutStock":3===t&&r.push({Key:"设置缺货",Value:a});break;case"ReSentOrder":6===t&&r.push({Key:"重发",Value:a});break;case"PrintLable":[5,6].includes(t)&&r.push({Key:"重打面单",Value:a});break;case"RevertPack":5===t&&r.push({Key:"还原打包",Value:a});break;case"ToNoCheck":99===t&&r.push({Key:"检查",Value:a});break;case"ToHoldUp":[2,3,4,5].includes(t)&&!o&&r.push({Key:"拦截",Value:a});break;case"UpdEdisPackage":20===s&&[7,8,9].includes(t)&&r.push({Key:"更新eDIS包裹",Value:a});break}}return r.push({Key:"查看",Value:"ShipOrderView"}),r}},{key:"GetShipOrderTags",value:function(e){var r=[],a=e.ShipOrderExt?JSON.parse(e.ShipOrderExt):new h["a"].ShipOrderExt;return r.push(e.IsApiDownLoad?"API":"手"),e.IsHoldUp&&r.push("拦截"),e.IsMerge&&r.push("合"),e.IsSplit&&r.push("拆"),e.IsReport&&r.push("报表"),e.IsException&&r.push("异"),a.LazadaGC&&r.push("GC"),a.WishExpress&&r.push("Wish WE"),a.WishEPC&&r.push("EPC"),a.PremiumCarrier&&r.push("优"),a.VovaIsCombinedOrder&&r.push("集运"),1===e.AfterSaleOrderType&&r.push("退"),2===e.AfterSaleOrderType&&r.push("重"),r}},{key:"GetSelectedData",value:function(e){this.$set(this,"SelectedData",e)}},{key:"CancelSelected",value:function(){this.$refs.ShipOrderList.selectAll(!1),this.GetSelectedData([])}},{key:"TriggerOperations",value:function(e,r){switch(this.EmitCloseSearch(),e){case"ShipOrderView":this.EmitDetails({OrderId:this.SelectedData[0].ShipOrder.Id,OrderCode:""}),this.CancelSelected();break;case"EbayMsgSend":this.$refs.EbayMsgSend[0].TriggerWrite(this.SelectedData);break;default:if(!this.SelectedData.length)return void this.$UI.Tips.Floating("warning","请选择发货订单进行操作");this.$refs[e][0].Validate(JSON.parse(JSON.stringify(this.SelectedData))),r&&this.CancelSelected();break}}},{key:"SHIP_ORDER_POWERS",get:function(){return this["ShipOrder/SHIP_ORDER_POWERS"]}}]),a}(p["d"]);l["a"]([Object(p["c"])(Array)],k.prototype,"List",void 0),l["a"]([Object(p["c"])({default:function(){return[]}})],k.prototype,"TOperations",void 0),l["a"]([Object(p["c"])(String)],k.prototype,"Page",void 0),l["a"]([d["b"]],k.prototype,"ShipOrder/SHIP_ORDER_POWERS",void 0),l["a"]([Object(p["b"])()],k.prototype,"EmitPagerChange",null),l["a"]([Object(p["b"])()],k.prototype,"EmitDetails",null),l["a"]([Object(p["b"])()],k.prototype,"EmitCloseSearch",null),k=l["a"]([Object(p["a"])({name:"ShipOrderList",components:{EbayMsgSend:function(){return a.e("chunk-2d0c5b2b").then(a.bind(null,"3fce"))}}})],k);var g=k,E=g,V=a("4023"),C=Object(V["a"])(E,t,n,!1,null,"0bd1337a",null);r["default"]=C.exports}}]);