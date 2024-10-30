<!--
 * Created Date: 30.10.2024 10:56:52
 * Author: Julian Hardtung
 * 
 * Last Modified: 30.10.2024 16:38:15
 * Modified By: Julian Hardtung
 * 
 * Description: Component for image table rows
 -->

<template>
  <tr v-on:click="$emit('clickedRow', item._id)">

    <!-- OBJECT TYPE BUTTON -->
    <td>
      <v-btn color="secondary" icon variant="text">
        <v-tooltip activator="parent" location="bottom">
          {{ $tc('find', 0) + '/' + $tc('find', 4) }}
        </v-tooltip>
        <v-icon>mdi-book-open-variant-outline</v-icon>
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

    <!-- SUB NUMBER -->
    <td :style="{backgroundColor: tdColor, cursor: cursor}" 
      @mouseenter="tdColor = '#2f3845'; cursor = 'pointer'" 
      @mouseleave="tdColor = ''">
      <v-list-item-title v-if="item.subNumber.length != 0">
        {{ item.subNumber }}
      </v-list-item-title>
      <v-list-item-title v-if="item.subNumber.length == 0" 
        style="color:dimgrey;">
        -
      </v-list-item-title>
    </td>

    <!-- TITLE -->
    <td :style="{backgroundColor: tdColor, cursor: cursor}" 
      @mouseenter="tdColor = '#2f3845'; cursor = 'pointer'" 
      @mouseleave="tdColor = ''">
      <v-list-item-title v-if="item.title.length > 0"
        style="min-width:200px" class="text-wrap">
        {{ item.title.join('; ') }}
      </v-list-item-title>
      <v-list-item-title v-if="item.title.length == 0" 
        style="color:dimgrey;">
        -
      </v-list-item-title>
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
      <v-btn icon variant="text" v-if="item.lastSync > 0"
        class="my-1">
          <v-tooltip 
            activator="parent"
            location="bottom">
            {{ this.$t('lastSync') + new Date(item.lastSync).toLocaleString() }}
          </v-tooltip>
          <v-icon>mdi-cloud-check</v-icon>
      </v-btn>
      <v-btn icon variant="text" class="my-1" v-else>
        <v-tooltip 
          activator="parent"
          location="bottom">
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
      <v-btn color="primary" icon variant="text" v-else>
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