<script setup lang="ts">
import { useAuthedUserStore } from '@/stores/authedUser'

const store = useAuthedUserStore()
</script>

<template>
  <nav class="navbar navbar-light">
    <div class="container">
      <RouterLink :to="{ name: 'home' }" class="navbar-brand">conduit</RouterLink>
      <ul class="nav navbar-nav pull-xs-right">
        <li class="nav-item">
          <RouterLink :to="{ name: 'home' }" class="nav-link">Home</RouterLink>
        </li>
        <li v-if="!store.authedUser" class="nav-item">
          <RouterLink :to="{ name: 'login' }" class="nav-link">Sign in</RouterLink>
        </li>
        <li v-if="!store.authedUser" class="nav-item">
          <RouterLink :to="{ name: 'register' }" class="nav-link">Sign up</RouterLink>
        </li>
        <li v-if="store.authedUser" class="nav-item">
          <RouterLink :to="{ name: 'editor' }" class="nav-link">
            <i class="ion-compose"></i>&nbsp;New Article
          </RouterLink>
        </li>
        <li v-if="store.authedUser" class="nav-item">
          <RouterLink :to="{ name: 'settings' }" class="nav-link">
            <i class="ion-gear-a"></i>&nbsp;Settings
          </RouterLink>
        </li>
        <li v-if="store.authedUser" class="nav-item">
          <RouterLink
            :to="{ name: 'profile', params: { username: store.authedUser.username } }"
            class="nav-link"
          >
            <img :src="store.authedUser.image" class="user-pic" />
            {{ store.authedUser.username }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
