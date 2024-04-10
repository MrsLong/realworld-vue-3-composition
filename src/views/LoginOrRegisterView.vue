<script setup lang="ts">
import { useMyFetch } from '@/fetches'
import { useAuthedUserStore } from '@/stores/authedUser'
import type { UserModel } from '@/types'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useAuthedUserStore()

const email = ref('')
const password = ref('')
const username = ref('')

const isRegistering = computed(() => router.currentRoute.value.name === 'register')
const user = computed(() =>
  isRegistering.value
    ? { user: { email: email.value, password: password.value, username: username.value } }
    : { user: { email: email.value, password: password.value } }
)
const url = computed(() => `users${isRegistering.value ? '' : '/login'}`)

const { execute, data, error } = useMyFetch(url, { immediate: false })
  .post(user)
  .json<{ user: UserModel }>()

watch(data, (data) => {
  if (data) {
    store.login(data.user)
    router.push({ name: isRegistering.value ? 'settings' : 'home' })
  } else {
    store.logout()
  }
})

const handleSubmit = (e: Event) => {
  e.preventDefault()
  execute()
}
</script>

<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign {{ isRegistering ? 'up' : 'in' }}</h1>
          <p class="text-xs-center">
            <RouterLink :to="{ name: isRegistering ? 'login' : 'register' }">
              {{ isRegistering ? 'Have' : 'Need' }} an account?
            </RouterLink>
          </p>

          <ul v-if="error" class="error-messages">
            <li>{{ error }}</li>
          </ul>

          <form @submit="handleSubmit">
            <fieldset class="form-group" v-if="isRegistering">
              <input
                v-model="username"
                class="form-control form-control-lg"
                type="text"
                placeholder="Username"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                v-model="email"
                class="form-control form-control-lg"
                type="text"
                placeholder="Email"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                v-model="password"
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right" type="submit">
              Sign {{ isRegistering ? 'up' : 'in' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
