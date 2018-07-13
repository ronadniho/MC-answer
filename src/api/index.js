const baseURL = '/ts/';
const axios = require('axios').create({
  baseURL: baseURL,            //api请求的baseURL
  timeout: 0,
  withCredentials: false, // 允许跨域 cookie
  headers: {'content-type': 'application/json'},
  maxContentLength: 2000,
  transformResponse: [function (data) {
    try {
      data = JSON.parse(data);
    } catch (e) {
      data = {};
    }
    return data;
  }]
})


// get
export const _get = (req) => {
  return axios.get(req.url, {params: req.data})
}

// post
export const _post = (req) => {
  return axios({method: 'post', url: `/${req.url}`, data: req.data})
}
