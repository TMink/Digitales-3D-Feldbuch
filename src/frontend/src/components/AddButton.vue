<!--
 * Created Date: 24.06.2023 09:35:44
 * Author: Julian Hardtung
 * 
 * Last Modified: 17.02.2024 12:17:06
 * Modified By: Julian Hardtung
 * 
 * Description: Simple button with the fieldbook design for adding things
 -->

<template>
    <div class="text-center pa-2">
        <v-btn v-on:click="onClick()" color="secondary" class="ma-2">
            <v-icon>mdi-plus-box-multiple</v-icon>
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
        }
    },
}
</script>