<!--
 * Created Date: 24.06.2023 09:35:44
 * Author: Julian Hardtung
 * 
 * Last Modified: 25.07.2024 15:41:02
 * Modified By: Julian Hardtung
 * 
 * Description: Simple button with the fieldbook design for adding things
 -->

<template>
  <div class="text-center pa-2">
    <v-btn v-on:click="onClick()" color="secondary" class="ma-2">
      <v-icon>mdi-plus-box-multiple</v-icon>
      {{ $t('add') }}
      <v-tooltip v-if="generalStore.getShowTooltips()" activator="parent" location="bottom"
        :text="$t('addMsg', { msg: $tc(prop_object, 1) })">
      </v-tooltip>
    </v-btn>
  </div>
</template>

<script>

import { generalDataStore } from '../ConnectionToLocalStorage';

export default {
    name: "AddButton",
    setup() {
      const generalStore = generalDataStore();

      return {
        generalStore
      }
    },
    props: {
        onClick: {
            type: Function,
            required: true
        },
        prop_object: String,
    },
}
</script>