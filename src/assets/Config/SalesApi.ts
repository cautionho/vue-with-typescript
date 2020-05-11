export default {
  // eBay
  1: {
    StoreList: '/api/EbayStore/GetList',
    StoreSaler: '/api/EbayStore/GetStoreSaler',
    StoreCreate: '/api/EbayStore/Create', //添加店铺
    StoreModify: '/api/EbayStore/Modify', //编辑店铺
    StoreApi: '/api/EbayStore/ChangeUseApi', //启停API
    StoreStatus: '/api/EbayStore/ChangeStatus', //启停店铺
    CreateStoreSaler: '/api/EbayStore/CreateStoreSaler', //绑定授权用户
    StoreDrop: '/api/EbayStore/DropList', //获取ebay可用店铺下拉列表
    Sites: '/api/EbayData/EbaySites', //获取ebay站点下拉列表
    ShippingService: '/api/EbayData/EbayShippingService', //获取ebay站点下的运输服务
    BindRedisDb: '/api/EbayStore/SaveStoreBindingRedisDb', //绑定 ebay店铺和redisDB
    DisputedDetails: '/api/AfterSale/EbayDetail', // 订单详情售后详情
  },

  // Wish
  2: {
    StoreList: '/api/WishStore/GetList', //获取分页列表
    StoreSaler: '/api/WishStore/GetStoreSaler', //获取授权用户
    StoreCreate: '/api/WishStore/Create', //添加店铺
    StoreModify: '/api/WishStore/Modify', //编辑店铺
    StoreApi: '/api/WishStore/ChangeUseApi', //启停API
    StoreStatus: '/api/WishStore/ChangeStatus', //启停店铺
    CreateStoreSaler: '/api/WishStore/CreateStoreSaler', //绑定授权用户
    StoreDrop: '/api/WishStore/DropList', //获取wish可用店铺下拉列表
    DisputedDetails: '/api/AfterSale/WishDetail'
  },

  // Amazon
  3: {
    StoreList: '/api/AmazonStore/GetList', //获取分页列表
    StoreDrop: '/api/AmazonStore/DropList', //获取可用店铺下拉列表
    StoreSaler: '/api/AmazonStore/GetStoreSaler', //获取授权用户
    CreateStoreSaler: '/api/AmazonStore/CreateStoreSaler', //绑定授权用户
    StoreCreate: '/api/AmazonStore/Create', //添加账号
    StoreModify: '/api/AmazonStore/Modify', //编辑账号
    StoreApi: '/api/AmazonStore/ChangeUseApi', //启停api
    StoreStatus: '/api/AmazonStore/ChangeStatus', //启停账号
    DisputedDetails: '/api/AfterSale/WishDetail'
  },

  // Shopee
  4: {
    StoreList: '/api/ShopeeStore/GetList', //获取分页列表
    StoreDrop: '/api/ShopeeStore/DropList', //获取可用店铺下拉列表
    StoreSaler: '/api/ShopeeStore/GetStoreSaler', //获取授权用户
    CreateStoreSaler: '/api/ShopeeStore/CreateStoreSaler', //绑定授权用户
    StoreCreate: '/api/ShopeeStore/Create', //添加账号
    StoreModify: '/api/ShopeeStore/Modify', //编辑账号
    StoreApi: '/api/ShopeeStore/ChangeUseApi', //启停api
    StoreStatus: '/api/ShopeeStore/ChangeStatus', //启停账号
    DisputedDetails: '/api/AfterSale/ShopeeDetail'
  },

  // Walmart
  5: {
    StoreList: '/api/WalmartStore/GetList', //获取分页列表
    StoreDrop: '/api/WalmartStore/DropList', //获取可用店铺下拉列表
    StoreSaler: '/api/WalmartStore/GetStoreSaler', //获取授权用户
    CreateStoreSaler: '/api/WalmartStore/CreateStoreSaler', //绑定授权用户
    StoreCreate: '/api/WalmartStore/Create', //添加账号
    StoreModify: '/api/WalmartStore/Modify', //编辑账号
    StoreApi: '/api/WalmartStore/ChangeUseApi', //启停api
    StoreStatus: '/api/WalmartStore/ChangeStatus', //启停账号
    DisputedDetails: '/api/AfterSale/WishDetail'
  },

  // Cdiscount
  6: {
    StoreList: '/api/CdiscountStore/GetList', //获取分页列表
    StoreDrop: '/api/CdiscountStore/DropList', //获取可用店铺下拉列表
    StoreSaler: '/api/CdiscountStore/GetStoreSaler', //获取授权用户
    CreateStoreSaler: '/api/CdiscountStore/CreateStoreSaler', //绑定授权用户
    StoreCreate: '/api/CdiscountStore/Create', //添加账号
    StoreModify: '/api/CdiscountStore/Modify', //编辑账号
    StoreApi: '/api/CdiscountStore/ChangeUseApi', //启停api
    StoreStatus: '/api/CdiscountStore/ChangeStatus', //启停账号
    StoreDetails: '/api/CdiscountStore/Details',
    DisputedDetails: '/api/AfterSale/WishDetail'
  },

  // 速卖通
  7: {},

  // Joom
  8: {
    StoreList: '/api/JoomStore/GetList', //获取分页列表
    StoreDrop: '/api/JoomStore/DropList', //获取可用店铺下拉列表
    StoreSaler: '/api/JoomStore/GetStoreSaler', //获取授权用户
    CreateStoreSaler: '/api/JoomStore/CreateStoreSaler', //绑定授权用户
    StoreCreate: '/api/JoomStore/Create', //添加账号
    StoreModify: '/api/JoomStore/Modify', //编辑账号
    StoreApi: '/api/JoomStore/ChangeUseApi', //启停api
    StoreStatus: '/api/JoomStore/ChangeStatus', //启停账号
    DisputedDetails: '/api/AfterSale/WishDetail'
  },

  // Fyndiq
  9: {
    StoreList: '/api/FyndiqStore/GetList', //获取分页列表
    StoreDrop: '/api/FyndiqStore/DropList', //获取可用店铺下拉列表
    StoreSaler: '/api/FyndiqStore/GetStoreSaler', //获取授权用户
    CreateStoreSaler: '/api/FyndiqStore/CreateStoreSaler', //绑定授权用户
    StoreCreate: '/api/FyndiqStore/Create', //添加账号
    StoreModify: '/api/FyndiqStore/Modify', //编辑账号
    StoreApi: '/api/FyndiqStore/ChangeUseApi', //启停api
    StoreStatus: '/api/FyndiqStore/ChangeStatus', //启停账号
    ImportProduct: '/api/Fyndiq/ImportFeedProduct', //导入产品cvs文件流转txt存入url(指定目录)
    DisputedDetails: '/api/AfterSale/WishDetail'
  },

  // Topbuy
  10: {
    StoreList: '/api/TopbuyStore/GetList', //获取分页列表
    StoreDrop: '/api/TopbuyStore/DropList', //获取可用店铺下拉列表
    StoreSaler: '/api/TopbuyStore/GetStoreSaler', //获取授权用户
    CreateStoreSaler: '/api/TopbuyStore/CreateStoreSaler', //绑定授权用户
    StoreCreate: '/api/TopbuyStore/Create', //添加账号
    StoreModify: '/api/TopbuyStore/Modify', //编辑账号
    StoreApi: '/api/TopbuyStore/ChangeUseApi', //启停api
    StoreStatus: '/api/TopbuyStore/ChangeStatus', //启停账号
    DisputedDetails: '/api/AfterSale/WishDetail'
  },

  // Tophatter
  11: {
    StoreList: '/api/TophatterStore/GetList', //获取分页列表
    StoreDrop: '/api/TophatterStore/DropList', //获取可用店铺下拉列表
    StoreSaler: '/api/TophatterStore/GetStoreSaler', //获取授权用户
    CreateStoreSaler: '/api/TophatterStore/CreateStoreSaler', //绑定授权用户
    StoreCreate: '/api/TophatterStore/Create', //添加账号
    StoreModify: '/api/TophatterStore/Modify', //编辑账号
    StoreApi: '/api/TophatterStore/ChangeUseApi', //启停api
    StoreStatus: '/api/TophatterStore/ChangeStatus', //启停账号
    DisputedDetails: '/api/AfterSale/WishDetail'
  },

  // FactoryMarket
  12: {
    StoreList: '/api/FactoryMarketStore/GetList', //获取分页列表
    StoreDrop: '/api/FactoryMarketStore/DropList', //获取可用店铺下拉列表
    StoreSaler: '/api/FactoryMarketStore/GetStoreSaler', //获取授权用户
    CreateStoreSaler: '/api/FactoryMarketStore/CreateStoreSaler', //绑定授权用户
    StoreCreate: '/api/FactoryMarketStore/Create', //添加账号
    StoreModify: '/api/FactoryMarketStore/Modify', //编辑账号
    StoreApi: '/api/FactoryMarketStore/ChangeUseApi', //启停api
    StoreStatus: '/api/FactoryMarketStore/ChangeStatus', //启停账号
    DisputedDetails: '/api/AfterSale/WishDetail'
  },

  // Vova
  13: {
    StoreList: '/api/VovaStore/GetList', //获取分页列表
    StoreDrop: '/api/VovaStore/DropList', //获取可用店铺下拉列表
    StoreSaler: '/api/VovaStore/GetStoreSaler', //获取授权用户
    CreateStoreSaler: '/api/VovaStore/CreateStoreSaler', //绑定授权用户
    StoreCreate: '/api/VovaStore/Create', //添加账号
    StoreModify: '/api/VovaStore/Modify', //编辑账号
    StoreApi: '/api/VovaStore/ChangeUseApi', //启停api
    StoreStatus: '/api/VovaStore/ChangeStatus', //启停账号
    DisputedDetails: '/api/AfterSale/WishDetail'
  },

  // MyMall
  14: {
    StoreList: '/api/MymallStore/GetList', //获取分页列表
    StoreDrop: '/api/MymallStore/DropList', //获取可用店铺下拉列表
    StoreSaler: '/api/MymallStore/GetStoreSaler', //获取授权用户
    CreateStoreSaler: '/api/MymallStore/CreateStoreSaler', //绑定授权用户
    StoreCreate: '/api/MymallStore/Create', //添加账号
    StoreModify: '/api/MymallStore/Modify', //编辑账号
    StoreApi: '/api/MymallStore/ChangeUseApi', //启停api
    StoreStatus: '/api/MymallStore/ChangeStatus', //启停账号
    DisputedDetails: '/api/AfterSale/WishDetail'
  },

  // Jumia
  16: {
    StoreList: '/api/JumiaStore/GetList', //获取列表
    StoreDrop: '/api/JumiaStore/DropList', //下拉列表
    StoreCreate: '/api/JumiaStore/Create', //创建账号
    StoreModify: '/api/JumiaStore/Modify', //编辑账号
    StoreApi: '/api/JumiaStore/ChangeUseApi', //启禁用API
    StoreStatus: '/api/JumiaStore/ChangeStatus', //启禁用账号
    StoreSaler: '/api/JumiaStore/ChangeStatus', //获取授权用户
    DisputedDetails: '/api/AfterSale/WishDetail'
  },

  // Allegro
  17: {
    StoreList: '/api/AllegroStore/GetList', //获取列表
    StoreDrop: '/api/AllegroStore/DropList', //获取店铺下拉
    StoreSaler: '/api/AllegroStore/GetStoreSaler', //获取授权用户
    StoreCreate: '/api/AllegroStore/Save', //添加编辑账号
    StoreModify: '/api/AllegroStore/Save', //添加编辑账号
    StoreApi: '/api/AllegroStore/ChangeUseApi', //启禁用API
    StoreStatus: '/api/AllegroStore/ChangeStatus', //启禁用账号
    StoreLocation: '/api/AllegroStore/GetStoreLocation', // 15.1.7.获取运输设置
    ChangeStoreLocation: '/api/AllegroStore/ChangeStoreLocation', // 编辑运输设置
    DisputedDetails: '/api/AfterSale/WishDetail'
  },

  // Lazada
  18: {
    StoreList: '/api/LazadaStore/GetList', //获取列表
    StoreDrop: '/api/LazadaStore/DropList', //获取店铺下拉
    StoreSaler: '/api/LazadaStore/GetStoreSaler', //获取授权用户
    StoreCreate: '/api/LazadaStore/Save', //添加编辑账号
    StoreModify: '/api/LazadaStore/Save', //添加编辑账号
    StoreApi: '/api/LazadaStore/ChangeUseApi', //启禁用API
    StoreStatus: '/api/LazadaStore/ChangeStatus', //启禁用账号
    Authorization: '/api/LazadaStore/AuthorizationAccount',
    DisputedDetails: '/api/AfterSale/WishDetail'
  },

  // Groupon
  19: {
    StoreList: '/api/GrouponStore/GetList', //获取列表
    StoreDrop: '/api/GrouponStore/DropList', //获取店铺下拉
    StoreSaler: '/api/LazadaStore/GetStoreSaler', //获取授权用户
    StoreCreate: '/api/GrouponStore/InsertStore', //添加账号
    StoreModify: '/api/GrouponStore/UpdateStore', //编辑账号
    StoreApi: '/api/GrouponStore/ChangeUseApi', //启禁用API
    StoreStatus: '/api/GrouponStore/ChangeStatus', //启禁用账号
    DisputedDetails: '/api/AfterSale/WishDetail'
  },

  // Real.de
  20: {
    StoreList: '/api/RealDeStore/GetList', //获取列表
    StoreDrop: '/api/RealDeStore/DropList', //获取店铺下拉
    StoreSaler: '/api/RealDeStore/GetStoreSaler', //获取授权用户
    StoreCreate: '/api/RealDeStore/Save', //添加账号
    StoreModify: '/api/RealDeStore/Save', //编辑账号
    StoreApi: '/api/RealDeStore/ChangeUseApi', //启禁用API
    StoreStatus: '/api/RealDeStore/ChangeStatus', //启禁用账号
    DisputedDetails: '/api/AfterSale/WishDetail'
  },

  // 德国乐天
  21: {
    StoreList: '/api/RakutenStore/GetList', //获取店铺分页列表
    StoreCreate: '/api/RakutenStore/Save', //添加编辑账号
    StoreModify: '/api/RakutenStore/Save', //添加编辑账号
    StoreStatus: '/api/RakutenStore/ChangeStatus', //启停账号
    StoreApi: '/api/RakutenStore/ChangeUseApi', //1.启停API
    StoreDrop: '/api/RakutenStore/DropList' //.获得可用店铺下拉列表
  },

  // 新蛋
  22: {
    StoreList: '/api/NeweggStore/GetList', //获取店铺分页列表
    StoreCreate: '/api/NeweggStore/Save', //添加编辑账号
    StoreModify: '/api/NeweggStore/Save', //添加编辑账号
    StoreStatus: '/api/NeweggStore/ChangeStatus', //启停账号
    StoreApi: '/api/NeweggStore/ChangeUseApi', //1.启停API
    StoreDrop: '/api/NeweggStore/DropList' //.获得可用店铺下拉列表
  },

  // 其他
  99: {
    StoreList: '/api/OtherStore/GetList', //获取分页列表
    StoreDrop: '/api/OtherStore/DropList', //获取可用店铺下拉
    StoreSaler: '/api/OtherStore/GetStoreSaler', //获取授权用户
    CreateStoreSaler: '/api/OtherStore/CreateStoreSaler', //绑定授权用户
    StoreCreate: '/api/OtherStore/Create', //添加账号
    StoreModify: '/api/OtherStore/Modify', //编辑账号
    StoreStatus: '/api/OtherStore/ChangeStatus', //启停账号
    DisputedDetails: '/api/AfterSale/WishDetail'
  }

}