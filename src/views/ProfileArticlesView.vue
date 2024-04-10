<script setup lang="ts">
import { useRoute } from 'vue-router'
import ArticlesList from '@/components/ArticlesList.vue'

const route = useRoute()
</script>
<template>
  <ArticlesList :url="`articles?author=${route.params.username}`" />
</template>
