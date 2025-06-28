<template>
  <li class="list-item">
    <router-link :to="`/lists/${list.id}`">
      {{ list.name }}
    </router-link>
  </li>
</template>

<script setup lang="ts">
defineProps<{
  list: { id: number; name: string }
}>()

defineEmits(['delete'])
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
}

router-link {
  color: black;
}
</style>
