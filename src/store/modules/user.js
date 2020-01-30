import Auth from '../../utils/auth'
import { acquireAzureToken } from '../../utils/auth'

/**
 * User 'state' object
 * @name state
 * 
 * @type {object}
 * @property {object} token - API Token for different platform
 * @property {string} name - User Name
 * @property {string} account - User Account
 */
const state = {
    token: {
        graph: '',
        azure: ''
    },
    name: '',
    account: ''

}

const mutations = {
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_ACCOUNT: (state, account) => {
        state.account = account
    },
    SET_GRAPH_TOKEN: (state, token) => {
        state.token.graph = token
    },
    SET_AZURE_TOKEN: (state, token) => {
        state.token.azure = token
    }
}

const actions = {
    // user login
    login({
        commit
    }) {
        return new Promise(
            (resolve, reject) => {
                const auth = new Auth()
                auth.login().then(
                    user => {
                        const name = user.name
                        const account = user.account

                        commit('SET_NAME', name)
                        commit('SET_ACCOUNT', account)

                        resolve()
                    }).catch(
                    err => {
                        console.log("reject")
                        console.log(err)
                        reject(err)
                    }
                )
            })
    },
    // user logout
    logout({
        commit
    }) {
        return new Promise(
            resolve => {
                const auth = new Auth()
                auth.logout()
                console.log("logout")
                commit('SET_GRAPH_TOKEN', '')
                commit('SET_AZURE_TOKEN', '')
                commit('SET_NAME', '')
                commit('SET_ACCOUNT', '')
                resolve()
            })
    },
    // get user info
    async getUserInfo({
        commit
    }) {
        try {
            const token = await new Promise((resolve, reject) => {
                const auth = new Auth()
                const responseToken = auth.acquireToken()
                if (!responseToken) {
                    reject('Verification failed, please log in again')
                }
                resolve(responseToken)
            })
            commit('SET_GRAPH_TOKEN', token)
            commit('SET_NAME', token.idToken.name)
            commit('SET_ACCOUNT', token.idToken.preferredName)
        } catch (err) {
            return Promise.reject(err)
        }
    },
    // remove user info
    removeUserInfo({
        commit
    }) {
        return new Promise(
            resolve => {
                localStorage.clear()
                commit('SET_GRAPH_TOKEN', '')
                commit('SET_AZURE_TOKEN', '')
                commit('SET_NAME', '')
                commit('SET_ACCOUNT', '')
                resolve()
            }
        )
    },
    /**
     * Access Azure REST API Token
     * Temporary Store at Front End (change later)
     */
    async getAzureToken({
        commit
    }) {
        try {
            const token = await acquireAzureToken()
            commit('SET_AZURE_TOKEN', token)
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

export default {
    state,
    mutations,
    actions
}