<!--
 * Created Date: 24.06.2023 09:35:44
 * Author: Julian Hardtung
 * 
 * Last Modified: 29.02.2024 15:58:57
 * Modified By: Julian Hardtung
 * 
 * Description: Simple button with the fieldbook design for adding things
 -->

<template>
    <div class="text-center pa-2">
      <v-tooltip location="bottom" :text="$t('add', {msg: $tc(prop_object, 1)}) ">
        <template v-slot:activator="{props}">

          <v-btn v-bind="props" v-on:click="onClick()" color="secondary" class="ma-2">
            <v-icon>mdi-plus-box-multiple</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
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
}
</script>