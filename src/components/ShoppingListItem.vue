<template>
  <li class="list-item" @click="goToList">
    {{ list.name }}
  </li>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  list: { id: number; name: string }
}>()

function goToList() {
  router.push(`/lists/${props.list.id}`)
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
</style>
