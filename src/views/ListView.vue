<template>
  <div class="container">
    <h1>Meine Einkaufsliste</h1>

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
      <li v-for="item in itemList" :key="item.name">
        <label :class="{ checked: item.checked }">
          <input
            type="checkbox"
            :checked="item.checked"
            @change="item.checked = !item.checked"
          />
          {{ item.name }} ({{ item.category }})
        </label>
      </li>

    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const API_URL = 'https://webtech-backend-o434.onrender.com/api/items'

interface ItemData {
  category: string
  checked: boolean
}

interface ServerItem {
  id: number
  name: string
  category: string
  quantity: number
  purchased: boolean
}

const itemName = ref<string>('')
const itemCategory = ref<string>('Obst')

const items = ref<Record<string, ItemData>>({})

const itemList = computed(() =>
  Object.entries(items.value).map(([name, data]) => ({
    name,
    ...data,
  }))
)

function addItem() {
  const name = itemName.value.trim()
  if (!name || items.value[name]) return

  // Neues Item lokal speichern
  items.value[name] = {
    category: itemCategory.value,
    checked: false,
  }

  // POST an Backend senden
  axios
    .post(API_URL, {
      name: name,
      category: itemCategory.value,
      quantity: 1, // immer 1, wird im Frontend ignoriert
      purchased: false,
    })
    .catch((err) => {
      console.error('Fehler beim Speichern des Artikels:', err)
    })

  itemName.value = ''
}

// Daten vom Server laden (PULL)
onMounted(() => {
  axios
    .get<ServerItem[]>(API_URL)
    .then((response) => {
      const data = response.data
      const loadedItems: Record<string, ItemData> = {}

      for (const item of data) {
        loadedItems[item.name] = {
          category: item.category,
          checked: item.purchased,
        }
      }

      items.value = loadedItems
    })
    .catch((err) => {
      console.error('Fehler beim Laden der Einkaufsliste:', err)
    })
})

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
}

.checked {
  text-decoration: line-through;
  color: gray;
}
</style>
