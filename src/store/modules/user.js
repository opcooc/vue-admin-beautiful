/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 登录、获取用户信息、退出登录、清除accessToken逻辑，不建议修改
 */

import Vue from 'vue'
import { getUserInfo, login, logout, mobileLogin } from '@/api/user'
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from '@/utils/accessToken'
import { resetRouter } from '@/router'
import { title, tokenName } from '@/config/settings'

const state = {
  accessToken: getAccessToken(),
  username: '',
  avatar: '',
  permissions: [],
}
const getters = {
  accessToken: (state) => state.accessToken,
  username: (state) => state.username,
  avatar: (state) => state.avatar,
  permissions: (state) => state.permissions,
}
const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken
    setAccessToken(accessToken)
  },
  setUsername(state, username) {
    state.username = username
  },
  setAvatar(state, avatar) {
    state.avatar = avatar
  },
  setPermissions(state, permissions) {
    state.permissions = permissions
  },
}
const actions = {
  setPermissions({ commit }, permissions) {
    commit('setPermissions', permissions)
  },
  async login({ commit }, userInfo) {
    const { data } = await login(userInfo)
    const accessToken = data.accessToken
    if (accessToken) {
      commit('setAccessToken', accessToken)
      const hour = new Date().getHours()
      const thisTime =
        hour < 8
          ? '早上好'
          : hour <= 11
          ? '上午好'
          : hour <= 13
          ? '中午好'
          : hour < 18
          ? '下午好'
          : '晚上好'
      Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`)
    } else {
      Vue.prototype.$baseMessage(
        `登录接口异常，未正确返回${tokenName}...`,
        'error'
      )
    }
  },
  async loginMobile({ commit }, mobileData) {
    const { data } = await mobileLogin(mobileData)
    const accessToken = data.accessToken
    if (accessToken) {
      commit('setAccessToken', accessToken)
      const hour = new Date().getHours()
      const thisTime =
        hour < 8
          ? '早上好'
          : hour <= 11
          ? '上午好'
          : hour <= 13
          ? '中午好'
          : hour < 18
          ? '下午好'
          : '晚上好'
      Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`)
    } else {
      Vue.prototype.$baseMessage(
        `登录接口异常，未正确返回${socialToken}...`,
        'error'
      )
    }
  },
  async getUserInfo({ commit }) {
    const { data } = await getUserInfo()
    console.log(data)
    if (!data) {
      Vue.prototype.$baseMessage('验证失败，请重新登录...', 'error')
      return false
    }
    let { authorities, username, avatar } = data
    if (authorities && username && Array.isArray(authorities)) {
      commit('setPermissions', authorities)
      commit('setUsername', username)
      commit('setAvatar', avatar)
      return authorities
    } else {
      Vue.prototype.$baseMessage('用户信息接口异常', 'error')
      return false
    }
  },
  async logout({ dispatch }) {
    await logout()
    await dispatch('resetAccessToken')
    await resetRouter()
  },
  resetAccessToken({ commit }) {
    commit('setPermissions', [])
    commit('setAccessToken', '')
    removeAccessToken()
  },
  async loginSocial({ commit }, data) {
    const accessToken = data.accessToken
    if (accessToken) {
      commit('setAccessToken', accessToken)
      const hour = new Date().getHours()
      const thisTime =
        hour < 8
          ? '早上好'
          : hour <= 11
          ? '上午好'
          : hour <= 13
          ? '中午好'
          : hour < 18
          ? '下午好'
          : '晚上好'
      Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`)
    } else {
      Vue.prototype.$baseMessage(`${data.message}...`, 'error')
    }
  },
}
export default { state, getters, mutations, actions }
