/**
 * Control Sidebar State
 * Use Localstorage to save sidebar status
 */

const state = {
    sidebar: {
    opened: (localStorage.getItem('sidebarStatus')==='1') ? true : false,
    withoutAnimation: false
    },
    device: 'Desktop'
}

const mutations = {
    TOGGLE_SIDEBAR: state => {
        state.sidebar.opened =!state.sidebar.opened
        state.sidebar.withoutAnimation = false
        if (state.sidebar.opened) {
            localStorage.setItem('sidebarStatus', 1)
        } else {
            localStorage.setItem('sidebarStatus', 0)
        }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
        localStorage.setItem('sidebarStatus', 0)
        state.sidebar.opened = false
        state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
        state.device = device
    }
}

const actions = {
    toggleSidebar({commit}) {
        commit('TOGGLE_SIDEBAR')
    },
    closeSidebar({commit}, {withoutAnimation})  {
        commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({commit}, device) {
        commit('TOGGLE_DEVICE', device)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}