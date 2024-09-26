<!--
 Created Date: 26.09.2024 14:41:12
 Author: Tobias Mink
 
 Last Modified: 26.09.2024 14:56:33
 Modified By: Tobias Mink
 
 Description: 
 -->

<script setup>
import { Position, Handle } from '@vue-flow/core'
  
// props were passed from the slot using `v-bind="customNodeProps"`
const props = defineProps(['data', 'type'])
</script>
  
<template>
  <div class="interface_clicked">
    <Handle id="top_middle" type="target" :position="Position.Top"/>
    <Handle id="left_middle" type="target" :position="Position.Left"/>
    <div>{{ data.label }}</div>
    <Handle id="right_middle" type="target" :position="Position.Right"/>
    <Handle id="bottom_middle" type="target" :position="Position.Bottom"/>
  </div>
</template>
 
<style>
  .interface_clicked {
    height: 100px;
    width: 100px;
    line-height: 100px;
    text-align: center;
    color: black;
    background-color:rgb(104, 65, 15);
    border: 3px solid #ffffff;
    border-radius: 100%;
  }
</style>