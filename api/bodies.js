import ajax from '../utils/ajax.js'
//文章列表查询
export const pageByInstitute = (data) => {
  let app = getApp()
  return ajax({
    url: wx.envConfig.host + 'institute/pageByInstitute',
    data: {
      state: '0',
      ...data
    },
    method: 'post',
    loading: true,
  })
}
//查询机构详情
export const getByInstitute = (data) => {
  return ajax({
    url: wx.envConfig.host + 'institute/getByInstitute',
    data: { ...data },
    method: 'post',
  })
}