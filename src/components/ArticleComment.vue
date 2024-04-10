<script setup lang="ts">
import { useMyFetch } from '@/fetches'
import { useAuthedUserStore } from '@/stores/authedUser'
import type { ArticleCommentModel } from '@/types'
import { useDateFormat } from '@vueuse/core'
import { computed } from 'vue'

const props = defineProps<{
  comment: ArticleCommentModel
  slug: string
}>()
const emits = defineEmits<{
  deleted: [id: number]
}>()

const store = useAuthedUserStore()

const formattedDate = useDateFormat(props.comment.createdAt, 'MMMM Do')
const commentUrl = computed(() => `articles/${props.slug}/comments/${props.comment.id}`)

const { execute } = useMyFetch(commentUrl, {
  immediate: false
}).delete()

const handleDelete = async () => {
  await execute()
  emits('deleted', props.comment.id)
}
</script>

<template>
  <div class="card">
    <div class="card-block">
      <p class="card-text">
        {{ comment.body }}
      </p>
    </div>
    <div class="card-footer">
      <RouterLink
        :to="{ name: 'profile', params: { username: comment.author.username } }"
        class="comment-author"
      >
        <img :src="comment.author.image" class="comment-author-img" />
      </RouterLink>
      &nbsp;
      <RouterLink
        :to="{ name: 'profile', params: { username: comment.author.username } }"
        class="comment-author"
      >
        {{ comment.author.username }}
      </RouterLink>
      <span class="date-posted">{{ formattedDate }}</span>
      <span
        v-if="store.authedUser && comment.author.username === store.authedUser.username"
        class="mod-options"
      >
        <i @click="handleDelete" class="ion-trash-a"></i>
      </span>
    </div>
  </div>
</template>
