import { Send } from "../../utils/Http";
import { Toast } from "../../view/common";
let SystemApi = {};


/**
 * @name 获取轮播
 * @param {*} source 
 */
SystemApi.getBanner = (source) => { // mobile
    return new Promise((resolve, reject) => {
        Send(`api/System/Banners?source=${source}`, {}, 'get')
        .then((res) => {
            if (res.code == 200) {
                resolve(res.data)
            }else {
                reject(res)
                Toast.tipTop(res.message)
            }
        })
        .catch((err) =>{
            reject(err)
            console.log('err', err)
        })
    })
}

/**
 * 
 * @name 发送验证码
 * @param { "Mobile": "string", "Type": "string" } params 
 */
SystemApi.sendVcode = (params) => { // mobile
    return new Promise((resolve, reject) => {
        Send(`api/User/SendVcode`, params)
        .then((res) => {
            if (res.code == 200) {
                resolve(res.data)
            }else {
                reject(res)
                Toast.tipTop(res.message)
            }
        })
        .catch((err) =>{
            reject(err)
            console.log('err', err)
        })
    })
}

/**
 * 
 * @name 消息
 * @param { "PageIndex": 0, "PageSize": 0, "Type": 0 } params 
 */
SystemApi.getNotices = (params) => { // mobile
    return new Promise((resolve, reject) => {
        Send(`api/System/Notices`, params)
        .then((res) => {
            if (res.code == 200) {
                resolve(res.data)
            }else {
                reject(res)
                Toast.tipTop(res.message)
            }
        })
        .catch((err) =>{
            reject(err)
            console.log('err', err)
        })
    })
}

/**
 * @name 获取公告
 */
SystemApi.getOneNotice = () => {
    return new Promise((resolve, reject) => {
        Send(`api/System/OneNotice`, {}, 'get')
        .then((res) => {
            if (res.code == 200) {
                resolve(res.data)
            }else {
                reject(res)
                Toast.tipTop(res.message)
            }
        })
        .catch((err) =>{
            reject(err)
            console.log('err', err)
        })
    })
}

/**
 * @name 获取app文案
 */
SystemApi.getCopyWriting = () => {
    return new Promise((resolve, reject) => {
        Send(`api/System/CopyWriting`, {}, 'get')
        .then((res) => {
            if (res.code == 200) {
                resolve(res.data)
            }else {
                reject(res)
                Toast.tipTop(res.message)
            }
        })
        .catch((err) =>{
            reject(err)
            console.log('err', err)
        })
    })
}


/**
 * @name 问题反馈
 */
SystemApi.Feedback = (params) => {
    return new Promise((resolve, reject) => {
        Send(`api/System/Feedback`, params)
        .then((res) => {
            if (res.code == 200) {
                resolve(res.data)
            }else {
                reject(res)
                Toast.tipTop(res.message)
            }
        })
        .catch((err) =>{
            reject(err)
            console.log('err', err)
        })
    })
}







export default SystemApi