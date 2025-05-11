<template>
  <div>
    <h1>This is a List</h1>
    <li v-for="item in items">
      {{ item.item_name }} --- {{item.category}}
    </li>
  </div>
  <div>

  </div>
</template>


<script setup lang="ts">

let items: {
  item_name: string, category: string
}[] = [
  {
    item_name: "Äpfel",
    category: "Obst und Gemüse"
  },
  {
    item_name: "Zwiebeln",
    category: "Obst und Gemüse"
  },
  {
    item_name: "Toilettenpapier",
    category: "Haushaltsmittel"
  },
  {
    item_name: "Orangensaft",
    category: "Getränke"
  },
  {
    item_name: "Apfelsaft",
    category: "Getränke"
  }
];
</script>
