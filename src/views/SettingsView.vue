<script setup lang="ts">
import { useMyFetch } from '@/fetches'
import { useAuthedUserStore } from '@/stores/authedUser'
import type { UserModel } from '@/types'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useAuthedUserStore()

// Set up internal versions of the store's reactive properties to
// prevent changes to other parts of the app while editing the settings page
const image = ref(store.authedUser?.image)
const username = ref(store.authedUser?.username)
const bio = ref(store.authedUser?.bio)
const email = ref(store.authedUser?.email)
const password = ref('')

const userUpdates = computed(() => ({
  user: {
    image: image.value,
    username: username.value,
    bio: bio.value,
    email: email.value,
    password: password.value
  }
}))

const { execute, data, error } = useMyFetch('user', { immediate: false })
  .put(userUpdates)
  .json<{ user: UserModel }>()

watch(data, (data) => {
  if (data) {
    store.login(data.user)
  }
})

const handleSubmit = (e: Event) => {
  e.preventDefault()
  execute()
}
const handleClick = () => {
  store.logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <div v-if="store.authedUser" class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <ul v-if="error" class="error-messages">
            <li>{{ error }}</li>
          </ul>

          <form @submit="handleSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="image"
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="username"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="bio"
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                ></textarea>
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
                  placeholder="New Password"
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right" type="submit">
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr />
          <button @click="handleClick" class="btn btn-outline-danger">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
