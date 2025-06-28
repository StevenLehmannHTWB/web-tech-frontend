<template>
  <li class="item-row">
    <label :class="{ checked: item.purchased }">
      <input type="checkbox" :checked="item.purchased" @change="$emit('toggle', item)" />
      {{ item.name }} ({{ item.category }})
    </label>
    <button class="delete-button" @click="$emit('delete', item)">❌</button>
  </li>
</template>

<script setup lang="ts">
defineProps<{
  item: {
    id: number
    name: string
    category: string
    purchased: boolean
    shoppingListId: number
  }
}>()

defineEmits(['delete', 'toggle'])
</script>

<style scoped>
.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.delete-button {
  background: none;
  border: none;
  color: red;
  font-size: 1.1rem;
  cursor: pointer;
}

label {
  color: black;
}
</style>
