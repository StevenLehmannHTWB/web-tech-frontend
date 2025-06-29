<template>
  <li class="list-item">
    <span @click="goToList" class="list-name">{{ list.name }}</span>
    <button class="delete-button" @click.stop="confirmDelete" title="Liste löschen">❌</button>
  </li>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  list: { id: number; name: string }
}>()

const emit = defineEmits<{
  (e: 'delete', id: number): void
}>()

function goToList() {
  router.push(`/lists/${props.list.id}`)
}

function confirmDelete() {
  const confirmed = window.confirm(`Möchtest du die Liste "${props.list.name}" und alle zugehörigen Artikel wirklich löschen?`)
  if (!confirmed) return

  fetch(`https://webtech-backend-o434.onrender.com/api/lists/${props.list.id}`, {
    method: 'DELETE',
  })
    .then(res => {
      if (!res.ok) throw new Error('Fehler beim Löschen')
      emit('delete', props.list.id)
    })
    .catch(err => {
      console.error('Fehler beim Löschen der Liste:', err)
    })
}
</script>

<style scoped>
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.list-item:hover {
  background-color: #f0f0f0;
}

.list-name {
  flex: 1;
}

.delete-button {
  background: none;
  border: none;
  color: red;
  font-size: 1rem;
  cursor: pointer;
}
</style>
