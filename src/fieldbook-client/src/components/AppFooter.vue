<template>
    <v-footer style="z-index: 1;" app>
        <v-row>
            <v-col icon class="text-center pa-0">
                {{ new Date().getFullYear() }} — <strong>TH-Köln</strong>
                <v-btn  icon 
                        class="ma-1" 
                        variant="text" 
                        href="https://www.th-koeln.de/informatik-und-ingenieurwissenschaften/fakultaet-fuer-informatik-und-ingenieurwissenschaften_2466.php" 
                        target="_blank"
                        >
                    <v-icon><v-img src="/THKöln_Icon.png"></v-img></v-icon>
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
  