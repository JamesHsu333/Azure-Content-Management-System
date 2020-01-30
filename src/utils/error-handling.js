import {
    Message
} from 'element-ui'
import router from '../router'
import store from '../store'

/**
 * Remind User with Error message
 * 
 * @function tip
 * 
 * @param {string} msg - Error message
 */
export const tip = msg => {
    Message.error(msg)
}

/**
 * Log out user and Back to Login Page
 * 
 * @function toLogin
 */
export const toLogin = async () => {
    await store.dispatch('logout')
    router.replace(
        {path: '/login'}
    )
}

 /**
  * To 403 Page
  * 
  * @function to403Page
  */

export const to403Page = () => {
    router.replace(
        {path: '/403'}
    )
}