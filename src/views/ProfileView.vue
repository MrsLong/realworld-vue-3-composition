<script setup lang="ts">
import { useMyFetch } from '@/fetches'
import { useAuthedUserStore } from '@/stores/authedUser'
import type { ProfileModel } from '@/types'
import { computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
import FollowButton from '@/components/FollowButton.vue'

const route = useRoute()
const store = useAuthedUserStore()

const profileUrl = computed(() => `profiles/${route.params.username}`)

const {
  isFetching: isFetchingProfile,
  error: profileError,
  data: profileData
} = useMyFetch(profileUrl, { refetch: true, afterFetch: ({ data }) => ({ data: reactive(data) }) })
  .get()
  .json<{ profile: ProfileModel }>()

const isLoggedInUser = computed(
  () => profileData.value && profileData.value.profile.username === store.authedUser?.username
)
</script>

<template>
  <div v-if="isFetchingProfile">Loading...</div>
  <div v-if="profileError">{{ profileError }}</div>
  <div v-if="profileData" class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profileData.profile.image" class="user-img" />
            <h4>{{ profileData.profile.username }}</h4>
            <p>
              {{ profileData.profile.bio }}
            </p>
            <FollowButton
              :username="profileData.profile.username"
              :isFollowing="profileData.profile.following"
              @change="(newValue) => profileData && (profileData.profile.following = newValue)"
            />
            <RouterLink
              v-if="isLoggedInUser"
              :to="{ name: 'settings' }"
              class="btn btn-sm btn-outline-secondary action-btn"
            >
              <i class="ion-gear-a"></i>
              &nbsp; Edit Profile Settings
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <RouterLink class="nav-link" :to="{ name: 'profile' }"> My Articles </RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" :to="{ name: 'profile-favorites' }">
                  Favorited Articles
                </RouterLink>
              </li>
            </ul>
          </div>

          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>
