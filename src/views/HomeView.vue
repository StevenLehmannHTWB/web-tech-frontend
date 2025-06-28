<template>
  <AppLayout>
    <div class="container">
      <h1>Alle Einkaufslisten</h1>

      <div class="input-section">
        <input v-model="newListName" type="text" placeholder="Neue Liste erstellen" />
        <button @click="createList">Liste hinzufügen</button>
      </div>

      <ul>
        <li v-for="list in lists" :key="list.id">
          <router-link :to="`/liste/${list.id}`">{{ list.name }}</router-link>
        </li>
      </ul>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/components/AppLayout.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_URL = 'https://webtech-backend-o434.onrender.com/api/lists'

interface ShoppingList {
  id: number
  name: string
}

const newListName = ref('')
const lists = ref<ShoppingList[]>([])

function loadLists() {
  axios.get<ShoppingList[]>(API_URL)
    .then(response => {
      lists.value = response.data
    })
    .catch(error => console.error('Fehler beim Laden der Listen:', error))
}

function createList() {
  const name = newListName.value.trim()
  if (!name) return

  axios.post(API_URL, { name })
    .then(response => {
      lists.value.push(response.data)
      newListName.value = ''
    })
    .catch(error => console.error('Fehler beim Erstellen der Liste:', error))
}

onMounted(loadLists)
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 2rem auto;
  font-family: Arial, sans-serif;
  background: #f9f9f9;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.input-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
input {
  flex: 1;
  padding: 0.5rem;
}
button {
  padding: 0.5rem 1rem;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  background: #fff;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: blue;
}
h1 {
  color: black;
}
</style>
