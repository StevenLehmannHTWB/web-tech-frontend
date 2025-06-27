<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

interface ServerItem {
  id: number
  name: string
  category: string
  quantity: number
  purchased: boolean
  shoppingList: { id: number }
}

interface Item {
  id: number
  name: string
  category: string
  purchased: boolean
  shoppingListId: number
}

const API_URL = 'https://webtech-backend-o434.onrender.com/api/items'
const route = useRoute()
const currentListId = Number(route.params.id)

const items = ref<Item[]>([])
const itemName = ref('')
const itemCategory = ref('Sonstiges')

onMounted(() => {
  axios.get<ServerItem[]>(API_URL).then((response) => {
    const filtered = response.data.filter((item) => item.shoppingList?.id === currentListId)
    items.value = filtered.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      purchased: item.purchased,
      shoppingListId: item.shoppingList.id,
    }))
  })
})

function addItem() {
  const name = itemName.value.trim()
  if (!name || items.value.find((i) => i.name === name)) return

  axios
    .post<ServerItem>(API_URL, {
      name: name,
      category: itemCategory.value,
      quantity: 1,
      purchased: false,
      shoppingList: { id: currentListId },
    })
    .then((response) => {
      const newItem = response.data
      items.value.push({
        id: newItem.id,
        name: newItem.name,
        category: newItem.category,
        purchased: newItem.purchased,
        shoppingListId: newItem.shoppingList.id,
      })
      itemName.value = ''
    })
    .catch((err) => {
      console.error('Fehler beim Speichern des Artikels:', err)
    })
}

function togglePurchased(item: Item) {
  axios
    .put(`${API_URL}/${item.id}`, {
      ...item,
      quantity: 1,
      shoppingList: { id: item.shoppingListId },
      purchased: !item.purchased,
    })
    .then(() => {
      item.purchased = !item.purchased
    })
    .catch((err) => {
      console.error('Fehler beim Aktualisieren:', err)
    })
}

function deleteItem(item: Item) {
  axios
    .delete(`${API_URL}/${item.id}`)
    .then(() => {
      items.value = items.value.filter((i) => i.id !== item.id)
    })
    .catch((err) => {
      console.error('Fehler beim Löschen:', err)
    })
}
</script>

<template>
  <div>
    <h1>Einkaufsliste</h1>
    <ul>
      <li v-for="item in items" :key="item.id">
        <input type="checkbox" :checked="item.purchased" @change="() => togglePurchased(item)" />
        {{ item.name }} ({{ item.category }})
        <button @click="() => deleteItem(item)">Löschen</button>
      </li>
    </ul>
    <input v-model="itemName" placeholder="Neuer Artikel" />
    <select v-model="itemCategory">
      <option>Getränke</option>
      <option>Obst</option>
      <option>Gemüse</option>
      <option>Milchprodukte</option>
      <option>Fleisch</option>
      <option>Sonstiges</option>
    </select>
    <button @click="addItem">Speichern</button>
  </div>
</template>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}
li {
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
