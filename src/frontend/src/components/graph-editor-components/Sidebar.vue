<!--
 Created Date: 24.09.2024 14:53:30
 Author: Tobias Mink
 
 Last Modified: 26.09.2024 14:57:06
 Modified By: Tobias Mink
 
 Description: 
 -->

<script setup>
import useDragAndDrop from './useDnD'
 
const { onDragStart } = useDragAndDrop()
</script>
 
<template>
  <aside>
    <div class="nodes">
      <v-row>
        <v-col class="pr-1">
          <div class="deposit_tab" :draggable="true" @dragstart="onDragStart($event, 'deposit')">D</div>
        </v-col>
        <v-col class="pl-1">
          <div class="interface_tab" :draggable="true" @dragstart="onDragStart($event, 'interface')">I</div>
        </v-col>
      </v-row>
    </div>
  </aside>
</template>

<style>
.deposit_tab {
   float: left;
   height: 30px;
   width: 30px;
   line-height: 30px;
   text-align: center;
   font-size: large;
   color: black;
   background-color:rgb(30, 154, 30);
   border: 1px solid #ffffff;
   border-radius: 0%;
 }
 .interface_tab {
   float: left;
   height: 30px;
   width: 30px;
   line-height: 30px;
   text-align: center;
   font-size: large;
   color: black;
   background-color:rgb(104, 65, 15);
   border: 1px solid #ffffff;
   border-radius: 100%;
 }
</style>