<script setup lang="ts">
import { useMyFetch } from '@/fetches'
import { useAuthedUserStore } from '@/stores/authedUser'
import { computed } from 'vue'

const props = defineProps<{
  username: string
  isFollowing: boolean
}>()
const emits = defineEmits<{
  change: [newValue: boolean]
}>()

const store = useAuthedUserStore()

const isLoggedInUser = computed(() => props.username === store.authedUser?.username)
const url = computed(() => `/profiles/${props.username}/follow`)

const { execute: executePost } = useMyFetch(url, {
  immediate: false
}).post()
const { execute: executeDelete } = useMyFetch(url, {
  immediate: false
}).delete()

const handleFollowUnfollow = async () => {
  if (props.isFollowing) {
    await executeDelete()
  } else {
    await executePost()
  }
  emits('change', !props.isFollowing)
}
</script>

<template>
  <!-- Potential UX enhancement: Allow a non-authed user to see the follow button and on click take them to login page, then bring them back to here. -->
  <button
    @click="handleFollowUnfollow"
    v-if="store.authedUser && !isLoggedInUser"
    class="btn btn-sm btn-outline-secondary action-btn"
  >
    <i :class="{ 'ion-plus-round': !isFollowing, 'ion-minus-round': isFollowing }"></i>
    &nbsp; {{ isFollowing ? 'Unfollow' : 'Follow' }} {{ username }}
  </button>
</template>
