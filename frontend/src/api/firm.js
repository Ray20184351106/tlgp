import request from './request'

// 获取所有公司列表
export const getFirmList = () => {
  return request({
    url: '/api/firms/list',
    method: 'get'
  })
}

// 添加公司
export const addFirm = (data) => {
  return request({
    url: '/api/firms/create',
    method: 'post',
    data
  })
}

// 更新公司信息
export const updateFirm = (data) => {
  return request({
    url: `/api/firms/update/${data.firmid}`,
    method: 'put',
    data
  })
}

// 删除公司
export const deleteFirm = (id) => {
  return request({
    url: `/api/firms/delete/${id}`,
    method: 'delete'
  })
}

// 搜索公司
export const searchFirm = (query) => {
  return request({
    url: '/api/firms/search',
    method: 'get',
    params: { query }
  })
} 