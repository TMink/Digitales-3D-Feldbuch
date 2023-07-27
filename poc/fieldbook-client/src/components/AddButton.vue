<template>
    <div class="text-center pa-4">
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