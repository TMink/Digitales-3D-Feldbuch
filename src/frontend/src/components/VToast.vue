<!--
 * Created Date: 10.06.2023 13:07:45
 * Author: Julian Hardtung
 * 
 * Last Modified: 08.12.2023 14:41:30
 * Modified By: Julian Hardtung
 * 
 * Description: customizable vToast based on vuetify v-snackbar
 -->

<template>
    <v-snackbar 
        :color="color" 
        :timeout="timer" 
        v-model="showSnackbar" 
        location="bottom">
        <v-icon start>{{ icon }}</v-icon>
        {{ message }}
    </v-snackbar>
</template>

<script>
export default {
    name: "VToast",
    data() {
        return {
            showSnackbar: false,
            message: '',
            color: 'success',
            icon: 'mdi-check',
            timer: 3000
        }
    },
    methods: {
        show(data) {
            this.message = data.message || 'missing "message".'
            this.color = data.color || 'success'
            this.timer = data.timer || 3000
            this.icon = data.icon || 'mdi-check'
            this.showSnackbar = true
        }
    }
}
</script>