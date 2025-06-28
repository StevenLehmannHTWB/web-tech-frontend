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
        <li v-for="item in items" :key="item.id">
          <label :class="{ checked: item.purchased }">
            <input
              type="checkbox"
              :checked="item.purchased"
              @change="togglePurchased(item)"
            />
            {{ item.name }} ({{ item.category }})
          </label>
          <button class="delete-button" @click="deleteItem(item)">🗑️</button>
        </li>
      </ul>
    </div>
  </AppLayout>
</template>

<script lang="ts" setup>
import AppLayout from '@/components/AppLayout.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const API_URL = 'https://webtech-backend-o434.onrender.com/api/items'
const route = useRoute()
const currentListId = Number(route.params.id)
const listName = ref<string>('Meine Einkaufsliste')

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

onMounted(() => {
  axios.get(`https://webtech-backend-o434.onrender.com/api/lists/${currentListId}`)
    .then((response) => {
      listName.value = response.data.name
    })
    .catch((err) => {
      console.error('Fehler beim Laden der Liste:', err)
    })

  axios
    .get<ServerItem[]>(API_URL)
    .then((response) => {
      const filtered = response.data.filter((item) => item.shoppingListId === currentListId)
      items.value = filtered.map((item): Item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        purchased: item.purchased,
        shoppingListId: item.shoppingListId,
      }))
    })
    .catch((err) => {
      console.error('Fehler beim Laden der Einkaufsliste:', err)
    })
})

function addItem() {
  const name = itemName.value.trim()
  if (!name || items.value.find((i: Item) => i.name === name)) return

  axios
    .post<ServerItem>(API_URL, {
      name: name,
      category: itemCategory.value,
      quantity: 1,
      purchased: false,
      shoppingListId: currentListId,
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
  axios
    .put(`${API_URL}/${item.id}`, {
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
  axios
    .delete(`${API_URL}/${item.id}`)
    .then(() => {
      items.value = items.value.filter((i: Item) => i.id !== item.id)
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

li {
  background: #fff;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: black
}

h1 {
  color: black
}

.checked {
  text-decoration: line-through;
  color: gray;
}

.delete-button {
  background: none;
  border: none;
  color: red;
  font-size: 1.1rem;
  cursor: pointer;
  margin-left: 1rem;
}
</style>
