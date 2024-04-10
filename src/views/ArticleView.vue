<script setup lang="ts">
import ArticleComment from '@/components/ArticleComment.vue'
import ArticleMeta from '@/components/ArticleMeta.vue'
import { useMyFetch } from '@/fetches'
import { useAuthedUserStore } from '@/stores/authedUser'
import type { ArticleCommentModel, SingleArticleModel } from '@/types'
import { computedAsync } from '@vueuse/core'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const store = useAuthedUserStore()

const comment = ref('')

const newComment = computed(() => ({
  comment: {
    body: comment.value
  }
}))
const articleUrl = computed(() => `articles/${route.params.slug}`)
const commentsUrl = computed(() => `articles/${route.params.slug}/comments`)

const {
  isFetching: isFetchingArticle,
  error: articleError,
  data: articleData
} = useMyFetch(articleUrl, {
  refetch: true,
  afterFetch: ({ data }) => ({ data: reactive(data) })
})
  .get()
  .json<{ article: SingleArticleModel }>()
const {
  isFetching: isFetchingComments,
  error: commentsError,
  data: commentsData,
  execute: refreshComments
} = useMyFetch(commentsUrl, { refetch: true }).get().json<{ comments: ArticleCommentModel[] }>()
const {
  execute: executePostComment,
  error: postCommentError,
  isFetching: isPostingComment
} = useMyFetch(commentsUrl, {
  immediate: false
})
  .post(newComment)
  .json<{ comment: ArticleCommentModel }>()

const cleanParsedBody = computedAsync(
  async () => DOMPurify.sanitize(await marked(articleData.value?.article.body || '')),
  null
)

const handleChangeFollowing = (newValue: boolean) =>
  articleData.value && (articleData.value.article.author.following = newValue)
const handleChangeFavorite = (newValue: boolean) => {
  articleData.value && (articleData.value.article.favorited = newValue)
  articleData.value && (articleData.value.article.favoritesCount += newValue ? 1 : -1)
}
const handlePostComment = async (event: Event) => {
  event.preventDefault()
  if (!isPostingComment.value) {
    await executePostComment()
    comment.value = ''
    refreshComments()
  }
}
</script>

<template>
  <div v-if="isFetchingArticle">Loading...</div>
  <div v-if="articleError">{{ articleError }}</div>
  <div v-if="articleData" class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ articleData.article.title }}</h1>
        <ArticleMeta
          :article="articleData.article"
          @changeFollowing="handleChangeFollowing"
          @changeFavorite="handleChangeFavorite"
        />
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12">
          <div v-html="cleanParsedBody"></div>
          <ul class="tag-list">
            <li
              v-for="tag in articleData.article.tagList"
              :key="tag"
              class="tag-default tag-pill tag-outline"
            >
              {{ tag }}
            </li>
          </ul>
        </div>
      </div>

      <hr />

      <ArticleMeta
        :article="articleData.article"
        @changeFollowing="handleChangeFollowing"
        @changeFavorite="handleChangeFavorite"
      />

      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <form v-if="store.authedUser" @submit="handlePostComment" class="card comment-form">
            <ul v-if="postCommentError" class="error-messages">
              <li>{{ postCommentError }}</li>
            </ul>
            <div class="card-block">
              <textarea
                v-model="comment"
                class="form-control"
                placeholder="Write a comment..."
                rows="3"
              ></textarea>
            </div>
            <div class="card-footer">
              <img :src="store.authedUser.image" class="comment-author-img" />
              <button class="btn btn-sm btn-primary" type="submit">Post Comment</button>
            </div>
          </form>
          <div v-if="isFetchingComments">Loading Comments...</div>
          <div v-if="commentsError">{{ commentsError }}</div>
          <div v-if="commentsData">
            <ArticleComment
              v-for="comment in commentsData?.comments"
              :key="comment.id"
              :comment="comment"
              :slug="articleData.article.slug"
              @deleted="() => refreshComments()"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
