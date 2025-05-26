<template>
  <div>
    <h1>Nachricht vom Backend:</h1>
    <p v-if="loading">Lade...</p>
    <p v-else>{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const message = ref('');
const loading = ref(true);

const backendURL = 'https://webtech-backend-o434.onrender.com/api/message';

onMounted(async () => {
  try {
    const response = await axios.get(backendURL);
    message.value = response.data.message;
  } catch (error) {
    message.value = 'Fehler beim Laden';
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>
