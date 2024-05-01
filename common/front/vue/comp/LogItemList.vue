<script setup lang="ts">
import LogItem from "./LogItem.vue";
const props = defineProps<{
  log_items: Array<any>;
}>();
</script>

<template>
  <div class="log-item-list">
    <LogItem
      v-for="log_item in props.log_items"
      :log_item="log_item"
    ></LogItem>
  </div>
</template>

<style>
.log-item-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 320px;
  max-height: 600px;
  overflow: auto;
  border: 1px solid var(--color-border);
  background: #c9c9c9;
  border-radius: 4px;
}
.log-item-list .log-item {
  border-bottom: 1px solid var(--color-border);
}
.log-item-list .log-item:last-child {
  border-bottom: none;
}
</style>
