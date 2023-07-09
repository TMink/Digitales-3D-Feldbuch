<template>
    <v-footer app>
        <v-row>
            <v-col icon class="text-center">
                {{ new Date().getFullYear() }} — <strong>TH-Köln</strong>
                <v-btn icon class="ma-1" variant="text" href="https://www.th-koeln.de/informatik-und-ingenieurwissenschaften/fakultaet-fuer-informatik-und-ingenieurwissenschaften_2466.php" target="_blank">
                    <v-img src="/THKöln_Icon.png"></v-img>
                </v-btn>
            </v-col>
        </v-row>
    </v-footer>
</template>
  
<script>
export default {
    name: 'AppFooter'
}
</script>
  
<style></style>
  