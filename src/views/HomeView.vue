<script setup lang="ts">
import { useMyFetch } from '@/fetches'
import { useAuthedUserStore } from '@/stores/authedUser'
import { useRoute } from 'vue-router'

const route = useRoute()
const store = useAuthedUserStore()

const {
  isFetching: isFetchingTags,
  error: tagsError,
  data: tagsData
} = useMyFetch('tags', {
  refetch: true
})
  .get()
  .json<{ tags: string[] }>()
</script>

<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="store.authedUser" class="nav-item">
                <RouterLink class="nav-link" :to="{ name: 'home-my-feed' }">Your Feed</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" :to="{ name: 'home' }">Global Feed</RouterLink>
              </li>
              <li v-if="route.params.tag" class="nav-item">
                <RouterLink
                  class="nav-link"
                  :to="{ name: 'home-tag', params: { tag: route.params.tag } }"
                >
                  # {{ route.params.tag }}
                </RouterLink>
              </li>
            </ul>
          </div>
          <RouterView />
        </div>

        <div class="col-md-3">
          <div v-if="isFetchingTags" class="sidebar">Loading Tags...</div>
          <div v-if="tagsError" class="sidebar">Error loading tags: {{ tagsError }}</div>
          <div v-if="tagsData" class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <RouterLink
                v-for="tag in tagsData.tags"
                :key="tag"
                :to="{ name: 'home-tag', params: { tag } }"
                class="tag-pill tag-default"
              >
                {{ tag }}
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
