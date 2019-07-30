import axios from 'axios'
import {Message} from 'element-ui'
let errCode = ['400', '500', '502', '503', '504'];
axios.defaults.baseURL = '';
axios.defaults.timeout = 10000
axios.defaults.headers = {
}

// 请求拦截器
axios.interceptors.request.use(config => {
    
    // config.responseType='blob';
    return config;
}, err => {
    return Promise.reject(err);
});


// 响应拦截器
axios.interceptors.response.use(res=>{
    return res;
},err=>{
    let errStatus=err.response.status.toString();
    let errCodeStr=errCode.join(',');
    if (errCodeStr.indexOf(errStatus)>=0) {
        Message({
            messgae: '亲，当前访问服务的人太多，请稍后重试',
            type: 'warning'
        });
    }
    else if (errStatus == '403')
    {
        Message({
            messgae: '亲，您当前无权访问页面，请稍后重试',
            type: 'warning'
        });
    }
    else if (errStatus == '404') {
        Message({
            messgae: '亲，您的请求已经丢失，您可以逛逛别的页面',
            type: 'warning'
        });
    }
    return Promise.reject(err);
});


class API {
    constructor(url) {
        this.url = url
    }

    // 创建axios配置项
    static _createAxiosConfig({url, action, method = 'get', data, timeout, baseURL,responseType}) {
        var config = {
            method: method,
            url: url + action
        }
        if (baseURL) {
            config.baseURL = baseURL;
        }
        if (['post', 'put', 'patch'].includes(config.method)) {
            config.data = data
        } else {
            config.params = data
        }
        if (timeout!=undefined) {
            config.timeout = timeout
        }
        if(responseType)
        {
            config.responseType=responseType;
        }
        return config
    }

    // 请求url, data, method = 'get'
    static request(params, isAuth = true) {
        if (this instanceof API && !params.url) {
            params.url = this.url;
        } else {
            params.url = ''
        }
        return isAuth ? API._probeAuthStatusAndRequest(params) : axios(API._createAxiosConfig(params))
    }


    

    //此处可以加鉴权处理,或者在每次请求之前加的处理逻辑
    static _probeAuthStatusAndRequest(params) {
        var promise = new Promise((resolve, reject) => {
            //这里可以添加权限验证,登录验证等
            axios(API._createAxiosConfig(params)).then(res => {
                return resolve(res)
            }).catch(err => {
                return reject(err)
            })
        })
        return promise
    }
}
export default API
