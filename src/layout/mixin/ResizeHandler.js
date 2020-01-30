import store from '../../store'

const {
    body
} = document

const WIDTH = 768

export default {
    watch: {
        $route() {
            if (this.device === 'mobile' && this.sidebar.opened) {
                store.dispatch('app/closeSidebar', {withoutAnimation: false})
            }
        }
    },
    beforeMount() {
        window.addEventListener('resize', this.$_resizeHandler())
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.$_resizeHandler())
    },
    mounted() {
        const isMobile = this.$_isMobile
        if(isMobile===true) {
            store.dispatch('app/toggleDevice', 'mobile')
            store.dispatch('app/closeSidebar', {withoutAnimation: true})
        }
    },
    methods: {
        $_isMobile() {
            const rect = body.getBoundingClientRect()
            return rect.width - 1 < WIDTH
        },
        $_resizeHandler() {
            if (!document.hidden) {
                const isMobile = this.$_isMobile()
                store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'Desktop')

                if(isMobile) {
                    store.dispatch('app/closeSidebar', {withoutAnimation: true})
                }
            }
        }
    }
}