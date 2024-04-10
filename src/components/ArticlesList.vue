<script setup lang="ts">
import ArticlePreview from '@/components/ArticlePreview.vue'
import { useMyFetch } from '@/fetches'
import { useAuthedUserStore } from '@/stores/authedUser'
import type { SingleArticleModel } from '@/types'
import { computed, reactive, ref, toRefs, watch } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{ url: string; removeOwnFavorited?: boolean }>()

const store = useAuthedUserStore()
const route = useRoute()

const limit = 10
const { url } = toRefs(props)
const selectedPage = ref(1)

const offset = computed(() => (selectedPage.value - 1) * limit)
const offsetUrl = computed(
  () => `${url.value}${url.value.includes('?') ? '&' : '?'}limit=${limit}&offset=${offset.value}`
)

// Users expect different instances to start at page 1
watch(url, () => (selectedPage.value = 1))

const {
  isFetching: isFetchingArticles,
  error: articlesError,
  data: articlesData
} = useMyFetch(offsetUrl, {
  refetch: true,
  afterFetch: ({ data }) => ({ data: reactive(data) })
})
  .get()
  .json<{ articles: SingleArticleModel[]; articlesCount: number }>()

const numberOfPages = computed(() => Math.ceil((articlesData?.value?.articlesCount || 0) / limit))

const handleChangeFavorite = (article: SingleArticleModel, newValue: boolean) => {
  article.favorited = newValue
  article.favoritesCount += newValue ? 1 : -1
  if (props.removeOwnFavorited && route.params.username === store.authedUser?.username) {
    articlesData.value?.articles.splice(
      articlesData.value?.articles.findIndex((a) => a.slug === article.slug),
      1
    )
  }
}
const handlePageClick = (page: number) => (selectedPage.value = page)
</script>

<template>
  <div v-if="isFetchingArticles">Loading...</div>
  <div v-if="articlesError">{{ articlesError }}</div>
  <div v-if="articlesData?.articles.length === 0">Oops! There are no articles to show.</div>
  <ArticlePreview
    v-for="article in articlesData?.articles"
    :key="article.slug"
    :article="article"
    @changeFavorite="(newValue) => handleChangeFavorite(article, newValue)"
  />
  <ul v-if="numberOfPages > 1" class="pagination">
    <li
      v-for="page in numberOfPages"
      :key="page"
      class="page-item"
      :class="{ active: page === selectedPage }"
    >
      <a class="page-link" role="button" @click="() => handlePageClick(page)">{{ page }}</a>
    </li>
  </ul>
</template>
