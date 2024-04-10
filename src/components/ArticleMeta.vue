<script setup lang="ts">
import FavoriteButton from '@/components/FavoriteButton.vue'
import FollowButton from '@/components/FollowButton.vue'
import { useMyFetch } from '@/fetches'
import { useAuthedUserStore } from '@/stores/authedUser'
import type { SingleArticleModel } from '@/types'
import { useDateFormat } from '@vueuse/core'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  article: SingleArticleModel
}>()
const emits = defineEmits<{
  changeFollowing: [newValue: boolean]
  changeFavorite: [newValue: boolean]
}>()

const store = useAuthedUserStore()
const router = useRouter()

const formattedDate = useDateFormat(props.article.createdAt, 'MMMM Do')
const articleUrl = computed(() => `articles/${props.article.slug}`)

const { isFetching: isDeletingArticle, execute } = useMyFetch(articleUrl, {
  immediate: false
}).delete()

const handleDelete = async () => {
  await execute()
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="article-meta">
    <RouterLink :to="{ name: 'profile', params: { username: article.author.username } }">
      <img :src="article.author.image" />
    </RouterLink>
    <div class="info">
      <RouterLink
        :to="{ name: 'profile', params: { username: article.author.username } }"
        class="author"
      >
        {{ article.author.username }}
      </RouterLink>
      <span class="date">{{ formattedDate }}</span>
    </div>
    <FollowButton
      :username="article.author.username"
      :isFollowing="article.author.following"
      @change="(newValue) => emits('changeFollowing', newValue)"
    />
    &nbsp;&nbsp;
    <FavoriteButton
      :count="article.favoritesCount"
      :slug="article.slug"
      :isFavorite="article.favorited"
      @change="(newValue) => emits('changeFavorite', newValue)"
    />
    <RouterLink
      :to="{ name: 'editor', params: { slug: article.slug } }"
      v-if="store.authedUser && article.author.username === store.authedUser.username"
      class="btn btn-sm btn-outline-secondary"
    >
      <i class="ion-edit"></i>
      Edit Article
    </RouterLink>
    <button
      v-if="store.authedUser && article.author.username === store.authedUser.username"
      @click="handleDelete"
      :disabled="isDeletingArticle"
      class="btn btn-sm btn-outline-danger"
    >
      <i class="ion-trash-a"></i> Delete Article
    </button>
  </div>
</template>
