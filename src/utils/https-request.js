import axios from 'axios'
import store from '../store'
import {
    tip,
    toLogin,
    to403Page
} from './error-handling.js'

/**
 * Handling Request Fail 
 * @param {Number} status 
 */

const errorHandle = (status, msg) => {
    switch (status) {
        case 400:
            tip(msg)
            break
        case 401:
            tip('Log in has expired, please login again')
            setTimeout(() => {
                toLogin()
            }, 1000)
            break
        case 403:
            to403Page()
            break
        case 404:
            tip(msg)
            break
        default:
            console.log('Unknown Error: ' + msg)
    }
}

// create Microsoft Graph  API axios instance

const GraphService = axios.create({
    baseURL: 'https://graph.microsoft.com/v1.0/',
    timeout: 7000,
    headers: {
        'Content-Type': 'application/json'
    }
})

//Graph Service Request interceptor

GraphService.interceptors.request.use(async (config) => {
    const now = Date.now()
    if (now > store.getters.token.expiresOn) {
        await store.dispatch('getUserInfo')
        config.headers['Authorization'] = 'Bearer ' + store.getters.token.graph.accessToken
    } else {
        if (store.getters.token) {
            config.headers['Authorization'] = 'Bearer ' + store.getters.token.graph.accessToken
        }
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

//Graph Service Response interceptor

GraphService.interceptors.response.use((response) => {
    return response
}, (error) => {
    if (error) {
        // Get error response
        console.log(error.response)
        errorHandle(error.response.status, error.response.data.error)
        return Promise.reject(error.response.data)
    } else {
        // Error but not get response
        if (!window.navigator.onLine) {
            tip('Internet has been offline, please check')
        } else {
            return Promise.reject(error.response.data)
        }
    }
})

// Create Azure REST API axios instance

const AzureService = axios.create({
    baseURL: 'https://management.azure.com/',
    timeout: 7000,
    headers: {
        'Content-Type': 'application/json'
    }
})

AzureService.interceptors.request.use(async (config) => {
    await store.dispatch('getAzureToken')

    config.headers['Authorization'] = 'Bearer ' + store.getters.token.azure.access_token
    return config
}, (error) => {
    return Promise.reject(error)
})

AzureService.interceptors.response.use((response) => {
    return response
}, (error) => {
    if (error) {
        // Get error response
        console.log(error.response)
        errorHandle(error.response.status, error.response.data.error)
        return Promise.reject(error.response.data)
    } else {
        // Error but not get response
        if (!window.navigator.onLine) {
            tip('Internet has been offline, please check')
        } else {
            return Promise.reject(error.response.data)
        }
    }
})

export {GraphService, AzureService}