<!--
 * Created Date: 24.06.2023 09:35:44
 * Author: Julian Hardtung
 * 
 * Last Modified: 21.03.2024 15:05:41
 * Modified By: Julian Hardtung
 * 
 * Description: Simple button with the fieldbook design for adding things
 -->

<template>
  <div class="text-center pa-2">
    <v-btn v-on:click="onClick()" color="secondary" class="ma-2">
      <v-icon>mdi-plus-box-multiple</v-icon>
      {{ $t('add') }}
      <v-tooltip v-if="tooltipsActive" activator="parent" location="bottom"
        :text="$t('addMsg', { msg: $tc(prop_object, 1) })">
      </v-tooltip>
    </v-btn>
  </div>
</template>

<script>

export default {
    name: "AddButton",
    props: {
        onClick: {
            type: Function,
            required: true
        },
        prop_object: String,
    },

    data() {
      return {
        tooltipsActive: false,
      }
    },

    created() {
     this.tooltipsActive = this.$generalStore.getShowTooltips();
    },
}
</script>