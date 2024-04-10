<script setup lang="ts">
import { useMyFetch } from '@/fetches'
import { useAuthedUserStore } from '@/stores/authedUser'
import { computed } from 'vue'

const props = defineProps<{
  count: number
  slug: string
  isFavorite: boolean
  compact?: boolean
}>()
const emits = defineEmits<{
  change: [newValue: boolean]
}>()

const store = useAuthedUserStore()

const url = computed(() => `/articles/${props.slug}/favorite`)

const { execute: executePost } = useMyFetch(url, {
  immediate: false
}).post()
const { execute: executeDelete } = useMyFetch(url, {
  immediate: false
}).delete()

const handleFavoriteUnfavorite = async () => {
  if (props.isFavorite) {
    await executeDelete()
  } else {
    await executePost()
  }
  emits('change', !props.isFavorite)
}
</script>

<template>
  <button
    @click="handleFavoriteUnfavorite"
    class="btn btn-sm btn-outline-primary"
    v-if="store.authedUser"
  >
    <i :class="{ 'ion-heart': !isFavorite, 'ion-minus': isFavorite }"></i>
    &nbsp;
    <template v-if="!compact"> {{ isFavorite ? 'Unfavorite' : 'Favorite' }} Post </template>
    <span class="counter">({{ count }})</span>
  </button>
</template>
