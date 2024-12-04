<!--
 * Created Date: 30.10.2024 10:56:52
 * Author: Julian Hardtung
 * 
 * Last Modified: 04.12.2024 12:48:23
 * Modified By: Julian Hardtung
 * 
 * Description: Component for image table rows
 -->

<template>
  <tr v-on:click="$emit('clickedRow', item._id)"
    v-if="item.posType == 'image' || item.posType == 'drawing' || item.posType == 'model'">

    <!-- OBJECT TYPE BUTTON -->
    <td>
      <v-btn icon color="secondary" variant="text">
        <v-tooltip activator="parent" location="bottom">
          {{ item.posType == 'image' ? $t('photo') : item.posType == 'drawing' ? $t('drawing') : $t('model') }}
        </v-tooltip>
        <v-icon v-if="item.posType == 'image'">mdi-image-outline</v-icon>
        <v-icon v-if="item.posType == 'drawing'">mdi-draw</v-icon>
        <v-icon v-if="item.posType == 'model'">mdi-cube-outline</v-icon>
      </v-btn>
    </td>

    <!-- POS NUMBER -->
    <td :style="{backgroundColor: tdColor, cursor: cursor}" 
      @mouseenter="tdColor = '#2f3845'; cursor = 'pointer'" 
      @mouseleave="tdColor = ''">
      <v-list-item-title class="pl-4">
        {{ item.positionNumber }}
      </v-list-item-title>
    </td>

    <td :style="{backgroundColor: tdColor, cursor: cursor}" 
      @mouseenter="tdColor = '#2f3845'; cursor = 'pointer'" 
      @mouseleave="tdColor = ''">
    </td>

    <!-- PHOTO -->
    <td :style="{backgroundColor: tdColor, cursor: cursor}" 
      @mouseenter="tdColor = '#2f3845'; cursor = 'pointer'" 
      @mouseleave="tdColor = ''">
      <v-row no-gutters>
        <v-col class="ml-1" cols="8">
          <v-img cover rounded height="50px" :src="item.image">
            <template v-slot:placeholder>
              <v-card class="d-flex align-center justify-center fill-height"
              variant="tonal">
              <v-icon v-if="item.posType == 'image'" size="x-large" icon="mdi-image-remove"></v-icon>
              <v-icon v-if="item.posType == 'drawing'" size="x-large" icon="mdi-draw-pen"></v-icon>
              <v-icon v-if="item.posType == 'model'" size="x-large" icon="mdi-cube-outline"></v-icon>
            </v-card> 
          </template>
        </v-img>
      </v-col>
      </v-row>  
    </td>
    
    <td :style="{backgroundColor: tdColor, cursor: cursor}" 
      @mouseenter="tdColor = '#2f3845'; cursor = 'pointer'" 
      @mouseleave="tdColor = ''">
    </td>

    <td :style="{backgroundColor: tdColor, cursor: cursor}" 
      @mouseenter="tdColor = '#2f3845'; cursor = 'pointer'" 
      @mouseleave="tdColor = ''">
    </td>

    <td :style="{backgroundColor: tdColor, cursor: cursor}" 
      @mouseenter="tdColor = '#2f3845'; cursor = 'pointer'" 
      @mouseleave="tdColor = ''">
    </td>

    <td :style="{backgroundColor: tdColor, cursor: cursor}" 
      @mouseenter="tdColor = '#2f3845'; cursor = 'pointer'" 
      @mouseleave="tdColor = ''">
    </td>

    <td :style="{backgroundColor: tdColor, cursor: cursor}" 
      @mouseenter="tdColor = '#2f3845'; cursor = 'pointer'" 
      @mouseleave="tdColor = ''">
    </td>
    
    <!-- COMMENT -->
    <td :style="{backgroundColor: tdColor, cursor: cursor}" 
      @mouseenter="tdColor = '#2f3845'; cursor = 'pointer'" 
      @mouseleave="tdColor = ''">
      <v-list-item-title class="text-wrap" style="max-width:200px">
        {{ item.comment }}
      </v-list-item-title>
      <v-list-item-title 
        v-if="item.comment == ''" style="color:dimgrey;">
        -
      </v-list-item-title>
    </td>

    <!-- PHOTOGRAPHER -->
    <td :style="{backgroundColor: tdColor, cursor: cursor}" 
      @mouseenter="tdColor = '#2f3845'; cursor = 'pointer'" 
      @mouseleave="tdColor = ''">
      <v-list-item-title
        v-if="item.editor != ''">
        {{ item.editor }}
      </v-list-item-title>
      <v-list-item-title 
        v-if="item.editor == ''" style="color:dimgrey;">
        -
      </v-list-item-title>
    </td>

    <!-- DATE -->
    <td :style="{backgroundColor: tdColor, cursor: cursor}" 
      @mouseenter="tdColor = '#2f3845'; cursor = 'pointer'" 
      @mouseleave="tdColor = ''">
      <v-list-item-title>
        {{ item.date}}
      </v-list-item-title>
    </td>

    <!-- <td :style="{backgroundColor: tdColor, cursor: cursor}" 
      @mouseenter="tdColor = '#2f3845'; cursor = 'pointer'" 
      @mouseleave="tdColor = ''">
    </td> -->

    <!-- SYNC STATUS -->
    <td>
      <v-btn icon class="my-1" variant="text" v-if="item.lastSync > 0">
        <v-tooltip activator="parent" location="bottom">
          {{ this.$t('lastSync') + new Date(item.lastSync).toLocaleString() }}
        </v-tooltip>
        <v-icon>mdi-cloud-check</v-icon>
      </v-btn>
      <v-btn icon class="my-1" variant="text" v-else>
        <v-tooltip activator="parent" location="bottom">
          {{ $t('onlyLocal') }}
        </v-tooltip>
        <v-icon>mdi-cloud-off-outline</v-icon>
      </v-btn>

      <!-- BODEON CONFORM -->
      <v-btn icon color="success" variant="text" v-if="isBodeonValid(item)">
        <v-tooltip activator="parent" location="bottom">
          {{ $t('fulfillsBodeonRequirements') }}
        </v-tooltip>
        <v-icon>mdi-check-circle</v-icon>
      </v-btn>
      <v-btn icon color="primary" variant="text" v-else>
        <v-tooltip activator="parent" location="bottom">
          {{ $t('mandatoryFieldNotFilled') }}
        </v-tooltip>
        <v-icon>mdi-alert-circle</v-icon>
      </v-btn>
    </td>
  </tr>
</template>


<script setup>
  import { ref } from 'vue';

  const tdColor = ref("");
  const cursor = ref("");

  const props = defineProps({
    item: Object,
  })

  /**
   * Checks if data of a position is valid for potential BODEON import
   * (are all mandatory fields properly filled?)
   * @param position 
   */
  function isBodeonValid(position) {
    if (position.posType == 'position' 
      && position.title.length != 0 
      && position.dating != ''){
        return true;
    } else if (position.posType == 'image'
      && position.editor != ''
      && position.comment != ''
      && position.date != ''
    ) {
      return true;
    } else if (position.posType == 'drawing'
      && position.editor != ''
      && position.comment != ''
      && position.date != ''
    ) {
      return true;
    } else if (position.posType == 'model'
      && position.editor != ''
      && position.comment != ''
      && position.date != ''
    ) {
      return true;
    }
    return false;
  }
</script>

<style scoped>
  td {
    padding: 6px !important;
  }
</style>