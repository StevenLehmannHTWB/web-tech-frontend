<template>
  <div class="layout">
    <header class="header">
      <h2>🛒 Meine Shopping App</h2>
      <router-link to="/" class="home-button">🏠 Home</router-link>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.layout {
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #e0f0ff;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.home-button {
  text-decoration: none;
  font-weight: bold;
  color: #007acc;
}

h2 {
  color: blue;
}
</style>
