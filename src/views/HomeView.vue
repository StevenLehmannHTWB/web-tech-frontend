<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

interface ShoppingList {
  id: number
  name: string
  plannedDate?: string
}

const API_URL = 'https://webtech-backend-o434.onrender.com/api/lists'
const lists = ref<ShoppingList[]>([])
const newListName = ref('')
const router = useRouter()

const fetchLists = async () => {
  try {
    const response = await axios.get<ShoppingList[]>(API_URL)
    lists.value = response.data
  } catch (err) {
    console.error('Fehler beim Laden der Listen:', err)
  }
}

const createList = async () => {
  const name = newListName.value.trim()
  if (!name) return

  try {
    const response = await axios.post<ShoppingList>(API_URL, {
      name: name,
      plannedDate: null,
    })
    const newList = response.data
    lists.value.push(newList)
    newListName.value = ''
    router.push(`/list/${newList.id}`)
  } catch (err) {
    console.error('Fehler beim Erstellen der Liste:', err)
  }
}

onMounted(fetchLists)
</script>

<template>
  <div>
    <h1>Einkaufslisten</h1>
    <ul>
      <li v-for="list in lists" :key="list.id">
        <router-link :to="`/list/${list.id}`">{{ list.name }}</router-link>
      </li>
    </ul>
    <input v-model="newListName" placeholder="Neue Liste" />
    <button @click="createList">Erstellen</button>
  </div>
</template>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}
li {
  margin: 0.5rem 0;
}
</style>
