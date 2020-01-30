import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import Login from '@/views/Login/login.vue'

describe('Login/login.vue', () => {
  it('Click on Login button calls login method with ', () => {
    const name = 'User Name'
    const wrapper = shallowMount(Login, {
      propsData: { name }
    })
    expect(wrapper.text()).to.include(name)
  })
})
