<script setup lang="ts">
import FavoriteButton from '@/components/FavoriteButton.vue'
import type { SingleArticleModel } from '@/types'
import { useDateFormat } from '@vueuse/core'

const props = defineProps<{
  article: SingleArticleModel
}>()
const emits = defineEmits<{
  changeFavorite: [newValue: boolean]
}>()

const formattedDate = useDateFormat(props.article.createdAt, 'MMMM Do')
</script>
<template>
  <div class="article-preview">
    <div class="article-meta">
      <RouterLink
        :to="{ name: 'profile', params: { username: article.author.username } }"
        class="author"
      >
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
      <FavoriteButton
        class="btn btn-outline-primary btn-sm pull-xs-right"
        :count="article.favoritesCount"
        :slug="article.slug"
        :isFavorite="article.favorited"
        @change="(newValue) => emits('changeFavorite', newValue)"
        :compact="true"
      />
    </div>
    <RouterLink :to="{ name: 'article', params: { slug: article.slug } }" class="preview-link">
      <h1>{{ article.title }}</h1>
      <p>{{ article.description }}</p>
      <span>Read more...</span>
      <ul class="tag-list">
        <li v-for="tag in article.tagList" :key="tag" class="tag-default tag-pill tag-outline">
          {{ tag }}
        </li>
      </ul>
    </RouterLink>
  </div>
</template>
