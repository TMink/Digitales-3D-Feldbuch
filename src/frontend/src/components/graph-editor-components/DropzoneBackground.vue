<!--
 Created Date: 24.09.2024 14:49:53
 Author: Tobias Mink
 
 Last Modified: 26.09.2024 15:15:17
 Modified By: Tobias Mink
 
 Description: 
 -->

<script lang="ts" setup>
import { Background } from '@vue-flow/background'
</script>
 
<template>
  <div class="dropzone-background">
    <Background :size="2" :gap="50" color="#42f59e" variant="dots"/>
    <div class="overlay">
      <slot />
    </div>
  </div>
</template>