<script setup lang="ts"></script>

<template>
  <footer>
    <div class="container">
      <RouterLink :to="{ name: 'home' }" class="logo-font">conduit</RouterLink>
      <span class="attribution">
        An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code
        &amp; design licensed under MIT.
      </span>
    </div>
  </footer>
</template>
