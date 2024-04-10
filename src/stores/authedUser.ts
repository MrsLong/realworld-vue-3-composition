import { ref } from 'vue'
import type { UserModel } from '@/types'
import { defineStore } from 'pinia'

export const useAuthedUserStore = defineStore('authedUser', () => {
  const authedUser = ref<UserModel | null>(null)
  const login = (user: UserModel) => (authedUser.value = user)

  const logout = () => (authedUser.value = null)

  return { authedUser, login, logout }
})
