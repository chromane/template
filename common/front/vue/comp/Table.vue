<script setup lang="ts">
import { onMounted, watch, reactive, ref } from "vue";
import Button from "./Button.vue";

import mdi_image from "@mdi/svg/svg/image.svg?raw";
import mdi_edit from "@mdi/svg/svg/pencil.svg?raw";
import mdi_trash from "@mdi/svg/svg/delete.svg?raw";

const props = defineProps<{
  collection_name: any;
  cell_data_arr: any;
  data_arr: any;
}>();

const model = reactive({
  data_arr_sort: props.data_arr,
  handle_coords: [],
  col_data_arr: [
    {
      width: 200,
    },
    {
      width: 200,
    },
    {
      width: 200,
    },
  ],
  dragging_flag: false,
  table_width: 0,
  //
});

watch(
  () => model.col_data_arr,
  () => {
    let offset_x = 0;
    let len = model.col_data_arr.length;
    model.handle_coords = [];
    for (let i = 0; i < len; i++) {
      offset_x += model.col_data_arr[i].width;
      model.handle_coords.push({
        x: offset_x,
        last: i === len - 1,
      });
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => model.table_width,
  () => {
    // model.table_width
    if (model.table_width > 100) {
      let total_width: any = model.col_data_arr
        .map((col) => {
          return col.width;
        })
        .reduce((acc, curr) => {
          return acc + curr;
        }, 0);
      let factor = model.table_width / total_width;
      // console.log("total_width123", total_width, model.table_width, factor);
      model.col_data_arr.forEach((data) => {
        data.width = data.width * factor;
      });
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => [model.col_data_arr, model.table_width],
  () => {
    //
    let style: any = document.querySelector(`#table-style-row`);
    let offset = 0;
    let max_width = model.table_width;
    style.sheet.cssRules[0].style.gridAutoColumns = model.col_data_arr
      .map((data) => {
        return `${data.width}px`;
      })
      .join(" ");
  },
  { deep: true, immediate: true }
);

let ref_table = ref(null);

onMounted(() => {
  //
  let rect = ref_table.value.getBoundingClientRect();
  model.table_width = rect.width;
  let resize_observer = new ResizeObserver(([entry]) => {
    model.table_width = entry.contentRect.width;
  });
  resize_observer.observe(ref_table.value);
  //
  model.data_arr_sort = props.data_arr;
  //
  // model.col_data_arr = [];
  let offset_x = 0;
  // for (let i = 0; i < model.col_size_arr.length; i++) {
  //   offset_x += model.col_size_arr[i];
  //   model.col_data_arr.push({
  //     x: offset_x,
  //     width: model.col_size_arr[i],
  //   });
  // }
  //
});

watch(
  () => props.data_arr,
  (val) => {
    model.data_arr_sort = val;
  }
);

const _emit = defineEmits(["cell_value_change_request", "remove_row_confirm_request"]);

async function edit_cell(data: any, cell_data: any) {
  console.log("data", data);
  console.log("cell_data", cell_data);
  let current_value = data[cell_data.name];
  console.log("current_value", current_value);
  // let new_value = await props.prompt_el.open({
  //   popup_title: "Cell edit",
  //   current_value,
  //   ...cell_data,
  // });
  // _emit("cell_value_change_request", { collection_name: props.collection_name, data, cell_data, new_value: new_value[0].value });
}

async function handle_remove_row(data) {
  // const document_id = data.id;
  // data - document data from firestore

  // let confirm = await props.prompt_el.open({
  //   popup_title: "Warning",
  //   mode: "confirm",
  // });

  if (confirm) {
    _emit("remove_row_confirm_request", { collection_name: props.collection_name, document_data: data });
  }
}

async function handle_click_sort(cell) {
  const allowed_types_sort = ["text", "number", "date"];

  console.log("cell", cell);

  if (!allowed_types_sort.includes(cell.type)) return;

  // get all column data items
  if (!model[`${cell.name}_sorted`]) {
    switch (cell.type) {
      case "text":
        model.data_arr_sort.sort((a, b) => {
          const textA = a[cell.name].toUpperCase();
          const textB = b[cell.name].toUpperCase();

          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });

        break;
      case "number":
        break;
      case "date":
        break;
    }
  } else {
    model.data_arr_sort = model.data_arr_sort.reverse();
  }

  model[`${cell.name}_sorted`] = true;
}

let dragging_start_x = 0;
let dragging_cell_data_start_width = 0;

let dragging_cell_data_left = null;
let dragging_cell_data_right = null;

let dragging_cell_data_left_width_init = null;
let dragging_cell_data_right_width_init = null;

let methods = {
  handle_dragging_mousedown: (event, index) => {
    if (model.col_data_arr[index + 1]) {
      //
      dragging_cell_data_left = model.col_data_arr[index];
      dragging_cell_data_right = model.col_data_arr[index + 1];
      //
      dragging_cell_data_left_width_init = dragging_cell_data_left.width;
      dragging_cell_data_right_width_init = dragging_cell_data_right.width;
      //
      dragging_start_x = event.clientX;
      //
      model.dragging_flag = true;
    }
    // dragging_cell_data = cell_data;
    // dragging_cell_data_start_width = cell_data.width;
    // console.log(cell_data, event);
  },
  handle_dragging_mousemove: (event) => {
    if (model.dragging_flag) {
      //
      let delta = dragging_start_x - event.clientX;
      let width_new_left = dragging_cell_data_left_width_init - delta;
      let width_new_right = dragging_cell_data_right_width_init + delta;
      if (width_new_left > 100 && width_new_right > 100) {
        dragging_cell_data_left.width = width_new_left;
        dragging_cell_data_right.width = width_new_right;
      }
      //
    }
  },
  handle_dragging_mouseup: () => {
    model.dragging_flag = false;
  },
};
</script>

<template>
  <div
    class="table"
    ref="ref_table"
  >
    <!-- Header -->
    <div class="row row-main">
      <div
        class="cell"
        v-for="cell in cell_data_arr"
        @click="handle_click_sort(cell)"
      >
        <div
          class="cell-value"
          v-text="cell.title"
        ></div>
      </div>
    </div>
    <!-- Body -->
    <div
      class="row"
      v-for="data in model.data_arr_sort"
    >
      <div
        class="row__action row-action"
        style="display: none"
      >
        <ul class="row-action__list">
          <li class="row-action__item">
            <div
              v-html="mdi_image"
              style="width: 36px"
            ></div>
            <div
              v-html="mdi_edit"
              style="width: 36px"
            ></div>
            <div
              v-html="mdi_trash"
              style="width: 36px"
            ></div>
          </li>
        </ul>
      </div>
      <div
        class="cell"
        v-for="cell in cell_data_arr"
      >
        <div
          v-if="cell.type === 'json_arr' || cell.type_display === 'json_arr'"
          class="cell-value"
        >
          <div
            class="cell-value-item"
            v-for="item in data[cell.name]"
            v-text="item"
          ></div>
        </div>
        <div
          v-else-if="cell.type === 'json'"
          class="cell-value"
          v-text="JSON.stringify(data[cell.name])"
        ></div>
        <img
          v-else-if="cell.type === 'image'"
          class="cell-value-image"
          :src="data[cell.name]"
        />
        <div
          v-else-if="cell.type !== 'json'"
          class="cell-value"
        >
          {{ data[cell.name] }}
        </div>
        <div class="cell__action">
          <div
            class="cell-edit"
            v-on:click="edit_cell(data, cell)"
            v-if="cell.editable"
            v-html="mdi_edit"
          ></div>
        </div>
      </div>
    </div>
    <!-- Dragging hanles -->
    <div
      class="dragging-handle-container"
      v-bind:class="{ wide: model.dragging_flag }"
      v-on:mousemove="methods.handle_dragging_mousemove($event)"
      v-on:mouseup="methods.handle_dragging_mouseup()"
    >
      <div
        class="dragging-handle"
        v-for="(cell_data, index) in model.col_data_arr"
        v-bind:style="{
          left: model.handle_coords[index].x + 'px',
          display: model.handle_coords[index].last ? 'none' : 'block',
        }"
        v-on:mousedown="methods.handle_dragging_mousedown($event, index)"
        v-on:mousemove="methods.handle_dragging_mousemove($event)"
        v-on:mouseup="methods.handle_dragging_mouseup()"
      ></div>
    </div>
    <!--  -->
  </div>
</template>

<style>
.table {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}
.dragging-handle-container {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 0px;
  height: 100%;
}
.dragging-handle-container.wide {
  width: 100%;
}
.dragging-handle {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 3px;
  height: 100%;
  background-color: transparent;
  cursor: col-resize;
}
/* .row,
.row-main {
  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
} */
.row:last-child,
.row-main:last-child {
  border-bottom: none;
}
.cell {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  padding: 12px;
  position: relative;
  overflow: hidden;
}
.cell:last-child {
  border-right: 0px;
}

.cell__action {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  right: 5px;
  height: 100%;
  z-index: 110;
  transition-duration: 200ms;
  display: flex;
  align-items: center;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
}

.cell-edit {
  color: rgb(13, 71, 161);
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 1px 2px 8px rgba(20, 20, 20, 0.5);
  border-radius: 50%;
  background-color: #fafafa;
}

.cell-edit svg {
  width: 20px;
  height: 20px;
}
.cell:hover .cell__action {
  visibility: visible;
  opacity: 1;
  pointer-events: auto;

  cursor: pointer;
}

.row-main .cell {
  font-weight: bold;
  background-color: rgb(245, 245, 245);
  color: #101010;
  cursor: pointer;
  user-select: none;
}

.row {
  position: relative;
}

.row__action {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: rgba(10, 10, 10, 0.1);
  transition-duration: 200ms;
  padding: 0 40px 0 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
}

.row-action__list {
  pointer-events: auto;
}

.row:hover .row__action {
  visibility: visible;
  opacity: 1;
  pointer-events: none;
}
.cell-value-item {
  background-color: rgb(13, 71, 161);
  color: white;
  border-radius: 4px;
  display: inline-block;
  padding: 2px 4px;
  margin: 0px 4px 4px 0px;
  width: fit-content;
}
</style>
