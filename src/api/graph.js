import {
    GraphService
} from '../utils/https-request.js'
import {domainName} from '../tenant.js'

/**
 * Create new user
 * 
 * @function createUser
 * 
 * @param {string} name - User Name
 * @param {string} password - User Password
 * 
 * @return {Promise} GraphService
 */
export const createUser = (name, password) => {
    return GraphService({
        url: '/users',
        method: 'post',
        data: {
            "accountEnabled": true,
            "displayName": name,
            "mailNickname": name,
            "userPrincipalName": name + "@" + domainName,
            "passwordProfile": {
                "forceChangePasswordNextSignIn": false,
                "password": password
            }
        }
    })
}

/**
 * Delete user
 * 
 * @function deleteUser
 * 
 * @param {*} userId - User Unique GUID
 * 
 * @return {Promise} GraphService
 */
export const deleteUser = (userId) => {
    return GraphService({
        url: '/users/' + userId,
        method: 'delete'
    })
}

/**
 * Retrieve a list of user objects
 * 
 * @function listUser
 * 
 * @return {Promise} GraphService
 */
export const listUser = () => {
    return GraphService({
        url: '/users/',
        method: 'get'
    })
}