<!--
 Created Date: 26.09.2024 14:11:44
 Author: Tobias Mink
 
 Last Modified: 26.09.2024 14:15:34
 Modified By: Tobias Mink
 
 Description: 
 -->

<script setup>
import { Position, Handle } from '@vue-flow/core'
  
// props were passed from the slot using `v-bind="customNodeProps"`
const props = defineProps(['data', 'type'])
</script>
  
<template>
  <div class="deposit_clicked">
    <Handle id="top_middle" type="target" :position="Position.Top"/>
    <Handle id="left_middle" type="target" :position="Position.Left"/>
    <div>{{ data.label }}</div>
    <Handle id="right_middle" type="target" :position="Position.Right"/>
    <Handle id="bottom_middle" type="target" :position="Position.Bottom"/>
  </div>
</template>
 
<style>
  .deposit_clicked {
    height: 100px;
    width: 100px;
    line-height: 100px;
    text-align: center;
    color: black;
    background-color:rgb(30, 154, 30);
    border: 3px solid #fff;
    border-radius: 0%;
  }
</style>