<template>
  <div>
    <h1>Meine Einkaufslisten</h1>

    <ul>
      <li v-for="list in lists" :key="list" @click="goToList(list)">
        📝 {{ list }}
      </li>
    </ul>

    <input v-model="newListName" placeholder="Neue Liste erstellen..." />
    <button @click="createList">Erstellen</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_URL = 'https://webtech-backend-o434.onrender.com/api/items'
const router = useRouter()

const lists = ref<string[]>([])
const newListName = ref('')

onMounted(async () => {
  const response = await axios.get<{ shoppingList: string }[]>(API_URL)
  const uniqueLists = [...new Set(response.data.map((item: any) => item.shoppingList))]
  lists.value = uniqueLists
})

function goToList(name: string) {
  router.push({ name: 'ListView', params: { shoppingList: name } })
}

function createList() {
  if (!newListName.value.trim()) return
  router.push({ name: 'ListView', params: { shoppingList: newListName.value.trim() } })
}
</script>
