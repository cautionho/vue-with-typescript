(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0bfe77"],{4005:function(t,e,o){"use strict";o.r(e);var r=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"P-Inline-Block"},[t.CalculateCreate()?o("Button",{staticClass:"P-MB-10  P-MR-5",attrs:{type:"primary"},on:{click:function(e){t.TriggerAccount(t.AccountsInfo[String(t.Platform)])}}},[t._v("添加账号")]):t._e(),o("Modal",{attrs:{title:t.Store.length&&t.Store[0].Id?"编辑账号":"添加账号",width:800},on:{"on-cancel":function(e){return t.CancelAccount(!1)}},model:{value:t.AccountModal,callback:function(e){t.AccountModal=e},expression:"AccountModal"}},[o("Row",[1===t.Platform?o("Col",{attrs:{span:"24"}},[o("Form",{ref:"Store"+t.Platform,attrs:{model:t.AccountsInfo[String(t.Platform)],rules:t.EbayRules,"label-width":90}},[o("FormItem",{attrs:{label:"账号：",prop:"StoreName"}},[o("Input",{attrs:{placeholder:"账号名称"},model:{value:t.AccountsInfo[String(t.Platform)].StoreName,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"StoreName",e)},expression:"AccountsInfo[String(Platform)].StoreName"}})],1),o("FormItem",{attrs:{label:"别名：",prop:"Alias"}},[o("Input",{attrs:{placeholder:"账号别名"},model:{value:t.AccountsInfo[String(t.Platform)].Alias,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"Alias",e)},expression:"AccountsInfo[String(Platform)].Alias"}})],1),o("FormItem",{attrs:{label:"Paypal：",prop:"PaypalAccountId"}},[o("Select",{attrs:{placeholder:"Paypal账号",options:t.PaypalDrop},model:{value:t.AccountsInfo[String(t.Platform)].PaypalAccountId,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"PaypalAccountId",e)},expression:"AccountsInfo[String(Platform)].PaypalAccountId"}})],1),o("FormItem",{attrs:{label:"API状态：",prop:"IsUseApi"}},[o("Select",{attrs:{placeholder:"API状态",options:t.EnableDrop},model:{value:t.AccountsInfo[String(t.Platform)].IsUseApi,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"IsUseApi",e)},expression:"AccountsInfo[String(Platform)].IsUseApi"}})],1),o("FormItem",{attrs:{label:"账单币种：",prop:"InvoiceCurrency"}},[o("Select",{attrs:{placeholder:"账单币种",options:t.CURRENCY_DROP},model:{value:t.AccountsInfo[String(t.Platform)].InvoiceCurrency,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"InvoiceCurrency",e)},expression:"AccountsInfo[String(Platform)].InvoiceCurrency"}})],1),o("FormItem",{attrs:{label:"登录IP：",prop:"LoginIp"}},[o("Input",{attrs:{placeholder:"登录IP"},model:{value:t.AccountsInfo[String(t.Platform)].LoginIp,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"LoginIp",e)},expression:"AccountsInfo[String(Platform)].LoginIp"}})],1),o("FormItem",{attrs:{label:"密码：",prop:"Password"}},[o("Input",{attrs:{placeholder:t.Store.length?"不填写则默认不修改密码":"登录密码"},model:{value:t.AccountsInfo[String(t.Platform)].Password,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"Password",e)},expression:"AccountsInfo[String(Platform)].Password"}})],1),o("FormItem",{attrs:{label:"站点：",prop:"JumpAddr"}},[o("CheckboxGroup",{model:{value:t.AccountsInfo[String(t.Platform)].JumpAddr,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"JumpAddr",e)},expression:"AccountsInfo[String(Platform)].JumpAddr"}},t._l(t.EabyLoginSite,(function(e,r){return o("Checkbox",{key:r,attrs:{label:e.Value}},[t._v(t._s(e.Key))])})),1)],1)],1)],1):t._e(),2===t.Platform?o("Col",{attrs:{span:"24"}},[o("Form",{ref:"Store"+t.Platform,attrs:{model:t.AccountsInfo[String(t.Platform)],rules:t.WishRules,"label-width":90}},[o("FormItem",{attrs:{label:"账号：",prop:"StoreName"}},[o("Input",{attrs:{placeholder:"账号名称"},model:{value:t.AccountsInfo[String(t.Platform)].StoreName,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"StoreName",e)},expression:"AccountsInfo[String(Platform)].StoreName"}})],1),o("FormItem",{attrs:{label:"别名：",prop:"Alias"}},[o("Input",{attrs:{placeholder:"账号别名"},model:{value:t.AccountsInfo[String(t.Platform)].Alias,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"Alias",e)},expression:"AccountsInfo[String(Platform)].Alias"}})],1)],1)],1):t._e(),3===t.Platform?o("Col",{attrs:{span:"24"}},[o("Form",{ref:"Store"+t.Platform,attrs:{model:t.AccountsInfo[String(t.Platform)],rules:t.AmazonRules,"label-width":90}},[o("FormItem",{attrs:{label:"账号：",prop:"StoreName"}},[o("Input",{attrs:{placeholder:"账号名称"},model:{value:t.AccountsInfo[String(t.Platform)].StoreName,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"StoreName",e)},expression:"AccountsInfo[String(Platform)].StoreName"}})],1),o("FormItem",{attrs:{label:"别名：",prop:"Alias"}},[o("Input",{attrs:{placeholder:"账号别名"},model:{value:t.AccountsInfo[String(t.Platform)].Alias,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"Alias",e)},expression:"AccountsInfo[String(Platform)].Alias"}})],1),o("FormItem",{attrs:{label:"卖家ID：",prop:"SellerId"}},[o("Input",{attrs:{placeholder:"卖家ID"},model:{value:t.AccountsInfo[String(t.Platform)].SellerId,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"SellerId",e)},expression:"AccountsInfo[String(Platform)].SellerId"}})],1),o("FormItem",{attrs:{label:"MWS授权令牌：",prop:"MWSAuthToken"}},[o("Input",{attrs:{placeholder:"MWS授权令牌"},model:{value:t.AccountsInfo[String(t.Platform)].MWSAuthToken,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"MWSAuthToken",e)},expression:"AccountsInfo[String(Platform)].MWSAuthToken"}})],1),o("FormItem",{attrs:{label:"站点：",prop:"SiteCode"}},[o("CheckboxGroup",{model:{value:t.AccountsInfo[String(t.Platform)].SiteCode,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"SiteCode",e)},expression:"AccountsInfo[String(Platform)].SiteCode"}},t._l(t.AmazonSiteDrop,(function(e,r){return o("Checkbox",{key:r,attrs:{label:e.Value}},[t._v(t._s(e.Key))])})),1)],1)],1)],1):t._e(),4===t.Platform?o("Col",{attrs:{span:"24"}},[o("Form",{ref:"Store"+t.Platform,attrs:{model:t.AccountsInfo[String(t.Platform)],rules:t.ShopeeRules,"label-width":90}},[o("FormItem",{attrs:{label:"账号：",prop:"StoreName"}},[o("Input",{attrs:{placeholder:"账号名称"},model:{value:t.AccountsInfo[String(t.Platform)].StoreName,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"StoreName",e)},expression:"AccountsInfo[String(Platform)].StoreName"}})],1),o("FormItem",{attrs:{label:"别名：",prop:"Alias"}},[o("Input",{attrs:{placeholder:"账号别名"},model:{value:t.AccountsInfo[String(t.Platform)].Alias,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"Alias",e)},expression:"AccountsInfo[String(Platform)].Alias"}})],1),o("FormItem",{attrs:{label:"ShopId：",prop:"ShopId"}},[o("Input",{attrs:{placeholder:"ShopId",type:t.Store.length?"password":"text"},model:{value:t.AccountsInfo[String(t.Platform)].ShopId,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"ShopId",e)},expression:"AccountsInfo[String(Platform)].ShopId"}})],1),o("FormItem",{attrs:{label:"站点：",prop:"Site"}},[o("Select",{attrs:{placeholder:"站点",options:t.ShopeeSiteDrop},model:{value:t.AccountsInfo[String(t.Platform)].Site,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"Site",e)},expression:"AccountsInfo[String(Platform)].Site"}})],1)],1)],1):t._e(),5===t.Platform||12===t.Platform||17===t.Platform?o("Col",{attrs:{span:"24"}},[o("Form",{ref:"Store"+t.Platform,attrs:{model:t.AccountsInfo[String(t.Platform)],rules:t.WalmartRules,"label-width":110}},[o("FormItem",{attrs:{label:"账号：",prop:"StoreName"}},[o("Input",{attrs:{placeholder:"账号名称"},model:{value:t.AccountsInfo[String(t.Platform)].StoreName,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"StoreName",e)},expression:"AccountsInfo[String(Platform)].StoreName"}})],1),o("FormItem",{attrs:{label:"别名：",prop:"Alias"}},[o("Input",{attrs:{placeholder:"账号别名"},model:{value:t.AccountsInfo[String(t.Platform)].Alias,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"Alias",e)},expression:"AccountsInfo[String(Platform)].Alias"}})],1),o("FormItem",{attrs:{label:"ClientId：",prop:"ClientId"}},[o("Input",{attrs:{placeholder:"ClientId",type:t.Store.length?"password":"text"},model:{value:t.AccountsInfo[String(t.Platform)].ClientId,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"ClientId",e)},expression:"AccountsInfo[String(Platform)].ClientId"}})],1),o("FormItem",{attrs:{label:"Client Secret：",prop:"ClientSecret"}},[o("Input",{attrs:{placeholder:"Client Secret",type:t.Store.length?"password":"text"},model:{value:t.AccountsInfo[String(t.Platform)].ClientSecret,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"ClientSecret",e)},expression:"AccountsInfo[String(Platform)].ClientSecret"}})],1)],1)],1):t._e(),6===t.Platform?o("Col",{attrs:{span:"24"}},[o("Form",{ref:"Store"+t.Platform,attrs:{model:t.AccountsInfo[String(t.Platform)],rules:t.CdiscountRules,"label-width":110}},[o("FormItem",{attrs:{label:"账号：",prop:"StoreName"}},[o("Input",{attrs:{placeholder:"账号名称"},model:{value:t.AccountsInfo[String(t.Platform)].StoreName,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"StoreName",e)},expression:"AccountsInfo[String(Platform)].StoreName"}})],1),o("FormItem",{attrs:{label:"别名：",prop:"Alias"}},[o("Input",{attrs:{placeholder:"账号别名"},model:{value:t.AccountsInfo[String(t.Platform)].Alias,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"Alias",e)},expression:"AccountsInfo[String(Platform)].Alias"}})],1),o("FormItem",{attrs:{label:"Api Login：",prop:"ApiLogin"}},[o("Input",{attrs:{placeholder:"Api Login"},model:{value:t.AccountsInfo[String(t.Platform)].ApiLogin,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"ApiLogin",e)},expression:"AccountsInfo[String(Platform)].ApiLogin"}})],1),o("FormItem",{attrs:{label:"Api Password：",prop:"ApiPassword"}},[o("Input",{attrs:{placeholder:"Api Password",type:t.Store.length?"password":"text"},model:{value:t.AccountsInfo[String(t.Platform)].ApiPassword,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"ApiPassword",e)},expression:"AccountsInfo[String(Platform)].ApiPassword"}})],1)],1)],1):t._e(),8===t.Platform?o("Col",{attrs:{span:"24"}},[o("Form",{ref:"Store"+t.Platform,attrs:{model:t.AccountsInfo[String(t.Platform)],rules:t.JoomRules,"label-width":110}},[o("FormItem",{attrs:{label:"账号：",prop:"StoreName"}},[o("Input",{attrs:{placeholder:"账号名称"},model:{value:t.AccountsInfo[String(t.Platform)].StoreName,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"StoreName",e)},expression:"AccountsInfo[String(Platform)].StoreName"}})],1),o("FormItem",{attrs:{label:"别名：",prop:"Alias"}},[o("Input",{attrs:{placeholder:"账号别名"},model:{value:t.AccountsInfo[String(t.Platform)].Alias,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"Alias",e)},expression:"AccountsInfo[String(Platform)].Alias"}})],1),o("FormItem",{attrs:{label:"Client Id：",prop:"ClientId"}},[o("Input",{attrs:{placeholder:"Client Id",type:t.Store.length?"password":"text"},model:{value:t.AccountsInfo[String(t.Platform)].ClientId,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"ClientId",e)},expression:"AccountsInfo[String(Platform)].ClientId"}})],1),o("FormItem",{attrs:{label:"Client Secret：",prop:"ClientSecret"}},[o("Input",{attrs:{placeholder:"Client Secret",type:t.Store.length?"password":"text"},model:{value:t.AccountsInfo[String(t.Platform)].ClientSecret,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"ClientSecret",e)},expression:"AccountsInfo[String(Platform)].ClientSecret"}})],1),o("FormItem",{attrs:{label:"Warehouse Id：",prop:"WarehouseId"}},[o("Input",{attrs:{placeholder:"Warehouse Id"},model:{value:t.AccountsInfo[String(t.Platform)].WarehouseId,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"WarehouseId",e)},expression:"AccountsInfo[String(Platform)].WarehouseId"}})],1)],1)],1):t._e(),9===t.Platform?o("Col",{attrs:{span:"24"}},[o("Form",{ref:"Store"+t.Platform,attrs:{model:t.AccountsInfo[String(t.Platform)],rules:t.FyndiqRules,"label-width":110}},[o("FormItem",{attrs:{label:"账号：",prop:"StoreName"}},[o("Input",{attrs:{placeholder:"账号名称"},model:{value:t.AccountsInfo[String(t.Platform)].StoreName,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"StoreName",e)},expression:"AccountsInfo[String(Platform)].StoreName"}})],1),o("FormItem",{attrs:{label:"别名：",prop:"Alias"}},[o("Input",{attrs:{placeholder:"账号别名"},model:{value:t.AccountsInfo[String(t.Platform)].Alias,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"Alias",e)},expression:"AccountsInfo[String(Platform)].Alias"}})],1),o("FormItem",{attrs:{label:"Merchant Id：",prop:"MerchantId"}},[o("Input",{attrs:{placeholder:"Merchant Id",type:t.Store.length?"password":"text"},model:{value:t.AccountsInfo[String(t.Platform)].MerchantId,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"MerchantId",e)},expression:"AccountsInfo[String(Platform)].MerchantId"}})],1),o("FormItem",{attrs:{label:"Token：",prop:"Token"}},[o("Input",{attrs:{placeholder:"Token",type:t.Store.length?"password":"text"},model:{value:t.AccountsInfo[String(t.Platform)].Token,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"Token",e)},expression:"AccountsInfo[String(Platform)].Token"}})],1)],1)],1):t._e(),11===t.Platform?o("Col",{attrs:{span:"24"}},[o("Form",{ref:"Store"+t.Platform,attrs:{model:t.AccountsInfo[String(t.Platform)],rules:t.TophatterRules,"label-width":110}},[o("FormItem",{attrs:{label:"账号：",prop:"StoreName"}},[o("Input",{attrs:{placeholder:"账号名称"},model:{value:t.AccountsInfo[String(t.Platform)].StoreName,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"StoreName",e)},expression:"AccountsInfo[String(Platform)].StoreName"}})],1),o("FormItem",{attrs:{label:"别名：",prop:"Alias"}},[o("Input",{attrs:{placeholder:"账号别名"},model:{value:t.AccountsInfo[String(t.Platform)].Alias,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"Alias",e)},expression:"AccountsInfo[String(Platform)].Alias"}})],1),o("FormItem",{attrs:{label:"Access Token：",prop:"AccessToken"}},[o("Input",{attrs:{placeholder:"Access Token",type:t.Store.length?"password":"text"},model:{value:t.AccountsInfo[String(t.Platform)].AccessToken,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"AccessToken",e)},expression:"AccountsInfo[String(Platform)].AccessToken"}})],1)],1)],1):t._e(),13===t.Platform?o("Col",{attrs:{span:"24"}},[o("Form",{ref:"Store"+t.Platform,attrs:{model:t.AccountsInfo[String(t.Platform)],rules:t.VovaRules,"label-width":110}},[o("FormItem",{attrs:{label:"账号：",prop:"StoreName"}},[o("Input",{attrs:{placeholder:"账号名称"},model:{value:t.AccountsInfo[String(t.Platform)].StoreName,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"StoreName",e)},expression:"AccountsInfo[String(Platform)].StoreName"}})],1),o("FormItem",{attrs:{label:"别名：",prop:"Alias"}},[o("Input",{attrs:{placeholder:"账号别名"},model:{value:t.AccountsInfo[String(t.Platform)].Alias,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"Alias",e)},expression:"AccountsInfo[String(Platform)].Alias"}})],1),o("FormItem",{attrs:{label:"Token：",prop:"Token"}},[o("Input",{attrs:{placeholder:"Token",type:t.Store.length?"password":"text"},model:{value:t.AccountsInfo[String(t.Platform)].Token,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"Token",e)},expression:"AccountsInfo[String(Platform)].Token"}})],1),o("FormItem",{attrs:{label:"Platform Id：",prop:"PlatformId"}},[o("Input",{attrs:{placeholder:"Platform Id"},model:{value:t.AccountsInfo[String(t.Platform)].PlatformId,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"PlatformId",e)},expression:"AccountsInfo[String(Platform)].PlatformId"}})],1)],1)],1):t._e(),14===t.Platform?o("Col",{attrs:{span:"24"}},[o("Form",{ref:"Store"+t.Platform,attrs:{model:t.AccountsInfo[String(t.Platform)],rules:t.MyMallRules,"label-width":110}},[o("FormItem",{attrs:{label:"账号：",prop:"StoreName"}},[o("Input",{attrs:{placeholder:"账号名称"},model:{value:t.AccountsInfo[String(t.Platform)].StoreName,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"StoreName",e)},expression:"AccountsInfo[String(Platform)].StoreName"}})],1),o("FormItem",{attrs:{label:"别名：",prop:"Alias"}},[o("Input",{attrs:{placeholder:"账号别名"},model:{value:t.AccountsInfo[String(t.Platform)].Alias,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"Alias",e)},expression:"AccountsInfo[String(Platform)].Alias"}})],1),o("FormItem",{attrs:{label:"UserName：",prop:"UserName"}},[o("Input",{attrs:{placeholder:"UserName"},model:{value:t.AccountsInfo[String(t.Platform)].UserName,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"UserName",e)},expression:"AccountsInfo[String(Platform)].UserName"}})],1),o("FormItem",{attrs:{label:"Password：",prop:"Passwords"}},[o("Input",{attrs:{placeholder:"Password",type:t.Store.length?"password":"text"},model:{value:t.AccountsInfo[String(t.Platform)].Passwords,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"Passwords",e)},expression:"AccountsInfo[String(Platform)].Passwords"}})],1),o("FormItem",{attrs:{label:"Client Id：",prop:"ClientId"}},[o("Input",{attrs:{placeholder:"Client Id",type:t.Store.length?"password":"text"},model:{value:t.AccountsInfo[String(t.Platform)].ClientId,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"ClientId",e)},expression:"AccountsInfo[String(Platform)].ClientId"}})],1),o("FormItem",{attrs:{label:"Client Secret：",prop:"ClientSecret"}},[o("Input",{attrs:{placeholder:"Client Secret",type:t.Store.length?"password":"text"},model:{value:t.AccountsInfo[String(t.Platform)].ClientSecret,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"ClientSecret",e)},expression:"AccountsInfo[String(Platform)].ClientSecret"}})],1)],1)],1):t._e(),16===t.Platform?o("Col",{attrs:{span:"24"}},[o("Form",{ref:"Store"+t.Platform,attrs:{model:t.AccountsInfo[String(t.Platform)],rules:t.JumiaRules,"label-width":90}},[o("FormItem",{attrs:{label:"账号：",prop:"StoreName"}},[o("Input",{attrs:{placeholder:"账号名称"},model:{value:t.AccountsInfo[String(t.Platform)].StoreName,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"StoreName",e)},expression:"AccountsInfo[String(Platform)].StoreName"}})],1),o("FormItem",{attrs:{label:"别名：",prop:"Alias"}},[o("Input",{attrs:{placeholder:"账号别名"},model:{value:t.AccountsInfo[String(t.Platform)].Alias,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"Alias",e)},expression:"AccountsInfo[String(Platform)].Alias"}})],1),o("FormItem",{attrs:{label:"UserId：",prop:"UserId"}},[o("Input",{attrs:{placeholder:"UserId",type:t.Store.length?"password":"text"},model:{value:t.AccountsInfo[String(t.Platform)].UserId,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"UserId",e)},expression:"AccountsInfo[String(Platform)].UserId"}})],1),o("FormItem",{attrs:{label:"APIKey：",prop:"APIKey"}},[o("Input",{attrs:{placeholder:"APIKey",type:t.Store.length?"password":"text"},model:{value:t.AccountsInfo[String(t.Platform)].APIKey,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"APIKey",e)},expression:"AccountsInfo[String(Platform)].APIKey"}})],1),o("FormItem",{attrs:{label:"站点：",prop:"SiteType"}},[o("Select",{attrs:{placeholder:"站点",options:t.JumiaSiteDrop},model:{value:t.AccountsInfo[String(t.Platform)].SiteType,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"SiteType",e)},expression:"AccountsInfo[String(Platform)].SiteType"}})],1)],1)],1):t._e(),18===t.Platform?o("Col",{attrs:{span:"24"}},[o("Form",{ref:"Store"+t.Platform,attrs:{model:t.AccountsInfo[String(t.Platform)],rules:t.LazadaRules,"label-width":110}},[o("FormItem",{attrs:{label:"账号：",prop:"StoreName"}},[o("Input",{attrs:{placeholder:"账号名称"},model:{value:t.AccountsInfo[String(t.Platform)].StoreName,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"StoreName",e)},expression:"AccountsInfo[String(Platform)].StoreName"}})],1),o("FormItem",{attrs:{label:"别名：",prop:"Alias"}},[o("Input",{attrs:{placeholder:"账号别名"},model:{value:t.AccountsInfo[String(t.Platform)].Alias,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"Alias",e)},expression:"AccountsInfo[String(Platform)].Alias"}})],1),o("FormItem",{attrs:{label:"站点：",prop:"LazadaSiteType"}},[t._v(" "+t._s(t.$Enums.Sales.LazadaSiteType[t.AccountsInfo[String(t.Platform)].LazadaSiteType])+" ")])],1)],1):t._e(),19===t.Platform?o("Col",{attrs:{span:"24"}},[o("Form",{ref:"Store"+t.Platform,attrs:{model:t.AccountsInfo[String(t.Platform)],rules:t.GrouponRules,"label-width":110}},[o("FormItem",{attrs:{label:"账号：",prop:"StoreName"}},[o("Input",{attrs:{placeholder:"账号名称"},model:{value:t.AccountsInfo[String(t.Platform)].StoreName,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"StoreName",e)},expression:"AccountsInfo[String(Platform)].StoreName"}})],1),o("FormItem",{attrs:{label:"别名：",prop:"Alias"}},[o("Input",{attrs:{placeholder:"账号别名"},model:{value:t.AccountsInfo[String(t.Platform)].Alias,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"Alias",e)},expression:"AccountsInfo[String(Platform)].Alias"}})],1),o("FormItem",{attrs:{label:"Supplier ID：",prop:"SupplierId"}},[o("Input",{attrs:{placeholder:"SupplierId"},model:{value:t.AccountsInfo[String(t.Platform)].SupplierId,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"SupplierId",e)},expression:"AccountsInfo[String(Platform)].SupplierId"}})],1),o("FormItem",{attrs:{label:"Token：",prop:"Token"}},[o("Input",{attrs:{placeholder:"Token"},model:{value:t.AccountsInfo[String(t.Platform)].Token,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"Token",e)},expression:"AccountsInfo[String(Platform)].Token"}})],1)],1)],1):t._e(),20===t.Platform?o("Col",{attrs:{span:"24"}},[o("Form",{ref:"Store"+t.Platform,attrs:{model:t.AccountsInfo[String(t.Platform)],rules:t.RealDeRules,"label-width":110}},[o("FormItem",{attrs:{label:"账号：",prop:"StoreName"}},[o("Input",{attrs:{placeholder:"账号名称"},model:{value:t.AccountsInfo[String(t.Platform)].StoreName,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"StoreName",e)},expression:"AccountsInfo[String(Platform)].StoreName"}})],1),o("FormItem",{attrs:{label:"别名：",prop:"Alias"}},[o("Input",{attrs:{placeholder:"账号别名"},model:{value:t.AccountsInfo[String(t.Platform)].Alias,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"Alias",e)},expression:"AccountsInfo[String(Platform)].Alias"}})],1),o("FormItem",{attrs:{label:"Client Key：",prop:"ClientId"}},[o("Input",{attrs:{placeholder:"Client Key",type:this.Store.length&&this.Store[0].Id?"password":"text"},model:{value:t.AccountsInfo[String(t.Platform)].ClientId,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"ClientId",e)},expression:"AccountsInfo[String(Platform)].ClientId"}})],1),o("FormItem",{attrs:{label:"Secret Key：",prop:"ClientSecret"}},[o("Input",{attrs:{placeholder:"Secret Key",type:this.Store.length&&this.Store[0].Id?"password":"text"},model:{value:t.AccountsInfo[String(t.Platform)].ClientSecret,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"ClientSecret",e)},expression:"AccountsInfo[String(Platform)].ClientSecret"}})],1)],1)],1):t._e(),21===t.Platform?o("Col",{attrs:{span:"24"}},[o("Form",{ref:"Store"+t.Platform,attrs:{model:t.AccountsInfo[String(t.Platform)],rules:t.RakutenRules,"label-width":110}},[o("FormItem",{attrs:{label:"账号：",prop:"StoreName"}},[o("Input",{attrs:{placeholder:"账号名称"},model:{value:t.AccountsInfo[String(t.Platform)].StoreName,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"StoreName",e)},expression:"AccountsInfo[String(Platform)].StoreName"}})],1),o("FormItem",{attrs:{label:"别名：",prop:"Alias"}},[o("Input",{attrs:{placeholder:"账号别名"},model:{value:t.AccountsInfo[String(t.Platform)].Alias,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"Alias",e)},expression:"AccountsInfo[String(Platform)].Alias"}})],1),o("FormItem",{attrs:{label:"Key：",prop:"Key"}},[o("Input",{attrs:{placeholder:"Key",type:this.Store.length&&this.Store[0].Id?"password":"text"},model:{value:t.AccountsInfo[String(t.Platform)].Key,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"Key",e)},expression:"AccountsInfo[String(Platform)].Key"}})],1)],1)],1):t._e(),22===t.Platform?o("Col",{attrs:{span:"24"}},[o("Form",{ref:"Store"+t.Platform,attrs:{model:t.AccountsInfo[String(t.Platform)],rules:t.NeweggRules,"label-width":110}},[o("FormItem",{attrs:{label:"账号：",prop:"StoreName"}},[o("Input",{attrs:{placeholder:"账号名称"},model:{value:t.AccountsInfo[String(t.Platform)].StoreName,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"StoreName",e)},expression:"AccountsInfo[String(Platform)].StoreName"}})],1),o("FormItem",{attrs:{label:"别名：",prop:"Alias"}},[o("Input",{attrs:{placeholder:"账号别名"},model:{value:t.AccountsInfo[String(t.Platform)].Alias,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"Alias",e)},expression:"AccountsInfo[String(Platform)].Alias"}})],1),o("FormItem",{attrs:{label:"Seller Id：",prop:"SellerId"}},[o("Input",{attrs:{placeholder:"Seller Id",type:this.Store.length&&this.Store[0].Id?"password":"text"},model:{value:t.AccountsInfo[String(t.Platform)].SellerId,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"SellerId",e)},expression:"AccountsInfo[String(Platform)].SellerId"}})],1),o("FormItem",{attrs:{label:"Secret Key：",prop:"SecretKey"}},[o("Input",{attrs:{placeholder:"Secret Key",type:this.Store.length&&this.Store[0].Id?"password":"text"},model:{value:t.AccountsInfo[String(t.Platform)].SecretKey,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"SecretKey",e)},expression:"AccountsInfo[String(Platform)].SecretKey"}})],1)],1)],1):t._e(),99===t.Platform?o("Col",{attrs:{span:"24"}},[o("Form",{ref:"Store"+t.Platform,attrs:{model:t.AccountsInfo[String(t.Platform)],rules:t.OtherRules,"label-width":110}},[o("FormItem",{attrs:{label:"账号：",prop:"StoreName"}},[o("Input",{attrs:{placeholder:"账号名称"},model:{value:t.AccountsInfo[String(t.Platform)].StoreName,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"StoreName",e)},expression:"AccountsInfo[String(Platform)].StoreName"}})],1),o("FormItem",{attrs:{label:"别名：",prop:"Alias"}},[o("Input",{attrs:{placeholder:"账号别名"},model:{value:t.AccountsInfo[String(t.Platform)].Alias,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"Alias",e)},expression:"AccountsInfo[String(Platform)].Alias"}})],1),o("FormItem",{attrs:{label:"佣金比例(%)：",prop:"CommissionRate"}},[o("Input",{attrs:{placeholder:"佣金比例(%)"},model:{value:t.AccountsInfo[String(t.Platform)].CommissionRate,callback:function(e){t.$set(t.AccountsInfo[String(t.Platform)],"CommissionRate",e)},expression:"AccountsInfo[String(Platform)].CommissionRate"}})],1)],1)],1):t._e()],1),o("Row",{attrs:{slot:"footer"},slot:"footer"},[o("Button",{attrs:{type:"primary"},on:{click:t.Validate}},[t._v("提交")]),o("Button",{on:{click:function(e){return t.CancelAccount(!1)}}},[t._v("取消")])],1)],1)],1)},a=[],n=(o("0a9c"),o("4d62"),o("6ed5"),o("e8f2"),o("b916"),o("d088"),o("e24e")),l=o("3231"),s=o("064d"),c=o("46d7"),i=o("631e"),m=o("4a81"),u=o("d11d"),f=o("a349"),S=o("9550"),p=function(t){Object(c["a"])(o,t);var e=Object(i["a"])(o);function o(){var t;return Object(l["a"])(this,o),t=e.apply(this,arguments),t.AccountModal=!1,t.AccountsInfo=new S["a"].AllStore,t.Store=[],t.EnableDrop=t.$Utils.GetEnumArr(t.$Enums.Public.Enable),t.EabyLoginSite=[{Key:"美国",Value:"https://signin.ebay.com/ws/eBayISAPI.dll?SignIn"},{Key:"英国",Value:"https://signin.ebay.co.uk/ws/eBayISAPI.dll?SignIn"},{Key:"德国",Value:"https://signin.eBay.de/ws/eBayISAPI.dll?SignIn"},{Key:"澳大利亚",Value:"https://signin.ebay.com.au/ws/eBayISAPI.dll?SignIn"},{Key:"加拿大",Value:"https://signin.ebay.ca/ws/eBayISAPI.dll?SignIn"},{Key:"意大利",Value:"https://signin.ebay.it/ws/eBayISAPI.dll?SignIn"},{Key:"法国",Value:"https://signin.ebay.fr/ws/eBayISAPI.dll?SignIn"},{Key:"西班牙",Value:"https://signin.ebay.es/ws/eBayISAPI.dll?SignIn"},{Key:"香港",Value:"https://signin.ebay.com.hk/ws/eBayISAPI.dll"},{Key:"新加坡",Value:"https://signin.ebay.com.sg/ws/eBayISAPI.dll"}],t.EbayRules={StoreName:[{required:!0,message:"请输入账号名称"}],Alias:[{required:!0,message:"请输入账号别名"}],PaypalAccountId:[{required:!0,message:"请选择Paypal账号",trigger:"change",type:"number"}],IsUseApi:[{required:!0,message:"请选择API状态",trigger:"change",type:"number"}],InvoiceCurrency:[{required:!0,message:"请选择账单币种",trigger:"change"}],Password:[{required:!0,message:"请输入登录密码"}],JumpAddr:[{required:!0,message:"请选择登录站点",trigger:"change",type:"array"}]},t.EbayLoginPwd="",t.WishRules={StoreName:[{required:!0,message:"请输入账号名称"}],Alias:[{required:!0,message:"请输入账号别名"}]},t.AmazonSiteDrop=[{Value:"ATVPDKIKX0DER",Key:"美国"},{Value:"A1F83G8C2ARO7P",Key:"英国"},{Value:"A1PA6795UKMFR9",Key:"德国"},{Value:"A13V1IB3VIYZZH",Key:"法国"},{Value:"APJ6JRA9NG5V4",Key:"意大利"},{Value:"A1RKKUPIHCS9HS",Key:"西班牙"},{Value:"A2EUQ1WTGCTBG2",Key:"加拿大"},{Value:"A1VC38T7YXB528",Key:"日本"},{Value:"A1AM78C64UM0Y8",Key:"墨西哥"},{Value:"A39IBJ37TRP1C6",Key:"澳大利亚"}],t.AmazonRules={StoreName:[{required:!0,message:"请输入账号名称"}],Alias:[{required:!0,message:"请输入账号别名"}],SellerId:[{required:!0,message:"请输入卖家ID"}],MWSAuthToken:[{required:!0,message:"请输入MWS授权令牌"}],SiteCode:[{required:!0,message:"请选择站点",trigger:"change",type:"array"}]},t.ShopeeSiteDrop=t.$Utils.GetEnumArr(t.$Enums.Sales.ShopeeSiteType),t.ShopeeRules={StoreName:[{required:!0,message:"请输入账号名称"}],Alias:[{required:!0,message:"请输入账号别名"}],ShopId:[{required:!0,message:"请输入ShopId"}],Site:[{required:!0,message:"请选择站点",trigger:"change"}]},t.WalmartRules={StoreName:[{required:!0,message:"请输入账号名称"}],Alias:[{required:!0,message:"请输入账号别名"}],ClientId:[{required:!0,message:"请输入ClientId"}],ClientSecret:[{required:!0,message:"请输入Client Secret"}]},t.CdiscountRules={StoreName:[{required:!0,message:"请输入账号名称"}],Alias:[{required:!0,message:"请输入账号别名"}],ApiLogin:[{required:!0,message:"请输入Api Login"}],ApiPassword:[{required:!0,message:"请输入Api Password"}]},t.JoomRules={StoreName:[{required:!0,message:"请输入账号名称"}],Alias:[{required:!0,message:"请输入账号别名"}],ClientId:[{required:!0,message:"请输入ClientId"}],ClientSecret:[{required:!0,message:"请输入Client Secret"}],WarehouseId:[{required:!0,message:"请输入WarehouseId"}]},t.FyndiqRules={StoreName:[{required:!0,message:"请输入账号名称"}],Alias:[{required:!0,message:"请输入账号别名"}],MerchantId:[{required:!0,message:"请输入Merchant Id"}],Token:[{required:!0,message:"请输入Token"}]},t.TophatterRules={StoreName:[{required:!0,message:"请输入账号名称"}],Alias:[{required:!0,message:"请输入账号别名"}],AccessToken:[{required:!0,message:"请输入Access Token"}]},t.VovaRules={StoreName:[{required:!0,message:"请输入账号名称"}],Alias:[{required:!0,message:"请输入账号别名"}],Token:[{required:!0,message:"请输入Token"}]},t.MyMallRules={StoreName:[{required:!0,message:"请输入账号名称"}],Alias:[{required:!0,message:"请输入账号别名"}],Passwords:[{required:!0,message:"请输入Password"}],ClientId:[{required:!0,message:"请输入ClientId"}],ClientSecret:[{required:!0,message:"请输入Client Secret"}]},t.JumiaSiteDrop=t.$Utils.GetEnumArr(t.$Enums.Sales.JumiaSiteType),t.JumiaRules={StoreName:[{required:!0,message:"请输入账号名称"}],Alias:[{required:!0,message:"请输入账号别名"}],UserId:[{required:!0,message:"请输入UserId"}],APIKey:[{required:!0,message:"请输入APIKey"}],SiteType:[{required:!0,message:"请选择站点",type:"number",trigger:"change"}]},t.LazadaRules={StoreName:[{required:!0,message:"请输入账号名称"}],Alias:[{required:!0,message:"请输入账号别名"}]},t.GrouponRules={StoreName:[{required:!0,message:"请输入账号名称"}],Alias:[{required:!0,message:"请输入账号别名"}],SupplierId:[{required:!0,message:"请输入SupplierId"}],Token:[{required:!0,message:"请输入Token"}]},t.RealDeRules={StoreName:[{required:!0,message:"请输入账号名称"}],Alias:[{required:!0,message:"请输入账号别名"}],ClientId:[{required:!0,message:"请输入Client Key"}],ClientSecret:[{required:!0,message:"请输入Secret Key"}]},t.RakutenRules={StoreName:[{required:!0,message:"请输入账号名称"}],Alias:[{required:!0,message:"请输入别名"}],Key:[{required:!0,message:"请输入Key"}]},t.NeweggRules={StoreName:[{required:!0,message:"请输入账号名称"}],Alias:[{required:!0,message:"请输入别名"}],SellerId:[{required:!0,message:"请输入Seller Id"}],SecretKey:[{required:!0,message:"请输入Secret Key"}]},t.OtherRules={StoreName:[{required:!0,message:"请输入账号名称"}],Alias:[{required:!0,message:"请输入账号别名"}],CommissionRate:[{required:!0,message:"请输入佣金比例"}]},t}return Object(s["a"])(o,[{key:"EmitModify",value:function(t){}},{key:"CalculateCreate",value:function(){return[this.Powers.EbayStoreAdd,this.Powers.WishStoreAdd,this.Powers.AmazonStoreCreate,this.Powers.ShopeeStoreAdd,this.Powers.walmartStoreCreate,this.Powers.CdiscountStoreCreate,this.Powers.JoomStoreAdd,this.Powers.FyndiqStoreCreate,this.Powers.TopBuyCreate,this.Powers.TophatterStoreCreate,this.Powers.FactoryMarketStoreCreate,this.Powers.vovaStoreCreate,this.Powers.MymallStoreCreate,this.Powers.JumiaStoreAdd,this.Powers.AllegroStoreSave,this.Powers.LazadaStoreSave,this.Powers.GrouponStoreInsert,this.Powers.SaveRealDeStore,this.Powers.SaveRakutenStore,this.Powers.SaveNeweggStore,this.Powers.OtherStoreCreate].some((function(t){return!0===t}))}},{key:"TriggerAccount",value:function(t){if(this.$set(this,"Store",[t]),this.CURRENCY_DROP.length||1!==this.Platform||this["Base/UPDATE_BASE_INFO"]("CURRENCY",""),this.Store[0].Id)this.$set(this.AccountsInfo,String(this.Platform),this.Store[0]),1===this.Platform&&(this.$set(this.AccountsInfo[String(this.Platform)],"IsUseApi",this.AccountsInfo[String(this.Platform)].IsUseApi?1:0),this.$set(this.AccountsInfo[String(this.Platform)],"JumpAddr",this.AccountsInfo[String(this.Platform)].JumpAddr.split(",")),this.$set(this,"EbayLoginPwd",this.AccountsInfo[String(this.Platform)].Password),this.$set(this.AccountsInfo[String(this.Platform)],"Password",""),this.$set(this.EbayRules.Password[0],"required",!1)),3===this.Platform&&this.$set(this.AccountsInfo[String(this.Platform)],"SiteCode",this.AccountsInfo[String(this.Platform)].SiteCode.split(","));else if(18===this.Platform)return void this.LazadaAuthorization();this.$set(this,"AccountModal",!0)}},{key:"Validate",value:function(){var t=this;this.$refs["Store".concat(this.Platform)].validate((function(e){if(e){t.$UI.Loading.Show();var o=t.GetStorePostData();t.$Request.Post({Server:t.$Server.Sales,Api:{Address:0!==o.Id?t.$Api.Sales[t.Platform].StoreModify:t.$Api.Sales[t.Platform].StoreCreate,Login:!0},Data:o,Callback:function(e){e.IsSuccess?(t.$UI.Tips.Floating("success",0!==o.Id?"编辑账号成功":"添加账号成功"),e.Data.Url&&window.open(e.Data.Url,"_blank"),t.CancelAccount(!0)):(t.$UI.Loading.Hide(),t.$Request.Error(e))}})}}))}},{key:"GetStorePostData",value:function(){var t=JSON.parse(JSON.stringify(this.AccountsInfo[String(this.Platform)]));if(1===this.Platform&&(t.Password=""===t.Password?this.EbayLoginPwd:this.$Utils.Encrypt(t.Password),t.JumpAddr=t.JumpAddr.join(","),t.IsUseApi=Boolean(t.IsUseApi)),3===this.Platform){t.SiteName="";var e,o=Object(n["a"])(this.AmazonSiteDrop);try{var r=function(){var o=e.value;t.SiteCode.some((function(t){return t===o.Value}))&&(t.SiteName+="".concat(o.Key,","))};for(o.s();!(e=o.n()).done;)r()}catch(a){o.e(a)}finally{o.f()}t.SiteCode=t.SiteCode.join(","),t.SiteName=t.SiteName.slice(0,-1)}return delete t._index,delete t._rowKey,t}},{key:"LazadaAuthorization",value:function(){var t=this;this.$UI.Loading.Show(),this.$Request.Post({Server:this.$Server.Sales,Api:{Address:this.$Api.Sales["18"].Authorization,Login:!0},Data:"",Callback:function(e){t.$UI.Loading.Hide(),e.IsSuccess?window.open(e.Data.Url,"_blank"):t.$Request.Error(e)}})}},{key:"CancelAccount",value:function(t){var e=this;this.AccountsInfo=new S["a"].AllStore,this.EbayLoginPwd="",this.$nextTick((function(){e.$refs["Store".concat(e.Platform)].resetFields(),e.$set(e,"AccountModal",!1),t&&e.EmitModify(t)}))}},{key:"CURRENCY_DROP",get:function(){return this["Base/CURRENCY_DROP"]}}]),o}(u["d"]);m["a"]([f["a"]],p.prototype,"Base/UPDATE_BASE_INFO",void 0),m["a"]([f["b"]],p.prototype,"Base/CURRENCY_DROP",void 0),m["a"]([Object(u["c"])()],p.prototype,"Powers",void 0),m["a"]([Object(u["c"])(Number)],p.prototype,"Platform",void 0),m["a"]([Object(u["c"])(Array)],p.prototype,"PaypalDrop",void 0),m["a"]([Object(u["b"])()],p.prototype,"EmitModify",null),p=m["a"]([Object(u["a"])({name:"ModifyStore"})],p);var I=p,d=I,A=o("4023"),g=Object(A["a"])(d,r,a,!1,null,null,null);e["default"]=g.exports}}]);