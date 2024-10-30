<!--
 * Created Date: 30.10.2024 10:56:52
 * Author: Julian Hardtung
 * 
 * Last Modified: 30.10.2024 16:41:51
 * Modified By: Julian Hardtung
 * 
 * Description: Component for image table rows
 -->

<template>
  <tr v-on:click="$emit('clickedRow', item._id)">

    <!-- OBJECT TYPE BUTTON -->
    <td>
      <v-btn icon color="secondary" variant="text">
        <v-tooltip activator="parent" location="bottom">
          {{ item.posType == 'image' ? $t('photo') : $t('drawing') }}
        </v-tooltip>
        <v-icon v-if="item.posType == 'image'">mdi-image-outline</v-icon>
        <v-icon v-if="item.posType == 'drawing'">mdi-draw</v-icon>
      </v-btn>
    </td>

    <!-- POSITION NUMBER -->
    <td :style="{backgroundColor: tdColor, cursor: cursor}" 
      @mouseenter="tdColor = '#2f3845'; cursor = 'pointer'" 
      @mouseleave="tdColor = ''">
      <v-list-item-title class="pl-4">
        {{ item.positionNumber }}
      </v-list-item-title>
    </td>

    <!-- EMPTY COLUMN FOR IMAGES -->
    <td :style="{backgroundColor: tdColor, cursor: cursor}" 
      @mouseenter="tdColor = '#2f3845'; cursor = 'pointer'" 
      @mouseleave="tdColor = ''">
      <v-list-item-title>
      </v-list-item-title>
    </td>

    <!-- PHOTO -->
    <td :style="{backgroundColor: tdColor, cursor: cursor}" 
      @mouseenter="tdColor = '#2f3845'; cursor = 'pointer'" 
      @mouseleave="tdColor = ''">
      <v-row no-gutters>
        <v-spacer></v-spacer>
        <v-img cover rounded height="50px" :src="item.image">
          <template v-slot:placeholder>
            <v-card class="d-flex align-center justify-center fill-height"
              variant="tonal">
              <v-icon size="x-large" icon="mdi-image-remove"></v-icon>
            </v-card> 
          </template>
        </v-img>
        <v-spacer></v-spacer>
      </v-row>  
    </td>

    <!-- DATE -->
    <td :style="{backgroundColor: tdColor, cursor: cursor}" 
      @mouseenter="tdColor = '#2f3845'; cursor = 'pointer'" 
      @mouseleave="tdColor = ''">
      <v-list-item-title>
        {{ item.date }}
      </v-list-item-title>
    </td>

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
    }
    return false;
  }
</script>

<style scoped>
  td {
    padding: 6px !important;
  }
</style>