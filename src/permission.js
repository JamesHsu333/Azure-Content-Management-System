import router from './router'
import store from './store'
import {
    Message
} from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
    getToken
} from './utils/auth'

NProgress.configure({
    showSpinner: false
})

const whitelist = ['/login']

router.beforeEach(async (to, from, next) => {
    // Start Progress Bar
    NProgress.start()

    const hasToken = getToken()

    // Identify Iframe
    const isIframe = (window.document === window.parent.document)

    if (hasToken && isIframe) {
        if (to.path === '/login') {
            // If is logged in, redirect to the home page
            next({
                path: '/'
            })
            NProgress.done()
        } else {
            if (store.getters.account) {
                next()
            } else {
                try {
                    await store.dispatch('getUserInfo')
                    next()
                } catch (err) {
                    // Remove token and back to login page
                    await store.dispatch('removeUserInfo')
                    next('/login?redirect=' + to.path)
                }
            }
            NProgress.done()
        }
    } else {
        // Has no token
        if (whitelist.indexOf(to.path) !== -1) {
            next()
        } else {
            // other pages that do not have permission to access are redirected to login page
            next('/login')
            Message.error('Please Log In')
            NProgress.done()
        }
    }

})

router.afterEach(() => {
    //Finish progress bar
    NProgress.done()
})