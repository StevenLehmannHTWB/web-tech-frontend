<template>
  <li class="item-row">
    <!-- Checkbox -->
    <input type="checkbox" :checked="item.purchased" @change="$emit('toggle', item)" />

    <!-- Name -->
    <span v-if="!editingName" class="clickable" @click="startEdit('name')">
      {{ localItem.name }}
    </span>
    <input
      v-else
      v-model="localItem.name"
      @blur="saveEdit('name')"
      @keyup.enter="saveEdit('name')"
      class="edit-input"
      type="text"
    />

    <!-- Kategorie (nur Anzeige) -->
    <span class="category">({{ item.category }})</span>

    <!-- Menge -->
    <span v-if="!editingQuantity" class="clickable" @click="startEdit('quantity')">
      {{ localItem.quantity }}
    </span>
    <input
      v-else
      v-model.number="localItem.quantity"
      @blur="saveEdit('quantity')"
      @keyup.enter="saveEdit('quantity')"
      class="edit-input short"
      type="number"
      min="1"
    />

    x

    <!-- Preis -->
    <span v-if="!editingPrice" class="clickable" @click="startEdit('price')">
      {{ localItem.price ? localItem.price.toFixed(2) : "0.00" }} €
    </span>
    <input
      v-else
      v-model.number="localItem.price"
      @blur="saveEdit('price')"
      @keyup.enter="saveEdit('price')"
      class="edit-input short"
      type="number"
      min="0"
      step="0.01"
    />

    <!-- Gesamtsumme -->
    <span class="total">= {{ (localItem.quantity * (localItem.price || 0)).toFixed(2) }} €</span>

    <!-- Delete -->
    <button class="delete-button" @click="$emit('delete', item)">❌</button>
  </li>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  item: {
    id: number
    name: string
    category: string
    quantity: number
    price: number
    purchased: boolean
    shoppingListId: number
  }
}>()

const emit = defineEmits(['delete', 'toggle', 'update'])

const localItem = ref({ ...props.item })
const editField = ref('') // 'name', 'quantity', 'price' oder ''

// Reactivity: Update localItem wenn neues item reingereicht wird
watch(
  () => props.item,
  (newVal: typeof props.item) => {
    localItem.value = { ...newVal }
  }
)

function startEdit(field: string) {
  editField.value = field
}

function saveEdit(field: string) {
  editField.value = ''
  if (
    (field === 'name' && localItem.value.name !== props.item.name) ||
    (field === 'quantity' && localItem.value.quantity !== props.item.quantity) ||
    (field === 'price' && localItem.value.price !== props.item.price)
  ) {
    emit('update', { ...localItem.value })
  }
}

const editingName = computed(() => editField.value === 'name')
const editingQuantity = computed(() => editField.value === 'quantity')
const editingPrice = computed(() => editField.value === 'price')

</script>

<style scoped>
.item-row {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  gap: 0.7rem;
}

.category {
  color: #666;
  margin: 0 0.5rem;
}

.delete-button {
  background: none;
  border: none;
  color: red;
  font-size: 1.1rem;
  cursor: pointer;
  margin-left: 1rem;
}

.edit-input {
  font-size: 1rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.edit-input.short {
  width: 60px;
}

.total {
  margin-left: 10px;
  font-weight: bold;
}

.clickable {
  cursor: pointer;
  border-bottom: 1px dotted #aaa;
}
</style>
