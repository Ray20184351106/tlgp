import request from './request'

// 获取公司列表
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
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}

// 更新公司信息
export const updateFirm = (id, data) => {
  return request({
    url: `/api/firms/update/${id}`,
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      firmname: data.firmname
    }
  })
}

// 删除公司
export const deleteFirm = (firmid) => {
  return request({
    url: `/api/firms/delete/${firmid}`,
    method: 'delete',
    data: { firmid }
  })
}

// 搜索公司
// export const searchFirm = (keyword) => {
//   return request({
//     url: '/api/firms/search',
//     method: 'get',
//     params: { keyword }
//   })
// } 