<template>
  <AppLayout>
    <div class="container">
      <div class="header">
        <h1>{{ listName }}</h1>
        <button class="delete-list-button" @click="confirmDeleteList">❌ Liste löschen</button>
      </div>

      <div class="input-section">
        <input v-model="itemName" type="text" placeholder="Produktname" />
        <input v-model.number="itemQuantity" type="number" min="1" placeholder="Menge" style="width:80px" />
        <input v-model.number="itemPrice" type="number" min="0" step="0.01" placeholder="Stückpreis (€)" style="width:100px" />
        <select v-model="itemCategory">
          <option value="Obst & Gemüse">Obst & Gemüse</option>
          <option value="Kühltheke">Kühltheke</option>
          <option value="Tiefkühltheke">Tiefkühltheke</option>
          <option value="Backwaren">Backwaren</option>
          <option value="Getränke">Getränke</option>
          <option value="Haushalt">Haushalt</option>
          <option value="Sonstiges">Sonstiges</option>
        </select>
        <button @click="addItem">Hinzufügen</button>
      </div>

      <ul>
        <li v-if="isLoading">Artikel werden geladen...</li>
        <li v-else-if="items.length === 0">Keine Artikel in dieser Liste.</li>
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

      <div v-if="items.length > 0" style="margin-top:1rem;font-weight:bold;color:black;">
        Gesamtpreis: {{ totalPrice.toFixed(2) }} €
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts" setup>
import { ref, watchEffect, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

import AppLayout from '@/components/AppLayout.vue'
import ItemRow from '@/components/ItemRow.vue'

const route = useRoute()
const router = useRouter()

const API_ITEMS = 'https://webtech-backend-o434.onrender.com/api/items'
const API_LISTS = 'https://webtech-backend-o434.onrender.com/api/lists'

const currentListId = ref<number>(NaN)
const listName = ref<string>('Meine Einkaufsliste')
const isLoading = ref(true)

interface Item {
  id: number
  name: string
  category: string
  quantity: number
  price: number
  purchased: boolean
  shoppingListId: number
}

interface ServerItem extends Item {}

const itemName = ref<string>('')
const itemCategory = ref<string>('Obst & Gemüse')
const itemQuantity = ref<number>(1)
const itemPrice = ref<number>(0)
const items = ref<Item[]>([])

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
  axios.get(`${API_LISTS}/${listId}`)
    .then((response) => {
      listName.value = response.data.name
    })
    .catch((err) => {
      console.error('Fehler beim Laden der Liste:', err)
    })

  axios.get<ServerItem[]>(API_ITEMS)
    .then((response) => {
      const filtered = response.data.filter((item) => item.shoppingListId === listId)
      items.value = filtered.map((item): Item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
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

  axios.post<ServerItem>(API_ITEMS, {
    name,
    category: itemCategory.value,
    quantity: itemQuantity.value,
    price: itemPrice.value,
    purchased: false,
    shoppingListId: currentListId.value,
  })
    .then((response) => {
      const newItem = response.data
      items.value.push({
        id: newItem.id,
        name: newItem.name,
        category: newItem.category,
        quantity: newItem.quantity,
        price: newItem.price,
        purchased: newItem.purchased,
        shoppingListId: newItem.shoppingListId,
      })
      itemName.value = ''
      itemQuantity.value = 1
      itemPrice.value = 0
    })
    .catch((err) => {
      console.error('Fehler beim Speichern des Artikels:', err)
    })
}

function togglePurchased(item: Item) {
  const updated = !item.purchased
  axios.put(`${API_ITEMS}/${item.id}`, {
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    price: item.price,
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
  const originalItems = [...items.value];
  items.value = items.value.filter((i) => i.id !== item.id)
  axios.delete(`${API_ITEMS}/${item.id}`)
    .catch((err) => {
      items.value = originalItems;
      console.error('Fehler beim Löschen:', err)
      alert('Konnte Artikel nicht löschen!');
    })
}

function confirmDeleteList() {
  const confirm = window.confirm(`Möchtest du die Liste "${listName.value}" und alle zugehörigen Artikel wirklich löschen?`)
  if (!confirm) return

  axios.delete(`${API_LISTS}/${currentListId.value}`)
    .then(() => {
      router.push('/')
    })
    .catch((err) => {
      console.error('Fehler beim Löschen der Liste:', err)
    })
}

const totalPrice = computed(() => {
  return items.value.reduce((sum, item) =>
    sum + (item.quantity * (item.price || 0)), 0
  )
})
</script>

<style scoped>
.container {
  max-width: 900px;
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
input[type='number'],
select {
  padding: 0.5rem;
  font-size: 1rem;
  flex: 1;
}

input[type='number'] {
  max-width: 100px;
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
  color: black;
}

h1 {
  color: black;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.delete-list-button {
  background: none;
  border: none;
  color: red;
  font-size: 1rem;
  cursor: pointer;
}
</style>
