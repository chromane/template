<script setup lang="ts">
const props = defineProps<{
  log_item: any;
}>();
</script>

<template>
  <div class="log-item">
    <div v-text="props.log_item.text"></div>
    <div
      v-if="props.log_item.json"
      class="json"
      v-text="JSON.stringify(props.log_item.json, null, '\t')"
    ></div>
  </div>
</template>

<style>
.log-item {
  padding: 12px;
}
.log-item .json {
  margin-top: 12px;
  padding: 12px;
  background-color: rgb(127 255 212 / 36%);
  border: 1px dashed grey;
  border-radius: 4px;
  white-space: pre-wrap;
}
</style>
