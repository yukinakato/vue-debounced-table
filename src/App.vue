<script setup lang="ts">
import { useUsers } from "@/hooks/users";
import { computed } from "vue";

const { datas, addRow, deleteRow } = useUsers();
const inspect = computed(() =>
  datas.value.map((d) => ({ key: d.key, id: d.id, name: d.name, state: d.state }))
);
</script>

<template>
  <div class="main">
    <div>
      <table>
        <thead>
          <tr>
            <th class="id">ID</th>
            <th class="name">Name</th>
            <th>delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data in datas" :key="data.key">
            <td class="id">
              <input
                placeholder="1 ～ 10"
                :value="data.id"
                @input="event => data.idSetter = (event.target as HTMLInputElement).value"
              />
            </td>
            <td class="name">{{ data.name }}</td>
            <td><button @click="deleteRow(data)">delete</button></td>
          </tr>
        </tbody>
      </table>
      <button @click="addRow">add</button>
    </div>
    <div class="inspect">
      <pre>{{ inspect }}</pre>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main {
  padding: 50px;
  table {
    border-collapse: collapse;
    td {
      border: 1px solid #aaa;
    }
    th,
    td {
      &.id > input {
        width: 120px;
      }
      &.name {
        width: 220px;
      }
    }
  }
  div.inspect {
    margin-top: 40px;
    padding: 6px 10px;
    background-color: azure;
  }
}
</style>
