<script setup lang="ts">
import { onMounted, reactive, watch, ref } from "vue";
let emit = defineEmits<{
  (e: "change_event", data: any): void;
}>();
let input_ref = ref(null);

const props = defineProps<{
  model: any;
}>();

// onMounted(() => {
//   if (props.initial_value) {
//     input_ref.value.value = props.initial_value;
//   }
// });

// watch(
//   () => props.initial_value,
//   () => {
//     if (props.initial_value) {
//       input_ref.value.value = props.initial_value;
//     }
//   }
// );

watch(
  () => [props.model.value, input_ref.value],
  () => {
    console.log(1);
    if (input_ref.value) {
      input_ref.value.value = props.model.value;
    }
  },
  { immediate: true }
);

function handle_input() {
  console.log(2);
  props.model.value = input_ref.value.value;
  emit("change_event", input_ref.value.value);
}
</script>

<template>
  <input
    ref="input_ref"
    type="text"
    class="form-control"
    autocomplete="chrome-off"
    v-bind:placeholder="props.model.title"
    v-on:input="handle_input"
  />
</template>

<style></style>
