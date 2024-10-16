<!--
 Created Date: 24.09.2024 14:53:30
 Author: Tobias Mink
 
 Last Modified: 01.10.2024 17:04:46
 Modified By: Tobias Mink
 
 Description: 
 -->

<script setup>
import useDragAndDrop from './useDnD'

const props = defineProps({
  highestDefaultCount: {
    type: String,
    required: false,
  },
})
 
const { onDragStart } = useDragAndDrop()

function doIt(params) {
  params.srcElement.style.cursor = "grab";
  if(params.srcElement.id == "deposit") {
    params.srcElement.style.backgroundColor = "#32d132";
  } else {
    params.srcElement.style.backgroundColor = "#db902e";
  }
}

function changeColorBack(params) {
  if(params.srcElement.id == "deposit") {
    params.srcElement.style.backgroundColor = "#1e9a1e";
  } else {
    params.srcElement.style.backgroundColor = "#ac6c18";
  }
}
</script>
 
<template>
  <v-card class="nodes mb-2" width="fit-content" variant="text">
    <v-row no-gutters style="width: fit-content">
      <v-col align="center">
        <v-card height="fit-content" width="fitcontent" variant="text">
          <v-card-text class="pa-1 deposit__dragable_name" style="text-align: center; line-height: 100%;">
            Deposit
          </v-card-text>
        </v-card>
        <div id="deposit" class="deposit__dragable" :draggable="true" @dragstart="onDragStart($event, 'deposit', highestDefaultCount)" :onmouseover=doIt :onmouseleave=changeColorBack>D</div>
      </v-col>
      <v-col align="center">
        <v-card class="d-flex align-center justify-center" height="fit-content" width="fitcontent" variant="text">
          <v-card-text class="pa-1 interface__dragable_name" style="text-align: center; line-height: 100%;">
            Interface
          </v-card-text>
        </v-card>
        <div id="interface" class="interface__dragable" :draggable="true" @dragstart="onDragStart($event, 'interface', highestDefaultCount)" :onmouseover=doIt :onmouseleave=changeColorBack>I</div>
      </v-col>
    </v-row>
  </v-card>
</template>

<style>
</style>