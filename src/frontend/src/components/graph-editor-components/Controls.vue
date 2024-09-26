<!--
 Created Date: 25.09.2024 19:43:34
 Author: Tobias Mink
 
 Last Modified: 25.09.2024 20:40:35
 Modified By: Tobias Mink
 
 Description: 
 -->

<script setup>
  import { Panel, useVueFlow } from '@vue-flow/core'

  const flowKey = 'vue-flow--save-restore'

  const { toObject, fromObject } = useVueFlow()

  function onSave() {
    localStorage.setItem(flowKey, JSON.stringify(toObject()))
  }

  function onRestore() {
    const flow = JSON.parse(localStorage.getItem(flowKey))

    if (flow) {
      fromObject(flow)
      this.$root.vtoast.show({ message: 'Matrix wiederhergestellt' });
    }
  }
</script>

<template>
  <Panel position="top-right">
    <div class="buttons">
      <v-btn icon="mdi-text-box-plus" @click="onSave">
      </v-btn>
      <v-btn title="restore graph" icon="mdi-backup-restore" @click="onRestore">
      </v-btn>
    </div>
  </Panel>
</template>