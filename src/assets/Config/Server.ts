const ApiServer = 'http://192.168.11.220'
const SalesServer = 'http://192.168.11.221'
const FileServer = 'http://192.168.11.235'

// export const File = `${FileServer}:8888` 
export const File = `https://file.frler.com` 
export const Warehouse = `${ApiServer}:84`

export default {
  File: File, // 文件服务器
  Settings: `${ApiServer}:81`, //配置模块服务器
  Admin: `${ApiServer}:82`, //人事模块服务器
  Purchase: `${ApiServer}:83`, //采购模块
  Warehouse: Warehouse, // 仓储模块
  Finance: `${ApiServer}:85`, //财务模块
  Logistics: `${ApiServer}:89`, //物流模块
  CustomerService:  `${ApiServer}:90`, //客服模块
  Report: `${ApiServer}:92`, //报表模块
  Sales: `${SalesServer}:8501` //销售模块
}
