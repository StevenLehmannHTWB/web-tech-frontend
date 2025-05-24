<script setup lang="ts">
defineProps<{
  msg: string
}>()

async function loadThings (owner: string = '') {
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL // 'http://localhost:8080' in dev mode
  const endpoint = baseUrl + '/things' + '?owner=' + owner
  const response: AxiosResponse = await axios.get(endpoint);
  const responseData: Thing[] = response.data;
  responseData.forEach((thing: Thing) => {
    items.value.push(thing)
  })
}
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      This is a shopping List
      <!--
      You’ve successfully created a project with
      <a href="https://vite.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>. What's next?
      -->

    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
