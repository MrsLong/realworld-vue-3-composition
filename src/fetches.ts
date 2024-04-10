import { createFetch } from '@vueuse/core'
import { useAuthedUserStore } from './stores/authedUser'

export const useMyFetch = createFetch({
  baseUrl: import.meta.env.VITE_API_URL,
  options: {
    beforeFetch({ options }) {
      const store = useAuthedUserStore()
      if (options.headers && store.authedUser) {
        const bearer = `Bearer ${store.authedUser.token}`
        if (Array.isArray(options.headers)) {
          options.headers.push(['Authorization', bearer])
        } else if (options.headers instanceof Headers) {
          options.headers.append('Authorization', bearer)
        } else {
          options.headers.Authorization = bearer
        }
      }

      return { options }
    }
  }
})
