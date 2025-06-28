<template>
  <AppLayout>
    <div class="container">
      <h1>{{ listName }}</h1>

      <div class="input-section">
        <input v-model="itemName" type="text" placeholder="Produktname" />
        <select v-model="itemCategory">
          <option value="Obst">Obst</option>
          <option value="Gemüse">Gemüse</option>
          <option value="Getränke">Getränke</option>
          <option value="Sonstiges">Sonstiges</option>
        </select>
        <button @click="addItem">Hinzufügen</button>
      </div>

      <ul>
        <li v-if="isLoading">🔄 Artikel werden geladen...</li>
        <li v-else-if="items.length === 0">📭 Keine Artikel in dieser Liste.</li>
        <template v-else>
          <ItemRow
            v-for="item in items"
            :key="item.id"
            :item="item"
            @delete="deleteItem"
            @toggle="togglePurchased"
          />
        </template>
      </ul>
    </div>
  </AppLayout>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import AppLayout from '@/components/AppLayout.vue'
import ItemRow from '@/components/ItemRow.vue'

const API_URL = 'https://webtech-backend-o434.onrender.com/api/items'

const route = useRoute()
const currentListId = ref<number>(NaN)
const listName = ref<string>('Meine Einkaufsliste')
const isLoading = ref(true)

interface Item {
  id: number
  name: string
  category: string
  purchased: boolean
  shoppingListId: number
}

interface ServerItem {
  id: number
  name: string
  category: string
  quantity: number
  purchased: boolean
  price: number
  shoppingListId: number
}

const itemName = ref<string>('')
const itemCategory = ref<string>('Obst')
const items = ref<Item[]>([])

// Reaktiv auf Änderung von route.params.id reagieren
watchEffect(() => {
  const idParam = route.params.id
  if (typeof idParam === 'string') {
    const id = Number(idParam)
    if (!isNaN(id)) {
      currentListId.value = id
      loadData(id)
    }
  }
})

function loadData(listId: number) {
  isLoading.value = true
  axios.get(`https://webtech-backend-o434.onrender.com/api/lists/${listId}`)
    .then((response) => {
      listName.value = response.data.name
    })
    .catch((err) => {
      console.error('Fehler beim Laden der Liste:', err)
    })

  axios.get<ServerItem[]>(API_URL)
    .then((response) => {
      const filtered = response.data.filter((item) => item.shoppingListId === listId)
      items.value = filtered.map((item): Item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        purchased: item.purchased,
        shoppingListId: item.shoppingListId,
      }))
    })
    .catch((err) => {
      console.error('Fehler beim Laden der Artikel:', err)
    })
    .finally(() => {
      isLoading.value = false
    })
}

function addItem() {
  const name = itemName.value.trim()
  if (!name || items.value.find((i) => i.name === name)) return

  axios.post<ServerItem>(API_URL, {
    name,
    category: itemCategory.value,
    quantity: 1,
    purchased: false,
    shoppingListId: currentListId.value,
  })
    .then((response) => {
      const newItem = response.data
      items.value.push({
        id: newItem.id,
        name: newItem.name,
        category: newItem.category,
        purchased: newItem.purchased,
        shoppingListId: newItem.shoppingListId,
      })
      itemName.value = ''
    })
    .catch((err) => {
      console.error('Fehler beim Speichern des Artikels:', err)
    })
}

function togglePurchased(item: Item) {
  const updated = !item.purchased
  axios.put(`${API_URL}/${item.id}`, {
    name: item.name,
    category: item.category,
    quantity: 1,
    purchased: updated,
    shoppingListId: item.shoppingListId,
  })
    .then(() => {
      item.purchased = updated
    })
    .catch((err) => {
      console.error('Fehler beim Aktualisieren:', err)
    })
}

function deleteItem(item: Item) {
  axios.delete(`${API_URL}/${item.id}`)
    .then(() => {
      items.value = items.value.filter((i) => i.id !== item.id)
    })
    .catch((err) => {
      console.error('Fehler beim Löschen:', err)
    })
}
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
  margin-bottom: 1.5rem;
}

input[type='text'],
select {
  padding: 0.5rem;
  font-size: 1rem;
  flex: 1;
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}

ul {
  list-style: none;
  padding: 0;
}

h1 {
  color: black;
}
</style>
