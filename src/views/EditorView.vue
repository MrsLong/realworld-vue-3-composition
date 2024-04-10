<script setup lang="ts">
import { useMyFetch } from '@/fetches'
import { useAuthedUserStore } from '@/stores/authedUser'
import type { SingleArticleModel } from '@/types'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const store = useAuthedUserStore()

const title = ref('')
const description = ref('')
const body = ref('')
const tags = ref('')

const newArticle = computed(() => ({
  article: {
    title: title.value,
    description: description.value,
    body: body.value,
    tagList: tags.value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  }
}))
const editedArticle = computed(() => ({
  article: {
    title: title.value,
    description: description.value,
    body: body.value
  }
}))
const articleUrl = computed(() => `articles/${route.params.slug}`)

const {
  isFetching: isFetchingArticle,
  error: articleError,
  data: articleData
} = useMyFetch(articleUrl, {
  beforeFetch({ cancel }) {
    if (!route.params.slug) {
      cancel()
    }
  },
  refetch: true
})
  .get()
  .json<{ article: SingleArticleModel }>()
const {
  execute: executePost,
  data: postData,
  error: postError
} = useMyFetch('articles', { immediate: false })
  .post(newArticle)
  .json<{ article: SingleArticleModel }>()
const { execute: executePut, error: putError } = useMyFetch(articleUrl, { immediate: false })
  .put(editedArticle)
  .json<{ article: SingleArticleModel }>()

watch(articleData, (articleData) => {
  if (articleData) {
    title.value = articleData.article.title
    description.value = articleData.article.description
    body.value = articleData.article.body
    tags.value = articleData.article.tagList.join(', ')
  }
})
watch(postData, (data) => {
  if (data) {
    router.push({ name: 'article', params: { slug: data.article.slug } })
  }
})

const handleSubmit = (e: Event) => {
  e.preventDefault()
  if (route.params.slug) {
    executePut()
  } else {
    executePost()
  }
}
const removeTag = (tag: string) =>
  (tags.value = tags.value
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t !== tag)
    .join(', '))
</script>

<template>
  <div v-if="isFetchingArticle">Loading...</div>
  <div v-if="articleError">{{ articleError }}</div>
  <div v-if="store.authedUser" class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <ul v-if="postError" class="error-messages">
            <li>{{ postError }}</li>
          </ul>
          <ul v-if="putError" class="error-messages">
            <li>{{ putError }}</li>
          </ul>
          <form @submit="handleSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="title"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="description"
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="body"
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                ></textarea>
              </fieldset>
              <fieldset v-if="!route.params.slug" class="form-group">
                <input v-model="tags" type="text" class="form-control" placeholder="Enter tags" />
                <div class="tag-list">
                  <span
                    v-for="tag in newArticle.article.tagList"
                    :key="tag"
                    class="tag-default tag-pill"
                  >
                    <i @click="removeTag(tag)" class="ion-close-round"></i>
                    {{ tag }}
                  </span>
                </div>
              </fieldset>
              <button class="btn btn-lg pull-xs-right btn-primary" type="submit">
                {{ route.params.slug ? 'Save Changes' : 'Publish Article' }}
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
