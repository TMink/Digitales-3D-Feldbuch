<!--
 Created Date: 26.09.2024 12:53:27
 Author: Tobias Mink
 
 Last Modified: 29.09.2024 23:46:43
 Modified By: Tobias Mink
 
 Description: 
 -->

<script setup>
import { Position, Handle, useVueFlow } from '@vue-flow/core'
  
// props were passed from the slot using `v-bind="customNodeProps"`
const props = defineProps(['data', 'type'])
const { getNodes } = useVueFlow()

function testForValidConnection(connection) {
  for( const[_, value] of Object.entries(getNodes.value) ) {
    if( value.id == connection.source ) {
      switch( connection.sourceHandle ) {
        case "top_middle":
          if( value.data.validConnections.top_middle ) {
            return true
          } else {
            return false
          }
        case "bottom_middle":
          if( value.data.validConnections.bottom_middle ) {
            return true
          } else {
            return false
          }
        case "left_middle":
          if( value.data.validConnections.left_middle ) {
            return true
          } else {
            return false
          }
        case "right_middle":
          if( value.data.validConnections.right_middle ) {
            return true
          } else {
            return false
          }
        default:
          console.log("Somethings gone wrong")
      }
    }
  }
}
</script>
  
<template>
  <div :class=data.nodeStyle>
    <Handle id="top_middle" :style=data.styles.top_middle :isValidConnection=testForValidConnection type="target" :position="Position.Top"/>
    <Handle id="left_middle" :style=data.styles.left_middle :isValidConnection=testForValidConnection type="target" :position="Position.Left"/>
    <v-card class="d-flex align-center justify-center" height="100%" width="100%" variant="outlined">
      <v-card-text class="pa-1" style="text-align: center; line-height: 100%;">{{ data.label }}</v-card-text>
    </v-card>
    <Handle id="right_middle" :style=data.styles.right_middle :isValidConnection=testForValidConnection type="target" :position="Position.Right"/>
    <Handle id="bottom_middle" :style=data.styles.bottom_middle :isValidConnection=testForValidConnection type="target" :position="Position.Bottom"/>
  </div>
</template>

<style>
.clicked_deposit {
  height: 100px; 
  width: 100px; 
  line-height: 100px; 
  text-align: center; 
  color: black; 
  background-color:rgb(30, 154, 30); 
  border: 2px solid #ffffff; 
  border-radius: 10%; 
  padding: 6px; 
  box-shadow: 0 0 0 6px #88fd82;
}

.notClicked_deposit {
  height: 100px; 
  width: 100px; 
  line-height: 86px; 
  text-align: center; 
  color: black; 
  background-color:rgb(30, 154, 30); 
  border: 2px solid #ffffff; 
  border-radius: 10%; 
  padding: 6px;
}
</style>